import { wrappedFetch } from "../utils";

export async function getVaultBalance(vault: string): Promise<any> {
  const res = await wrappedFetch(`/api/vault/balance?vault=${vault}`);

  return res;
}

export async function getVaultHistory(vault: string, timeframe: string = "7D"): Promise<any> {
  const res = await wrappedFetch(`/api/vault/history?vault=${vault}&timeframe=${timeframe}`);

  return res;
}