import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "https://ultimate-mods-api.kawunlere.workers.dev";
const CACHE_KEY = "APP_CONFIG_CACHE";

export const getConfig = async () => {
  // 1. Return cached data instantly
  const cached = await AsyncStorage.getItem(CACHE_KEY);
  const cachedData = cached ? JSON.parse(cached) : null;

  // 2. Fetch fresh in background
  const fetchPromise = fetch(`${API_URL}/config`)
    .then(res => res.json())
    .then(async data => {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
      return data;
    })
    .catch(() => null);

  // If we have cache, return it immediately
  if (cachedData) {
    fetchPromise; // fire-and-forget refresh
    return cachedData;
  }

  // No cache = wait for network
  const fresh = await fetchPromise;
  return fresh || { apps: [], settings: {}, vip: { plans: [] }, keys: {}, featured: [], news: [], onboarding: [] };
};

export const getConfigFresh = async () => {
  try {
    const res = await fetch(`${API_URL}/config`);
    const data = await res.json();
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    return data;
  } catch (e) {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : { apps: [], settings: {}, vip: { plans: [] }, keys: {}, featured: [], news: [], onboarding: [] };
  }
};

export const getKey = async (appName) => {
  try {
    const res = await fetch(`${API_URL}/get-key/${encodeURIComponent(appName)}`);
    const data = await res.json();
    return data.key;
  } catch (e) {
    return "Error fetching key";
  }
};

export const verifyAdmin = async (password) => {
  try {
    const res = await fetch(`${API_URL}/admin/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    return data.success ? data.token : null;
  } catch (e) {
    return null;
  }
};

export const updateConfig = async (config, token) => {
  try {
    const res = await fetch(`${API_URL}/admin/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Admin-Key": token },
      body: JSON.stringify(config)
    });
    const data = await res.json();
    if (res.ok) {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(config));
    }
    return { ok: res.ok, message: data.error || (res.ok ? "Saved" : "Failed") };
  } catch (e) {
    return { ok: false, message: e.message || "Network error" };
  }
};

export const getReviews = async (appName) => {
  try {
    const res = await fetch(`${API_URL}/reviews/${encodeURIComponent(appName)}`);
    return await res.json();
  } catch (e) {
    return [];
  }
};

export const addReview = async (app, username, rating, comment) => {
  try {
    const res = await fetch(`${API_URL}/reviews/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app, username, rating, comment })
    });
    return res.ok;
  } catch (e) {
    return false;
  }
};
