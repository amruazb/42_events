const FORTY_TWO_API_URL = "https://api.intra.42.fr/v2";

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}

export async function exchangeCodeForToken(code: string): Promise<TokenResponse> {
  console.log('Exchanging code for token:', { hasCode: !!code });
  
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    console.log('Token exchange response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token exchange error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = errorText;
      }
      
      throw new Error(errorDetails.details || 'Failed to exchange code for token');
    }

    const data = await response.json();
    console.log('Token exchange successful');
    return data;
  } catch (error) {
    console.error('Token exchange error:', error);
    throw error;
  }
}

export async function getUserInfo(accessToken: string) {
  console.log('Getting user info with token');
  
  try {
    const response = await fetch(`${FORTY_TWO_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Get user info error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error('Failed to get user info');
    }

    const data = await response.json();
    console.log('User info retrieved successfully');
    return data;
  } catch (error) {
    console.error('Get user info error:', error);
    throw error;
  }
} 