import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user";

/**
 * POST /api/users/add-user
 * Creates or updates a user when they connect their wallet
 * Body: { publicAddress: string }
 */
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { publicAddress } = await req.json();
    
    if (!publicAddress) {
      return NextResponse.json(
        { error: "Missing publicAddress in request body" }, 
        { status: 400 }
      );
    }
    
    // Try to find existing user
    let user = await User.findOne({ publicAddress });
    
    if (user) {
      // Update last connected time
      user.lastConnected = new Date();
      await user.save();
      
      return NextResponse.json({ 
        success: true,
        message: "User connection updated",
        user: {
          publicAddress: user.publicAddress,
          createdAt: user.createdAt,
          lastConnected: user.lastConnected,
        },
        isNewUser: false,
      });
    } else {
      // Create new user
      user = await User.create({ 
        publicAddress,
        createdAt: new Date(),
        lastConnected: new Date(),
      });
      
      return NextResponse.json({ 
        success: true,
        message: "New user created",
        user: {
          publicAddress: user.publicAddress,
          createdAt: user.createdAt,
          lastConnected: user.lastConnected,
        },
        isNewUser: true,
      }, { status: 201 });
    }
  } catch (error) {
    console.error("Error adding/updating user:", error);
    return NextResponse.json(
      { error: "Failed to add/update user" }, 
      { status: 500 }
    );
  }
}
