export async function getPrices(mint: string[]) {
  const url = new URL(`${process.env.NEXT_PUBLIC_JUPITER_API_URL}/price/v3`);

  url.searchParams.append('ids', mint.join(','));

  const res = await fetch(url);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Unable to fetch token prices from Jupiter API.');
  }

  const prices: Record<string, any> = {};

  for (const key in data) {
    prices[key] = data[key].usdPrice;
  }

  return prices;
}

export async function getTokenInfos(mint: string[]) {
  const url = new URL(`${process.env.NEXT_PUBLIC_JUPITER_API_URL}/tokens/v2/search`);

  url.searchParams.append('query', mint.join(','));

  const res = await fetch(url);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Unable to fetch token info from Jupiter API.');
  }

  const infos: Record<string, any> = {};

  data.forEach((tokenInfo: any) => {
    infos[tokenInfo.id] = {
      name: tokenInfo.name,
      symbol: tokenInfo.symbol,
      icon: tokenInfo.icon,
      decimals: tokenInfo.decimals,
      tokenProgram: tokenInfo.tokenProgram,
      usdPrice: tokenInfo.usdPrice,
      priceChange24h: tokenInfo.priceChange24h,
    }
  })

  return infos;
}