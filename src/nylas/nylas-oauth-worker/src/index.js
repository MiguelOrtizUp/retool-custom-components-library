export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Start the OAuth flow
    if (url.pathname === "/start-auth") {
      const provider = url.searchParams.get("provider");
      const email = url.searchParams.get("email") || "";

      if (!provider || !["google", "microsoft"].includes(provider)) {
        return new Response("Invalid or missing provider", { status: 400 });
      }

      // Build redirect_uri to callback route in this worker
      const redirectUri = new URL(request.url);
      redirectUri.pathname = "/oauth/callback";
      redirectUri.search = "";

      // Build query parameters for Nylas connect/auth endpoint
      const nylasAuthParams = new URLSearchParams({
        client_id: env.NYLAS_CLIENT_ID,
        redirect_uri: redirectUri.toString(),
        provider,
        login_hint: email,
        response_type: "code",
        scope: "openid https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.compose"
      });

      // Compose the full URL
      const nylasAuthUrl = `https://api.us.nylas.com/v3/connect/auth?${nylasAuthParams.toString()}`;

      // Redirect user to Nylas auth URL
      return Response.redirect(nylasAuthUrl, 302);
    }

    // 2. Handle callback and exchange code for token
    if (url.pathname === "/oauth/callback") {
      const code = url.searchParams.get("code");
      if (!code) {
        console.log("Missing code in callback");
        return new Response("Missing code", { status: 400 });
      }

      const tokenRes = await fetch("https://api.us.nylas.com/v3/connect/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: env.NYLAS_CLIENT_ID,
          client_secret: env.NYLAS_CLIENT_SECRET,
          code,
          grant_type: "authorization_code",
          redirect_uri: new URL(request.url).origin + "/oauth/callback",
        }),
      });

      if (!tokenRes.ok) {
        const errorText = await tokenRes.text();
        console.log("Token exchange failed:", errorText);
        return new Response(`Token exchange failed: ${errorText}`, { status: 500 });
      }

      const tokenData = await tokenRes.json();
      console.log("Token exchange success:", tokenData);
      const grantId = tokenData.grant_id || tokenData.access_token;
      const origin = new URL(request.url).origin;

      return new Response(
        `
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ grant_id: "${grantId}" }, "*"); // For debugging, use "*" to allow all origins
                setTimeout(() => window.close(), 100);
                window.close();
              } else {
                document.body.innerText = "No opener window found";
              }
            </script>
            <p>Authentication complete. You can close this window.</p>
          </body>
        </html>
        `,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    return new Response("Not found", { status: 404 });
  }
};
