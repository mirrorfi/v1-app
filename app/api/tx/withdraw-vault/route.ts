import { buildTx, mirrorfiClient, SERVER_CONNECTION } from "@/lib/server/solana";
import { parseVault } from "@/types/accounts";
import { BN } from "@coral-xyz/anchor";
import { createCloseAccountInstruction, getAssociatedTokenAddressSync, NATIVE_MINT, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, withdrawer, vault } = await req.json();

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

    if (!withdrawer) {
      return NextResponse.json(
        { error: 'Depositor is required.' },
        { status: 400 }
      );
    }

    if (!vault) {
      return NextResponse.json(
        { error: 'Vault is required.' },
        { status: 400 }
      );
    }

    const vaultAcc = await mirrorfiClient.fetchProgramAccount(vault, "vault", parseVault);

    if (!vaultAcc) {
      return NextResponse.json(
        { error: 'Vault account not found.' },
        { status: 400 }
      );
    }

    const depositMint = vaultAcc.depositMint;
    const vaultPubkey = new PublicKey(vault);
    const withdrawerPubkey = new PublicKey(withdrawer);
    const vaultDepositor = mirrorfiClient.getVaultDepositorPda(withdrawerPubkey, vaultPubkey);
    const depositMintPubkey = new PublicKey(depositMint);
    const depositMintTokenProgram = (await SERVER_CONNECTION.getAccountInfo(depositMintPubkey))!.owner;

    const withdraw_ix = await mirrorfiClient.program.methods
      .withdrawVault(new BN(amount))
      .accounts({
        withdrawer,
        config: mirrorfiClient.configPda,
        vault,
        vaultDepositor,
        depositMint,
        depositMintTokenProgram,
      })
      .instruction();
    
    const ixs = [withdraw_ix];

    // Add SPL Token => Native Conversion if depositMint is native SOL
    if (depositMintPubkey.equals(NATIVE_MINT)) {
      const withdrawerAta = getAssociatedTokenAddressSync(
        NATIVE_MINT,
        withdrawerPubkey,
        false
      );

      // Close the wrapped SOL account to convert back to native SOL
      const closeAccountIx = createCloseAccountInstruction(
        withdrawerAta,
        withdrawerPubkey,
        withdrawerPubkey
      );

      ixs.push(closeAccountIx);
    }

    const tx = await buildTx(ixs, withdrawerPubkey);

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