import { PublicKey } from "@solana/web3.js";

export interface VaultData {
    manager: PublicKey;
    vaultId: number;
    vaultName: string;
    managerFeeRate: number;
    depositTokenMint: PublicKey;
    depositTokenProgram: PublicKey;
}

export async function getVaultInitializeTx(vaultData: VaultData) {
    const res = await fetch("/api/tx/initialize", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            manager: vaultData.manager.toString(),
            vaultId: vaultData.vaultId,
            vaultName: vaultData.vaultName,
            managerFeeRate: vaultData.managerFeeRate,
            depositTokenMint: vaultData.depositTokenMint.toString(),
            depositTokenProgram: vaultData.depositTokenProgram.toString(),
        }),
    });
    const data = await res.json();
    console.log(data);
    return data;
}

export async function getVaultDepositTx(user: PublicKey, vault: PublicKey, depositAmount: number) {
    const res = await fetch("/api/tx/deposit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user: user.toString(),
            vault: vault.toString(),
            depositAmount,
        }),
    });
    const data = await res.json();
    console.log(data);
    return data;
}

export async function getVaultWithdrawTx(user: PublicKey, vault: PublicKey, depositAmount: number) {
    const res = await fetch("/api/tx/withdraw", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user: user.toString(),
            vault: vault.toString(),
            depositAmount,
        }),
    });
    const data = await res.json();
    console.log(data);
    return data;
}