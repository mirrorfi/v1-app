import { Mirrorfi } from "@/types/mirrorfi";
import { AccountMeta, Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { Address, BN } from "@coral-xyz/anchor";
import { BigIntString, parseConfig } from "@/types/accounts";
import mirrorfiIdl from "@/idl/mirrorfi.json";
import { ProgramClient } from "./program-client";

export class MirrorFiClient extends ProgramClient<Mirrorfi> {
  constructor(connection: Connection) {
    super(connection, mirrorfiIdl);
  }

  configPda = this.getConfigPda();
  treasuryPda = this.getTreasuryPda();

  getConfigPda() {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      this.program.programId
    )[0];
  }

  getTreasuryPda() {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("treasury")],
      this.program.programId,
    )[0];
  }

  getVaultPda(id: BN, authority: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("vault"),
        id.toArrayLike(Buffer, "le", 8),
        authority.toBuffer(),
      ],
      this.program.programId,
    )[0];
  }

  getVaultDepositorPda(authority: PublicKey, vault: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("vault_depositor"), authority.toBuffer(), vault.toBuffer()],
      this.program.programId,
    )[0];
  }

  getStrategyPda(vault: PublicKey, protocolAccount: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("strategy"),
        vault.toBuffer(),
        protocolAccount.toBuffer(),
      ],
      this.program.programId,
    )[0];
  }

  getUserPda(authority: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("user"), authority.toBuffer()],
      this.program.programId,
    )[0];
  }

  async getNextVaultId() {
    const configAcc = await this.fetchProgramAccount(this.configPda, "config", parseConfig);

    if (!configAcc) {
      throw new Error("Config account not found.");
    }

    return configAcc.nextVaultId;
  }

  async claimManageFeeIx({
    mint,
    tokenProgram,
    vault,
    vaultTokenAccount,
    authority,
  }: {
    mint: Address;
    tokenProgram: Address;
    vault: Address;
    vaultTokenAccount: Address;
    authority: Address;
  }): Promise<TransactionInstruction> {
    return await this.program.methods
      .claimManagerFee()
      .accounts({
        mint,
        tokenProgram,
        vault,
        vaultTokenAccount,
        authority,
      })
      .instruction();
  }

  async closeStrategyIx({
    authority,
    strategy,
    vault,
  }: {
    authority: Address;
    strategy: Address;
    vault: Address;
  }): Promise<TransactionInstruction> {
    return await this.program.methods
      .closeStrategy()
      .accounts({
        authority,
        strategy,
        vault,
      })
      .instruction();
  }

  async closeVaultIx({
    authority,
    vault,
    depositMint,
    depositMintTokenProgram,
  }: {
    authority: Address;
    vault: Address;
    depositMint: Address;
    depositMintTokenProgram: Address;
  }): Promise<TransactionInstruction> {
    return await this.program.methods
      .closeVault()
      .accounts({
        authority,
        vault,
        depositMint,
        depositMintTokenProgram,
      })
      .instruction();
  }

  async depositVaultIx({
    amount,
    depositMint,
    depositMintTokenProgram,
    vault,
    depositor,
  }: {
    amount: BigIntString;
    depositMint: Address;
    depositMintTokenProgram: Address;
    vault: Address;
    depositor: Address;
  }): Promise<TransactionInstruction> {
    return await this.program.methods
      .depositVault(new BN(amount))
      .accounts({
        config: this.configPda,
        depositMint,
        depositMintTokenProgram,
        vault,
        depositor,
      })
      .instruction();
  }

  async executeStrategyJupiterSwapIx({
    swapData,
    amount,
    slippageBps,
    destinationMint,
    sourceMint,
    strategy,
    tokenProgram,
    vault,
    vaultSourceTokenAccount,
    authority,
    remainingAccounts,
  }: {
    swapData: Buffer;
    amount: BigIntString;
    slippageBps: number;
    destinationMint: Address;
    sourceMint: Address;
    strategy: Address;
    tokenProgram: Address;
    vault: Address;
    vaultSourceTokenAccount: Address;
    authority: Address;
    remainingAccounts: AccountMeta[];
  }): Promise<TransactionInstruction> {
    return await this.program.methods
      .executeStrategyJupiterSwap(
        swapData,
        new BN(amount),
        slippageBps,
      )
      .accounts({
        config: this.configPda,
        destinationMint,
        sourceMint,
        strategy,
        tokenProgram,
        vault,
        vaultSourceTokenAccount,
        authority,
      })
      .remainingAccounts(remainingAccounts)
      .instruction();
  }

  async executeStrategyMeteoraDammV2Ix({
    liquidityDelta,
    tokenAAmountThreshold,
    tokenBAmountThreshold,
    eventAuthority,
    pool,
    poolTokenAAccount,
    poolTokenBAccount,
    position,
    positionNftAccount,
    strategy,
    tokenAMint,
    tokenAProgram,
    tokenBMint,
    tokenBProgram,
    vault,
    vaultTokenAAccount,
    vaultTokenBAccount,
    authority,
  }: {
    liquidityDelta: BigIntString;
    tokenAAmountThreshold: BigIntString;
    tokenBAmountThreshold: BigIntString;
    eventAuthority: Address;
    pool: Address;
    poolTokenAAccount: Address;
    poolTokenBAccount: Address;
    position: Address;
    positionNftAccount: Address;
    strategy: Address;
    tokenAMint: Address;
    tokenAProgram: Address;
    tokenBMint: Address;
    tokenBProgram: Address;
    vault: Address;
    vaultTokenAAccount: Address;
    vaultTokenBAccount: Address;
    authority: Address;
  }): Promise<TransactionInstruction> {
    return await this.program.methods
      .executeStrategyMeteoraDammV2({
        params: {
          liquidityDelta: new BN(liquidityDelta),
          tokenAAmountThreshold: new BN(tokenAAmountThreshold),
          tokenBAmountThreshold: new BN(tokenBAmountThreshold),
        }
      })
      .accounts({
        config: this.configPda,
        eventAuthority,
        pool,
        poolTokenAAccount,
        poolTokenBAccount,
        position,
        positionNftAccount,
        strategy,
        tokenAMint,
        tokenAProgram,
        tokenBMint,
        tokenBProgram,
        vault,
        vaultTokenAAccount,
        vaultTokenBAccount,
        authority,
      })
      .instruction();
  }

  async exitStrategyJupiterSwapIx({
    swapData,
    amount,
    slippageBps,
    destinationMint,
    destinationTokenProgram,
    sourceMint,
    sourceTokenProgram,
    strategy,
    treasuryTokenAccount,
    vault,
    vaultDestinationTokenAccount,
    vaultSourceTokenAccount,
    authority,
    remainingAccounts,
  }: {
    swapData: Buffer;
    amount: BigIntString;
    slippageBps: number;
    destinationMint: Address;
    destinationTokenProgram: Address;
    sourceMint: Address;
    sourceTokenProgram: Address;
    strategy: Address;
    treasuryTokenAccount: Address;
    vault: Address;
    vaultDestinationTokenAccount: Address;
    vaultSourceTokenAccount: Address;
    authority: Address;
    remainingAccounts: AccountMeta[];
  }): Promise<TransactionInstruction> {
    return await this.program.methods
      .exitStrategyJupiterSwap(
        swapData,
        new BN(amount),
        slippageBps,
      )
      .accounts({
        config: this.configPda,
        destinationMint,
        destinationTokenProgram,
        sourceMint,
        sourceTokenProgram,
        strategy,
        treasuryTokenAccount,
        vault,
        vaultDestinationTokenAccount,
        vaultSourceTokenAccount,
        authority,
      })
      .remainingAccounts(remainingAccounts)
      .instruction()
  }

  async exitStrategyMeteoraDammV2Ix({
    liquidityDelta,
    tokenAAmountThreshold,
    tokenBAmountThreshold,
    eventAuthority,
    pool,
    poolTokenAAccount,
    poolTokenBAccount,
    poolAuthority,
    position,
    positionNftAccount,
    strategy,
    tokenAMint,
    tokenAProgram,
    tokenBMint,
    tokenBProgram,
    treasuryTokenAccount,
    vault,
    vaultTokenAAccount,
    vaultTokenBAccount,
    authority,
  }: {
    liquidityDelta: BigIntString;
    tokenAAmountThreshold: BigIntString;
    tokenBAmountThreshold: BigIntString;
    eventAuthority: Address;
    pool: Address;
    poolTokenAAccount: Address;
    poolTokenBAccount: Address;
    poolAuthority: Address;
    position: Address;
    positionNftAccount: Address;
    strategy: Address;
    tokenAMint: Address;
    tokenAProgram: Address;
    tokenBMint: Address;
    tokenBProgram: Address;
    treasuryTokenAccount: Address;
    vault: Address;
    vaultTokenAAccount: Address;
    vaultTokenBAccount: Address;
    authority: Address;
  }): Promise<TransactionInstruction> {
    return await this.program.methods
      .exitStrategyMeteoraDammV2(
        new BN(liquidityDelta),
        new BN(tokenAAmountThreshold),
        new BN(tokenBAmountThreshold),
      )
      .accounts({
        config: this.configPda,
        eventAuthority,
        pool,
        poolTokenAAccount,
        poolTokenBAccount,
        poolAuthority,
        position,
        positionNftAccount,
        strategy,
        tokenAMint,
        tokenAProgram,
        tokenBMint,
        tokenBProgram,
        treasuryTokenAccount,
        vault,
        vaultTokenAAccount,
        vaultTokenBAccount,
        authority,
      })
      .instruction();
  }

  async initializeStrategyJupiterSwapIx({
    destinationMint,
    vault,
    authority,
    strategy,
  }: {
    destinationMint: Address;
    vault: Address;
    authority: Address;
    strategy: Address;
  }): Promise<TransactionInstruction> {
    return await this.program.methods
      .initializeStrategyJupiterSwap()
      .accountsPartial({
        destinationMint,
        vault,
        authority,
        strategy,
      })
      .instruction();
  }

  async initializeStrategyMeteoraDammV2Ix({
    eventAuthority,
    pool,
    poolAuthority,
    position,
    positionNftAccount,
    positionNftMint,
    vault,
    authority,
  }: {
    eventAuthority: Address;
    pool: Address;
    poolAuthority: Address;
    position: Address;
    positionNftAccount: Address;
    positionNftMint: Address;
    vault: Address;
    authority: Address;
  }): Promise<TransactionInstruction> {
    return this.program.methods
      .initializeStrategyMeteoraDammV2()
      .accounts({
        eventAuthority,
        pool,
        poolAuthority,
        position,
        positionNftAccount,
        positionNftMint,
        vault,
        authority,
      })
      .instruction();
  }

  async initializeUserIx({
    authority,
  }: {
    authority: Address;
  }): Promise<TransactionInstruction> {
    return await this.program.methods
      .initializeUser()
      .accounts({
        authority,
      })
      .instruction();
  }

  async initializeVaultIx({
    name,
    description,
    managerFeeBps,
    depositCap,
    lockedProfitDuration,
    authority,
    depositMint,
    depositMintTokenProgram,
  }: {
    name: string;
    description: string;
    managerFeeBps: number;
    depositCap: BigIntString;
    lockedProfitDuration: BigIntString;
    authority: Address;
    depositMint: Address;
    depositMintTokenProgram: Address;
  }): Promise<TransactionInstruction> {
    return await this.program.methods
      .initializeVault({
        name,
        description,
        managerFeeBps,
        depositCap: new BN(depositCap),
        lockedProfitDuration: new BN(lockedProfitDuration),
      })
      .accounts({
        authority,
        treasury: this.treasuryPda,
        config: this.configPda,
        depositMint,
        depositMintTokenProgram,
      })
      .instruction();
  }

  async withdrawVaultIx({
    amount,
    withdrawer,
    vault,
    vaultDepositor,
    depositMint,
    depositMintTokenProgram,
  }: {
    amount: BigIntString;
    withdrawer: Address;
    vault: Address;
    vaultDepositor: Address;
    depositMint: Address;
    depositMintTokenProgram: Address;
  }): Promise<TransactionInstruction> {
    return await this.program.methods
      .withdrawVault(new BN(amount))
      .accounts({
        config: this.configPda,
        withdrawer,
        vault,
        vaultDepositor,
        depositMint,
        depositMintTokenProgram,
      })
      .instruction();

  }
}
