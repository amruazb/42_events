import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  // Log environment variables (without exposing secrets)
  console.log('Environment check:', {
    hasClientId: !!process.env.VITE_FORTY_TWO_CLIENT_ID,
    hasClientSecret: !!process.env.VITE_FORTY_TWO_CLIENT_SECRET,
  });

  try {
    const tokenUrl = 'https://api.intra.42.fr/oauth/token';
    const requestBody = {
      grant_type: 'authorization_code',
      client_id: process.env.VITE_FORTY_TWO_CLIENT_ID,
      client_secret: process.env.VITE_FORTY_TWO_CLIENT_SECRET,
      code: code,
      redirect_uri: 'https://42-events-iota.vercel.app/admin',
      scope: 'public events'
    };

    console.log('Making request to 42 API:', {
      url: tokenUrl,
      hasCode: !!code,
      redirectUri: requestBody.redirect_uri,
      scope: requestBody.scope
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('42 API error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      
      // Try to parse the error response as JSON
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = errorText;
      }
      
      return res.status(response.status).json({ 
        error: 'Failed to exchange code for token',
        details: errorDetails
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Token exchange error:', error);
    return res.status(500).json({ 
      error: 'Failed to exchange code for token',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 