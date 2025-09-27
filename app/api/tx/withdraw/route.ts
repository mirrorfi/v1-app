import { NextRequest } from "next/server";
import { AnchorProvider, Wallet, BN, Provider, Program, web3 } from "@coral-xyz/anchor";
import { PublicKey, Connection } from "@solana/web3.js";
import IDL from "@/lib/program/idl.json";
import { MirrorfiVault } from "@/lib/program/types";
import { createEncodedTransaction } from "@/lib/solana";
import { TOKEN_PROGRAM_2022_ID, TOKEN_PROGRAM_ID } from "@/lib/program/constants";
import { getRefreshNavIxs } from "@/lib/utils/mirrorfi";

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
    if(!data.withdrawAmount) {
        return new Response(JSON.stringify({ error: "Withdraw amount not found" }), { status: 500 });
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

        const withdrawAll = data.withdrawAll === true;

        const refresh_nav_ixs = await getRefreshNavIxs(program as unknown as Program<MirrorfiVault>, new PublicKey(data.vault));
        const vault_withdraw_ix = await program.methods.vaultWithdraw({
            amount: new BN(data.withdrawAmount),
            withdrawAll: withdrawAll,
        }).accounts({
            vault: data.vault,
            depositTokenProgram: TOKEN_PROGRAM_ID,
        }).instruction();
        
        const instructions = [
            web3.ComputeBudgetProgram.setComputeUnitLimit({
                units: 1000000,
            }),
            web3.ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: 0,
            }),
            ...refresh_nav_ixs,
            vault_withdraw_ix,
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