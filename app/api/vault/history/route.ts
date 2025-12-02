import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/database";
import { VaultData5Minute, VaultDataHourly, IVaultData } from "@/lib/database/models/vaultData";

// ============================================
// Types
// ============================================

interface TimeConfig {
  range: number;
  model: typeof VaultData5Minute | typeof VaultDataHourly;
  needsAggregation: boolean;
  unit?: string;
  binSize?: number;
}

interface ChartDataPoint {
  timestamp: Date;
  tokenNav: number;     // Vault valuation in USDC
  usdNav: number;       // Vault valuation in USD
  userDeposits: number; // User deposits adjusted by decimals
  dataPointsInBucket?: number;
}

// ============================================
// Route Handler
// ============================================

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const vault = searchParams.get("vault");

  if (!vault) {
    return new Response(
      JSON.stringify({ error: "Vault is required." }), 
      { status: 400 }
    );
  }
  
  const timeframe = searchParams.get("timeframe") || "7D";

  try {
    await connectToDatabase();
    
    const now = new Date();
    
    // Define time ranges and which model to use
    const timeConfig: Record<string, TimeConfig> = {
      "24H": { 
        range: 24 * 60 * 60 * 1000,      // 24 hours
        model: VaultData5Minute,
        needsAggregation: false           // Full resolution from 5-minute data
      },
      "7D": { 
        range: 7 * 24 * 60 * 60 * 1000,   // 7 days
        model: VaultData5Minute,
        needsAggregation: false           // Return all data (TTL is 7 days anyway)
      },
      "30D": { 
        range: 30 * 24 * 60 * 60 * 1000,  // 30 days
        model: VaultDataHourly,
        needsAggregation: false           // Hourly data, no need to aggregate
      },
      "90D": { 
        range: 90 * 24 * 60 * 60 * 1000,  // 90 days
        model: VaultDataHourly,
        needsAggregation: true,           // Aggregate to 3-hour intervals
        unit: "hour",
        binSize: 3
      },
    };

    const config = timeConfig[timeframe];
    
    if (!config) {
      return new Response(
        JSON.stringify({ error: "Invalid timeframe. Use: 24H, 7D, 30D, or 90D" }), 
        { status: 400 }
      );
    }

    const startTime = new Date(now.getTime() - config.range);

    let chartData: ChartDataPoint[];

    // Simple query without aggregation
    if (!config.needsAggregation) {
      const historicalData = await config.model
        .find({
          "metadata.vaultAddr": vault,
          timestamp: {
            $gte: startTime,
            $lte: now,
          },
        })
        .sort({ timestamp: 1 })
        .lean<IVaultData[]>();

      // Transform data from indexer schema to API output format
      chartData = historicalData.map((doc) => ({
        timestamp: doc.timestamp,
        tokenNav: doc.data?.tokenNav || 0,
        usdNav: doc.data?.usdNav || 0,
        userDeposits: doc.data?.userDeposits || 0,
      }));
    } else {
      // Aggregation for 90D (3-hour intervals)
      const aggregatedData = await config.model.aggregate([
        // Stage 1: Filter by vault and time range
        {
          $match: {
            "metadata.vaultAddr": vault,
            timestamp: {
              $gte: startTime,
              $lte: now,
            },
          },
        },
        
        // Stage 2: Sort by timestamp
        {
          $sort: { timestamp: 1 },
        },
        
        // Stage 3: Group by time intervals
        {
          $group: {
            _id: {
              interval: {
                $dateTrunc: {
                  date: "$timestamp",
                  unit: config.unit!,
                  binSize: config.binSize!,
                },
              },
              vaultAddr: "$metadata.vaultAddr",
            },
            // Use LAST value in each interval (most recent snapshot)
            timestamp: { $last: "$timestamp" },
            tokenNav: { $last: "$data.tokenNav" },
            usdNav: { $last: "$data.usdNav" },
            userDeposits: { $last: "$data.userDeposits" },
            
            // Count how many data points are in this bucket
            count: { $sum: 1 },
          },
        },
        
        // Stage 4: Sort by interval
        {
          $sort: { "_id.interval": 1 },
        },
        
        // Stage 5: Project and calculate derived values
        {
          $project: {
            _id: 0,
            timestamp: "$timestamp",
            tokenNav: { $ifNull: ["$tokenNav", 0] },
            usdNav: { $ifNull: ["$usdNav", 0] },
            userDeposits: { $ifNull: ["$userDeposits", 0] },
            dataPointsInBucket: "$count",
          },
        },
      ]);

      // Transform aggregated data to API output format
      chartData = aggregatedData.map((doc: any) => ({
        timestamp: doc.timestamp,
        tokenNav: doc.tokenNav || 0,
        usdNav: doc.usdNav || 0,
        userDeposits: doc.userDeposits || 0,
        dataPointsInBucket: doc.dataPointsInBucket,
      }));
    }

    const collectionName = config.model.collection.name;

    return Response.json({
      vaultAddress: vault,
      timeframe,
      collection: collectionName,
      resolution: config.needsAggregation ? `${config.binSize}-${config.unit}` : "native",
      dataPoints: chartData.length,
      data: chartData,
    });

  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Failed to fetch historical data." }), 
      { status: 500 }
    );
  }
  // No need to close connection - mongoose handles connection pooling
}