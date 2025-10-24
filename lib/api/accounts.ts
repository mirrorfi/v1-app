import { PublicKey } from "@solana/web3.js";
import { wrappedFetch } from "../utils";

export async function getVaultStrategies(vault: PublicKey) {
    return await wrappedFetch(`/api/accounts/strategies?vault=${vault.toString()}`);
}

export async function getAllVaults() {
    return await wrappedFetch(`/api/accounts/vaults`);
}