import { PublicKey } from '@solana/web3.js';
import { SPOT_MANAGER, KAMINO_MANAGER, VAULT_AUTHORITY, VAULT_DEPOSITOR, VAULT_SHARE_MINT } from './seeds';


export function getSpotManagerPda(programId: PublicKey, vault: PublicKey) {
    const [spotManagerPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(SPOT_MANAGER), vault.toBuffer()],
        programId
    );
    return spotManagerPda;
}

export function getKaminoManagerPda(programId: PublicKey, vault: PublicKey) {
    const [kaminoManagerPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(KAMINO_MANAGER), vault.toBuffer()],
        programId
    );
    return kaminoManagerPda;
}

export function getVaultAuthorityPda(programId: PublicKey, vault: PublicKey) {
    const [vaultAuthorityPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(VAULT_AUTHORITY), vault.toBuffer()],
        programId
    );
    return vaultAuthorityPda;
}

export function getVaultDepositorPda(programId: PublicKey, vault: PublicKey, user: PublicKey) {
    const [vaultDepositorPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(VAULT_DEPOSITOR), vault.toBuffer(), user.toBuffer()],
        programId
    );
    return vaultDepositorPda;
}

export function getShareTokenMintPda(programId: PublicKey, vault: PublicKey) {
    const [shareTokenMintPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(VAULT_SHARE_MINT), vault.toBuffer()],
        programId
    );
    return shareTokenMintPda;
}