import { getTokenInfos } from "@/lib/api/jupiter";
import { DISCRIMINATOR_SIZE } from "@/lib/constants";
import { mirrorfiClient, SERVER_CONNECTION } from "@/lib/solana-server";
import { parseStrategy, parseVault } from "@/types/accounts";
import { getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { GetProgramAccountsFilter, PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const vault = searchParams.get("vault");

  if (!vault) {
    return NextResponse.json(
      {
        error: "Vault is required.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const vaultAcc = await mirrorfiClient.fetchProgramAccount(vault, "vault", parseVault);

    if (!vaultAcc) {
      return NextResponse.json(
        {
          error: "Vault account not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Get NAV of vault ATA idle balance

    const depositMint = new PublicKey(vaultAcc.depositMint);
    const tokenInfo = (await getTokenInfos([depositMint.toBase58()]))[depositMint.toBase58()];
    const tokenProgram = new PublicKey(tokenInfo.tokenProgram);
    const vaultAta = getAssociatedTokenAddressSync(
      depositMint,
      new PublicKey(vaultAcc.authority),
      !PublicKey.isOnCurve(vaultAcc.authority),
      tokenProgram,
    )
    const vaultAtaBal = (await getAccount(SERVER_CONNECTION, vaultAta, "confirmed", tokenProgram)).amount;
    let totalNav = Number(vaultAtaBal) / (10 ** tokenInfo.decimals);

    // Accumulate NAV from each strategy

    const filters: GetProgramAccountsFilter[] = [
      {
        memcmp: {
          offset: DISCRIMINATOR_SIZE,
          bytes: vault,
        },
      }
    ]

    const strategies = await mirrorfiClient.fetchAllProgramAccounts("strategy", parseStrategy, filters);
  
    const strategiesWithNav = await Promise.all(
      strategies.map(async (strategy) => {
        switch (strategy.strategyType) {
          case "jupiterSwap":
            const tokenInfo = await getTokenInfos(strategy.strategyType.jupiterSwap.targetMint);
            const tokenProgram = new PublicKey(tokenInfo.tokenProgram);
            const ata = getAssociatedTokenAddressSync(
              new PublicKey(strategy.strategyType.jupiterSwap.targetMint),
              new PublicKey(vaultAcc.authority),
              !PublicKey.isOnCurve(vaultAcc.authority),
              tokenProgram
            );
            const ataAccBal = (await getAccount(SERVER_CONNECTION, ata, "confirmed", tokenProgram)).amount;
            const balance = Number(ataAccBal) / (10 ** tokenInfo.decimals);
            const nav = balance * tokenInfo.priceUsd;
            totalNav += nav;
            return {
              ...strategy,
              nav,
            }
          // TODO: add case for KaminoLend
          default:
            throw new Error(`Unknown strategy type: ${strategy.strategyType}`);
        }
      })
    )

    return NextResponse.json({
      vault: {
        ...vaultAcc,
        totalNav,
      },
      strategies: strategiesWithNav,
    })
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Unable to fetch vault balance.',
      },
      {
        status: 500,
      }
    );
  }
}