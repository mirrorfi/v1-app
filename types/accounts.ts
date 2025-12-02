import { BN, IdlAccounts, IdlTypes } from "@coral-xyz/anchor";
import { Mirrorfi } from "./mirrorfi";
import { ExtractDefinedKeys } from "./generators";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { wrappedI80F48toBigNumber } from "./wrappedI80F48";

function byteArrayToString(array: number[] | Uint8Array): string {
  // Find the first null byte (0) to determine actual string length
  const nullIndex = array.indexOf(0);
  const trimmed = nullIndex >= 0 ? array.slice(0, nullIndex) : array;

  // Convert to Buffer and decode as UTF-8
  return Buffer.from(trimmed).toString("utf-8");
}

function parseEnum<T>(field: object): T {
  return Object.keys(field)[0] as T;
}

function parsePublicKey(field: PublicKey | null): string {
  return !field || field.equals(SystemProgram.programId)
    ? ''
    : field.toBase58();
}

function parseBN(field: BN): string {
  return field.toString();
}

function parseStrategyType(strategyType: StrategyType): ParsedStrategyType {
  const type = Object.keys(strategyType)[0];

  let parsedStrategyType: ParsedStrategyType;

  switch (type) {
    case "jupiterSwap":
      parsedStrategyType = {
        jupiterSwap: {
          targetMint: parsePublicKey(strategyType.jupiterSwap.targetMint),
        },
      };
      break;

    case "kaminoLend":
      parsedStrategyType = {
        kaminoLend: {
          obligation: parsePublicKey(strategyType.kaminoLend.obligation),
          reserve: parsePublicKey(strategyType.kaminoLend.lendingMarket),
        },
      };
      break;

    default:
      throw new Error(`Unknown strategy type: ${type}`);
  }

  return parsedStrategyType;
}

function parseWrappedI80F48(field: { value: number[] }): number {
  return wrappedI80F48toBigNumber(field).toNumber();
}

// Denotes a bigint serialized as a string
export type BigIntString = string;
type Pubkey = string;
type u8 = number;
type u16 = number;
type u32 = number;
type u64 = BigIntString;
type i32 = number;
type i64 = BigIntString;
type WrappedI80F48 = number;

type Config = IdlAccounts<Mirrorfi>["config"];
type Vault = IdlAccounts<Mirrorfi>["vault"];
type Strategy = IdlAccounts<Mirrorfi>["strategy"];
type User = IdlAccounts<Mirrorfi>["user"];
type VaultDepositor = IdlAccounts<Mirrorfi>["vaultDepositor"];
type ProtocolStatus = IdlTypes<Mirrorfi>["protocolStatus"];
type StrategyType = IdlTypes<Mirrorfi>["strategyType"];
type VaultStatus = IdlTypes<Mirrorfi>["vaultStatus"];

type ParsedProtocolStatus = ExtractDefinedKeys<ProtocolStatus>;
type ParsedStrategyType = {
  jupiterSwap: {
    targetMint: Pubkey;
  };
}
| {
  kaminoLend: {
    obligation: Pubkey;
    reserve: Pubkey;
  };
};
type ParsedVaultStatus = ExtractDefinedKeys<VaultStatus>;

export interface ParsedProgramAccount {
  publicKey: string;
}

export interface ParsedConfig extends ParsedProgramAccount {
  admin: Pubkey;
  treasuryAuthority: Pubkey;
  nextVaultId: u64;
  platformPerformanceFeeBps: u16;
  platformDepositFeeBps: u16;
  platformWithdrawalFeeBps: u16;
  platformReferralFeeBps: u16;
  status: ParsedProtocolStatus;
}

export interface ParsedVault extends ParsedProgramAccount {
  id: u64;
  authority: Pubkey;
  name: string;
  description: string;
  depositMint: Pubkey;
  depositCap: u64;
  userDeposits: u64;
  realizedPnl: i64;
  depositsInStrategies: u64;
  lockedProfit: u64;
  lockedProfitDuration: u64;
  lastProfitLockTs: i64;
  totalShares: i64;
  unclaimedManagerFee: u64;
  managerFeeBps: u16;
  status: ParsedVaultStatus;
  nextStrategyId: u8;
  assetPerShare: WrappedI80F48;
  highWaterMark: WrappedI80F48;
}

