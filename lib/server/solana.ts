import { AddressLookupTableAccount, clusterApiUrl, Connection, PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { Cluster } from '@solana/web3.js';
import { MirrorFiClient } from '@/lib/mirrorfi-client';
import { v0TxToBase64 } from '@/lib/utils';
import { randomUUID } from 'crypto';
import { BuildGatewayTransactionResponse, DeliveryResult } from '@/types/gateway';

const SERVER_CLUSTER: Cluster = (process.env.SERVER_SOLANA_RPC_CLUSTER ??
  'mainnet-beta') as Cluster;
export const SERVER_CONNECTION = new Connection(
  process.env.SERVER_SOLANA_RPC_URL ?? clusterApiUrl(SERVER_CLUSTER),
  'confirmed'
);
export const mirrorfiClient = new MirrorFiClient(SERVER_CONNECTION);

export async function getALTs(
  addresses: PublicKey[]
): Promise<AddressLookupTableAccount[]> {
  const lookupTableAccounts: AddressLookupTableAccount[] = [];

  for (const address of addresses) {
    const account = await SERVER_CONNECTION.getAddressLookupTable(address);

    if (account.value) {
      lookupTableAccounts.push(account.value);
    } else {
      throw new Error(`Lookup table not found: ${address.toBase58()}`);
    }
  }

  return lookupTableAccounts;
}

export async function buildTx(
  instructions: TransactionInstruction[],
  payer: PublicKey,
  lookupTables: AddressLookupTableAccount[] = []
): Promise<string> {
  const messageV0 = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: (await SERVER_CONNECTION.getLatestBlockhash()).blockhash,
    instructions,
  }).compileToV0Message(lookupTables);

  const v0Tx = new VersionedTransaction(messageV0);

  const res = await fetch(`${process.env.GATEWAY_URL}${process.env.GATEWAY_API}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: randomUUID(),
      jsonrpc: "2.0",
      method: "buildGatewayTransaction",
      params: [
        v0TxToBase64(v0Tx),
        {
          encoding: "base64",
          skipSimulation: false,
          skipPriorityFee: false,
          cuPriceRange: "low",
          jitoTipRange: "low",
        },
      ],
    }),
  })

  if (!res.ok) {
    throw new Error("Failed to build transaction.");
  }

  const data = await res.json() as BuildGatewayTransactionResponse;

  return data.result.transaction;
}

export async function sendTx(transaction: string): Promise<string> {
  const res = await fetch(`${process.env.GATEWAY_URL}${process.env.GATEWAY_API}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: randomUUID(),
      jsonrpc: "2.0",
      method: "sendTransaction",
      params: [
        transaction,
        {
          encoding: "base64",
        },
      ],
    }),
  })

  const data = await res.json() as DeliveryResult;

  if (!res.ok) {
    throw new Error(data.error?.message || "Failed to send transaction.");
  }

  return data.result!;
}