import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { page = 1, per_page = 30, sort = 'begin_at', filter } = req.query;
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    return res.status(401).json({ error: 'Access token is required' });
  }

  try {
    // Build the URL with query parameters
    const baseUrl = 'https://api.intra.42.fr/v2/events';
    const queryParams = new URLSearchParams({
      'page[number]': page.toString(),
      'page[size]': per_page.toString(),
      sort: sort.toString(),
      ...(filter && { filter: filter.toString() })
    });

    const url = `${baseUrl}?${queryParams.toString()}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('42 API error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = errorText;
      }
      
      return res.status(response.status).json({ 
        error: 'Failed to fetch events',
        details: errorDetails
      });
    }

    const data = await response.json();
    
    // Get pagination info from headers
    const total = response.headers.get('x-total');
    const totalPages = response.headers.get('x-total-pages');
    
    return res.status(200).json({
      events: data,
      pagination: {
        total: total ? parseInt(total) : null,
        totalPages: totalPages ? parseInt(totalPages) : null,
        currentPage: parseInt(page.toString()),
        perPage: parseInt(per_page.toString())
      }
    });
  } catch (error) {
    console.error('Events fetch error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch events',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 