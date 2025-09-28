import { struct, u8, blob } from '@solana/buffer-layout';
import { publicKey, u64, i64, bool } from '@solana/buffer-layout-utils';
import { Connection, PublicKey } from '@solana/web3.js';
import { BN } from "@coral-xyz/anchor"

// Types that won’t silently overflow
type U64 = BN;
type I64 = BN;

export interface VaultAccount {
  discriminator?: Buffer; // 8 bytes (Anchor)
  is_initialized: boolean;
  is_closed: boolean;
  is_frozen: boolean;
  version: number;
  bump: number;
  is_kamino: boolean;
  is_meteora: boolean;
  reserved_protocols: Buffer; 
  deposit_token_decimals: number; 
  lookup_table: PublicKey;
  pubkey: PublicKey;
  manager: PublicKey;
  protocol: PublicKey;
  vault_authority: PublicKey;
  deposit_token_mint: PublicKey;
  share_token_mint: PublicKey;
  created_at: I64;
  updated_at: I64;
  last_gav_update_at: I64;
  last_resolve_at: I64;
  manager_fee_rate: U64;
  last_gav_usd: U64;
  last_gav_token: U64;
  last_total_profit_usd: U64;
  last_total_profit_token: U64;
  total_deposit: U64;
  total_withdrawal: U64;
  total_claimed_fee: U64;
  total_claimed_protocol_fee: U64;
  fresh_capital: U64;
  request_capital: U64;
  withdrawable_capital: U64;
  delegatee_1: PublicKey;
  delegatee_1_stop: I64;
  delegatee_2: PublicKey;
  delegatee_2_stop: I64;
  padding_raw: Buffer; 
}

// Core vault layout without the 8-byte Anchor discriminator
export const VaultAccountLayout = struct<VaultAccount>([
  u64("discriminator"),
  bool('is_initialized'),
  bool('is_closed'),
  bool('is_frozen'),
  u8('version'),
  u8('bump'),
  bool('is_kamino'),
  bool('is_meteora'),
  blob(16, 'reserved_protocols'),
  u8('deposit_token_decimals'),
  publicKey('lookup_table'),
  publicKey('pubkey'),
  publicKey('manager'),
  publicKey('protocol'),
  publicKey('vault_authority'),
  publicKey('deposit_token_mint'),
  publicKey('share_token_mint'),
//   i64('created_at'),
//   i64('updated_at'),
//   i64('last_gav_update_at'),
//   i64('last_resolve_at'),
    u64('created_at'),
    u64('updated_at'),
    u64('last_gav_update_at'),
    u64('last_resolve_at'),
  u64('manager_fee_rate'),
  u64('last_gav_usd'),
  u64('last_gav_token'),
  u64('last_total_profit_usd'),
  u64('last_total_profit_token'),
  u64('total_deposit'),
  u64('total_withdrawal'),
  u64('total_claimed_fee'),
  u64('total_claimed_protocol_fee'),
  u64('fresh_capital'),
  u64('request_capital'),
  u64('withdrawable_capital'),
  publicKey('delegatee_1'),
  u64('delegatee_1_stop'),
  publicKey('delegatee_2'),
  u64('delegatee_2_stop'),
  blob(61 * 8, 'padding_raw'),
]);