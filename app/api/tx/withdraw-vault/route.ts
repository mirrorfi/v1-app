import { buildTx, mirrorfiClient, SERVER_CONNECTION } from "@/lib/solana-server";
import { parseVault } from "@/types/accounts";
import { BN } from "@coral-xyz/anchor";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, withdrawer, vault } = await req.json();

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return NextResponse.json(
        { error: 'Invalid deposit amount.' },
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
    const receiptMint = mirrorfiClient.getReceiptMintPda(vaultPubkey);
    const depositMintPubkey = new PublicKey(depositMint);
    const withdrawerPubkey = new PublicKey(withdrawer);
    const depositMintTokenProgram = (await SERVER_CONNECTION.getAccountInfo(depositMintPubkey))!.owner;
    const vaultTokenAccount = getAssociatedTokenAddressSync(
      depositMintPubkey,
      new PublicKey(vault),
      !PublicKey.isOnCurve(vault),
      depositMintTokenProgram,
    );

    const ix = await mirrorfiClient.program.methods
      .withdrawVault(new BN(amount))
      .accounts({
        config: mirrorfiClient.configPda,
        depositMint,
        depositMintTokenProgram,
        receiptMint,
        vault,
        vaultTokenAccount,
        withdrawer,
      })
      .instruction();

    const tx = await buildTx([ix], withdrawerPubkey);
    let res = {
      tx: bs58.encode(tx.serialize()),
    }
    return new Response(
      JSON.stringify(res),
      { status: 200 }
    );
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