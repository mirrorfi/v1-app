import IDL from "@/lib/program/idl.json";
import { PublicKey, Connection } from "@solana/web3.js";
import { VaultAccountLayout } from "./struct";

export async function getVaultAccountInfo(connection: Connection, vault: PublicKey) {
    console.log("Fetching Vault Account Info for:", vault.toBase58());
    const accountInfo = await connection.getAccountInfo(vault);
    console.log("Raw Vault Account Info:", accountInfo);
    if (!accountInfo) throw new Error("Vault not found");
    // Decode Data
    const data = accountInfo.data;

    console.log("Raw Vault Data:", data);
    const decoded = VaultAccountLayout.decode(Uint8Array.from(data));
    console.log("Decoded Vault Data:", decoded);
    return decoded;
}
