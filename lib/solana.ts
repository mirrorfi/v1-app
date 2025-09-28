
import { AnchorProvider, Wallet, BN, Program } from "@coral-xyz/anchor";
import { TransactionInstruction, VersionedTransaction, TransactionMessage, Connection } from "@solana/web3.js";
import bs58 from "bs58";

export function getConnection() {
  if(!process.env.NEXT_PUBLIC_SOLANA_RPC_URL) {
      throw new Error("Solana RPC Not Provided");
  }
  const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL);
  return connection;
}

export async function createTransaction(provider: AnchorProvider, instructions: TransactionInstruction[]): Promise<VersionedTransaction> {
    const recentBlockhash = await provider.connection.getLatestBlockhash();
    const messageV0 = new TransactionMessage({
        payerKey: provider.wallet.publicKey,
        recentBlockhash: recentBlockhash.blockhash,
        instructions,
    }).compileToV0Message([]);  
    const versionedTransaction = new VersionedTransaction(messageV0);
    
    const serialized = versionedTransaction.serialize();
    const encoded = bs58.encode(serialized);
    
    return versionedTransaction;
}

export async function createEncodedTransaction(provider: AnchorProvider, instructions: TransactionInstruction[]): Promise<String> {
    const recentBlockhash = await provider.connection.getLatestBlockhash();
    const messageV0 = new TransactionMessage({
        payerKey: provider.wallet.publicKey,
        recentBlockhash: recentBlockhash.blockhash,
        instructions,
    }).compileToV0Message([]);  
    const versionedTransaction = new VersionedTransaction(messageV0);
    
    const serialized = versionedTransaction.serialize();
    const encoded = bs58.encode(serialized);
    
    return encoded;
}

export function deserializeTransaction(encoded: string): VersionedTransaction {
  const decoded = bs58.decode(encoded);
  return VersionedTransaction.deserialize(decoded);
}

export function encodePrivateKey(privateKey: Uint8Array): string {
  return bs58.encode(privateKey);
}
