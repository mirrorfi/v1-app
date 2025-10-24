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

function parseBN(field: BN): bigint {
  return BigInt(field.toString());
}

type pubkey = string;
type u8 = number;
type u16 = number;
type u32 = number;
type u64 = bigint;
type i32 = number;
type i64 = bigint;

type Config = IdlAccounts<Mirrorfi>["config"];
type Vault = IdlAccounts<Mirrorfi>["vault"];
type Strategy = IdlAccounts<Mirrorfi>["strategy"];
type User = IdlAccounts<Mirrorfi>["user"];
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
  platformFeeBps: u16;
  status: ParsedProtocolStatus;
}

export interface ParsedVault extends ParsedProgramAccount {
  id: u64;
  authority: pubkey;
  name: string;
  description: string;
  depositMint: pubkey;
  priceUpdateV2: pubkey;
  depositCap: u64;
  userDeposits: u64;
  realizedPnl: i64;
  depositsInStrategies: u64;
  lockedProfit: u64;
  lockedProfitDegradationDuration: u64;
  lastProfitLockTs: i64;
  lastRefreshTs: i64;
  unclaimedManagerFee: u64;
  managerFeeBps: u16;
  status: ParsedVaultStatus;
  nextStrategyId: u8;
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

export function parseConfig({
  admin,
  treasuryAuthority,
  nextVaultId,
  platformFeeBps,
  status,
  treasuryBump,
}: Config): Omit<ParsedConfig, "publicKey"> {
  return {
    admin: parsePublicKey(admin),
    nextVaultId: parseBN(nextVaultId),
    platformFeeBps,
    status: parseEnum<ParsedProtocolStatus>(status),
    treasuryAuthority: parsePublicKey(treasuryAuthority),
  };
}

export function parseVault({
  authority,
  name,
  description,
  depositMint,
  priceUpdateV2,
  depositCap,
  userDeposits,
  realizedPnl,
  depositsInStrategies,
  lockedProfit,
  lockedProfitDegradationDuration,
  lastProfitLockTs,
  lastRefreshTs,
  unclaimedManagerFee,
  managerFeeBps,
  status,
  nextStrategyId,
  id,
}: Vault): Omit<ParsedVault, "publicKey"> {
  return {
    authority: parsePublicKey(authority),
    name: byteArrayToString(name),
    description: byteArrayToString(description),
    depositMint: parsePublicKey(depositMint),
    priceUpdateV2: parsePublicKey(priceUpdateV2),
    depositCap: parseBN(depositCap),
    userDeposits: parseBN(userDeposits),
    realizedPnl: parseBN(realizedPnl),
    depositsInStrategies: parseBN(depositsInStrategies),
    lockedProfit: parseBN(lockedProfit),
    lockedProfitDegradationDuration: parseBN(lockedProfitDegradationDuration),
    lastProfitLockTs: parseBN(lastProfitLockTs),
    lastRefreshTs: parseBN(lastRefreshTs),
    unclaimedManagerFee: parseBN(unclaimedManagerFee),
    managerFeeBps,
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