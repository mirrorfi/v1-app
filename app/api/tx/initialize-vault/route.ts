import { buildTx, mirrorfiClient, SERVER_CONNECTION } from "@/lib/solana-server";
import { stringToByteArray, v0TxToBase64 } from "@/lib/utils";
import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, description, managerFeeBps, depositCap, lockedProfitDegradationDuration, depositMint, priceUpdateV2, authority } = await req.json();

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

    if (typeof depositCap !== 'number' || depositCap <= 0) {
      return NextResponse.json(
        { error: 'Deposit cap must be a positive number.' },
        { status: 400 }
      );
    }

    if (lockedProfitDegradationDuration === undefined || lockedProfitDegradationDuration === null) {
      return NextResponse.json(
        { error: 'Locked profit degradation duration is required.' },
        { status: 400 }
      );
    }

    if (typeof lockedProfitDegradationDuration !== 'number' || lockedProfitDegradationDuration <= 0) {
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
    const vaultPda = mirrorfiClient.getVaultPda(new BN(id), new PublicKey(authority));
    const depositMintPubkey = new PublicKey(depositMint);
    const depositMintTokenProgram = (await SERVER_CONNECTION.getAccountInfo(depositMintPubkey))!.owner;

    const ix = await mirrorfiClient.program.methods
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
        vault: vaultPda,
      })
      .instruction();

    const tx = await buildTx([ix], new PublicKey(authority));

    return NextResponse.json({
      tx: v0TxToBase64(tx),
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