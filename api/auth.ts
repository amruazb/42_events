import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    console.error('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code) {
    console.error('No code provided in request body');
    return res.status(400).json({ error: 'Code is required' });
  }

  // Log environment variables (without exposing secrets)
  console.log('Environment check:', {
    hasClientId: !!process.env.VITE_FORTY_TWO_CLIENT_ID,
    hasClientSecret: !!process.env.VITE_FORTY_TWO_CLIENT_SECRET,
    redirectUri: 'https://42-events-iota.vercel.app/admin'
  });

  try {
    const tokenUrl = 'https://api.intra.42.fr/oauth/token';
    const requestBody = {
      grant_type: 'authorization_code',
      client_id: process.env.VITE_FORTY_TWO_CLIENT_ID,
      client_secret: process.env.VITE_FORTY_TWO_CLIENT_SECRET,
      code: code,
      redirect_uri: 'https://42-events-iota.vercel.app/admin'
    };

    console.log('Making request to 42 API:', {
      url: tokenUrl,
      hasCode: !!code,
      redirectUri: requestBody.redirect_uri,
      hasClientId: !!requestBody.client_id,
      hasClientSecret: !!requestBody.client_secret
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    console.log('42 API response status:', response.status);
    console.log('42 API response text:', responseText);

    if (!response.ok) {
      let errorDetails;
      try {
        errorDetails = JSON.parse(responseText);
      } catch {
        errorDetails = responseText;
      }
      
      console.error('42 API error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorDetails,
      });
      
      return res.status(response.status).json({ 
        error: 'Failed to exchange code for token',
        details: errorDetails
      });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      return res.status(500).json({ 
        error: 'Failed to parse response from 42 API',
        details: responseText
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Token exchange error:', error);
    return res.status(500).json({ 
      error: 'Failed to exchange code for token',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 