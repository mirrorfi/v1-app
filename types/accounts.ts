import { BN, IdlAccounts, IdlTypes } from "@coral-xyz/anchor";
import { Mirrorfi } from "./mirrorfi";
import { ExtractDefinedKeys } from "./generators";
import { PublicKey, SystemProgram } from "@solana/web3.js";

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

// Denotes a bigint serialized as a string
export type bigIntString = string;
type pubkey = string;
type u8 = number;
type u16 = number;
type u32 = number;
type u64 = bigIntString;
type i32 = number;
type i64 = bigIntString;

type Config = IdlAccounts<Mirrorfi>["config"];
type Vault = IdlAccounts<Mirrorfi>["vault"];
type Strategy = IdlAccounts<Mirrorfi>["strategy"];
type User = IdlAccounts<Mirrorfi>["user"];
type VaultDepositor = IdlAccounts<Mirrorfi>["vaultDepositor"];
type ProtocolStatus = IdlTypes<Mirrorfi>["protocolStatus"];
type StrategyType = IdlTypes<Mirrorfi>["strategyType"];
type VaultStatus = IdlTypes<Mirrorfi>["vaultStatus"];

type ParsedProtocolStatus = ExtractDefinedKeys<ProtocolStatus>;
type ParsedStrategyType = ExtractDefinedKeys<StrategyType>;
type ParsedVaultStatus = ExtractDefinedKeys<VaultStatus>;

export interface ParsedProgramAccount {
  publicKey: string;
}

export interface ParsedConfig extends ParsedProgramAccount {
  admin: pubkey;
  treasuryAuthority: pubkey;
  nextVaultId: u64;
  platformPerformanceFeeBps: u16;
  platformDepositFeeBps: u16;
  platformReferralFeeBps: u16;
  platformWithdrawalFeeBps: u16;
  status: ParsedProtocolStatus;
}

export interface ParsedVault extends ParsedProgramAccount {
  id: u64;
  authority: pubkey;
  name: string;
  description: string;
  depositMint: pubkey;
  //_unused0: u8[];
  depositCap: u64;
  userDeposits: u64;
  realizedPnl: i64;
  depositsInStrategies: u64;
  lockedProfit: u64;
  lockedProfitDuration: u64;
  lastProfitLockTs: i64;
  totalShares: i64;
  unclaimedManagerFee: u64;
  performanceFeeBps: u16;
  status: ParsedVaultStatus;
  nextStrategyId: u8;
  // Wrapped Decimal Not used:
  // assetPerShare: WrappedDecimal;
  // highWaterMark: WrappedDecimal;
}

export interface ParsedStrategy extends ParsedProgramAccount {
  vault: pubkey;
  depositsDeployed: u64;
  id: u8;
  strategyType: ParsedStrategyType;
}

export interface ParsedUser extends ParsedProgramAccount {
  authority: pubkey;
}

export interface ParsedVaultDepositor extends ParsedProgramAccount {
  authority: pubkey;
  vault: pubkey;
  shares: u64;
  // Wrapped Decimal Not used:
  // lastVaultAssetPerShare: WrappedDecimal;
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
  performanceFeeBps,
  status,
  nextStrategyId,
  id,
}: Vault): Omit<ParsedVault, "publicKey"> {
  return {
    authority: parsePublicKey(authority),
    name: byteArrayToString(name),
    description: byteArrayToString(description),
    depositMint: parsePublicKey(depositMint),
    //unused0: parseByteArray(unused0),
    depositCap: parseBN(depositCap),
    userDeposits: parseBN(userDeposits),
    realizedPnl: parseBN(realizedPnl),
    depositsInStrategies: parseBN(depositsInStrategies),
    lockedProfit: parseBN(lockedProfit),
    lockedProfitDuration: parseBN(lockedProfitDuration),
    lastProfitLockTs: parseBN(lastProfitLockTs),
    totalShares: parseBN(totalShares),
    unclaimedManagerFee: parseBN(unclaimedManagerFee),
    performanceFeeBps,
    status: parseEnum<ParsedVaultStatus>(status),
    nextStrategyId,
    id: parseBN(id),
  };
}

export function parseStrategy(
  {
    vault,
    depositsDeployed,
    id,
    strategyType,
  }: Strategy
): Omit<ParsedStrategy, "publicKey"> {
  const type = parseEnum<ParsedStrategyType>(strategyType);

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
          lendingMarket: parsePublicKey(strategyType.kaminoLend.lendingMarket),
        },
      };
      break;
    
    default:
      throw new Error(`Unknown strategy type: ${type}`);
  }

  return {
    vault: parsePublicKey(vault),
    depositsDeployed: parseBN(depositsDeployed),
    id,
    strategyType: parsedStrategyType,
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
  //lastVaultAssetPerShare,
  lastDepositTs,
}: VaultDepositor): Omit<ParsedVaultDepositor, "publicKey"> {
  return {
    authority: parsePublicKey(authority),
    vault: parsePublicKey(vault),
    shares: parseBN(shares),
    lastDepositTs: parseBN(lastDepositTs),
  };
}