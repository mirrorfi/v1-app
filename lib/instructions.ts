import { AccountMeta, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { mirrorfiClient } from "./solana-client";
import { bigIntString } from "@/types/accounts";
import { BN } from "@coral-xyz/anchor";
import { stringToByteArray } from "./utils";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export async function closeStrategyIx({
  authority,
  strategy,
  vault
}: {
  authority: PublicKey,
  strategy: PublicKey,
  vault: PublicKey
}): Promise<TransactionInstruction> {
  return await mirrorfiClient.program.methods
    .closeStrategy()
    .accounts({
      authority,
      strategy,
      vault
    })
    .instruction();
}

export async function depositVaultIx({
  amount,
  depositMint,
  depositMintTokenProgram,
  depositor,
  depositorTokenAccount,
  receiptMint,
  vault,
  vaultTokenAccount,
}: {
  amount: bigIntString,
  depositMint: PublicKey,
  depositMintTokenProgram: PublicKey,
  depositor: PublicKey,
  depositorTokenAccount: PublicKey,
  receiptMint: PublicKey,
  vault: PublicKey,
  vaultTokenAccount: PublicKey,
}): Promise<TransactionInstruction> {
  return await mirrorfiClient.program.methods
    .depositVault(new BN(amount))
    .accounts({
      config: mirrorfiClient.configPda,
      depositMint,
      depositMintTokenProgram,
      depositor,
      depositorTokenAccount,
      receiptMint,
      vault,
      vaultTokenAccount,
    })
    .instruction();
}

export async function executeStrategyJupiterSwapIx({
  swapData,
  amount,
  slippageBps,
  authority,
  destinationMint,
  sourceMint,
  vault,
  strategy,
  vaultSourceTokenAccount,
  remainingAccounts,
}: {
  swapData: Buffer,
  amount: bigIntString,
  slippageBps: number,
  authority: PublicKey,
  destinationMint: PublicKey,
  sourceMint: PublicKey,
  vault: PublicKey,
  strategy: PublicKey,
  vaultSourceTokenAccount: PublicKey,
  remainingAccounts: AccountMeta[]
}): Promise<TransactionInstruction> {
  return await mirrorfiClient.program.methods
    .executeStrategyJupiterSwap(swapData, new BN(amount), slippageBps)
    .accounts({
      authority,
      config: mirrorfiClient.configPda,
      destinationMint,
      sourceMint,
      vault,
      strategy,
      tokenProgram: TOKEN_PROGRAM_ID,
      vaultSourceTokenAccount,
    })
    .remainingAccounts(remainingAccounts)
    .instruction();
}

export async function exitStrategyJupiterSwapIx({
  swapData,
  amount,
  slippageBps,
  authority,
  destinationMint,
  sourceMint,
  vault,
  strategy,
  vaultSourceTokenAccount,
  vaultDestinationTokenAccount,
  treasuryTokenAccount,
  remainingAccounts,
}: {
  swapData: Buffer,
  amount: bigIntString,
  slippageBps: number,
  authority: PublicKey,
  destinationMint: PublicKey,
  sourceMint: PublicKey,
  vault: PublicKey,
  strategy: PublicKey,
  vaultSourceTokenAccount: PublicKey,
  vaultDestinationTokenAccount: PublicKey
  treasuryTokenAccount: PublicKey,
  remainingAccounts: AccountMeta[]
}): Promise<TransactionInstruction> {
  return await mirrorfiClient.program.methods
    .exitStrategyJupiterSwap(
      swapData,
      new BN(amount),
      slippageBps,
    )
    .accounts({
      authority,
      config: mirrorfiClient.configPda,
      destinationMint,
      sourceMint,
      vault,
      strategy,
      tokenProgram: TOKEN_PROGRAM_ID,
      vaultSourceTokenAccount,
      vaultDestinationTokenAccount,
      treasuryTokenAccount,
    })
    .remainingAccounts(remainingAccounts)
    .instruction();
}

export async function initializeAndExecuteStrategyIx({
  authority,
  destinationMint,
  vault,
  strategy,
  swapData,
  amount,
  slippageBps,
  sourceMint,
  vaultSourceTokenAccount,
  remainingAccounts,
 }: {
  authority: PublicKey,
  destinationMint: PublicKey,
  vault: PublicKey,
  strategy: PublicKey,
  swapData: Buffer,
  amount: bigIntString,
  slippageBps: number,
  sourceMint: PublicKey,
  vaultSourceTokenAccount: PublicKey,
  remainingAccounts: AccountMeta[]
 }): Promise<TransactionInstruction[]> {
  return await Promise.all([
    await mirrorfiClient.program.methods
      .initializeStrategyJupiterSwap()
      .accountsPartial({
        authority,
        destinationMint,
        vault,
        strategy,
      })
      .instruction(),
    await mirrorfiClient.program.methods
      .executeStrategyJupiterSwap(
        swapData,
        new BN(amount),
        slippageBps,
      )
      .accounts({
        authority,
        config: mirrorfiClient.configPda,
        destinationMint,
        sourceMint,
        vault,
        strategy,
        tokenProgram: TOKEN_PROGRAM_ID,
        vaultSourceTokenAccount,
      })
      .remainingAccounts(remainingAccounts)
      .instruction()
  ])
}

export async function initializeStrategyIx({
  authority,
  destinationMint,
  vault,
  strategy,
}: {
  authority: PublicKey,
  destinationMint: PublicKey,
  vault: PublicKey,
  strategy: PublicKey,
}): Promise<TransactionInstruction> {
  return await mirrorfiClient.program.methods
    .initializeStrategyJupiterSwap()
    .accountsPartial({
      authority,
      destinationMint,
      vault,
      strategy,
    })
    .instruction();
}

export async function initializeUserIx({
  authority,
}: {
  authority: PublicKey,
}): Promise<TransactionInstruction> {
  return await mirrorfiClient.program.methods
    .initializeUser()
    .accounts({
      authority,
    })
    .instruction();
}

export async function initializeVaultIx({
  depositCap,
  description,
  lockedProfitDegradationDuration,
  managerFeeBps,
  name,
  authority,
  depositMint,
  priceUpdateV2,
  depositMintTokenProgram,
  vault,
}: {
  depositCap: bigIntString,
  description: string,
  lockedProfitDegradationDuration: bigIntString,
  managerFeeBps: number,
  name: string,
  authority: PublicKey,
  depositMint: PublicKey,
  priceUpdateV2: PublicKey,
  depositMintTokenProgram: PublicKey,
  vault: PublicKey,
}): Promise<TransactionInstruction> {
  return await mirrorfiClient.program.methods
    .initializeVault({
      depositCap: new BN(depositCap),
      description: stringToByteArray(description, 64),
      lockedProfitDegradationDuration: new BN(
        lockedProfitDegradationDuration,
      ),
      managerFeeBps,
      name: stringToByteArray(name, 32),
    })
    .accountsPartial({
      authority,
      config: mirrorfiClient.configPda,
      depositMint,
      priceUpdateV2,
      depositMintTokenProgram,
      vault,
    })
    .instruction();
}

export async function withdrawVaultIx({
  amount,
  depositMint,
  depositMintTokenProgram,
  receiptMint,
  vault,
  vaultTokenAccount,
  withdrawer,
}: {
  amount: bigIntString,
  depositMint: PublicKey,
  depositMintTokenProgram: PublicKey,
  receiptMint: PublicKey,
  vault: PublicKey,
  vaultTokenAccount: PublicKey,
  withdrawer: PublicKey,
}): Promise<TransactionInstruction> {
  return await mirrorfiClient.program.methods
    .withdrawVault(new BN(amount))
    .accounts({
      config: mirrorfiClient.configPda,
      depositMint,
      depositMintTokenProgram,
      receiptMint,
      vault,
      vaultTokenAccount,
      withdrawer,
    })
    .instruction();
}