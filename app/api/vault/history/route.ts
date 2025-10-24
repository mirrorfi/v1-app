import { mongodbClient } from "@/lib/utils/mongodb";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const vault = searchParams.get("vault");

  if (!vault) {
    return new Response(
      JSON.stringify({ error: "vault is required." }), 
      { status: 400 }
    );
  }
  const timeframe = searchParams.get("timeframe") || "7D";

  try {
    await mongodbClient.connect();
    const db = mongodbClient.db(process.env.MONGODB_DB_NAME || "jarvis");
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
        "metadata.vaultAddress": vault,
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
      vaultAddress: vault,
      timeframe,
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