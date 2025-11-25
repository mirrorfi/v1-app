import { mongodbClient } from "@/lib/utils/mongodb";
import { NextRequest } from "next/server";

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
    await mongodbClient.connect();
    const db = mongodbClient.db(process.env.MONGODB_DB_NAME || "jarvis");
    
    const now = new Date();
    
    // Define time ranges and which collection to use
    const timeConfig: Record<string, { 
      range: number; 
      collection: string; 
      needsAggregation: boolean;
      unit?: string;
      binSize?: number;
    }> = {
      "24H": { 
        range: 24 * 60 * 60 * 1000,      // 24 hours
        collection: process.env.MONGODB_COLLECTION_5_MINUTE || "vault_data_5_minute",
        needsAggregation: false           // Full resolution from 5-minute data
      },
      "7D": { 
        range: 7 * 24 * 60 * 60 * 1000,   // 7 days
        collection: process.env.MONGODB_COLLECTION_5_MINUTE || "vault_data_5_minute",
        needsAggregation: false           // Return all data (TTL is 7 days anyway)
      },
      "30D": { 
        range: 30 * 24 * 60 * 60 * 1000,  // 30 days
        collection: process.env.MONGODB_COLLECTION_HOURLY || "vault_data_hourly",
        needsAggregation: false           // Hourly data, no need to aggregate
      },
      "90D": { 
        range: 90 * 24 * 60 * 60 * 1000,  // 90 days
        collection: process.env.MONGODB_COLLECTION_HOURLY || "vault_data_hourly",
        needsAggregation: true,           // Aggregate to 3-hour intervals
        unit: "hour",
        binSize: 3
      },
    };

    const config = timeConfig[timeframe];
    const collection = db.collection(config.collection);
    const startTime = new Date(now.getTime() - config.range);

    let chartData;

    // Simple query without aggregation
    if (!config.needsAggregation) {
      const historicalData = await collection
        .find({
          "metadata.vaultAddr": vault,
          timestamp: {
            $gte: startTime,
            $lte: now,
          },
        })
        .sort({ timestamp: 1 })
        .toArray();

      // Transform data from indexer schema to API output format
      chartData = historicalData.map((doc: any) => ({
        timestamp: doc.timestamp,
        totalNAV: doc.data?.totalNav || 0,
        balance: doc.data?.balance || "0",
        decimals: doc.data?.decimals || 0,
        // shareTokenSupply: parseFloat(doc.data?.balance || "0") / Math.pow(10, doc.data?.decimals || 6),
        // depositTokenPrice: doc.data?.totalNav && doc.data?.balance 
        //   ? (doc.data.totalNav * Math.pow(10, doc.data.decimals || 6)) / parseFloat(doc.data.balance || "1")
        //   : 0,
      }));
    } else {
      // Aggregation for 90D (3-hour intervals)
      const aggregatedData = await collection.aggregate([
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
            totalNav: { $last: "$data.totalNav" },
            balance: { $last: "$data.balance" },
            decimals: { $last: "$data.decimals" },
            
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
            totalNav: { $ifNull: ["$totalNav", 0] },
            balance: { $ifNull: ["$balance", "0"] },
            decimals: { $ifNull: ["$decimals", 6] },
            dataPointsInBucket: "$count",
          },
        },
      ]).toArray();

      // Transform aggregated data to API output format
      chartData = aggregatedData.map((doc: any) => ({
        timestamp: doc.timestamp,
        totalNAV: doc.totalNav || 0,
        balance: doc.balance || "0",
        decimals: doc.decimals || 0,
        // shareTokenSupply: parseFloat(doc.balance || "0") / Math.pow(10, doc.decimals || 6),
        // depositTokenPrice: doc.totalNav && doc.balance 
        //   ? (doc.totalNav * Math.pow(10, doc.decimals || 6)) / parseFloat(doc.balance || "1")
        //   : 0,
        dataPointsInBucket: doc.dataPointsInBucket,
      }));
    }

    return Response.json({
      vaultAddress: vault,
      timeframe,
      collection: config.collection,
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
  } finally {
    await mongodbClient.close();
  }
}