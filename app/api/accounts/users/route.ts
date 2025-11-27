import { mirrorfiClient } from '@/lib/server/solana';
import { parseUser } from '@/types/accounts';
import { NextRequest, NextResponse } from 'next/server';
import { GetProgramAccountsFilter } from '@solana/web3.js';
import { DISCRIMINATOR_SIZE } from '@/lib/constants';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const pdas = searchParams.getAll('pda');
  const authority = searchParams.get('authority');

  try {
    if (!pdas.length) {
      const filters: GetProgramAccountsFilter[] = [];

      if (authority) {
        filters.push({
          memcmp: {
            offset: DISCRIMINATOR_SIZE,
            bytes: authority,
          },
        });
      }

      return NextResponse.json(
        {
          users: await mirrorfiClient.fetchAllProgramAccounts('user', parseUser, filters),
        },
        {
          status: 200,
        }
      );
    } else if (pdas.length > 1) {
      return NextResponse.json(
        {
          users: await mirrorfiClient.fetchMultipleProgramAccounts(pdas, 'user', parseUser),
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          user: await mirrorfiClient.fetchProgramAccount(pdas[0], 'user', parseUser),
        },
        {
          status: 200,
        }
      );
    }
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Unable to fetch user account(s).',
      },
      {
        status: 500,
      }
    );
  }
}
