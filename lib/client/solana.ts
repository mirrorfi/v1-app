import { Mirrorfi } from '@/types/mirrorfi';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { Cluster } from '@solana/web3.js';
import mirrorfiIdl from '@/idl/mirrorfi.json';
import { MirrorFiClient } from '../mirrorfi-client';

const cluster: Cluster = (process.env.NEXT_PUBLIC_SOLANA_RPC_CLUSTER ??
  'mainnet-beta') as Cluster;
export const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? clusterApiUrl(cluster),
  'confirmed'
);
const provider = { connection: connection } as AnchorProvider;
const mirrorfiProgram = new Program<Mirrorfi>(mirrorfiIdl, provider);
export const mirrorfiClient = new MirrorFiClient(mirrorfiProgram);
