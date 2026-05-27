import axios from "axios";

const API_BASE_URL = "https://admin.astrogurujii.com";

function authHeaders() {
  const token = localStorage.getItem("token") ?? "";
  return { Authorization: `Bearer ${token}` };
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type KundliData = {
  name: string;
  gender: string;
  yy: string;
  mm: string;
  dd: string;
  hh_time: string;
  mm_time: string;
  latitude: string;
  longitude: string;
  place: string;
};

export type CallInitiateResponse = {
  status: boolean;
  message: string;
  channel_id: string;
  fb_channel_id: string;
};

export type CallInitiateStatusResponse = {
  status: boolean;
  message: string;
  results: { status: string } | null;
};

export type LastCallData = {
  callType: string;        // "chat" | "audio"
  status: string;          // "accept_astro" | "pending" | etc
  channelId: string;       // API channel_id — used as gid for Firebase + polling
  fbChannelId: string;     // fb_channel_id
  astroId: string;
  astroName: string;
  astroProfileImg: string;
  callRate: string;
  userName: string;
  difference: number;      // elapsed seconds
};

export type LastCallListResponse = {
  result: boolean;
  message?: string;
  data2?: LastCallData;
};


export type GeocodeResult = { lat: string; lng: string };

// ─── Utilities ────────────────────────────────────────────────────────────────

/**
 * Mirrors Flutter Kundli.toString() — produces a raw JSON string, not a nested object.
 * '{"name":"Rahul","gender":"Male","yy":"1995","mm":"6","dd":"15",
 *   "hh_time":"10","mm_time":"30","latitude":"28.6","longitude":"77.2","place":"Delhi"}'
 */
export function buildKundliString(k: KundliData): string {
  return JSON.stringify({
    name: k.name, gender: k.gender, yy: k.yy, mm: k.mm, dd: k.dd,
    hh_time: k.hh_time, mm_time: k.mm_time,
    latitude: k.latitude, longitude: k.longitude, place: k.place,
  });
}

/**
 * Mirrors Flutter: userID + "_" + astrologer_id + "_" + millisecondsSinceEpoch
 */
export function generateChannelId(userId: string, astrologerId: string): string {
  return `${userId}_${astrologerId}_${Date.now()}`;
}

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * Mirrors Flutter HttpServices.call_initiate
 * reqBody = { astrologer_id, call_type, fb_channel_id, kundli }
 * kundli is a JSON STRING (Kundli.toString()), NOT a nested object.
 */
export async function call_initiate(payload: {
  astrologer_id: string;
  call_type: "chat" | "audio" | "video";
  fb_channel_id: string;
  kundli: string;
}): Promise<CallInitiateResponse> {
  const response = await axios.post(
    `${API_BASE_URL}/user_api/call_initiate`,
    payload,
    { headers: authHeaders() }
  );
  return response.data;
}

/**
 * Mirrors Flutter HttpServices.call_initiate_status — poll every 2s
 * reqBody = { channel_id }
 * Status: accept_astro | reject_astro | end_astro | end_user | disconnect_user
 */
export async function call_initiate_status(
  channel_id: string
): Promise<CallInitiateStatusResponse> {
  const response = await axios.post(
    `${API_BASE_URL}/user_api/call_initiate_status`,
    { channel_id },
    { headers: authHeaders() }
  );
  return response.data;
}

/**
 * Mirrors Flutter HttpServices.call_status_update
 * reqBody = { channel_id, status }
 * "disconnect_user" = cancelled while waiting | "end_user" = user ended chat
 */
export async function call_status_update(
  channel_id: string,
  status: "disconnect_user" | "end_user"
): Promise<{ status: boolean; message: string }> {
  const response = await axios.post(
    `${API_BASE_URL}/user_api/call_status_update`,
    { channel_id, status },
    { headers: authHeaders() }
  );
  return response.data;
}

/**
 * Mirrors Flutter HttpServices.add_rating
 */
export async function add_rating(
  channel_id: string, rating: string, review: string
): Promise<{ status: boolean; message: string }> {
  const response = await axios.post(
    `${API_BASE_URL}/user_api/add_rating`,
    { channel_id, rating, review },
    { headers: authHeaders() }
  );
  return response.data;
}

/**
 * Mirrors Flutter HttpServices.geocode — place name → lat/lng via backend
 * reqBody = { place }
 */
export async function geocode(place: string): Promise<GeocodeResult | null> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user_api/geocode`,
      { place },
      { headers: authHeaders() }
    );
    const data = response.data;
    if (data?.status === true && data?.results) {
      return {
        lat: String(data.results.lat ?? data.results.latitude ?? "0"),
        lng: String(data.results.lng ?? data.results.longitude ?? "0"),
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Mirrors Flutter HttpServices.profile_api — pre-fill intake form
 */
export async function profile_api(): Promise<any> {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/user_api/get_profile`,
      { headers: authHeaders() }
    );
    return response.data;
  } catch {
    return null;
  }
}

export async function lastCallList(): Promise<LastCallListResponse | null> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user_api/last_call_list`,
      {},
      { headers: authHeaders() }
    );
    return response.data;
  } catch {
    return null;
  }
}

// ─── Notification Types ───────────────────────────────────────────────────────

export type NotificationResult = {
  id: number;
  title: string;
  text: string;
  created_date: string;
};

export type NotificationsListResponse = {
  status: boolean;
  results?: NotificationResult[];
};

export type NotificationsDropResponse = {
  status: boolean;
  message?: string;
};

// ─── Notifications API ────────────────────────────────────────────────────────

/**
 * Mirrors Flutter HttpServices.notifications_list
 * GET /user_api/notifications_list
 */
export async function notifications_list(): Promise<NotificationsListResponse | null> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user_api/notifications_list`,
      {},
      { headers: authHeaders() }
    );
    return response.data;
  } catch {
    return null;
  }
}

/**
 * Mirrors Flutter HttpServices.notifications_drop
 * Deletes one notification (by id) or all (id = "")
 * POST /user_api/notifications_drop  { id }
 */
export async function notifications_drop(
  id: string
): Promise<NotificationsDropResponse | null> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user_api/notifications_drop`,
      { id },
      { headers: authHeaders() }
    );
    return response.data;
  } catch {
    return null;
  }
}