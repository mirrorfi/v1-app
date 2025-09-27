

export const erire = "reretert";


import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { MirrorfiVault } from "@/lib/program/types";
import { getSpotManagerPda, getVaultAuthorityPda } from "./pda";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

// Temporary Data, only USDC Price Feed Available
const TEMP_PYTH_PRICES: Record<string, PublicKey> = {
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': new PublicKey('Dpw1EAVrSB1ibxiDQyTAW6Zip3J4Btk2x4SgApQCeFbX'),
}

export const getRefreshNavIxs = async (program: Program<MirrorfiVault>, vault: PublicKey) => {
    console.log("Fetching Refresh NAV Instructions...");
    const spotManagerPda = getSpotManagerPda(program.programId, vault);
    const vaultAuthorityPda = getVaultAuthorityPda(program.programId, vault);
    console.log("Spot Manager PDA:", spotManagerPda.toBase58());
    console.log("Vault Authority PDA:", vaultAuthorityPda.toBase58());
    const spotManager = await program.account.spotManager.fetch(spotManagerPda);

    const mapping_refresh_ixs: TransactionInstruction[] = [];
    const remainingAccounts: any = [];
    await Promise.all(spotManager.positions.map(async(position: any, index: number) => {
        if (position.isActive) {
            const refresh_ix = await program.methods
                .mappingRefresh()
                .accounts({ mint: position.tokenMint})
                .remainingAccounts([{
                    pubkey: TEMP_PYTH_PRICES[position.tokenMint.toString()],
                    isSigner: false,
                    isWritable: false,
                }]).instruction();
            const [mapping] = PublicKey.findProgramAddressSync(
                [Buffer.from("mapping"), position.tokenMint.toBuffer()],
                program.programId
            );
            const vault_ata = await getAssociatedTokenAddressSync(position.tokenMint, vaultAuthorityPda, true, TOKEN_PROGRAM_ID);
            remainingAccounts.push({
                pubkey: mapping,
                isWritable: true,
                isSigner: false,
            });
            remainingAccounts.push({
                pubkey: vault_ata,
                isWritable: true,
                isSigner: false,
            });
            mapping_refresh_ixs.push(refresh_ix);
            console.log(`Mapping Refresh Instruction for Position ${index + 1} Fetched`);
        }
    }));

    const vault_refresh_nav_ix = await program.methods
        .vaultRefreshNav()
        .accounts({vault})
        .remainingAccounts(remainingAccounts)
        .instruction();

    return [...mapping_refresh_ixs, vault_refresh_nav_ix];
};