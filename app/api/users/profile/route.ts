import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/user';

/**
 * Get complete user profile (X profile + custom profile data)
 * GET /api/users/profile?wallet=...
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

    console.log('[GET /api/users/profile] Fetching profile for wallet:', wallet.slice(0, 8) + '...');

    await connectToDatabase();

    // Use .lean() to get raw MongoDB data (bypass Mongoose schema)
    const user = await User.findOne({ publicAddress: wallet }).lean();

    if (!user) {
      console.log('[GET /api/users/profile] No user found, returning empty profile');
      return NextResponse.json({ 
        xProfile: null, 
        customName: null, 
        customProfileImage: null 
      });
    }

    console.log('[GET /api/users/profile] User found (raw MongoDB data):', {
      hasXProfile: !!user.xProfile,
      hasCustomName: !!user.customName,
      hasCustomImage: !!user.customProfileImage,
      customImageLength: user.customProfileImage?.length || 0,
      customName: user.customName
    });

    // Explicitly convert undefined to null for consistent API responses
    const response = {
      xProfile: user.xProfile || null,
      customName: user.customName || null,
      customProfileImage: user.customProfileImage || null,
    };

    console.log('[GET /api/users/profile] Returning:', {
      hasXProfile: !!response.xProfile,
      hasCustomName: !!response.customName,
      hasCustomImage: !!response.customProfileImage,
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('[GET /api/users/profile] Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
