import { BigIntString } from "@/types/accounts";
import { wrappedFetch } from "../utils";
import { Address } from "@coral-xyz/anchor";
import { getJupiterSwapInstructions, getJupiterSwapQuote } from "@/lib/server/jupiter";

export async function getSwapInstructions({
  inputMint,
  outputMint,
  amount,
  slippageBps,
  exactOutRoute,
  onlyDirectRoutes,
  userPublicKey,
}: {
  inputMint: Address,
  outputMint: Address,
  amount: BigIntString,
  slippageBps: number,
  exactOutRoute: boolean,
  onlyDirectRoutes: boolean,
  userPublicKey: string,
}) {
  const quoteResponse = await getJupiterSwapQuote({
    amount: Number(amount),
    slippageBps: Number(slippageBps),
    inputMint,
    outputMint,
    onlyDirectRoutes,
    exactOutRoute,
  })

  const instructions = await getJupiterSwapInstructions({
    quoteResponse,
    userPublicKey,
    dynamicSlippage: true,
  })
  return instructions;
  
  // const res = await wrappedFetch(`/api/swap?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}&exactOutRoute=${exactOutRoute}&onlyDirectRoutes=${onlyDirectRoutes}&userPublicKey=${userPublicKey}`);

  // return res.instructions;
}