/**
 * TypeScript interfaces for vault data schema
 * Based on the NEON PostgreSQL TimescaleDB schema
 */

// ============================================
// 5-Minute Data Types
// ============================================

export interface VaultData5Minute {
  id: number;
  timestamp: Date;
  vault_addr: string;
  token_nav: number;      // Vault valuation in USDC (totalNav / usdPrice)
  usd_nav: number;        // Vault valuation in USD (same as totalNav from API)
  user_deposits: number;  // User deposits adjusted by decimals
}

// ============================================
// Hourly OHLC Data Types
// ============================================

export interface VaultDataHourly {
  id: number;
  timestamp: Date;
  vault_addr: string;
  
  // Token NAV OHLC
  token_nav_open: number;
  token_nav_high: number;
  token_nav_low: number;
  token_nav_close: number;
  token_nav_high_timestamp: Date;
  token_nav_low_timestamp: Date;
  
  // USD NAV OHLC
  usd_nav_open: number;
  usd_nav_high: number;
  usd_nav_low: number;
  usd_nav_close: number;
  usd_nav_high_timestamp: Date;
  usd_nav_low_timestamp: Date;
  
  // User Deposits OHLC
  user_deposits_open: number;
  user_deposits_high: number;
  user_deposits_low: number;
  user_deposits_close: number;
  user_deposits_high_timestamp: Date;
  user_deposits_low_timestamp: Date;
}

// ============================================
// API Response Types
// ============================================

export interface ChartDataPoint {
  timestamp: Date;
  tokenNav: number;       // Vault valuation in USDC
  usdNav: number;         // Vault valuation in USD
  userDeposits: number;   // User deposits adjusted by decimals
  dataPointsInBucket?: number;
}

export interface VaultHistoryResponse {
  vaultAddress: string;
  timeframe: string;
  table: string;
  resolution: string;
  dataPoints: number;
  data: ChartDataPoint[];
}
