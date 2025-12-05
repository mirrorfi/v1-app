import { getJupiterPrices } from "@/lib/server/jupiter";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const ids = searchParams.get('mints');

    if (!ids) {
      return NextResponse.json(
        {
          error: 'ids are required',
        },
        {
          status: 400,
        }
      );
    }

    const mints = ids.split(',');

    return NextResponse.json({
      prices: await getJupiterPrices(mints),
    })
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Unable to fetch token prices.',
      },
      {
        status: 500,
      }
    );
  }
}