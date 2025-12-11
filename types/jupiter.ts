export type JupiterPrice = Record<string, number>

export type JupiterTokenInfo = Record<string, {
  name: string;
  symbol: string;
  icon: string;
  decimals: number;
  tokenProgram: string;
  usdPrice: number;
}>