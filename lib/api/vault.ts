import { PublicKey } from "@solana/web3.js";

export async function getVaultBalances(vault: PublicKey) {
    // const res = await fetch("/api/tx/initialize", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({}),
    // });
    const res = await fetch(`/api/vault/balances?vault=${"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}`);
    const data = await res.json();
    console.log(data);
    return data;
}