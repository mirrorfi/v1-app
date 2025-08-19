import { NextRequest } from "next/server";
import { AnchorProvider, Wallet, BN, Provider, Program, web3 } from "@coral-xyz/anchor";
import { PublicKey, Connection, Keypair } from "@solana/web3.js";
import IDL from "@/lib/program/idl.json";
import { MirrorfiVault } from "@/lib/program/types";
import { createEncodedTransaction } from "@/lib/solana";
import { encodeName } from "@/lib/program/encodeName";
import accounts from "@/lib/program/accounts.json";
import { TOKEN_PROGRAM_2022_ID } from "@/lib/program/constants";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const vault = searchParams.get("vault");
    
    if(!process.env.PRIVATE_SOLANA_RPC_URL) {
        return new Response(JSON.stringify({ error: "Solana PRC Not Provided" }), { status: 500 });
    }

    if(!vault) {
        return new Response(JSON.stringify({ error: "Vault Not Provided" }), { status: 400 });
    }

    let vaultAddress
    try {
        vaultAddress = new PublicKey(vault);
    } catch(e) {
        return new Response(JSON.stringify({ error: "Invalid Vault Address" }), { status: 400 });
    }
    
    try{
        const connection = new Connection(process.env.PRIVATE_SOLANA_RPC_URL);
        const wallet = {
            publicKey: Keypair.generate().publicKey,
            signTransaction: async (transaction: any) => { return transaction; },
            signAllTransactions: async (transactions: any) => { return transactions; }
        }
        const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
        const program = new Program(IDL as MirrorfiVault, provider);

        
        let vault = await program.account.vault.fetch(vaultAddress);
        console.log(vault)

        // TODO: Fetch Vault Details

        const res = {
            message: "hello"
        }

        return new Response(
            JSON.stringify(res),
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("API Error:", error instanceof Error ? error.message : "Unknown error occurred");

        return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
        status: 500,
        });
    }
}