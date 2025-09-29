import { NextRequest } from "next/server";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey, Connection, Keypair } from "@solana/web3.js";
import IDL from "@/lib/program/idl.json";
import { MirrorfiVault } from "@/lib/program/types";
import { getKaminoBalances } from "@/lib/utils/kamino";
import { getShareTokenMintPda } from "@/lib/utils/mirrorfi/pda";
import { getSpotBalances } from "@/lib/utils/spot";

// !!!!!!!!!Note!!!!!!!!!
// Use this for Demo Data
// !!!!!!!!!!!!!!!!!!!!!!

export async function GET(req: NextRequest, res: NextRequest) {
    const { searchParams } = new URL(req.url);
    const vault = searchParams.get("vault");

    // Taken inspiration from jupiter api: allow for multiple vault datas to be fetched in one batch call
    // If possible, allow comma separated list of vault addresses
    // Example: ?vaults=addr1,addr2,addr3
    // Mario if you read this, you reckon this is possible to do from your side?
    const vaults = searchParams.get("vaults");
    
    if(!process.env.PRIVATE_SOLANA_RPC_URL) {
        return new Response(JSON.stringify({ error: "Solana PRC Not Provided" }), { status: 500 });
    }

    if(!vault && !vaults) {
        return new Response(JSON.stringify({ error: "Vault(s) Not Provided" }), { status: 400 });
    }

    // let vaultAddresses = [];
    // try {
    //     vaultAddress = new PublicKey(vault);
    // } catch(e) {
    //     return new Response(JSON.stringify({ error: "Invalid Vault Address" }), { status: 400 });
    // }
    
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
        
        console.log("Vault:", vault);
        // Fetch Share Token Supply
        const shareToken = getShareTokenMintPda(program.programId, new PublicKey(vault!));
        const shareTokenAccount = await connection.getParsedAccountInfo(shareToken);
        const shareTokenSupply = (shareTokenAccount.value?.data as any)?.parsed?.info?.supply || 0;
        const shareTokenDecimals = (shareTokenAccount.value?.data as any)?.parsed?.info?.decimals || 6;
        console.log("Share Token Decimals:", shareTokenDecimals);
       
        balances["shareTokenSupply"] = Number(shareTokenSupply) / 10**shareTokenDecimals;
        balances["spot"] = spotBalances;
        balances["kamino"] = kaminoBalances;
        balances["totalNAV"] = spotBalances.totalNAV + kaminoBalances.totalNAV;
        console.log(balances);
        

        return new Response(
            JSON.stringify(balances),
            { 
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
            }
        );
    } catch (error: unknown) {
        console.error("API Error:", error instanceof Error ? error.message : "Unknown error occurred");

        return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
        status: 500,
        });
    }
}