import { NextRequest } from "next/server";
import { MongoClient } from "mongodb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const vaultAddress = searchParams.get("vault");
  const timeframe = searchParams.get("timeframe") || "7D";
  
  if (!vaultAddress) {
    return new Response(JSON.stringify({ error: "Vault address not provided" }), { status: 400 });
  }

  if (!process.env.MONGODB_URI) {
    return new Response(JSON.stringify({ error: "MongoDB URI not configured" }), { status: 500 });
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME || "jarvis");
    const collection = db.collection(process.env.MONGODB_COLLECTION || "vault_data");

    // Calculate time range based on timeframe
    const now = new Date();
    const timeRanges: Record<string, number> = {
      "24H": 24 * 60 * 60 * 1000,      // 24 hours
      "7D": 7 * 24 * 60 * 60 * 1000,   // 7 days
      "30D": 30 * 24 * 60 * 60 * 1000, // 30 days
      "90D": 90 * 24 * 60 * 60 * 1000, // 90 days
    };

    const startTime = new Date(now.getTime() - timeRanges[timeframe]);

    // Query MongoDB for historical data
    const historicalData = await collection
      .find({
        "metadata.vaultAddress": vaultAddress,
        timestamp: {
          $gte: startTime,
          $lte: now,
        },
      })
      .sort({ timestamp: 1 })
      .toArray();

    // Transform data for chart consumption
    const chartData = historicalData.map((doc: any) => ({
      timestamp: doc.timestamp,
      totalNAV: doc.data?.totalNAV || doc.data?.nav || 0,
      shareTokenSupply: doc.data?.shareTokenSupply || doc.data?.sts || 0,
      depositTokenPrice: doc.data?.depositTokenPrice || doc.data?.dtp || 0,
    }));

    return Response.json({
      vaultAddress,
      timeframe,
      dataPoints: chartData.length,
      data: chartData,
    });

  } catch (error: any) {
    console.error("Failed to fetch historical vault data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch historical data" }), 
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}