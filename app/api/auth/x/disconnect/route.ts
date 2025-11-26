import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/user';

/**
 * Disconnect X account
 * POST /api/auth/x/disconnect
 */
export async function POST(request: NextRequest) {
  try {
    const { wallet } = await request.json();

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Remove X profile from user
    const user = await User.findOneAndUpdate(
      { publicAddress: wallet },
      { $unset: { xProfile: "" } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'X account disconnected successfully'
    });
  } catch (error: any) {
    console.error('Error disconnecting X account:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect X account' },
      { status: 500 }
    );
  }
}
