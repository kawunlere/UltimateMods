const API_URL = "https://ultimate-mods-api.kawunlere.workers.dev";

export const getConfig = async () => {
  try {
    const res = await fetch(`${API_URL}/config`);
    return await res.json();
  } catch (e) {
    return { apps: [], settings: {}, vip: { plans: [] }, keys: {}, featured: [], news: [] };
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
    return res.ok;
  } catch (e) {
    return false;
  }
};
