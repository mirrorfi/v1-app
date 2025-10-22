import { buildTx, mirrorfiClient } from "@/lib/solana-server";
import { v0TxToBase64 } from "@/lib/utils";
import { parseStrategy, parseVault } from "@/types/accounts";
import { PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { authority, strategy } = await req.json();

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
        { status: 404 }
      );
    }

    const { vault } = strategyAcc;
    const vaultAcc = await mirrorfiClient.fetchProgramAccount(vault, "vault", parseVault);

    if (!vaultAcc) {
      return NextResponse.json(
        { error: 'Vault account not found.' },
        { status: 404 }
      );
    }

    const ix = await mirrorfiClient.program.methods
      .closeStrategy()
      .accounts({
        authority,
        strategy,
        vault
      })
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