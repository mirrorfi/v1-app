import { NextRequest, NextResponse } from 'next/server';

/**
 * Generate X OAuth URL
 * POST /api/auth/x/oauth-url
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

    // X OAuth 2.0 credentials (set these in your .env.local)
    const clientId = process.env.X_CLIENT_ID;
    const redirectUri = process.env.X_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/x/callback`;
    
    if (!clientId) {
      return NextResponse.json(
        { error: 'X OAuth is not configured. Please set X_CLIENT_ID in environment variables.' },
        { status: 500 }
      );
    }

    // Generate state parameter (contains wallet address)
    const state = Buffer.from(JSON.stringify({ wallet })).toString('base64');

    // Build OAuth URL
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'tweet.read users.read offline.access',
      state,
      code_challenge: 'challenge', // For PKCE flow (you should generate this properly)
      code_challenge_method: 'plain',
    });

    const authUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
    
    console.log('Generated OAuth URL:', authUrl);
    console.log('Redirect URI:', redirectUri);

    return NextResponse.json({ authUrl });
  } catch (error: any) {
    console.error('Error generating OAuth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate OAuth URL' },
      { status: 500 }
    );
  }
}
