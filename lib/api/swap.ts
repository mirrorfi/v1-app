import { BigIntString } from "@/types/accounts";
import { wrappedFetch } from "../utils";
import { Address } from "@coral-xyz/anchor";

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
  const res = await wrappedFetch(`/api/swap?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}&exactOutRoute=${exactOutRoute}&onlyDirectRoutes=${onlyDirectRoutes}&userPublicKey=${userPublicKey}`);

  return res.instructions;
}