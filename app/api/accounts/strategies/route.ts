import { GetProgramAccountsFilter } from '@solana/web3.js';
import { NextRequest, NextResponse } from 'next/server';
import { DISCRIMINATOR_SIZE } from '@/lib/constants';
import { BN } from '@coral-xyz/anchor';
import { mirrorfiClient } from '@/lib/server/solana';
import { parseStrategy } from '@/types/accounts';
import { BNtoBase64 } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const pdas = searchParams.getAll('pda');
  const vault = searchParams.get('vault');
  const id = searchParams.get('id');

  try {
    if (!pdas.length) {
      const filters : GetProgramAccountsFilter[] = [];

      if (vault) {
        filters.push({
          memcmp: {
            offset: DISCRIMINATOR_SIZE,
            bytes: vault,
            encoding: "base58",
          },
        });
      }

      if (id) {
        filters.push({
          memcmp: {
            offset: DISCRIMINATOR_SIZE + 32 + 8,
            bytes: BNtoBase64(new BN(id), 1),
            encoding: "base64",
          },
        });
      }

      return NextResponse.json(
        {
          strategies: await mirrorfiClient.fetchAllProgramAccounts("strategy", parseStrategy, filters),
        },
        {
          status: 200,
        }
      );
    } else if (pdas.length > 1) {
      return NextResponse.json(
        {
          strategies: await mirrorfiClient.fetchMultipleProgramAccounts(pdas, "strategy", parseStrategy),
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          strategies: await mirrorfiClient.fetchProgramAccount(pdas[0], "strategy", parseStrategy),
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
            : 'Unable to fetch strategy account(s).',
      },
      {
        status: 500,
      }
    );
  }
}
