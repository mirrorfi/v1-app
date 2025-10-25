import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user";

/**
 * GET /api/users/get-user?publicAddress=<wallet_address>
 * Retrieves a user by their wallet address
 */
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const publicAddress = searchParams.get("publicAddress");
    
    if (!publicAddress) {
      return NextResponse.json(
        { error: "Missing publicAddress parameter" }, 
        { status: 400 }
      );
    }
    
    const user = await User.findOne({ publicAddress });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      user: {
        publicAddress: user.publicAddress,
        createdAt: user.createdAt,
        lastConnected: user.lastConnected,
      }
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" }, 
      { status: 500 }
    );
  }
}
