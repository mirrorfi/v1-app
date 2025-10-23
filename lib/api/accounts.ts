import { PublicKey } from "@solana/web3.js";

export async function getVaultStrategies(vault: PublicKey) {
    try {
        const res = await fetch(`/api/accounts/strategies?vault=${vault.toString()}`);
        const data = await res.json();
        return data.strategies;
    } catch (error) {
        console.error("Fetch Vault Strategies Error:", error);
        return null;
    }
}

export async function getAllVaults() {
    try {
        const res = await fetch(`/api/accounts/vaults`);
        const data = await res.json();
        return data.vaults;
    } catch (error) {
        console.error("Fetch All Vaults Error:", error);
        return null;
    }
}