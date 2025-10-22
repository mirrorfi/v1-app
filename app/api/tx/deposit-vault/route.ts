import { buildTx, mirrorfiClient, SERVER_CONNECTION } from "@/lib/solana-server";
import { parseVault } from "@/types/accounts";
import { BN } from "@coral-xyz/anchor";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, depositor, vault } = await req.json();

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return NextResponse.json(
        { error: 'Invalid deposit amount.' },
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

    const depositMint = vaultAcc.depositMint;
    const vaultPubkey = new PublicKey(vault);
    const receiptMint = mirrorfiClient.getReceiptMintPda(vaultPubkey);
    const depositMintPubkey = new PublicKey(depositMint);
    const depositorPubkey = new PublicKey(depositor);
    const depositMintTokenProgram = (await SERVER_CONNECTION.getAccountInfo(depositMintPubkey))!.owner;
    const depositorTokenAccount = getAssociatedTokenAddressSync(
      depositMintPubkey,
      depositorPubkey,
      !PublicKey.isOnCurve(depositorPubkey),
      depositMintTokenProgram,
    );
    const vaultTokenAccount = getAssociatedTokenAddressSync(
      depositMintPubkey,
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