import { buildTx, mirrorfiClient, SERVER_CONNECTION } from "@/lib/solana-server";
import { extractRemainingAccountsForSwap, swap } from "@/lib/utils/jupiter-swap";
import { parseVault } from "@/types/accounts";
import { BN } from "@coral-xyz/anchor";
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { strategyType, authority, destinationMint, vault, amount, slippageBps } = await req.json();

    if (strategyType !== 'JupiterSwap') {
      return NextResponse.json(
        { error: 'Invalid strategy type.' },
        { status: 400 }
      );
    }

    if (!authority) {
      return NextResponse.json(
        { error: 'Authority is required.' },
        { status: 400 }
      );
    }

    if (!destinationMint) {
      return NextResponse.json(
        { error: 'Destination mint is required.' },
        { status: 400 }
      );
    }

    if (!vault) {
      return NextResponse.json(
        { error: 'Vault is required.' },
        { status: 400 }
      );
    }

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

    const strategy = mirrorfiClient.getStrategyPda(new PublicKey(vault), new PublicKey(destinationMint));
    const vaultAcc = await mirrorfiClient.fetchProgramAccount(vault, 'vault', parseVault);

    if (!vaultAcc) {
      return NextResponse.json(
        { error: 'Vault account not found.' },
        { status: 400 }
      );
    }

    const depositMint = new PublicKey(vaultAcc.depositMint);
    const tokenMintAccountInfos = (await SERVER_CONNECTION.getMultipleAccountsInfo([depositMint, new PublicKey(destinationMint)]));
    const depositMintTokenProgram = tokenMintAccountInfos[0]!.owner;
    const destinationMintTokenProgram = tokenMintAccountInfos[1]!.owner;
    const vaultDepositMintTokenAccount = getAssociatedTokenAddressSync(
      depositMint,
      new PublicKey(vault),
      !PublicKey.isOnCurve(vault),
      depositMintTokenProgram,
    );
    const executeSwapResult = await swap(
      depositMint,
      destinationMint,
      amount,
      slippageBps,
      false,
      true,
      new PublicKey(vault),
      mirrorfiClient.program.provider.connection,
    );
    const remainingAccounts = extractRemainingAccountsForSwap(
      executeSwapResult.swapInstruction,
    ).remainingAccounts;

    const ixs = [
      await mirrorfiClient.program.methods
        .initializeStrategyJupiterSwap()
        .accounts({
          authority,
          destinationMint,
          vault,
        })
        .instruction(),
      await mirrorfiClient.program.methods
        .executeStrategyJupiterSwap(
          executeSwapResult.swapInstruction.data,
          new BN(amount),
          slippageBps,
        )
        .accounts({
          authority,
          config: mirrorfiClient.configPda,
          destinationMint,
          sourceMint: vaultAcc.depositMint,
          vault,
          strategy,
          tokenProgram: destinationMintTokenProgram,
          vaultSourceTokenAccount: vaultDepositMintTokenAccount,
        })
        .remainingAccounts(remainingAccounts)
        .instruction()
    ];

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