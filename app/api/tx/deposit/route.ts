import { NextRequest } from "next/server";
import { AnchorProvider, Wallet, BN, Provider, Program, web3 } from "@coral-xyz/anchor";
import { PublicKey, Connection } from "@solana/web3.js";
import IDL from "@/lib/program/idl.json";
import { MirrorfiVault } from "@/lib/program/types";
import { createEncodedTransaction } from "@/lib/solana";
import { encodeName } from "@/lib/program/encodeName";
import accounts from "@/lib/program/accounts.json";
import { TOKEN_PROGRAM_2022_ID, TOKEN_PROGRAM_ID } from "@/lib/program/constants";

export async function POST(req: NextRequest) {
    const data = await req.json();
    
    if(!process.env.PRIVATE_SOLANA_RPC_URL) {
        return new Response(JSON.stringify({ error: "Solana PRC Not Provided" }), { status: 500 });
    }
    if(!data.user) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 500 });
    }
    if(!data.vault) {
        return new Response(JSON.stringify({ error: "Vault not found" }), { status: 500 });
    }
    if(!data.depositAmount) {
        return new Response(JSON.stringify({ error: "Deposit amount not found" }), { status: 500 });
    }

    try{
        const connection = new Connection(process.env.PRIVATE_SOLANA_RPC_URL);

        const userPublicKey = new PublicKey(data.user);
        const userWallet = {
            publicKey: userPublicKey,
            signTransaction: async (transaction: any) => { return transaction; },
            signAllTransactions: async (transactions: any) => { return transactions; }
        }
        const provider = new AnchorProvider(connection, userWallet, { commitment: "confirmed" });
        const program = new Program(IDL as MirrorfiVault, provider);

        const vault = await program.account.vault.fetch(new PublicKey(data.vault));
        if(!vault){
            throw new Error("Vault not found");
        }
        const depositTokenMint = vault.depositTokenMint;
        const depositTokenProgram = TOKEN_PROGRAM_ID;
        const shareTokenProgram = TOKEN_PROGRAM_2022_ID;

        const vault_deposit_ix = await program.methods.vaultDeposit({
            amount: new BN(data.depositAmount),
        }).accounts({
            vault: data.vault,
            depositTokenMint,
            depositTokenProgram,
            shareTokenProgram,
        }).instruction();
        
        const instructions = [
            web3.ComputeBudgetProgram.setComputeUnitLimit({
                units: 1000000,
            }),
            web3.ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: 0,
            }),
            vault_deposit_ix,
        ];
        const encodedTx = await createEncodedTransaction(provider, instructions);
        let res = {
            tx: encodedTx,
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