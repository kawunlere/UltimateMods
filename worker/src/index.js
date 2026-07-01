export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    const headers = { 
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Admin-Key",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") return new Response(null, { headers });

    if (pathname === "/admin/verify" && request.method === "POST") {
      const { password } = await request.json();
      if (password === env.ADMIN_PASSWORD) {
        const token = crypto.randomUUID();
        await env.MOD_KEYS.put(`SESSION_${token}`, "valid", { expirationTtl: 3600 });
        return new Response(JSON.stringify({ success: true, token }), { headers });
      }
      return new Response(JSON.stringify({ success: false, error: "Wrong password" }), { status: 401, headers });
    }

    if (pathname === "/config") {
      const config = await env.MOD_KEYS.get("APP_CONFIG");
      return new Response(config || JSON.stringify({
        apps: [], settings: {}, vip: { plans: [] }, keys: {}, featured: [], news: []
      }), { headers });
    }

    if (pathname.startsWith("/get-key/")) {
      const appName = decodeURIComponent(pathname.split("/")[2]);
      const configStr = await env.MOD_KEYS.get("APP_CONFIG");
      const config = configStr ? JSON.parse(configStr) : { keys: {} };
      const key = (config.keys && config.keys[appName]) || "No key set yet";
      return new Response(JSON.stringify({ key }), { headers });
    }

    if (pathname === "/admin/update" && request.method === "POST") {
      const token = request.headers.get("X-Admin-Key");
      const session = await env.MOD_KEYS.get(`SESSION_${token}`);
      if (!session) {
        return new Response(JSON.stringify({ error: "Session expired" }), { status: 401, headers });
      }
      const body = await request.text();
      await env.MOD_KEYS.put("APP_CONFIG", body);
      return new Response(JSON.stringify({ success: true }), { headers });
    }

    return new Response(JSON.stringify({ status: "Ultimate Mods API v2 Active ✅" }), { headers });
  }
};
