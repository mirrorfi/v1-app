import { getUserMetadata } from "../pda";
import { Connection, PublicKey } from "@solana/web3.js";

export async function userMetadataExists(connection: Connection, user: PublicKey): Promise<boolean> {
    const userMetadataPda = getUserMetadata(user);
    const accountInfo = await connection.getAccountInfo(userMetadataPda);
    return accountInfo !== null;
}