import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Activity from "@/lib/database/models/activity";

/**
 * GET /api/activities/get-by-wallet?wallet=<address>&page=1&limit=20
 * Retrieves activities for a specific wallet with pagination
 */
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get("wallet");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    
    if (!wallet) {
      return NextResponse.json(
        { error: "Missing wallet parameter" }, 
        { status: 400 }
      );
    }
    
    const skip = (page - 1) * limit;
    
    const [activities, total] = await Promise.all([
      Activity.find({ wallet })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Activity.countDocuments({ wallet }),
    ]);
    
    return NextResponse.json({ 
      success: true,
      wallet,
      activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" }, 
      { status: 500 }
    );
  }
}
