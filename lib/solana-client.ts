import { clusterApiUrl, Connection } from '@solana/web3.js';
import { Cluster } from '@solana/web3.js';
import { Keypair } from '@solana/web3.js';

const CLIENT_CLUSTER: Cluster = (process.env.NEXT_PUBLIC_SOLANA_RPC_CLUSTER ??
  'devnet') as Cluster;
export const CLIENT_CONNECTION = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? clusterApiUrl(CLIENT_CLUSTER),
  'confirmed'
);
