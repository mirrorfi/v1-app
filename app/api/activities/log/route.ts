import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Activity, { ActivityType } from "@/lib/database/models/activity";

/**
 * POST /api/activities/log
 * Logs a user activity
 * Body: {
 *   wallet: string,
 *   activity: ActivityType,
 *   vault?: string,
 *   token?: string,
 *   amount?: string,
 *   amountInUsd?: string,
 *   txHash: string,
 *   metadata?: Record<string, any>
 * }
 */
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { 
      wallet, 
      activity, 
      vault, 
      token, 
      amount, 
      amountInUsd, 
      txHash,
      metadata, 
      decimals,
    } = body;
    
    // Validate required fields
    if (!wallet || !activity || !txHash) {
      return NextResponse.json(
        { error: "Missing required fields: wallet, activity, and txHash are required" }, 
        { status: 400 }
      );
    }
    
    // Validate activity type
    const validActivityTypes: ActivityType[] = [
      'deposit', 
      'withdraw', 
      'swap', 
      'vault_create', 
      'strategy_execute',
      'strategy_create',
      'other'
    ];
    
    if (!validActivityTypes.includes(activity)) {
      return NextResponse.json(
        { error: `Invalid activity type. Must be one of: ${validActivityTypes.join(', ')}` }, 
        { status: 400 }
      );
    }
    
    // Check if activity with this txHash already exists (prevent duplicates)
    const existingActivity = await Activity.findOne({ txHash });
    if (existingActivity) {
      return NextResponse.json(
        { 
          success: true,
          message: "Activity already logged",
          activity: existingActivity,
          isDuplicate: true,
        }
      );
    }
    
    // Create new activity
    const newActivity = await Activity.create({
      wallet,
      activity,
      vault,
      token,
      amount,
      amountInUsd,
      txHash,
      timestamp: new Date(),
      metadata,
      decimals,
    });
    
    return NextResponse.json({ 
      success: true,
      message: "Activity logged successfully",
      activity: newActivity,
      isDuplicate: false,
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error logging activity:", error);
    return NextResponse.json(
      { error: "Failed to log activity" }, 
      { status: 500 }
    );
  }
}
