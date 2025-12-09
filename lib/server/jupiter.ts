import { JupiterPrice, JupiterTokenInfo } from "@/types/jupiter";
import { Address } from "@coral-xyz/anchor";

type Price = Record<string, { usdPrice: number }>;
type TokenInfo = {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  decimals: number;
  tokenProgram: string;
  usdPrice: number;
  priceChange24h: number;
};

export async function getJupiterPrices(mint: string[]): Promise<JupiterPrice> {
  const url = new URL(`${process.env.JUPITER_API_URL}/price/v3`);

  url.searchParams.append('ids', mint.join(','));

  const res = await fetch(url);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Unable to fetch token prices from Jupiter API.');
  }

  const prices: JupiterPrice = {};

  for (const key in data as Price) {
    prices[key] = data[key].usdPrice;
  }

  return prices;
}

export async function getJupiterTokenInfos(mint: string[]): Promise<JupiterTokenInfo> {
  const url = new URL(`${process.env.JUPITER_API_URL}/tokens/v2/search`);

  url.searchParams.append('query', mint.join(','));

  const res = await fetch(url);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Unable to fetch token info from Jupiter API.');
  }

  const infos: JupiterTokenInfo = {};

  data.forEach((tokenInfo: TokenInfo) => {
    infos[tokenInfo.id] = {
      name: tokenInfo.name,
      symbol: tokenInfo.symbol,
      icon: tokenInfo.icon,
      decimals: tokenInfo.decimals,
      tokenProgram: tokenInfo.tokenProgram,
      usdPrice: tokenInfo.usdPrice,
    }
  })

  return infos;
}

export async function getJupiterSwapQuote({
  inputMint,
  outputMint,
  amount,
  slippageBps,
  exactOutRoute,
  onlyDirectRoutes,
}: {
  inputMint: Address,
  outputMint: Address,
  amount: number,
  slippageBps: number,
  exactOutRoute: boolean,
  onlyDirectRoutes: boolean,
}) {
  const res = await fetch(`${process.env.JUPITER_API_URL}/swap/v1/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}&onlyDirectRoutes=${onlyDirectRoutes}&swapMode=${exactOutRoute ? "ExactOut" : "ExactIn"}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Unable to fetch swap quote from Jupiter API.');
  }

  return data;
}

export async function getJupiterSwapInstructions({
  quoteResponse,
  userPublicKey,
  dynamicSlippage = true
}: {
  quoteResponse: any,
  userPublicKey: Address,
  dynamicSlippage?: boolean,
}) {
  const res = await fetch(`${process.env.JUPITER_API_URL}/swap/v1/swap-instructions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quoteResponse,
      userPublicKey,
      dynamicSlippage,
    }),
  })

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Unable to fetch swap instructions from Jupiter API.');
  }

  return data;
}