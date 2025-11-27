import { Mirrorfi } from "@/types/mirrorfi";
import { Connection, PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { parseConfig } from "@/types/accounts";
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
}
