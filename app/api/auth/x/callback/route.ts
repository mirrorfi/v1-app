import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/user';

/**
 * X OAuth Callback
 * GET /api/auth/x/callback?code=...&state=...
 */
export async function GET(request: NextRequest) {
  console.log('=== X OAuth Callback Started ===');
  console.log('Full callback URL:', request.url);
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    console.log('Received params:', { code: code?.slice(0, 10) + '...', state: state?.slice(0, 20) + '...', error });

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error from X:', error);
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Authentication Error</title>
          </head>
          <body>
            <script>
              window.opener.postMessage({ type: 'X_AUTH_ERROR', error: '${error}' }, '*');
              window.close();
            </script>
            <p>Authentication failed. You can close this window.</p>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    if (!code || !state) {
      console.error('Missing required params:', { code: !!code, state: !!state });
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
          <head><title>Error</title></head>
          <body>
            <p>Missing required parameters</p>
            <script>
              window.opener?.postMessage({ type: 'X_AUTH_ERROR', error: 'Missing parameters' }, '*');
              setTimeout(() => window.close(), 2000);
            </script>
          </body>
        </html>
      `, { headers: { 'Content-Type': 'text/html' } });
    }

    // Decode state to get wallet address
    console.log('Decoding state...');
    const { wallet } = JSON.parse(Buffer.from(state, 'base64').toString());
    console.log('Wallet from state:', wallet?.slice(0, 8) + '...');

    if (!wallet) {
      console.error('Invalid wallet in state');
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
          <head><title>Error</title></head>
          <body>
            <p>Invalid state parameter</p>
            <script>
              window.opener?.postMessage({ type: 'X_AUTH_ERROR', error: 'Invalid state' }, '*');
              setTimeout(() => window.close(), 2000);
            </script>
          </body>
        </html>
      `, { headers: { 'Content-Type': 'text/html' } });
    }

    // Exchange code for access token
    const clientId = process.env.X_CLIENT_ID;
    const clientSecret = process.env.X_CLIENT_SECRET;
    const redirectUri = process.env.X_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/x/callback`;

    console.log('OAuth config:', { 
      clientId: clientId?.slice(0, 10) + '...', 
      hasSecret: !!clientSecret,
      redirectUri 
    });

    if (!clientId || !clientSecret) {
      console.error('Missing OAuth credentials');
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
          <head><title>Configuration Error</title></head>
          <body>
            <p>X OAuth is not configured</p>
            <script>
              window.opener?.postMessage({ type: 'X_AUTH_ERROR', error: 'OAuth not configured' }, '*');
              setTimeout(() => window.close(), 2000);
            </script>
          </body>
        </html>
      `, { headers: { 'Content-Type': 'text/html' } });
    }

    // Get access token
    console.log('Exchanging code for token...');
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code_verifier: 'challenge', // Should match the code_challenge from oauth-url
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange failed:', { status: tokenResponse.status, error: errorData });
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
          <head><title>Authentication Error</title></head>
          <body>
            <p>Failed to exchange authorization code</p>
            <script>
              console.error('Token exchange failed:', ${JSON.stringify(errorData)});
              window.opener?.postMessage({ type: 'X_AUTH_ERROR', error: 'Token exchange failed' }, '*');
              setTimeout(() => window.close(), 2000);
            </script>
          </body>
        </html>
      `, { headers: { 'Content-Type': 'text/html' } });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    console.log('Got access token:', accessToken ? 'YES' : 'NO');

    // Get user profile from X
    console.log('Fetching X user profile...');
    const userResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,name,username', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.text();
      console.error('Failed to fetch user profile:', { status: userResponse.status, error: errorData });
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
          <head><title>Authentication Error</title></head>
          <body>
            <p>Failed to fetch user profile</p>
            <script>
              console.error('User profile fetch failed:', ${JSON.stringify(errorData)});
              window.opener?.postMessage({ type: 'X_AUTH_ERROR', error: 'Profile fetch failed' }, '*');
              setTimeout(() => window.close(), 2000);
            </script>
          </body>
        </html>
      `, { headers: { 'Content-Type': 'text/html' } });
    }

    const userData = await userResponse.json();
    const xUser = userData.data;
    console.log('Got X user:', xUser?.username);

    // Update user in database with X profile
    console.log('Connecting to database...');
    await connectToDatabase();
    
    console.log('Updating user in database...');
    const updatedUser = await User.findOneAndUpdate(
      { publicAddress: wallet },
      {
        xProfile: {
          username: xUser.username,
          name: xUser.name,
          profileImageUrl: xUser.profile_image_url,
          xId: xUser.id,
          connectedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );
    
    console.log('Database updated successfully for user:', updatedUser?.publicAddress?.slice(0, 8) + '...');
    console.log('=== X OAuth Callback Success ===');

    // Return success HTML that closes popup and notifies parent
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Successful</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(to bottom right, #1e293b, #0f172a);
              color: white;
            }
            .container {
              text-align: center;
              padding: 2rem;
            }
            .success-icon {
              width: 64px;
              height: 64px;
              margin: 0 auto 1rem;
              border-radius: 50%;
              background: #10b981;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 32px;
            }
            h1 { margin: 0 0 0.5rem; font-size: 1.5rem; }
            p { color: #94a3b8; margin: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success-icon">✓</div>
            <h1>Successfully Connected!</h1>
            <p>You can close this window now.</p>
          </div>
          <script>
            console.log('X Auth Success - Sending message to opener...');
            
            // Try multiple methods to communicate with parent
            const sendSuccess = () => {
              // Method 1: postMessage (preferred)
              if (window.opener) {
                window.opener.postMessage({ type: 'X_AUTH_SUCCESS' }, '*');
                console.log('✓ Message sent via postMessage');
              } else {
                console.error('✗ No window.opener available!');
              }
              
              // Method 2: Try localStorage as backup
              try {
                localStorage.setItem('x_auth_success', Date.now().toString());
                console.log('✓ Set localStorage flag');
              } catch (e) {
                console.error('✗ Failed to set localStorage:', e);
              }
              
              // Method 3: Try sessionStorage
              try {
                sessionStorage.setItem('x_auth_success', Date.now().toString());
                console.log('✓ Set sessionStorage flag');
              } catch (e) {
                console.error('✗ Failed to set sessionStorage:', e);
              }
            };
            
            sendSuccess();
            
            setTimeout(() => {
              console.log('Closing window in 1 second...');
              window.close();
            }, 1500);
          </script>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Error</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(to bottom right, #1e293b, #0f172a);
              color: white;
            }
            .container {
              text-align: center;
              padding: 2rem;
            }
            .error-icon {
              width: 64px;
              height: 64px;
              margin: 0 auto 1rem;
              border-radius: 50%;
              background: #ef4444;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 32px;
            }
            h1 { margin: 0 0 0.5rem; font-size: 1.5rem; }
            p { color: #94a3b8; margin: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error-icon">✕</div>
            <h1>Authentication Failed</h1>
            <p>Please try again later.</p>
          </div>
          <script>
            console.error('X Auth Error:', '${error.message}');
            if (window.opener) {
              window.opener.postMessage({ type: 'X_AUTH_ERROR', error: '${error.message}' }, '*');
            }
            setTimeout(() => window.close(), 2000);
          </script>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    });
  }
}
