import express from "express";
import serverless from "serverless-http";
import fetch from "node-fetch";

const app = express();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "https://<your-vercel-project>.vercel.app/api/callback"; // ← あなたのURLに変更

app.get("/", (req, res) => {
  res.send("✅ Spotify OAuth API 稼働中");
});

// Spotify認証ページへ
app.get("/login", (req, res) => {
  const scope = "user-read-private user-read-email";
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.search = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: scope,
    redirect_uri: REDIRECT_URI,
  });
  res.redirect(authUrl.toString());
});

// 認証後のコールバック
app.get("/callback", async (req, res) => {
  const code = req.query.code || null;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Authorization":
        "Basic " + Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code: code,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  const data = await response.json();

  if (data.access_token) {
    res.send(`<h2>🎉 ログイン成功！</h2><p>Access Token: ${data.access_token}</p>`);
  } else {
    res.send(`<h2>❌ ログイン失敗</h2><pre>${JSON.stringify(data, null, 2)}</pre>`);
  }
});

export default app;
export const handler = serverless(app);
