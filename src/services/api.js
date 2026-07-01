const API_URL = "https://ultimate-mods-api.kawunlere.workers.dev";

export const getConfig = async () => {
  try {
    const res = await fetch(`${API_URL}/config`);
    return await res.json();
  } catch (e) {
    return { mods: [], settings: {}, vip: {} };
  }
};

export const getKey = async (game) => {
  try {
    const res = await fetch(`${API_URL}/get-key/${game}`);
    const data = await res.json();
    return data.key;
  } catch (e) {
    return "Error fetching key";
  }
};

export const updateConfig = async (config, password) => {
  try {
    const res = await fetch(`${API_URL}/admin/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Admin-Key": password },
      body: JSON.stringify(config)
    });
    return res.ok;
  } catch (e) {
    return false;
  }
};
