import { VersionedTransaction } from "@solana/web3.js";
import { base64ToV0Tx, wrappedFetch } from "../utils"
import { BigIntString } from "@/types/accounts";

export async function getCloseStrategyTx({
  authority,
  strategy,
}: {
  authority: string,
  strategy: string
}): Promise<VersionedTransaction> {
  let { tx } = await wrappedFetch("/api/tx/close-strategy", "POST", {
    authority,
    strategy,
  });

  return base64ToV0Tx(tx);
}

export async function getCloseVaultTx({
  authority,
  vault,
}: {
  authority: string,
  vault: string
}): Promise<VersionedTransaction> {
  let { tx } = await wrappedFetch("/api/tx/close-vault", "POST", {
    authority,
    vault,
  });

  return base64ToV0Tx(tx);
}

export async function getDepositVaultTx({
  amount,
  depositor,
  vault,
}: {
  amount: string,
  depositor: string,
  vault: string,
}): Promise<VersionedTransaction> {
  const { tx } = await wrappedFetch("/api/tx/deposit-vault", "POST", {
    amount,
    depositor,
    vault,
  });

  return base64ToV0Tx(tx);
}

export async function getExecuteStrategyJupiterSwap({
  amount, slippageBps, authority, strategy
}: {
  amount: BigIntString,
  slippageBps: number,
  authority: string,
  strategy: string
}): Promise<VersionedTransaction> {
  const { tx } = await wrappedFetch("/api/tx/execute-strategy/jupiter-swap", "POST", {
    amount, slippageBps, authority, strategy
  });

  return base64ToV0Tx(tx);
}

export async function getExitStrategyJupiterSwap({
  amount, slippageBps, authority, strategy, all = false
}: {
  amount: BigIntString,
  slippageBps: number,
  authority: string,
  strategy: string,
  all: boolean
}): Promise<VersionedTransaction> {
  const { tx } = await wrappedFetch("/api/tx/exit-strategy/jupiter-swap", "POST", {
    amount, slippageBps, authority, strategy, all
  });

  return base64ToV0Tx(tx);
}

export async function getInitializeAndExecuteStrategyJupiterSwap({
  strategyType = "JupiterSwap", authority, destinationMint, vault, amount, slippageBps
}: {
  strategyType?: string,
  authority: string,
  destinationMint: string,
  vault: string,
  amount: BigIntString,
  slippageBps: number
}): Promise<VersionedTransaction> {
  const { tx } = await wrappedFetch("/api/tx/initialize-and-execute/jupiter-swap", "POST", {
    strategyType, authority, destinationMint, vault, amount, slippageBps
  });

  return base64ToV0Tx(tx);
}

export async function getInitializeStrategyTx({
  strategyType, authority, destinationMint, vault
}: {
  strategyType: string,
  authority: string,
  destinationMint: string,
  vault: string
}): Promise<VersionedTransaction> {
  const { tx } = await wrappedFetch("/api/tx/initialize-strategy/jupiter-swap", "POST", {
    strategyType, authority, destinationMint, vault
  });

  return base64ToV0Tx(tx);
}

export async function getInitializeUserTx({
  authority
}: {
  authority: string,
}): Promise<VersionedTransaction> {
  const { tx } = await wrappedFetch("/api/tx/initialize-user", "POST", {
    authority
  });

  return base64ToV0Tx(tx);
}

export async function getInitializeVaultTx({
  name, description, managerFeeBps, depositCap, lockedProfitDuration, depositMint, priceUpdateV2, authority
}: {
  name: string,
  description: string,
  managerFeeBps: number,
  depositCap: BigIntString,
  lockedProfitDuration: BigIntString,
  depositMint: string,
  priceUpdateV2: string,
  authority: string,
}): Promise<VersionedTransaction> {
  const { tx } = await wrappedFetch("/api/tx/initialize-vault", "POST", {
    name, description, managerFeeBps, depositCap, lockedProfitDuration, depositMint, priceUpdateV2, authority
  });

  return base64ToV0Tx(tx);
}

export async function getWithdrawVaultTx({
  amount, withdrawer, vault
}: {
  amount: string,
  withdrawer: string,
  vault: string,
}): Promise<VersionedTransaction> {
  const { tx } = await wrappedFetch("/api/tx/withdraw-vault", "POST", {
    amount, withdrawer, vault
  });

  return base64ToV0Tx(tx);
}