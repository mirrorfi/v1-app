import { buildTx, mirrorfiClient, SERVER_CONNECTION } from "@/lib/solana-server";
import { v0TxToBase64 } from "@/lib/utils";
import { extractRemainingAccountsForSwap, swap } from "@/lib/utils/jupiter-swap";
import { parseStrategy, parseVault } from "@/types/accounts";
import { BN } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, slippageBps, authority, strategy } = await req.json();

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

    if (!strategyType.jupiterSwap) {
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
    const executeSwapResult = await swap(
      depositMint,
      targetMint,
      amount,
      slippageBps,
      false,
      false,
      new PublicKey(vault),
      mirrorfiClient.program.provider.connection,
    );
    const remainingAccounts = extractRemainingAccountsForSwap(
      executeSwapResult.swapInstruction,
    ).remainingAccounts;
    const tokenMintAccountInfos = (await SERVER_CONNECTION.getMultipleAccountsInfo([depositMint, targetMint]));
    const depositMintTokenProgram = tokenMintAccountInfos[0]!.owner;
    const targetMintTokenProgram = tokenMintAccountInfos[1]!.owner;
    const vaultDepositMintTokenAccount = getAssociatedTokenAddressSync(
      depositMint,
      new PublicKey(vault),
      !PublicKey.isOnCurve(vault),
      depositMintTokenProgram,
    )

    let ix = await mirrorfiClient.program.methods
      .executeStrategyJupiterSwap(
        executeSwapResult.swapInstruction.data,
        new BN(amount),
        slippageBps,
      )
      .accounts({
        authority,
        config: mirrorfiClient.configPda,
        destinationMint: targetMint,
        sourceMint: depositMint,
        vault,
        strategy,
        tokenProgram: targetMintTokenProgram,
        vaultSourceTokenAccount: vaultDepositMintTokenAccount,
      })
      .remainingAccounts(remainingAccounts)
      .instruction();

    const tx = await buildTx([ix], new PublicKey(authority));

    return NextResponse.json({
      tx: v0TxToBase64(tx),
    })
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