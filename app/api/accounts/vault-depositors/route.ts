import { GetProgramAccountsFilter } from '@solana/web3.js';
import { NextRequest, NextResponse } from 'next/server';
import { DISCRIMINATOR_SIZE } from '@/lib/constants';
import { BN } from '@coral-xyz/anchor';
import { mirrorfiClient } from '@/lib/solana-server';
import { parseVault, parseVaultDepositor } from '@/types/accounts';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const pdas = searchParams.getAll('pda');
  const vault = searchParams.get('vault');
  const authority = searchParams.get('authority');

  try {
    if (!pdas.length) {
      const filters : GetProgramAccountsFilter[] = [];

      if (vault) {
        filters.push({
          memcmp: {
            offset: DISCRIMINATOR_SIZE + 32,
            bytes: vault,
          },
        });
      }

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
          vaultDepositors: await mirrorfiClient.fetchAllProgramAccounts("vaultDepositor", parseVaultDepositor, filters),
        },
        {
          status: 200,
        }
      );
    } else if (pdas.length > 1) {
      return NextResponse.json(
        {
          vaultDepositors: await mirrorfiClient.fetchMultipleProgramAccounts(pdas, "vaultDepositor", parseVaultDepositor),
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          vaultDepositor: await mirrorfiClient.fetchProgramAccount(pdas[0], "vaultDepositor", parseVaultDepositor),
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
            : 'Unable to fetch vaultDepositor account(s).',
      },
      {
        status: 500,
      }
    );
  }
}
