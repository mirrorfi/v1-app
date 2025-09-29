import { NextRequest } from "next/server";
import { AnchorProvider, Wallet, BN, Provider, Program, web3 } from "@coral-xyz/anchor";
import { PublicKey, Connection, Keypair } from "@solana/web3.js";
import IDL from "@/lib/program/idl.json";
import { MirrorfiVault } from "@/lib/program/types";
import { createEncodedTransaction } from "@/lib/solana";
import { encodeName } from "@/lib/program/encodeName";
import accounts from "@/lib/program/accounts.json";
import { TOKEN_PROGRAM_2022_ID } from "@/lib/program/constants";
import { getAllVaultAccountInfos } from "@/lib/utils/mirrorfi/accounts";

export async function GET(req: NextRequest) {
    if(!process.env.PRIVATE_SOLANA_RPC_URL) {
        return new Response(JSON.stringify({ error: "Solana PRC Not Provided" }), { status: 500 });
    }
    
    try{ 
        // Fetch All Vaults
        const connection = new Connection(process.env.PRIVATE_SOLANA_RPC_URL);
        let vaults = await getAllVaultAccountInfos(connection);

        return new Response(
            JSON.stringify(vaults),
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("API Error:", error instanceof Error ? error.message : "Unknown error occurred");

        return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
        status: 500,
        });
    }
}