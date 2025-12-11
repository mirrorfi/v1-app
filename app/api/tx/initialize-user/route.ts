import { buildTx, mirrorfiClient } from "@/lib/server/solana";
import { PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { authority } = await req.json();

    if (!authority) {
      return NextResponse.json(
        { error: 'Authority is required.' },
        { status: 400 }
      );
    }

    const ix = await mirrorfiClient.program.methods
      .initializeUser()
      .accounts({
        authority,
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