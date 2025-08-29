import { NextRequest } from "next/server";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey, Connection, Keypair } from "@solana/web3.js";
import IDL from "@/lib/program/idl.json";
import { MirrorfiVault } from "@/lib/program/types";
import { getKaminoBalances } from "@/lib/utils/kamino/nav";
import { getSpotBalances } from "@/lib/utils/spot";

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


        // Hardcoded Position Data
        const vaultAuthority = new PublicKey("H1ZpCkCHJR9HxwLQSGYdCDt7pkqJAuZx5FhLHzWHdiEw");
        const spotPositions = [
            new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
            new PublicKey("So11111111111111111111111111111111111111112"),
            new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB")
        ];
        const kaminoObligations = [
            new PublicKey("Vnaq7vbHuwHHHSTzDYVnMf2WzFPdAzQA1iAa5NtpXNw")
        ];

        // Fetch Vault Position & Balances
        const balances: Record<string, any> = {}
        const spotBalances = await getSpotBalances(connection, vaultAuthority, spotPositions);
        const kaminoBalances = await getKaminoBalances(connection, kaminoObligations);
        balances["spot"] = spotBalances;
        balances["kamino"] = kaminoBalances;

        return new Response(
            JSON.stringify(balances),
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("API Error:", error instanceof Error ? error.message : "Unknown error occurred");

        return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
        status: 500,
        });
    }
}