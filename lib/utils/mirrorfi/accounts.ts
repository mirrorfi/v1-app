import IDL from "@/lib/program/idl.json";
import { PublicKey, Connection } from "@solana/web3.js";
import { VaultAccountLayout, VaultDepositorLayout } from "./struct";
import { getVaultDepositorPda } from "./pda";
import { lookup } from "dns";

export async function getAllVaultAccountInfos(connection: Connection) {
    const vaultAccounts = await connection.getProgramAccounts(new PublicKey(IDL.address), {
        filters: [
            {
                memcmp: {
                    bytes: 'cJJWPqNMczr',
                    offset: 0,
                },
            },
            {
                dataSize: 952,
            },
        ]
    });
    const vaults = vaultAccounts.map(({ pubkey, account }) => {
        const decoded = VaultAccountLayout.decode(Uint8Array.from(account.data));
        // Include the relevant fields only
        return {
            pubkey: pubkey.toBase58(),
            is_initialized: decoded.is_initialized,
            is_closed: decoded.is_closed,
            is_frozen: decoded.is_frozen,
            version: decoded.version,
            bump: decoded.bump,
            is_kamino: decoded.is_kamino,
            is_meteora: decoded.is_meteora,
            lookup_table: decoded.lookup_table.toString(),
            manager: decoded.manager.toString(),
            deposit_token_mint: decoded.deposit_token_mint.toString(),
            deposit_token_decimals: decoded.deposit_token_decimals,
            share_token_mint: decoded.share_token_mint.toString(),
            total_deposit: Number(decoded.total_deposit),
            total_withdrawal: Number(decoded.total_withdrawal),
            total_claimed_protocol_fee: Number(decoded.total_claimed_protocol_fee),
        };
    });
    return vaults;
}

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
