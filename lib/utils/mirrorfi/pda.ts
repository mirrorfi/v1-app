import { PublicKey } from '@solana/web3.js';
import { SPOT_MANAGER, VAULT_AUTHORITY } from './seeds';


export function getSpotManagerPda(programId: PublicKey, vault: PublicKey) {
    const [spotManagerPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(SPOT_MANAGER), vault.toBuffer()],
        programId
    );
    return spotManagerPda;
}

export function getVaultAuthorityPda(programId: PublicKey, vault: PublicKey) {
    const [vaultAuthorityPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(VAULT_AUTHORITY), vault.toBuffer()],
        programId
    );
    return vaultAuthorityPda;
}