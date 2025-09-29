import { struct, u8, blob } from '@solana/buffer-layout';
import { publicKey, u64, i64, bool } from '@solana/buffer-layout-utils';
import { Connection, PublicKey } from '@solana/web3.js';
import { BN } from "@coral-xyz/anchor"

type U64 = BN;
type I64 = BN;

export interface VaultDepositor {
  discriminator?: Buffer;    // 8 bytes (Anchor)
  version: number;           // u8
  is_initialized: boolean;   // bool (1 byte)
  align: Buffer;             // [u8; 6]
  vault: PublicKey;          // 32
  user: PublicKey;           // 32
  created_at: I64;           // i64
  total_shares: U64;         // u64
  total_cost: U64;           // u64
  realized_pnl: I64;         // i64
  padding_raw: Buffer;
}

export const VaultDepositorLayout = struct<VaultDepositor>([
    u64("discriminator"),
    u8('version'),
    bool('is_initialized'),
    blob(6, 'align'),
    publicKey('vault'),
    publicKey('user'),
    u64('created_at'),
    u64('total_shares'),
    u64('total_cost'),
    u64('realized_pnl'),
    blob(32 * 8, 'padding_raw'),
]);

