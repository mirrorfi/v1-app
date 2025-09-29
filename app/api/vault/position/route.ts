// import { NextRequest } from "next/server";
// import { AnchorProvider, Wallet, BN, Provider, Program, web3 } from "@coral-xyz/anchor";
// import { PublicKey, Connection } from "@solana/web3.js";
// import IDL from "@/lib/program/idl.json";
// import { MirrorfiVault } from "@/lib/program/types";
// import { createEncodedTransaction } from "@/lib/solana";
// import { getRefreshNavIxs, getVaultDepositorPda } from "@/lib/utils/mirrorfi";
// import { getVaultDepositorAccountInfo } from "@/lib/utils/mirrorfi/accounts";

// export async function POST(req: NextRequest) {
//     const data = await req.json();
    
//     if(!process.env.PRIVATE_SOLANA_RPC_URL) {
//         return new Response(JSON.stringify({ error: "Solana PRC Not Provided" }), { status: 500 });
//     }
//     if(!data.user) {
//         return new Response(JSON.stringify({ error: "User not found" }), { status: 500 });
//     }
//     if(!data.vault) {
//         return new Response(JSON.stringify({ error: "Vault not found" }), { status: 500 });
//     }
//     console.log("Request Checking Passed, proceeding...");

//     try{
//         console.log("Establishing connection to Solana...");
//         const connection = new Connection(process.env.PRIVATE_SOLANA_RPC_URL);

//         const userPublicKey = new PublicKey(data.user);
        

//         const vaultDepositorPda = getVaultDepositorPda(new PublicKey(IDL.address), new PublicKey(data.vault), new PublicKey(data.user));
//         console.log("Vault Depositor PDA:", vaultDepositorPda.toBase58());

//         const vaultDepositor = await getVaultDepositorAccountInfo(connection, new PublicKey(data.vault), new PublicKey(data.user));

//         return new Response(
//             JSON.stringify(vaultDepositor),
//             { status: 200 }
//         );
//     } catch (error: unknown) {
//         console.error("API Error:", error instanceof Error ? error.message : "Unknown error occurred");

//         return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
//         status: 500,
//         });
//     }
// }