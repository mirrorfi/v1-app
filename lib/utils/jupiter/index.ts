interface JupiterPriceResponse {
  usdPrice: number;
  blockId: number;
  decimals: number;
  priceChange24h: number;
}

export async function fetchJupiterPrices(tokens: string[]) {
  try {
    const queryParams = tokens.map(token => `${token}`).join(',');
    const response = await fetch(`https://lite-api.jup.ag/price/v3?ids=${queryParams}`);
    const result = await response.json() as Record<string, JupiterPriceResponse>;
    return result;
  } catch (error) {
    console.error('Error fetching Jupiter prices:', error);
    return {};
  }
}