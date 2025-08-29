import { initReferrerTokenState } from "@kamino-finance/klend-sdk";
import { SYSTEM_PROGRAM_ID, SYSVAR_RENT_ADDRESS } from '@/lib/constants'
import { KAMINO_PROGRAM_ID } from "../constants";
import { PublicKey } from "@solana/web3.js";
import { getReferrerTokenState } from "../pda";


export async function getInitReferrerTokenStateInstruction(payer: PublicKey, user: PublicKey, lendingMarket: PublicKey, reserve: PublicKey){
  return initReferrerTokenState(
    {
        payer: payer,
        lendingMarket: lendingMarket,
        reserve: reserve,
        referrer: user,
        referrerTokenState: getReferrerTokenState(user, reserve),
        rent: SYSVAR_RENT_ADDRESS,
        systemProgram: SYSTEM_PROGRAM_ID,
    },
    KAMINO_PROGRAM_ID
  );
}