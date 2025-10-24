import { VersionedTransaction } from "@solana/web3.js";
import { base64ToV0Tx, wrappedFetch } from "../utils"

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
  // bigint serialized as string
  amount: string,
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
  amount, slippageBps, authority, strategy
}: {
  // bigint serialized as string
  amount: string,
  slippageBps: number,
  authority: string,
  strategy: string
}): Promise<VersionedTransaction> {
  const { tx } = await wrappedFetch("/api/tx/exit-strategy/jupiter-swap", "POST", {
    amount, slippageBps, authority, strategy
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
  name, description, managerFeeBps, depositCap, lockedProfitDegradationDuration, depositMint, priceUpdateV2, authority
}: {
  name: string,
  description: string,
  managerFeeBps: number,
  // bigint serialized as string
  depositCap: string,
  // bigint serialized as string
  lockedProfitDegradationDuration: string,
  depositMint: string,
  priceUpdateV2: string,
  authority: string,
}): Promise<VersionedTransaction> {
  const { tx } = await wrappedFetch("/api/tx/initialize-user", "POST", {
    name, description, managerFeeBps, depositCap, lockedProfitDegradationDuration, depositMint, priceUpdateV2, authority
  });

  return base64ToV0Tx(tx);
}

export async function getWithdrawVaultTx({
  authority, withdrawer, vault
}: {
  authority: string,
  withdrawer: string,
  vault: string,
}): Promise<VersionedTransaction> {
  const { tx } = await wrappedFetch("/api/tx/withdraw-vault", "POST", {
    authority, withdrawer, vault
  });

  return base64ToV0Tx(tx);
}