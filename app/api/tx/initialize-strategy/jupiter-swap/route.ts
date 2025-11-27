import { buildTx, mirrorfiClient } from "@/lib/server/solana";
import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { strategyType, authority, destinationMint, vault } = await req.json();

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

    const id = await mirrorfiClient.getNextStrategyId(vault);
    const strategy = mirrorfiClient.getStrategyPda(new PublicKey(vault), new BN(id));

    const ix = await mirrorfiClient.program.methods
      .initializeStrategyJupiterSwap()
      .accountsPartial({
        authority,
        destinationMint,
        vault,
        strategy,
      })
      .instruction();

    const tx = await buildTx([ix], new PublicKey(authority));

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