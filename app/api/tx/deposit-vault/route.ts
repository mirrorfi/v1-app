import { buildTx, mirrorfiClient, SERVER_CONNECTION } from "@/lib/solana-server";
import { parseVault } from "@/types/accounts";
import { BN } from "@coral-xyz/anchor";
import { createAssociatedTokenAccountIdempotentInstruction, createSyncNativeInstruction, getAssociatedTokenAddressSync, NATIVE_MINT } from "@solana/spl-token";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, depositor, vault } = await req.json();

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

    if (!depositor) {
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

    const depositMint = new PublicKey(vaultAcc.depositMint);
    const vaultPubkey = new PublicKey(vault);
    const depositorPubkey = new PublicKey(depositor);
    const depositMintTokenProgram = (await SERVER_CONNECTION.getAccountInfo(depositMint))!.owner;

    const deposit_ix = await mirrorfiClient.program.methods
      .depositVault(new BN(amount))
      .accounts({
        depositor,
        config: mirrorfiClient.configPda,
        vault,
        depositMint,
        depositMintTokenProgram,
      })
      .instruction();

    const ixs = [];

    // Add Native => SPL Token Conversion if depositMint is native SOL
    if (depositMint.equals(NATIVE_MINT)) {
      const depositorAta = getAssociatedTokenAddressSync(
        NATIVE_MINT,
        depositorPubkey,
        false
      );

      // Create ATA if it doesn't exist (idempotent)
      const createAtaIx = createAssociatedTokenAccountIdempotentInstruction(
        depositorPubkey,
        depositorAta,
        depositorPubkey,
        NATIVE_MINT
      );

      // Transfer SOL to the ATA
      const transferIx = SystemProgram.transfer({
        fromPubkey: depositorPubkey,
        toPubkey: depositorAta,
        lamports: BigInt(amount),
      });

      // Sync native balance
      const syncNativeIx = createSyncNativeInstruction(depositorAta);

      ixs.push(createAtaIx, transferIx, syncNativeIx);
    }

    ixs.push(deposit_ix);

    const tx = await buildTx(ixs, depositorPubkey);

    return NextResponse.json({
      tx,
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