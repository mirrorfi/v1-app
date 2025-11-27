import { buildTx, mirrorfiClient, SERVER_CONNECTION } from "@/lib/server/solana";
import { swap } from "@/lib/client/jupiter";
import { parseStrategy, parseVault } from "@/types/accounts";
import { BN } from "@coral-xyz/anchor";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let { amount, slippageBps, authority, strategy, all } = await req.json();

    if (!amount) {
      return NextResponse.json(
        { error: 'Amount is required.' },
        { status: 400 }
      );
    }

    // amount is a bigint serialized as string
    if (isNaN(amount) || BigInt(amount) <= BigInt(0)) {
      return NextResponse.json(
        { error: 'Amount must be a positive number.' },
        { status: 400 }
      );
    }

    if (!slippageBps) {
      return NextResponse.json(
        { error: 'Slippage basis points is required.' },
        { status: 400 }
      );
    }

    if (isNaN(slippageBps) || Number(slippageBps) < 0) {
      return NextResponse.json(
        { error: 'Slippage basis points must be a non-negative number.' },
        { status: 400 }
      );
    }

    if (!authority) {
      return NextResponse.json(
        { error: 'Authority is required.' },
        { status: 400 }
      );
    }

    if (!strategy) {
      return NextResponse.json(
        { error: 'Strategy is required.' },
        { status: 400 }
      );
    }

    const strategyAcc = await mirrorfiClient.fetchProgramAccount(strategy, "strategy", parseStrategy);

    if (!strategyAcc) {
      return NextResponse.json(
        { error: 'Strategy account not found.' },
        { status: 400 }
      );
    }

    const strategyType = strategyAcc.strategyType;

    if (!('jupiterSwap' in strategyType)) {
      return NextResponse.json(
        { error: 'Strategy is not a JupiterSwap strategy.' },
        { status: 400 }
      );
    }

    const vault = new PublicKey(strategyAcc.vault);
    const vaultAcc = await mirrorfiClient.fetchProgramAccount(vault.toBase58(), "vault", parseVault);

    if (!vaultAcc) {
      return NextResponse.json(
        { error: 'Vault account not found.' },
        { status: 400 }
      );
    }

    const depositMint = new PublicKey(vaultAcc.depositMint);
    const targetMint = new PublicKey(strategyType.jupiterSwap.targetMint);
    const depositMintTokenProgram = (await SERVER_CONNECTION.getAccountInfo(depositMint))!.owner;
    const vaultDepositMintTokenAccount = getAssociatedTokenAddressSync(
      depositMint,
      new PublicKey(vault),
      !PublicKey.isOnCurve(vault),
      depositMintTokenProgram,
    )
    const targetMintTokenProgram = (await SERVER_CONNECTION.getAccountInfo(targetMint))!.owner;
    const vaultTargetMintTokenAccount = getAssociatedTokenAddressSync(
      targetMint,
      new PublicKey(vault),
      !PublicKey.isOnCurve(vault),
      targetMintTokenProgram,
    );
    if (all) {
      amount = (await SERVER_CONNECTION.getTokenAccountBalance(vaultTargetMintTokenAccount)).value.amount;
    }

    const executeSwapResult = await swap({
      inputMint: targetMint,
      outputMint: depositMint,
      amount,
      slippageBps,
      exactOutRoute: false,
      onlyDirectRoutes: true,
      userPublicKey: vault,
    });
    const treasuryPda = mirrorfiClient.treasuryPda;
    const treasuryTokenAccount = getAssociatedTokenAddressSync(
      depositMint,
      new PublicKey(treasuryPda),
      !PublicKey.isOnCurve(treasuryPda),
      depositMintTokenProgram,
    );

    let exitIx = await mirrorfiClient.program.methods
      .exitStrategyJupiterSwap(
        executeSwapResult.swapInstruction.data,
        new BN(amount),
        slippageBps,
      )
      .accounts({
        authority,
        config: mirrorfiClient.configPda,
        destinationMint: depositMint,
        sourceMint: targetMint,
        vault,
        strategy,
        destinationTokenProgram: depositMintTokenProgram,
        sourceTokenProgram: targetMintTokenProgram,
        vaultSourceTokenAccount: vaultTargetMintTokenAccount,
        vaultDestinationTokenAccount: vaultDepositMintTokenAccount,
        treasuryTokenAccount,
      })
      .remainingAccounts(executeSwapResult.remainingAccounts)
      .instruction();
    let ixs = [exitIx];
    
    if (all) {
      let closeIx = await mirrorfiClient.program.methods.closeStrategy().accounts({
        authority,
        vault,
        strategy
      }).instruction();
      ixs.push(closeIx);
    }

    const tx = await buildTx(ixs, new PublicKey(authority), executeSwapResult.addressLookupTableAccounts);

    return NextResponse.json({
      tx,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Failed to generate transaction.',
      },
      { status: 500 }
    );
  }
}