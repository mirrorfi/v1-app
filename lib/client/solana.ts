import { clusterApiUrl, Connection } from '@solana/web3.js';
import { Cluster } from '@solana/web3.js';
import { MirrorFiClient } from '@/lib/mirrorfi-client';

const CLIENT_CLUSTER: Cluster = (process.env.NEXT_PUBLIC_SOLANA_RPC_CLUSTER ??
  'mainnet-beta') as Cluster;
export const CLIENT_CONNECTION = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? clusterApiUrl(CLIENT_CLUSTER),
  'confirmed'
);
export const mirrorfiClient = new MirrorFiClient(CLIENT_CONNECTION);
