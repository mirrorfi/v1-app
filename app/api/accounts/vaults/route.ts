import { GetProgramAccountsFilter } from '@solana/web3.js';
import { NextRequest, NextResponse } from 'next/server';
import { DISCRIMINATOR_SIZE } from '@/lib/constants';
import { BN } from '@coral-xyz/anchor';
import { mirrorfiClient } from '@/lib/server/solana';
import { parseVault } from '@/types/accounts';
import { BNtoBase64 } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const pdas = searchParams.getAll('pda');
  const id = searchParams.get('id');
  const authority = searchParams.get('authority');

  try {
    if (!pdas.length) {
      const filters : GetProgramAccountsFilter[] = [];

      if (id) {
        filters.push({
          memcmp: {
            offset: DISCRIMINATOR_SIZE,
            bytes: BNtoBase64(new BN(id), 8),
            encoding: "base64",
          },
        });
      }

      if (authority) {
        filters.push({
          memcmp: {
            offset: DISCRIMINATOR_SIZE + 8,
            bytes: authority,
            encoding: "base58",
          },
        });
      }

      return NextResponse.json(
        {
          vaults: await mirrorfiClient.fetchAllProgramAccounts("vault", parseVault, filters),
        },
        {
          status: 200,
        }
      );
    } else if (pdas.length > 1) {
      return NextResponse.json(
        {
          vaults: await mirrorfiClient.fetchMultipleProgramAccounts(pdas, "vault", parseVault),
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          vault: await mirrorfiClient.fetchProgramAccount(pdas[0], "vault", parseVault),
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
            : 'Unable to fetch vault account(s).',
      },
      {
        status: 500,
      }
    );
  }
}