export interface ParsedStrategy extends ParsedProgramAccount {
  vault: Pubkey;
  depositsDeployed: u64;
  id: u8;
  strategyType: ParsedStrategyType;
}

export interface ParsedUser extends ParsedProgramAccount {
  authority: Pubkey;
}

export interface ParsedVaultDepositor extends ParsedProgramAccount {
  authority: Pubkey;
  vault: Pubkey;
  shares: u64;
  lastVaultAssetPerShare: WrappedI80F48;
  lastDepositTs: i64;
}

export function parseConfig({
  admin,
  treasuryAuthority,
  nextVaultId,
  platformPerformanceFeeBps,
  platformDepositFeeBps,
  platformReferralFeeBps,
  platformWithdrawalFeeBps,
  status,
}: Config): Omit<ParsedConfig, "publicKey"> {
  return {
    admin: parsePublicKey(admin),
    nextVaultId: parseBN(nextVaultId),
    platformPerformanceFeeBps,
    platformDepositFeeBps,
    platformReferralFeeBps,
    platformWithdrawalFeeBps,
    status: parseEnum<ParsedProtocolStatus>(status),
    treasuryAuthority: parsePublicKey(treasuryAuthority),
  };
}

export function parseVault({
  authority,
  name,
  description,
  depositMint,
  depositCap,
  userDeposits,
  realizedPnl,
  depositsInStrategies,
  lockedProfit,
  lockedProfitDuration,
  lastProfitLockTs,
  totalShares,
  unclaimedManagerFee,
  managerFeeBps,
  status,
  nextStrategyId,
  id,
  assetPerShare,
  highWaterMark,
}: Vault): Omit<ParsedVault, "publicKey"> {
  return {
    authority: parsePublicKey(authority),
    name: byteArrayToString(name),
    description: byteArrayToString(description),
    depositMint: parsePublicKey(depositMint),
    depositCap: parseBN(depositCap),
    userDeposits: parseBN(userDeposits),
    realizedPnl: parseBN(realizedPnl),
    depositsInStrategies: parseBN(depositsInStrategies),
    lockedProfit: parseBN(lockedProfit),
    lockedProfitDuration: parseBN(lockedProfitDuration),
    lastProfitLockTs: parseBN(lastProfitLockTs),
    totalShares: parseBN(totalShares),
    unclaimedManagerFee: parseBN(unclaimedManagerFee),
    managerFeeBps,
    status: parseEnum<ParsedVaultStatus>(status),
    nextStrategyId,
    id: parseBN(id),
    assetPerShare: parseWrappedI80F48(assetPerShare),
    highWaterMark: parseWrappedI80F48(highWaterMark),
  };
}

export function parseStrategy({
  vault,
  depositsDeployed,
  id,
  strategyType,
}: Strategy): Omit<ParsedStrategy, "publicKey"> {
  return {
    vault: parsePublicKey(vault),
    depositsDeployed: parseBN(depositsDeployed),
    id,
    strategyType: parseStrategyType(strategyType),
  };
};

export function parseUser({
  authority,
}: User): Omit<ParsedUser, "publicKey"> {
  return {
    authority: parsePublicKey(authority),
  };
}

export function parseVaultDepositor({
  authority,
  vault,
  shares,
  lastVaultAssetPerShare,
  lastDepositTs,
}: VaultDepositor): Omit<ParsedVaultDepositor, "publicKey"> {
  return {
    authority: parsePublicKey(authority),
    vault: parsePublicKey(vault),
    shares: parseBN(shares),
    lastVaultAssetPerShare: parseWrappedI80F48(lastVaultAssetPerShare),
    lastDepositTs: parseBN(lastDepositTs),
  };
}