export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    const headers = { 
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Admin-Key",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") return new Response(null, { headers });

    // Get full app config
    if (pathname === "/config") {
      const config = await env.MOD_KEYS.get("APP_CONFIG");
      return new Response(config || '{"mods":[],"settings":{},"vip":{"plans":[]},"keys":{}}', { headers });
    }

    // Get key for a specific mod
    if (pathname.startsWith("/get-key/")) {
      const game = decodeURIComponent(pathname.split("/")[2]);
      const configStr = await env.MOD_KEYS.get("APP_CONFIG");
      const config = configStr ? JSON.parse(configStr) : { keys: {} };
      const key = (config.keys && config.keys[game]) || "No key set yet";
      return new Response(JSON.stringify({ key }), { headers });
    }

    // Admin update
    if (pathname === "/admin/update" && request.method === "POST") {
      const adminKey = request.headers.get("X-Admin-Key");
      if (adminKey !== env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers });
      }
      const body = await request.text();
      await env.MOD_KEYS.put("APP_CONFIG", body);
      return new Response(JSON.stringify({ success: true }), { headers });
    }

    return new Response(JSON.stringify({ status: "Ultimate Mods API Active ✅" }), { headers });
  }
};
