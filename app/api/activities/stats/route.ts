import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Activity from "@/lib/database/models/activity";

/**
 * GET /api/activities/stats
 * Get aggregated statistics about activities
 * Optional query params: ?wallet=<address>&vault=<address>&days=30
 */
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get("wallet");
    const vault = searchParams.get("vault");
    const days = parseInt(searchParams.get("days") || "30", 10);
    
    // Build query filter
    const filter: any = {};
    if (wallet) filter.wallet = wallet;
    if (vault) filter.vault = vault;
    
    // Add time filter
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    filter.timestamp = { $gte: startDate };
    
    // Aggregate statistics
    const [
      totalActivities,
      activityTypeBreakdown,
      totalVolumeUsd,
      uniqueWallets,
      uniqueVaults,
    ] = await Promise.all([
      // Total activities count
      Activity.countDocuments(filter),
      
      // Activity type breakdown
      Activity.aggregate([
        { $match: filter },
        { $group: { _id: "$activity", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      
      // Total volume in USD
      Activity.aggregate([
        { $match: { ...filter, amountInUsd: { $exists: true, $ne: null } } },
        { $group: { _id: null, total: { $sum: { $toDouble: "$amountInUsd" } } } },
      ]),
      
      // Unique wallets
      Activity.distinct("wallet", filter),
      
      // Unique vaults
      Activity.distinct("vault", { ...filter, vault: { $exists: true, $ne: null } }),
    ]);
    
    return NextResponse.json({ 
      success: true,
      stats: {
        totalActivities,
        activityTypeBreakdown: activityTypeBreakdown.map(item => ({
          activity: item._id,
          count: item.count,
        })),
        totalVolumeUsd: totalVolumeUsd[0]?.total || 0,
        uniqueWallets: uniqueWallets.length,
        uniqueVaults: uniqueVaults.length,
        periodDays: days,
      }
    });
  } catch (error) {
    console.error("Error fetching activity stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity statistics" }, 
      { status: 500 }
    );
  }
}
