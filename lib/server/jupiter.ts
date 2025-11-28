import { JupiterPrice, JupiterTokenInfo } from "@/types/jupiter";
import { Address } from "@coral-xyz/anchor";
import { createJupiterApiClient, QuoteGetRequest, QuoteResponse, SwapInstructionsResponse } from '@jup-ag/api';

const jupiterClient = createJupiterApiClient();

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
  swapMode,
  onlyDirectRoutes,
}: QuoteGetRequest): Promise<QuoteResponse> {
  const quote = await jupiterClient.quoteGet({
    inputMint: inputMint.toString(),
    outputMint: outputMint.toString(),
    amount,
    slippageBps,
    onlyDirectRoutes,
    swapMode,
  })

  return quote;
}

export async function getJupiterSwapInstructions({
  quoteResponse,
  userPublicKey,
  dynamicSlippage = true
}: {
  quoteResponse: QuoteResponse,
  userPublicKey: Address,
  dynamicSlippage?: boolean,
}): Promise<SwapInstructionsResponse> {
  const instructions = await jupiterClient.swapInstructionsPost({
    swapRequest: {
      quoteResponse,
      userPublicKey: userPublicKey.toString(),
      dynamicSlippage,
    }
  })

  return instructions;
}