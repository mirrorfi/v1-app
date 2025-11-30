import { ActivityType } from "@/lib/database/models/activity";

export interface LogActivityParams {
  wallet: string;
  activity: ActivityType;
  vault?: string;
  token?: string;
  amount?: string;
  amountInUsd?: string;
  txHash: string;
  metadata?: Record<string, any>;
  decimals?: number;
}

/**
 * Client-side helper to log user activity
 * Can be called from anywhere in the frontend
 * 
 * @example
 * ```typescript
 * import { logActivity } from '@/lib/utils/activity-logger';
 * 
 * await logActivity({
 *   wallet: publicKey.toBase58(),
 *   activity: 'deposit',
 *   vault: vaultAddress,
 *   token: 'SOL',
 *   amount: '0.1',
 *   amountInUsd: '20.123',
 *   txHash: signature,
 * });
 * ```
 */
export async function logActivity(params: LogActivityParams): Promise<{
  success: boolean;
  error?: string;
  isDuplicate?: boolean;
}> {
  try {
    const response = await fetch('/api/activities/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Failed to log activity:', data.error);
      return { success: false, error: data.error };
    }

    return { 
      success: true, 
      isDuplicate: data.isDuplicate 
    };
  } catch (error) {
    console.error('Error logging activity:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Register or update a user when they connect their wallet
 * 
 * @example
 * ```typescript
 * import { registerUser } from '@/lib/utils/activity-logger';
 * 
 * await registerUser(publicKey.toBase58());
 * ```
 */
export async function registerUser(publicAddress: string): Promise<{
  success: boolean;
  isNewUser?: boolean;
  error?: string;
}> {
  try {
    const response = await fetch('/api/users/add-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicAddress }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Failed to register user:', data.error);
      return { success: false, error: data.error };
    }

    return { 
      success: true, 
      isNewUser: data.isNewUser 
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get user activities with pagination
 * 
 * @example
 * ```typescript
 * import { getUserActivities } from '@/lib/utils/activity-logger';
 * 
 * const { activities, pagination } = await getUserActivities(
 *   publicKey.toBase58(),
 *   1,
 *   20
 * );
 * ```
 */
export async function getUserActivities(
  wallet: string,
  page: number = 1,
  limit: number = 20
): Promise<{
  success: boolean;
  activities?: any[];
  pagination?: any;
  error?: string;
}> {
  try {
    const response = await fetch(
      `/api/activities/get-by-wallet?wallet=${wallet}&page=${page}&limit=${limit}`
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Failed to fetch activities:', data.error);
      return { success: false, error: data.error };
    }

    return { 
      success: true, 
      activities: data.activities,
      pagination: data.pagination,
    };
  } catch (error) {
    console.error('Error fetching activities:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get vault activities with pagination
 * 
 * @example
 * ```typescript
 * import { getVaultActivities } from '@/lib/utils/activity-logger';
 * 
 * const { activities, pagination } = await getVaultActivities(
 *   vaultAddress,
 *   1,
 *   20
 * );
 * ```
 */
export async function getVaultActivities(
  vault: string,
  page: number = 1,
  limit: number = 20
): Promise<{
  success: boolean;
  activities?: any[];
  pagination?: any;
  error?: string;
}> {
  try {
    const response = await fetch(
      `/api/activities/get-by-vault?vault=${vault}&page=${page}&limit=${limit}`
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Failed to fetch vault activities:', data.error);
      return { success: false, error: data.error };
    }

    return { 
      success: true, 
      activities: data.activities,
      pagination: data.pagination,
    };
  } catch (error) {
    console.error('Error fetching vault activities:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get activity statistics
 * 
 * @example
 * ```typescript
 * import { getActivityStats } from '@/lib/utils/activity-logger';
 * 
 * const stats = await getActivityStats({ wallet: publicKey.toBase58(), days: 30 });
 * ```
 */
export async function getActivityStats(params?: {
  wallet?: string;
  vault?: string;
  days?: number;
}): Promise<{
  success: boolean;
  stats?: any;
  error?: string;
}> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.wallet) queryParams.append('wallet', params.wallet);
    if (params?.vault) queryParams.append('vault', params.vault);
    if (params?.days) queryParams.append('days', params.days.toString());

    const response = await fetch(
      `/api/activities/stats?${queryParams.toString()}`
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Failed to fetch stats:', data.error);
      return { success: false, error: data.error };
    }

    return { 
      success: true, 
      stats: data.stats,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
