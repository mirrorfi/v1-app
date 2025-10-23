import { AddressLookupTableAccount, clusterApiUrl, ComputeBudgetProgram, Connection, PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { Cluster } from '@solana/web3.js';
// import { getSimulationComputeUnits } from '@solana-developers/helpers';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Mirrorfi } from '@/types/mirrorfi';
import mirrorfiIdl from '@/idl/mirrorfi.json';
import { MirrorFiClient } from './utils/mirrorfi-client';

const SERVER_CLUSTER: Cluster = (process.env.SERVER_SOLANA_RPC_CLUSTER ?? process.env.NEXT_PUBLIC_SOLANA_RPC_CLUSTER ?? 'mainnet-beta') as Cluster;
export const SERVER_CONNECTION = new Connection(
  process.env.SERVER_SOLANA_RPC_URL ?? 
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? 
  clusterApiUrl(SERVER_CLUSTER),
  'confirmed'
);
const provider = { connection: SERVER_CONNECTION } as AnchorProvider;
const mirrorfiProgram = new Program<Mirrorfi>(mirrorfiIdl, provider);
export const mirrorfiClient = new MirrorFiClient(mirrorfiProgram);

export async function getPriorityFee(): Promise<number> {
  const recentFees = await SERVER_CONNECTION.getRecentPrioritizationFees();
  return Math.floor(
    recentFees.reduce(
      (acc, { prioritizationFee }) => acc + prioritizationFee,
      0
    ) / recentFees.length
  );
}

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
  ixs: TransactionInstruction[],
  payer: PublicKey,
  lookupTables: AddressLookupTableAccount[] = []
) {
  // const units = await getSimulationComputeUnits(
  //   SERVER_CONNECTION,
  //   ixs,
  //   payer,
  //   lookupTables
  // );
  const units = 200_000;

  if (!units) {
    throw new Error('Unable to get compute limits.');
  }

  const ixsWithCompute = [
    ComputeBudgetProgram.setComputeUnitLimit({
      units: Math.ceil(units * 1.1),
    }),
    ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: await getPriorityFee(),
    }),
    ...ixs,
  ];

  const messageV0 = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: (await SERVER_CONNECTION.getLatestBlockhash()).blockhash,
    instructions: ixsWithCompute,
  }).compileToV0Message(lookupTables);

  return new VersionedTransaction(messageV0);
}