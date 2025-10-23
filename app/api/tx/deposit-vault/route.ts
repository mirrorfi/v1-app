import { buildTx, mirrorfiClient, SERVER_CONNECTION } from "@/lib/solana-server";
import { v0TxToBase64 } from "@/lib/utils";
import { parseVault } from "@/types/accounts";
import { BN } from "@coral-xyz/anchor";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
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
    const receiptMint = mirrorfiClient.getReceiptMintPda(vaultPubkey);
    const depositorPubkey = new PublicKey(depositor);
    const depositMintTokenProgram = (await SERVER_CONNECTION.getAccountInfo(depositMint))!.owner;
    const depositorTokenAccount = getAssociatedTokenAddressSync(
      depositMint,
      depositorPubkey,
      !PublicKey.isOnCurve(depositorPubkey),
      depositMintTokenProgram,
    );
    const vaultTokenAccount = getAssociatedTokenAddressSync(
      depositMint,
      vaultPubkey,
      !PublicKey.isOnCurve(vault),
      depositMintTokenProgram,
    );

    const ix = await mirrorfiClient.program.methods
      .depositVault(new BN(amount))
      .accounts({
        config: mirrorfiClient.configPda,
        depositMint,
        depositMintTokenProgram,
        depositor,
        depositorTokenAccount,
        receiptMint,
        vault,
        vaultTokenAccount,
      })
      .instruction();

    const tx = await buildTx([ix], depositorPubkey);

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