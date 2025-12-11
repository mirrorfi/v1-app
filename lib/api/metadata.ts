import { JupiterPrice, JupiterTokenInfo } from "@/types/jupiter";
import { wrappedFetch } from "../utils";

export async function getPrices(mints: string[]) {
  const res = await wrappedFetch(`/api/prices?mints=` + mints.join(','));

  return res.prices as JupiterPrice;
}

export async function getTokenInfos(mints: string[]) {
  const res = await wrappedFetch(`/api/tokens?mints=` + mints.join(','));

  return res.tokenInfos as JupiterTokenInfo;
}