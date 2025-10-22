import { mirrorfiClient } from '@/lib/solana-server';
import { parseConfig } from '@/types/accounts';
import { NextRequest, NextResponse } from 'next/server';

export  async function GET(req: NextRequest) {
  const configPda = mirrorfiClient.configPda;

  try {
    return NextResponse.json(
      {
        config: await mirrorfiClient.fetchProgramAccount(configPda.toBase58(), "config", parseConfig),
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Unable to fetch config account.',
      },
      {
        status: 500,
      }
    );
  }
}
