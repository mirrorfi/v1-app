import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Activity from "@/lib/database/models/activity";

/**
 * GET /api/activities/get-by-vault?vault=<address>&page=1&limit=20
 * Retrieves activities for a specific vault with pagination
 */
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const vault = searchParams.get("vault");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    
    if (!vault) {
      return NextResponse.json(
        { error: "Missing vault parameter" }, 
        { status: 400 }
      );
    }
    
    const skip = (page - 1) * limit;
    
    const [activities, total] = await Promise.all([
      Activity.find({ vault })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Activity.countDocuments({ vault }),
    ]);
    
    return NextResponse.json({ 
      success: true,
      vault,
      activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error("Error fetching vault activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch vault activities" }, 
      { status: 500 }
    );
  }
}
