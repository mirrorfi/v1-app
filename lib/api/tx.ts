import { PublicKey } from "@solana/web3.js";

export interface VaultData {
    manager: PublicKey;
    vaultId: number;
    vaultName: string;
    managerFeeRate: number;
    depositTokenMint: PublicKey;
    depositTokenProgram: PublicKey;
}

export async function getVaultDepositTx(user: PublicKey, vault: PublicKey, depositAmount: number) {
    const res = await fetch("/api/tx/deposit-vault", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            depositor: user.toString(),
            vault: vault.toString(),
            amount: depositAmount,
        }),
    });
    const data = await res.json();
    console.log(data);
    return data;
}

export async function getVaultWithdrawTx(user: PublicKey, vault: PublicKey, withdrawAmount: number) {
    const res = await fetch("/api/tx/withdraw-vault", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            withdrawer: user.toString(),
            vault: vault.toString(),
            amount: withdrawAmount,
        }),
    });
    const data = await res.json();
    console.log(data);
    return data;
}