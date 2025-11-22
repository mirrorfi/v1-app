import { wrappedFetch } from "../utils";

export async function getVaultBalance(vault: string): Promise<any> {
  const res = await wrappedFetch(`/api/vault/balance?vault=${vault}`);

  return res;
}

export async function getAllVaultBalances(): Promise<any> {
  const res = await wrappedFetch(`/api/vault/balance`);

  return res;
}

export async function getVaultHistory(vault: string, timeframe: string = "7D"): Promise<any> {
  const res = await wrappedFetch(`/api/vault/history?vault=${vault}&timeframe=${timeframe}`);

  return res;
}

export interface ParsedVaultBalanceData {
  strategyType: string;
  tokenInfo: {
    name: string;
    symbol: string;
    icon: string;
    decimals: number;
    tokenProgram: string;
    usdPrice: number;
  };
  mint: string;
  balance: number;
  value: number;
  initialCapital: number;
}

export function parseVaultBalanceData(vaultBalanceData: any, strategyType: string, initialCapital: number = 0): ParsedVaultBalanceData {
  let depositData = {
    strategyType,
    tokenInfo: {
      name: vaultBalanceData.name,
      symbol: vaultBalanceData.symbol,
      icon: vaultBalanceData.icon,
      decimals: vaultBalanceData.decimals,
      tokenProgram: vaultBalanceData.tokenProgram,
      usdPrice: vaultBalanceData.usdPrice,
    },
    mint: vaultBalanceData.depositMint,
    balance: Number(vaultBalanceData.balance) / (10 ** vaultBalanceData.decimals),
    value: (Number(vaultBalanceData.balance) / (10 ** vaultBalanceData.decimals)) * (vaultBalanceData.usdPrice || 0),
    initialCapital,
  }
  return depositData;
}
