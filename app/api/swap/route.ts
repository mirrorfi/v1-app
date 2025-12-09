import { getJupiterSwapInstructions, getJupiterSwapQuote } from "@/lib/server/jupiter";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const inputMint = searchParams.get('inputMint');
    const outputMint = searchParams.get('outputMint');
    const amount = searchParams.get('amount');
    const slippageBps = searchParams.get('slippageBps');
    const exactOutRoute = searchParams.get('exactOutRoute');
    const onlyDirectRoutes = searchParams.get('onlyDirectRoutes');
    const userPublicKey = searchParams.get('userPublicKey');

    if (!inputMint) {
      return NextResponse.json(
        { error: 'inputMint is required.' },
        { status: 400 }
      );
    }

    if (!outputMint) {
      return NextResponse.json(
        { error: 'outputMint is required.' },
        { status: 400 }
      );
    }

    if (!amount) {
      return NextResponse.json(
        { error: 'amount is required.' },
        { status: 400 }
      );
    }

    // amount must be a valid positive number
    if (BigInt(amount) <= BigInt(0)) {
      return NextResponse.json(
        { error: 'Amount must be a positive number.' },
        { status: 400 }
      );
    }

    if (!slippageBps) {
      return NextResponse.json(
        { error: 'slippageBps is required.' },
        { status: 400 }
      );
    }

    // slippageBps must be a valid positive number
    if (isNaN(Number(slippageBps)) || Number(slippageBps) < 0) {
      return NextResponse.json(
        { error: 'slippageBps must be a non-negative number.' },
        { status: 400 }
      );
    }

    if (!exactOutRoute) {
      return NextResponse.json(
        { error: 'exactOutRoute is required.' },
        { status: 400 }
      );
    }

    // exactOutRoute must be a boolean
    if (exactOutRoute !== 'true' && exactOutRoute !== 'false') {
      return NextResponse.json(
        { error: 'exactOutRoute must be a boolean.' },
        { status: 400 }
      );
    }

    if (!onlyDirectRoutes) {
      return NextResponse.json(
        { error: 'onlyDirectRoutes is required.' },
        { status: 400 }
      );
    }

    // onlyDirectRoutes must be a boolean
    if (onlyDirectRoutes !== 'true' && onlyDirectRoutes !== 'false') {
      return NextResponse.json(
        { error: 'onlyDirectRoutes must be a boolean.' },
        { status: 400 }
      );
    }

    if (!userPublicKey) {
      return NextResponse.json(
        { error: 'userPublicKey is required.' },
        { status: 400 }
      );
    }

    const quoteResponse = await getJupiterSwapQuote({
      amount: Number(amount),
      slippageBps: Number(slippageBps),
      inputMint,
      outputMint,
      onlyDirectRoutes: onlyDirectRoutes === 'true',
      exactOutRoute: exactOutRoute === 'true',
    })

    const instructions = await getJupiterSwapInstructions({
      quoteResponse,
      userPublicKey,
      dynamicSlippage: true,
    })

    return NextResponse.json({
      instructions,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Unable to get swap instructions.',
      },
      {
        status: 500,
      }
    );
  }
}