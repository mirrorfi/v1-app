import { PublicKey, Connection } from "@solana/web3.js";
import { Obligation, Reserve } from '@kamino-finance/klend-sdk';
import { SYSTEM_PROGRAM_ID } from "@/lib/constants";

export async function getObligationData(connection: Connection, address: PublicKey): Promise<Obligation| null> {
    const res = await connection.getAccountInfo(address);
    const accData = res?.data;
    if (!accData) {
        console.log("No Obligation Data found");
        return null;
    }

    const data = Obligation.decode(accData);
    return data;
}

export async function getMultipleObligationData(connection: Connection, addresses: PublicKey[]): Promise<Obligation[] | null> {
    const res = await connection.getMultipleAccountsInfo(addresses);
    const obligations: Obligation[] = [];
    for (const acc of res) {
        if (acc) {
            const data = Obligation.decode(acc.data);
            obligations.push(data);
        }
    }
    return obligations;
}

export function getObligationReserves(obligation: Obligation): PublicKey[] {
    const reserves: PublicKey[] = [];
    obligation.deposits.forEach(position => {
        if(position.depositReserve.toString() != SYSTEM_PROGRAM_ID.toString()){
            reserves.push(position.depositReserve);
        }
    });
    obligation.borrows.forEach(position => {
        if(position.borrowReserve.toString() != SYSTEM_PROGRAM_ID.toString()){
            reserves.push(position.borrowReserve);
        }
    });

    return reserves;
}
