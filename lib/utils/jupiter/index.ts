import { JupiterTokensV2Response, JupiterTokenV2 } from './token-interface'

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

// Details: https://dev.jup.ag/docs/tokens/v2
export async function fetchJupiterTokenInfos(tokens: string[]) {
  try {
    const queryParams = tokens.map(token => `${token}`).join(',');
    const response = await fetch(`https://lite-api.jup.ag/tokens/v2/search?query=${queryParams}`);
    const result = await response.json() as JupiterTokensV2Response;
    // Convert List to mint => data JSON
    const tokenInfos: Record<string,JupiterTokenV2> = {}
    result.forEach((tokenInfo)=> {
      tokenInfos[tokenInfo.id] = tokenInfo
    })
    return tokenInfos;
  } catch (error) {
    console.error('Error fetching Jupiter prices:', error);
    return {};
  }
}