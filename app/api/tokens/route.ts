import { getTokenInfos } from "@/lib/api/jupiter";
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
      tokenInfos: getTokenInfos(mints),
    })
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Unable to fetch token info.',
      },
      {
        status: 500,
      }
    );
  }
}