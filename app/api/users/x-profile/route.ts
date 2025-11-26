import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/user';

/**
 * Get X profile for a wallet
 * GET /api/users/x-profile?wallet=...
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ publicAddress: wallet });

    if (!user) {
      return NextResponse.json({ xProfile: null, customName: null, customProfileImage: null });
    }

    return NextResponse.json({ 
      xProfile: user.xProfile || null,
      customName: user.customName || null,
      customProfileImage: user.customProfileImage || null,
    });
  } catch (error: any) {
    console.error('Error fetching X profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch X profile' },
      { status: 500 }
    );
  }
}
