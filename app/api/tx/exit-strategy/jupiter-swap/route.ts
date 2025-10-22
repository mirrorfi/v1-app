import { buildTx, mirrorfiClient, SERVER_CONNECTION } from "@/lib/solana-server";
import { extractRemainingAccountsForSwap, swap } from "@/lib/utils/jupiterSwap";
import { parseStrategy, parseVault } from "@/types/accounts";
import { BN } from "@coral-xyz/anchor";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, slippageBps, authority, strategy } = await req.json();

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return NextResponse.json(
        { error: 'Invalid swap amount.' },
        { status: 400 }
      );
    }

    if (!slippageBps || isNaN(slippageBps) || Number(slippageBps) < 0) {
      return NextResponse.json(
        { error: 'Invalid slippage bps.' },
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

    const vaultPda = new PublicKey(strategyAcc.vault);
    const vaultAcc = await mirrorfiClient.fetchProgramAccount(vaultPda.toBase58(), "vault", parseVault);

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
      new PublicKey(vaultPda),
      mirrorfiClient.program.provider.connection,
    );
    const remainingAccounts = extractRemainingAccountsForSwap(
      executeSwapResult.swapInstruction,
    ).remainingAccounts;
    const depositMintTokenProgram = (await SERVER_CONNECTION.getAccountInfo(depositMint))!.owner;
    const vaultDepositMintTokenAccount = getAssociatedTokenAddressSync(
      depositMint,
      new PublicKey(vaultPda),
      !PublicKey.isOnCurve(vaultPda),
      depositMintTokenProgram,
    )
    const targetMintTokenProgram = (await SERVER_CONNECTION.getAccountInfo(targetMint))!.owner;
    const vaultTargetMintTokenAccount = getAssociatedTokenAddressSync(
      targetMint,
      new PublicKey(vaultPda),
      !PublicKey.isOnCurve(vaultPda),
      targetMintTokenProgram,
    );
    const treasuryPda = mirrorfiClient.treasuryPda;
    const treasuryTokenAccount = getAssociatedTokenAddressSync(
      depositMint,
      new PublicKey(treasuryPda),
      !PublicKey.isOnCurve(treasuryPda),
      depositMintTokenProgram,
    );

    let ix = await mirrorfiClient.program.methods
      .exitStrategyJupiterSwap(
        executeSwapResult.swapInstruction.data,
        new BN(amount),
        slippageBps,
      )
      .accounts({
        authority,
        config: mirrorfiClient.configPda,
        destinationMint: targetMint,
        sourceMint: depositMint,
        vault: vaultPda,
        strategy,
        tokenProgram: TOKEN_PROGRAM_ID,
        vaultSourceTokenAccount: vaultTargetMintTokenAccount,
        vaultDestinationTokenAccount: vaultDepositMintTokenAccount,
        treasuryTokenAccount,
      })
      .remainingAccounts(remainingAccounts)
      .instruction();

    const tx = await buildTx([ix], new PublicKey(authority));

    return bs58.encode(tx.serialize());
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