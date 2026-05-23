/**
 * agoraToken.ts
 *
 * Fetches an Agora RTC token from the backend.
 *
 * Your Flutter app works → your backend already generates tokens.
 * This calls the same backend with the channel_id to get a token.
 *
 * Endpoint tried (in order):
 *   POST /user_api/agora_token       { channel_id }
 *   POST /user_api/get_agora_token   { channel_id }
 *   POST /user_api/token             { channel_id }
 *
 * Response expected (any of):
 *   { token: "..." }
 *   { results: { token: "..." } }
 *   { data: { token: "..." } }
 */

const API_BASE_URL = "https://admin.astrogurujii.com";

function authHeaders() {
  const token = localStorage.getItem("token") ?? "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function extractToken(data: any): string | null {
  return (
    data?.token ??
    data?.results?.token ??
    data?.data?.token ??
    data?.agoraToken ??
    data?.rtc_token ??
    null
  );
}

const ENDPOINTS = [
  "/user_api/agora_token",
  "/user_api/get_agora_token",
  "/user_api/token",
];

export async function fetchAgoraToken(channelId: string): Promise<string | null> {
  for (const endpoint of ENDPOINTS) {
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ channel_id: channelId }),
      });

      if (!res.ok) continue;

      const data = await res.json();
      const token = extractToken(data);

      if (token) {
        console.log(`[Agora] Token fetched from ${endpoint}`);
        return token;
      }
    } catch {
      // try next endpoint
    }
  }

  console.warn("[Agora] No token endpoint found. Joining without token (will fail if App Certificate is enabled).");
  return null;
}