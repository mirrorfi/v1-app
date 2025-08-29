import { publicKey, u64, bool } from '@solana/buffer-layout-utils';
import { u32, u8, struct } from '@solana/buffer-layout';
import { PublicKey } from '@solana/web3.js';


export type TokenAccount = {
  readonly mint: PublicKey;
  readonly owner: PublicKey;
  readonly amount: bigint;
  readonly delegateOption: number;
  readonly delegate: PublicKey;
  readonly state: AccountState;
  readonly isNativeOption: number;
  readonly isNative: bigint;
  readonly delegatedAmount: bigint;
  readonly closeAuthorityOption: number;
  readonly closeAuthority: PublicKey;
};

enum AccountState {
    Uninitialized = 0,
    Initialized = 1,
    Frozen = 2,
}

export const TokenAccountStruct = struct<TokenAccount>([
    publicKey('mint'),
    publicKey('owner'),
    u64('amount'),
    u32('delegateOption'),
    publicKey('delegate'),
    u8('state'),
    u32('isNativeOption'),
    u64('isNative'),
    u64('delegatedAmount'),
    u32('closeAuthorityOption'),
    publicKey('closeAuthority'),
]);

export type MintAccount = {
  readonly mintAuthorityOption: number;
  readonly mintAuthority: PublicKey;
  readonly supply: bigint;
  readonly decimals: number;
  readonly initialized: boolean;
  readonly freezeAuthorityOption: number;
  readonly freezeAuthority: PublicKey;
};

export const MintAccountStruct = struct<MintAccount>([
    u32('mintAuthorityOption'),
    publicKey('mintAuthority'),
    u64('supply'),
    u8('decimals'),
    bool('initialized'),
    u32('freezeAuthorityOption'),
    publicKey('freezeAuthority'),
]);