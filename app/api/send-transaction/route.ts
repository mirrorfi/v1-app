import { sendTx } from "@/lib/solana-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { transaction } = await req.json();

    const signature = await sendTx(transaction);

    return NextResponse.json({
      signature,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Failed to send transaction.',
      },
      { status: 500 }
    );
  }
}