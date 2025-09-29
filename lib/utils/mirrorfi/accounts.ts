import IDL from "@/lib/program/idl.json";
import { PublicKey, Connection } from "@solana/web3.js";
import { VaultAccountLayout, VaultDepositorLayout } from "./struct";
import { getVaultDepositorPda } from "./pda";

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

export async function getVaultDepositorAccountInfo(connection: Connection, vault: PublicKey, user: PublicKey) {
    const vaultDepositor = getVaultDepositorPda(new PublicKey(IDL.address), vault, user);
    console.log("Fetching Vault Depositor Account Info for:", vaultDepositor.toBase58());
    const accountInfo = await connection.getAccountInfo(vaultDepositor);
    console.log("Raw Vault Depositor Account Info:", accountInfo);
    if (!accountInfo) return null;
    // Decode Data
    const data = accountInfo.data;
    const decoded = VaultDepositorLayout.decode(Uint8Array.from(data));
    console.log("Decoded Vault Depositor Data:", decoded);
    return decoded;
}

// export async function getUser
