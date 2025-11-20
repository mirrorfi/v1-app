import { Mirrorfi } from "@/types/mirrorfi";
import { GetProgramAccountsFilter, PublicKey } from "@solana/web3.js";
import { AccountNamespace, BN, IdlAccounts, Program } from "@coral-xyz/anchor";
import { parseConfig, ParsedProgramAccount, parseVault } from "@/types/accounts";
import mirrorfiIdl from "@/idl/mirrorfi.json";

const programId = new PublicKey(mirrorfiIdl.address);

export class MirrorFiClient {
  program: Program<Mirrorfi>;

  constructor(program: Program<Mirrorfi>) {
    this.program = program;
  }
  
  configPda = this.getConfigPda();
  treasuryPda = this.getTreasuryPda();

  private getConfigPda() {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      programId
    )[0];
  }

  getTreasuryPda() {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("treasury")],
      programId,
    )[0];
  }

  getVaultPda(id: BN, authority: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("vault"),
        id.toArrayLike(Buffer, "le", 8),
        authority.toBuffer(),
      ],
      programId,
    )[0];
  }

  getReceiptMintPda(vault: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("receipt_mint"), vault.toBuffer()],
      programId,
    )[0];
  }

  getStrategyPda(vault: PublicKey, id: BN) {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("strategy"),
        vault.toBuffer(),
        id.toArrayLike(Buffer, "le", 1),
      ],
      programId,
    )[0];
  }

  getJupiterStrategyPda(vault: PublicKey, tokenMint: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("strategy"),
        vault.toBuffer(),
        tokenMint.toBuffer(),
      ],
      programId,
    )[0];
  }

  getUserPda(authority: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("user"), authority.toBuffer()],
      programId,
    )[0];
  }

  async fetchProgramAccount<
    T extends keyof AccountNamespace<Mirrorfi>,
    R extends ParsedProgramAccount
  >(
    pda: string,
    accountName: T,
    parser: (acc: IdlAccounts<Mirrorfi>[T]) => Omit<R, "publicKey">
  ): Promise<R | null> {
    const acc = await this.program.account[accountName].fetchNullable(pda);

    return acc
      ? ({ publicKey: pda, ...parser(acc as IdlAccounts<Mirrorfi>[T]) } as R)
      : null;
  }

  async fetchMultipleProgramAccounts<
    T extends keyof AccountNamespace<Mirrorfi>,
    R extends ParsedProgramAccount
  >(
    pdas: string[],
    accountName: T,
    parser: (acc: IdlAccounts<Mirrorfi>[T]) => Omit<R, "publicKey">
  ): Promise<(R | null)[]> {
    const accs = await this.program.account[accountName].fetchMultiple(pdas);

    return accs.map((acc, i) => {
      return acc
        ? ({ publicKey: pdas[i], ...parser(acc as IdlAccounts<Mirrorfi>[T]) } as R)
        : null;
    });
  }

  async fetchAllProgramAccounts<
    T extends keyof AccountNamespace<Mirrorfi>,
    R extends ParsedProgramAccount
  >(
    accountName: T,
    parser: (acc: IdlAccounts<Mirrorfi>[T]) => Omit<R, "publicKey">,
    filters: GetProgramAccountsFilter[] = []
  ): Promise<R[]> {
    const accs = await this.program.account[accountName].all(filters);

    return accs.map(({ account, publicKey }) => {
      return {
        ...parser(account as IdlAccounts<Mirrorfi>[T]),
        publicKey: publicKey.toBase58(),
      } as R;
    });
  }

  async getNextVaultId() {
    const configAcc = await this.fetchProgramAccount(this.configPda.toBase58(), "config", parseConfig);

    if (!configAcc) {
      throw new Error("Config account not found.");
    }

    return configAcc.nextVaultId;
  }

  async getNextStrategyId(vault: string) {
    const vaultAcc = await this.fetchProgramAccount(vault, "vault", parseVault);

    if (!vaultAcc) {
      throw new Error("Vault account not found.");
    }

    return vaultAcc.nextStrategyId;
  }
}
