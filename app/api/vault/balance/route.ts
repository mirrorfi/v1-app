import { getJupiterTokenInfos } from "@/lib/server/jupiter";
import { DISCRIMINATOR_SIZE } from "@/lib/constants";
import { mirrorfiClient, SERVER_CONNECTION } from "@/lib/server/solana";
import { parseStrategy, parseVault } from "@/types/accounts";
import { getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { GetProgramAccountsFilter, PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const vaults = searchParams.getAll('vault');
  try {
    let allVaultAccs = await mirrorfiClient.fetchAllProgramAccounts("vault", parseVault);
    // Filter Vault Accounts based on the provided vault PDAs
    if(vaults.length > 0){
      allVaultAccs = allVaultAccs.filter(vaultAcc => vaults.includes(vaultAcc.publicKey));
    }

    const vaultAndStrategies = await Promise.all(
      allVaultAccs.map(async (vault) => {
        // Get NAV of vault ATA idle balance

        const depositMint = new PublicKey(vault.depositMint);
        const depositMintIndex = depositMint.toBase58();
        const tokenInfo = (await getJupiterTokenInfos([depositMintIndex]))[depositMintIndex];
        const tokenProgram = new PublicKey(tokenInfo.tokenProgram);
        const vaultAta = getAssociatedTokenAddressSync(
          depositMint,
          new PublicKey(vault.publicKey),
          !PublicKey.isOnCurve(vault.publicKey),
          tokenProgram,
        )
        const vaultAtaBal = (await getAccount(SERVER_CONNECTION, vaultAta, "confirmed", tokenProgram)).amount;
        let totalNav = (Number(vaultAtaBal) / (10 ** tokenInfo.decimals)) * tokenInfo.usdPrice;

        // Accumulate NAV from each strategy

        const filters: GetProgramAccountsFilter[] = [
          {
            memcmp: {
              offset: DISCRIMINATOR_SIZE,
              bytes: vault.publicKey,
            },
          }
        ]

        const strategies = await mirrorfiClient.fetchAllProgramAccounts("strategy", parseStrategy, filters);

        const strategiesWithNav = await Promise.all(
          strategies.map(async (strategy) => {
            if (strategy.strategyType.jupiterSwap) {
              const index = strategy.strategyType.jupiterSwap.targetMint;
              const tokenInfo = (await getJupiterTokenInfos([index]))[index];
              const tokenProgram = new PublicKey(tokenInfo.tokenProgram);
              const ata = getAssociatedTokenAddressSync(
                new PublicKey(index),
                new PublicKey(vault.publicKey),
                !PublicKey.isOnCurve(vault.publicKey),
                tokenProgram
              );
              const ataAccBal = (await getAccount(SERVER_CONNECTION, ata, "confirmed", tokenProgram)).amount;
              const balance = Number(ataAccBal) / (10 ** tokenInfo.decimals);
              const nav = balance * tokenInfo.usdPrice;
              totalNav += nav;
              const strategyWithNav = {
                ...strategy,
                balance: ataAccBal.toString(),
                nav,
                decimals: tokenInfo.decimals,
                name: tokenInfo.name,
                icon: tokenInfo.icon,
                symbol: tokenInfo.symbol,
                usdPrice: tokenInfo.usdPrice,
                tokenProgram: tokenInfo.tokenProgram,
              };
              delete (strategyWithNav as any).vault;
              return strategyWithNav;
            } else {
              throw new Error(`Unknown strategy type: ${strategy.strategyType}`);
            }
          })
        )

        return {
          vault: {
            ...vault,
            balance: vaultAtaBal.toString(),
            totalNav,
            decimals: tokenInfo.decimals,
            icon: tokenInfo.icon,
            symbol: tokenInfo.symbol,
            usdPrice: tokenInfo.usdPrice,
            tokenProgram: tokenInfo.tokenProgram,
          },
          strategies: strategiesWithNav,
        }
      })
    );

    return NextResponse.json(vaultAndStrategies);
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