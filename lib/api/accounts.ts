import { PublicKey } from "@solana/web3.js";
import { wrappedFetch } from "../utils";

export async function getVaultStrategies(vault: PublicKey) {
    const res = await wrappedFetch(`/api/accounts/strategies?vault=${vault.toString()}`);

    return res.strategies;
}

export async function getAllVaults() {
    const res = await wrappedFetch(`/api/accounts/vaults`);

    return res.vaults;
}

export async function getVaultDepositors(vault: string): Promise<any> {
  const res = await wrappedFetch(`/api/accounts/vault-depositors?vault=${vault}`);

  return res.vaultDepositors;
}

export async function getUserPositions(user: string): Promise<any> {
  const res = await wrappedFetch(`/api/accounts/vault-depositors?authority=${user}`);

  return res.vaultDepositors;
}

export async function getUserVaultPosition(user: string, vault: string): Promise<any> {
  const res = await wrappedFetch(`/api/accounts/vault-depositors?authority=${user}&vault=${vault}`);

  return res.vaultDepositors;
}