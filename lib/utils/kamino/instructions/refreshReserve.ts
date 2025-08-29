import { refreshReserve } from "@kamino-finance/klend-sdk";
import { PublicKey } from "@solana/web3.js";
import { KAMINO_PROGRAM_ID, KAMINO_SCOPE_PRICES } from "../constants";


export async function getRefreshReserveInstruction(
    reserveAddress: PublicKey,
    lendingMarket: PublicKey,
){
    const ix = refreshReserve(
        {
            reserve: reserveAddress,
            lendingMarket: lendingMarket,
            pythOracle: KAMINO_PROGRAM_ID,
            switchboardPriceOracle: KAMINO_PROGRAM_ID,
            switchboardTwapOracle: KAMINO_PROGRAM_ID,
            scopePrices: KAMINO_SCOPE_PRICES,
        },
        KAMINO_PROGRAM_ID
    );
    return ix;
}