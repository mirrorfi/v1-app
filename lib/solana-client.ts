import { Mirrorfi } from '@/types/mirrorfi';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { Cluster } from '@solana/web3.js';
import mirrorfiIdl from '@/idl/mirrorfi.json';
import { MirrorFiClient } from './utils/mirrorfi-client';

const CLIENT_CLUSTER: Cluster = (process.env.NEXT_PUBLIC_SOLANA_RPC_CLUSTER ??
  'mainnet-beta') as Cluster;
export const CLIENT_CONNECTION = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? clusterApiUrl(CLIENT_CLUSTER),
  'confirmed'
);
const provider = { connection: CLIENT_CONNECTION } as AnchorProvider;
const mirrorfiProgram = new Program<Mirrorfi>(mirrorfiIdl, provider);
export const mirrorfiClient = new MirrorFiClient(mirrorfiProgram);