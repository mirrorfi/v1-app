import { Transaction } from "@/components/VaultDashboardTransactionHistory";

export interface GetActivityParams {
  wallet: string;

  vault: string;

  page?: number;

  limit?: number;
}

export async function getUserActivitiesByVault({
  wallet,
  vault,
  page = 1,
  limit = 20,
}: GetActivityParams): Promise<{
  success: boolean;

  transactions: Transaction[];

  pagination: {
    page: number;

    limit: number;

    total: number;

    totalPages: number;
  };

  error?: string;
}> {
  try {
    const queryParams = new URLSearchParams({
      wallet,

      vault,

      page: page.toString(),

      limit: limit.toString(),
    });

    const response = await fetch(
      `/api/activities/get-user-activities-by-vault?${queryParams.toString()}`
    );

    if (!response.ok) {
      const errorData = await response.json();

      return {
        success: false,

        transactions: [],

        pagination: {
          page,

          limit,

          total: 0,

          totalPages: 0,
        },

        error: errorData.error || "Failed to fetch activities",
      };
    }

    const data = await response.json();

    // Transform the activities to Transaction format

    const transactions: Transaction[] = data.activities.map((activity: any) => {
      const amount = parseFloat(activity.amount);

      console.log("Activity data:", {
        amount: activity.amount,

        parsed: amount,

        token: activity.token,

        decimals: activity.decimals,
      });

      return {
        id: activity._id,

        type: activity.activity as "deposit" | "withdraw",

        amount: isNaN(amount) ? 0 : amount,

        token: activity.token || "UNKNOWN",

        timestamp: new Date(activity.timestamp),

        signature: activity.txHash,

        decimals: activity.decimals || 6,

        status: "completed" as const,
      };
    });

    return {
      success: true,

      transactions,

      pagination: data.pagination,
    };
  } catch (error) {
    console.error("Error fetching user activities:", error);

    return {
      success: false,

      transactions: [],

      pagination: {
        page,

        limit,

        total: 0,

        totalPages: 0,
      },

      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
