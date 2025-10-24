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