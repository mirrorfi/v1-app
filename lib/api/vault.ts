import { PublicKey } from "@solana/web3.js";

export async function getVaultBalances(vault: PublicKey) {
    // const res = await fetch("/api/tx/initialize", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({}),
    // });
    try {
        const res = await fetch(`/api/vault/balances?vault=${vault.toString()}`);
        const data = await res.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Fetch Vault Balances Error:", error);
    }
}