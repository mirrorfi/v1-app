import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/user';

/**
 * Update user profile (custom name and/or profile image)
 * POST /api/users/update-profile
 * Body: { wallet: string, customName?: string, customProfileImage?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet, customName, customProfileImage } = body;

    console.log('[POST /api/users/update-profile] Request received:', {
      wallet: wallet?.slice(0, 8) + '...',
      customName,
      hasCustomImage: !!customProfileImage,
      imageLength: customProfileImage?.length || 0
    });

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Validate custom name length
    if (customName && customName.length > 100) {
      console.error('[POST /api/users/update-profile] Name too long:', customName.length);
      return NextResponse.json(
        { error: 'Display name must be less than 100 characters' },
        { status: 400 }
      );
    }

    // Validate image is base64 and reasonable size (max ~7MB base64 = ~5MB file)
    if (customProfileImage && customProfileImage.length > 0) {
      if (!customProfileImage.startsWith('data:image/')) {
        console.error('[POST /api/users/update-profile] Invalid image format');
        return NextResponse.json(
          { error: 'Invalid image format' },
          { status: 400 }
        );
      }
      // Check base64 size (7MB limit for base64 string)
      if (customProfileImage.length > 7 * 1024 * 1024) {
        console.error('[POST /api/users/update-profile] Image too large:', customProfileImage.length);
        return NextResponse.json(
          { error: 'Image too large. Maximum size is 5MB' },
          { status: 400 }
        );
      }
    }

    await connectToDatabase();
    console.log('[POST /api/users/update-profile] Database connected');

    // Prepare update data with explicit $set
    const updateData: any = {};
    
    if (customName !== undefined) {
      updateData.customName = customName && customName.trim() ? customName.trim() : null;
      console.log('[POST /api/users/update-profile] Will set customName:', updateData.customName);
    }
    
    if (customProfileImage !== undefined) {
      updateData.customProfileImage = customProfileImage && customProfileImage.length > 0 ? customProfileImage : null;
      console.log('[POST /api/users/update-profile] Will set customProfileImage length:', updateData.customProfileImage?.length || 0);
    }

    // Use direct MongoDB update operation with $set (bypass Mongoose)
    const result = await User.collection.updateOne(
      { publicAddress: wallet },
      { $set: updateData },
      { upsert: true }
    );

    console.log('[POST /api/users/update-profile] MongoDB update result:', {
      matched: result.matchedCount,
      modified: result.modifiedCount,
      upserted: result.upsertedCount
    });

    // Fetch the updated user to confirm
    const savedUser = await User.findOne({ publicAddress: wallet }).lean();
    console.log('[POST /api/users/update-profile] User after update:', {
      id: savedUser?._id,
      customName: savedUser?.customName,
      hasCustomImage: !!savedUser?.customProfileImage,
      imageLength: savedUser?.customProfileImage?.length || 0
    });

    if (!savedUser) {
      console.error('[POST /api/users/update-profile] User not found after update!');
      return NextResponse.json(
        { error: 'Failed to verify user update' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      user: {
        customName: savedUser.customName || null,
        customProfileImage: savedUser.customProfileImage || null,
      }
    });
  } catch (error: any) {
    console.error('[POST /api/users/update-profile] Error updating profile:', error);
    console.error('[POST /api/users/update-profile] Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Failed to update profile: ' + error.message },
      { status: 500 }
    );
  }
}
