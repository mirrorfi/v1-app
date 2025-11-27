import { buildTx, mirrorfiClient, SERVER_CONNECTION } from "@/lib/server/solana";
import { stringToByteArray } from "@/lib/utils";
import { parseConfig } from "@/types/accounts";
import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, description, managerFeeBps, depositCap, lockedProfitDuration, depositMint, priceUpdateV2, authority } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required.' },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required.' },
        { status: 400 }
      );
    }

    if (managerFeeBps === undefined || managerFeeBps === null) {
      return NextResponse.json(
        { error: 'Manager fee basis points is required.' },
        { status: 400 }
      );
    }

    if (depositCap === undefined || depositCap === null) {
      return NextResponse.json(
        { error: 'Deposit cap is required.' },
        { status: 400 }
      );
    }

    // depositCap is a bigint serialized as string
    if (isNaN(depositCap) || BigInt(depositCap) <= BigInt(0)) {
      return NextResponse.json(
        { error: 'Deposit cap must be a positive number.' },
        { status: 400 }
      );
    }

    if (lockedProfitDuration === undefined || lockedProfitDuration === null) {
      return NextResponse.json(
        { error: 'Locked profit degradation duration is required.' },
        { status: 400 }
      );
    }

    // lockedProfitDegradationDuration is a bigint serialized as string
    if (isNaN(lockedProfitDuration) || BigInt(lockedProfitDuration) <= BigInt(0)) {
      return NextResponse.json(
        { error: 'Locked profit degradation duration must be a positive number.' },
        { status: 400 }
      );
    }

    if (!depositMint) {
      return NextResponse.json(
        { error: 'Deposit mint is required.' },
        { status: 400 }
      );
    }

    if (!priceUpdateV2) {
      return NextResponse.json(
        { error: 'Price update V2 is required.' },
        { status: 400 }
      );
    }

    if (!authority) {
      return NextResponse.json(
        { error: 'Authority is required.' },
        { status: 400 }
      );
    }

    const id = await mirrorfiClient.getNextVaultId();
    const configPda = mirrorfiClient.getConfigPda();
    const treasuryPda = mirrorfiClient.getTreasuryPda();
    const depositMintPubkey = new PublicKey(depositMint);
    const depositMintTokenProgram = (await SERVER_CONNECTION.getAccountInfo(depositMintPubkey))!.owner;

    const config = (await mirrorfiClient.fetchProgramAccount(configPda.toBase58(), "config", parseConfig))!;
    const vaultPda = mirrorfiClient.getVaultPda(new BN(config.nextVaultId), new PublicKey(authority));
    console.log("New Vault PDA:", vaultPda.toBase58());

    const ix = await mirrorfiClient.program.methods
      .initializeVault({
        name: stringToByteArray(name, 32),
        description: stringToByteArray(description, 64),
        managerFeeBps,
        depositCap: new BN(depositCap),
        lockedProfitDuration: new BN(lockedProfitDuration),
      })
      .accountsPartial({
        authority,
        treasury: treasuryPda,
        config: configPda,
        vault: vaultPda,
        depositMint,
        depositMintTokenProgram,
      })
      .instruction();

    const tx = await buildTx([ix], new PublicKey(authority));

    return NextResponse.json({
      tx,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Failed to generate transaction.',
      },
      { status: 500 }
    );
  }
}