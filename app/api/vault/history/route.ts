import { NextRequest } from "next/server";
import { connectToNeon } from "@/lib/neon";
import type { 
  VaultData5Minute, 
  VaultDataHourly, 
  ChartDataPoint, 
  VaultHistoryResponse 
} from "./types";

// ============================================
// Types
// ============================================

interface TimeConfig {
  range: number;
  table: "vault_data_5_minute" | "vault_data_hourly";
  needsAggregation: boolean;
  binSize?: string; // e.g., "3 hours" for TimescaleDB time_bucket
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
    const now = new Date();

    const sql = await connectToNeon();
    
    // Define time ranges and which table to use
    const timeConfig: Record<string, TimeConfig> = {
      "24H": { 
        range: 24 * 60 * 60 * 1000,      // 24 hours
        table: "vault_data_5_minute",
        needsAggregation: false           // Full resolution from 5-minute data
      },
      "7D": { 
        range: 7 * 24 * 60 * 60 * 1000,   // 7 days
        table: "vault_data_5_minute",
        needsAggregation: false           // Return all data (TTL is 7 days anyway)
      },
      "30D": { 
        range: 30 * 24 * 60 * 60 * 1000,  // 30 days
        table: "vault_data_hourly",
        needsAggregation: false           // Hourly data, no need to aggregate
      },
      "90D": { 
        range: 90 * 24 * 60 * 60 * 1000,  // 90 days
        table: "vault_data_hourly",
        needsAggregation: true,           // Aggregate to 3-hour intervals
        binSize: "3 hours"
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
      if (config.table === "vault_data_5_minute") {
        const result = await sql`
          SELECT timestamp, vault_addr, token_nav, usd_nav, user_deposits
          FROM vault_data_5_minute
          WHERE vault_addr = ${vault}
            AND timestamp >= ${startTime.toISOString()}
            AND timestamp <= ${now.toISOString()}
          ORDER BY timestamp ASC
        `;
        
        chartData = result.map((row: any) => ({
          timestamp: new Date(row.timestamp),
          tokenNav: Number(row.token_nav) || 0,
          usdNav: Number(row.usd_nav) || 0,
          userDeposits: Number(row.user_deposits) || 0,
        }));
      } else {
        // For hourly data, use the close values from OHLC
        const result = await sql`
          SELECT 
            timestamp, 
            vault_addr, 
            token_nav_close, 
            usd_nav_close, 
            user_deposits_close
          FROM vault_data_hourly
          WHERE vault_addr = ${vault}
            AND timestamp >= ${startTime.toISOString()}
            AND timestamp <= ${now.toISOString()}
          ORDER BY timestamp ASC
        `;
        
        chartData = result.map((row: any) => ({
          timestamp: new Date(row.timestamp),
          tokenNav: Number(row.token_nav_close) || 0,
          usdNav: Number(row.usd_nav_close) || 0,
          userDeposits: Number(row.user_deposits_close) || 0,
        }));
      }
    } else {
      // Aggregation for 90D (3-hour intervals using TimescaleDB time_bucket)
      const result = await sql`
        SELECT 
          time_bucket(${config.binSize}, timestamp) AS bucket,
          MAX(timestamp) AS timestamp,
          MAX(token_nav_close) AS token_nav,
          MAX(usd_nav_close) AS usd_nav,
          MAX(user_deposits_close) AS user_deposits,
          COUNT(*) AS data_points_in_bucket
        FROM vault_data_hourly
        WHERE vault_addr = ${vault}
          AND timestamp >= ${startTime.toISOString()}
          AND timestamp <= ${now.toISOString()}
        GROUP BY bucket
        ORDER BY bucket ASC
      `;

      // Transform aggregated data to API output format
      chartData = result.map((row: any) => ({
        timestamp: new Date(row.timestamp),
        tokenNav: Number(row.token_nav) || 0,
        usdNav: Number(row.usd_nav) || 0,
        userDeposits: Number(row.user_deposits) || 0,
        dataPointsInBucket: Number(row.data_points_in_bucket),
      }));
    }

    const response: VaultHistoryResponse = {
      vaultAddress: vault,
      timeframe,
      table: config.table,
      resolution: config.needsAggregation && config.binSize ? config.binSize : "native",
      dataPoints: chartData.length,
      data: chartData,
    };

    return Response.json(response);

  } catch (err) {
    console.error("[Vault History API Error]", err);

    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Failed to fetch historical data." }), 
      { status: 500 }
    );
  }
}