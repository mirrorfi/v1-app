import { PROGRAM_ID } from "@kamino-finance/klend-sdk";
import { KAMINO_PROGRAM_ID, KAMINO_FARMS_PROGRAM_ID } from "./constants";
import { PublicKey } from "@solana/web3.js";

/**
 * Derives an obligation address
 * 
 * @param tag - Obligation type tag (e.g., 0 for standard, 1 for margin)
 * @param id - Obligation identifier 
 * @param owner - Owner of the obligation
 * @param lendingMarket - Parent lending market
 * @param seed1 - Additional seed account (varies by obligation type)
 * @param seed2 - Additional seed account (varies by obligation type)
 */
export function getObligation(
  tag: number, 
  id: number, 
  owner: PublicKey, 
  lendingMarket: PublicKey, 
  seed1: PublicKey, 
  seed2: PublicKey
): PublicKey {
  const [obligation] = PublicKey.findProgramAddressSync(
    [
      Buffer.from([tag]), 
      Buffer.from([id]), 
      owner.toBuffer(), 
      lendingMarket.toBuffer(), 
      seed1.toBuffer(), 
      seed2.toBuffer()
    ],
    PROGRAM_ID
  );
  console.log("Obligation PDA:", obligation.toString());
  return obligation;
}

/**
 * Derives the user metadata address
 */
export function getUserMetadata(owner: PublicKey): PublicKey {
  const [metadata] = PublicKey.findProgramAddressSync(
    [Buffer.from('user_meta'), owner.toBuffer()],
    PROGRAM_ID
  );
  console.log("User Metadata PDA:", metadata.toString());
  return metadata;
}

export function getLendingMarketAuthority(lendingMarket: PublicKey): PublicKey{
  const [lendingMarketAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from('lma'), lendingMarket.toBuffer()],
    PROGRAM_ID
  );
  console.log("Lending Market Authority PDA:", lendingMarketAuthority.toString());
  return lendingMarketAuthority;
}

export function getObligationFarmState(reserveFarmState: PublicKey, obligation: PublicKey): PublicKey {
  const [obligationFarmState] = PublicKey.findProgramAddressSync(
    [Buffer.from('user'), reserveFarmState.toBuffer(), obligation.toBuffer()],
    KAMINO_FARMS_PROGRAM_ID
  );
  console.log("Obligation Farm State PDA:", obligationFarmState.toString());
  return obligationFarmState;
}

export function getReferrerTokenState(user: PublicKey, reserve: PublicKey): PublicKey {
  const [referrerTokenState] = PublicKey.findProgramAddressSync(
    [Buffer.from('referrer_acc'), user.toBuffer(), reserve.toBuffer()],
    KAMINO_PROGRAM_ID
  );
  console.log("Referrer Token State PDA:", referrerTokenState.toString());
  return referrerTokenState;
}
