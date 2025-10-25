/**
 * Activity tracking types for MirrorFi
 */

export type ActivityType = 
  | 'deposit' 
  | 'withdraw' 
  | 'swap' 
  | 'vault_create' 
  | 'strategy_execute'
  | 'strategy_create'
  | 'other';

export interface Activity {
  _id?: string;
  wallet: string;
  activity: ActivityType;
  vault?: string;
  token?: string;
  amount?: string;
  amountInUsd?: string;
  txHash: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  _id?: string;
  publicAddress: string;
  createdAt: Date;
  lastConnected: Date;
}

export interface ActivityStats {
  totalActivities: number;
  activityTypeBreakdown: {
    activity: ActivityType;
    count: number;
  }[];
  totalVolumeUsd: number;
  uniqueWallets: number;
  uniqueVaults: number;
  periodDays: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LogActivityParams {
  wallet: string;
  activity: ActivityType;
  vault?: string;
  token?: string;
  amount?: string;
  amountInUsd?: string;
  txHash: string;
  metadata?: Record<string, any>;
}

export interface ActivityResponse {
  success: boolean;
  error?: string;
  isDuplicate?: boolean;
  activity?: Activity;
}

export interface ActivitiesListResponse {
  success: boolean;
  activities?: Activity[];
  pagination?: Pagination;
  error?: string;
}

export interface StatsResponse {
  success: boolean;
  stats?: ActivityStats;
  error?: string;
}

export interface UserResponse {
  success: boolean;
  user?: User;
  isNewUser?: boolean;
  error?: string;
}
