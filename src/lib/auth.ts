const FORTY_TWO_TOKEN_URL = "https://api.intra.42.fr/oauth/token";
const CLIENT_ID = import.meta.env.VITE_FORTY_TWO_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_FORTY_TWO_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_FORTY_TWO_REDIRECT_URI;

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}

export async function exchangeCodeForToken(code: string): Promise<TokenResponse> {
  const response = await fetch(FORTY_TWO_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange code for token");
  }

  return response.json();
}

export async function getUserInfo(accessToken: string) {
  const response = await fetch("https://api.intra.42.fr/v2/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get user info");
  }

  return response.json();
} 