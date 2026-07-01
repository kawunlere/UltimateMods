export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname.startsWith("/get-key/")) {
      const game = pathname.split("/")[2];
      const key = await env.MOD_KEYS.get(game);
      return new Response(key || "No Key Found", { 
        headers: { "Access-Control-Allow-Origin": "*" } 
      });
    }

    return new Response("Ultimate Mods API Active ✅");
  }
};
