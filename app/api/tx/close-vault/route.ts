import { buildTx, mirrorfiClient, SERVER_CONNECTION} from "@/lib/solana-server";
import { parseVault } from "@/types/accounts";
import { PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

export async function POST(req: NextRequest) {
  try {
    const { vault, authority } = await req.json();

    if (!authority) {
      return NextResponse.json(
        { error: 'Authority is required.' },
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
        { status: 404 }
      );
    }

    const depositMint = new PublicKey(vaultAcc.depositMint);
    const depositMintTokenProgram = (await SERVER_CONNECTION.getAccountInfo(depositMint))!.owner;
    
    const ix = await mirrorfiClient.program.methods
      .closeVault()
      .accounts({
        authority,
        vault,
        depositMint,
        depositMintTokenProgram,
      })
      .instruction();

    const tx = await buildTx([ix], new PublicKey(authority));

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