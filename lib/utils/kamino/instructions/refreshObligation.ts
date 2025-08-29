import { PublicKey, Connection, TransactionInstruction } from "@solana/web3.js";
import { refreshObligation } from "@kamino-finance/klend-sdk";
import { KAMINO_PROGRAM_ID } from "../constants";
import { getObligationData, getObligationReserves } from "../accounts";
import { getRefreshReserveInstruction } from "./refreshReserve";

export async function getRefreshObligationInstructions(
    connection: Connection,
    obligationAddress: PublicKey,
    lendingMarket: PublicKey,
): Promise<TransactionInstruction[]> {
    // Check if the obligation exists
    const obligationData = await getObligationData(connection, obligationAddress);

    const ix = refreshObligation(
        {
            obligation: obligationAddress,
            lendingMarket: lendingMarket,
        },
        KAMINO_PROGRAM_ID
    );

    // If it's an existing obligation, add the remaining Accounts
    const refresh_reserve_ixs = [];
    if( obligationData) {
        const reserves = getObligationReserves(obligationData);
        console.log("Added Reserves:", reserves.map(r => r.toString()));

        for(const reserve of reserves) {
            // Add Refresh Reserve Instruction
            const refresh_reserve_ix = await getRefreshReserveInstruction(reserve, lendingMarket);
            refresh_reserve_ixs.push(refresh_reserve_ix);
            // Add Reserve to the remaining accounts
            ix.keys.push({
                pubkey: reserve,
                isSigner: false,
                isWritable: true,
            });
        }
    }

    return [...refresh_reserve_ixs, ix];
}