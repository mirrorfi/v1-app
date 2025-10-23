/** Organic score bucket as labeled by Jupiter. */
export type OrganicScoreLabel = "high" | "medium" | "low";

/** Rolling stats block (same shape for 5m, 1h, 6h, 24h). */
export interface TokenStats {
  /** Relative price change over the window (e.g., 0.12 = +12%). */
  priceChange: number;
  /** Relative holder count change over the window. */
  holderChange: number;
  /** Relative liquidity change over the window. */
  liquidityChange: number;
  /** Relative volume change over the window. */
  volumeChange: number;
  /** Buy volume in the window. */
  buyVolume: number;
  /** Sell volume in the window. */
  sellVolume: number;
  /** Estimated organic buy volume in the window. */
  buyOrganicVolume: number;
  /** Estimated organic sell volume in the window. */
  sellOrganicVolume: number;
  /** Count of buy txs in the window. */
  numBuys: number;
  /** Count of sell txs in the window. */
  numSells: number;
  /** Unique traders in the window. */
  numTraders: number;
  /** Estimated number of organic buyers in the window. */
  numOrganicBuyers: number;
  /** Net buyers = buyers − sellers in the window. */
  numNetBuyers: number;
}

/** First pool metadata for the token. */
export interface FirstPool {
  /** Pool address/id. */
  id: string;
  /** ISO timestamp when the first pool was created. */
  createdAt: string; // ISO 8601
}

/** Audit/trust metrics surfaced by the API. */
export interface AuditMetrics {
  /** Heuristic “suspicious” flag. */
  isSus: boolean;
  /** Whether mint authority is disabled. */
  mintAuthorityDisabled: boolean;
  /** Whether freeze authority is disabled. */
  freezeAuthorityDisabled: boolean;
  /** Percentage held by top holders (0..100). */
  topHoldersPercentage: number;
  /** Developer wallet balance percentage (0..100). */
  devBalancePercentage: number;
  /** Number of developer migrations detected. */
  devMigrations: number;
}

/** Single item returned by Tokens API V2 endpoints (search/tag/category/recent). */
export interface JupiterTokenV2 {
  /** Token mint address. */
  id: string;
  /** Token name (e.g., “Wrapped SOL”). */
  name: string;
  /** Ticker/symbol (e.g., “SOL”). */
  symbol: string;
  /** Icon URL, if any. */
  icon: string | null;
  /** Mint decimals. */
  decimals: number;

  /** Socials and website, if any. */
  twitter: string | null;
  telegram: string | null;
  website: string | null;

  /** Developer address, if exposed. */
  dev: string | null;

  /** Circulating supply (may be null). */
  circSupply: number | null;
  /** Total supply (may be null). */
  totalSupply: number | null;

  /** Token program address (e.g., Tokenkeg... or TokenzQd...). */
  tokenProgram: string;

  /** Launchpad name/id if applicable. */
  launchpad: string | null;
  /** Partner config id if applicable. */
  partnerConfig: string | null;

  /** Graduated pool id and timestamp if token “graduated.” */
  graduatedPool: string | null;
  graduatedAt: string | null;

  /** Approximate holder count. */
  holderCount: number | null;

  /** Fully diluted valuation. */
  fdv: number | null;
  /** Market capitalization. */
  mcap: number | null;

  /** Current USD price. */
  usdPrice: number | null;
  /** Block id corresponding to price snapshot. */
  priceBlockId: number | null;

  /** Liquidity (USD), if available. */
  liquidity: number | null;

  /** Rolling stats. Same shape across windows. */
  stats5m: TokenStats;
  stats1h: TokenStats;
  stats6h: TokenStats;
  stats24h: TokenStats;

  /** First liquidity pool metadata. */
  firstPool: FirstPool | null;

  /** Audit/trust metrics. */
  audit: AuditMetrics | null;

  /** Organic score numeric value and label. */
  organicScore: number;
  organicScoreLabel: OrganicScoreLabel;

  /** Jupiter verification flag. */
  isVerified: boolean | null;

  /** Centralized exchanges listing the token, if known. */
  cexes: string[] | null;

  /** Tags such as “verified”, “lst”, etc. */
  tags: string[] | null;

  /** Last update timestamp. */
  updatedAt: string; // ISO 8601
}

/** All Tokens API V2 endpoints return an array of these items. */
export type JupiterTokensV2Response = JupiterTokenV2[];
