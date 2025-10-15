// api/index.js
import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import axios from "axios";
import querystring from "querystring";

const app = express();
app.use(cors()); // 外部アクセスを許可

// Vercel Dashboard に登録した環境変数
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// ホームページ
app.get("/", (req, res) => {
  res.send(`
    <h2>Spotify OAuth サーバー稼働中</h2>
    <p><a href="/api/login">Spotifyにログイン</a></p>
  `);
});

// Spotify認証ページにリダイレクト
app.get("/api/login", (req, res) => {
  const scope = "user-read-private user-read-email";
  const authUrl = "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id: CLIENT_ID,
      scope,
      redirect_uri: REDIRECT_URI,
    });
  res.redirect(authUrl);
});

// Spotify コールバック処理
app.get("/api/callback", async (req, res) => {
  const code = req.query.code || null;
  if (!code) return res.status(400).send("❌ code がありません");

  try {
    const tokenRes = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // アクセストークンはサーバー側で保持するのが安全
    res.send(`
      <h2>✅ 認証成功！</h2>
      <p>アクセストークンはサーバーで安全に保持してください。</p>
    `);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(400).send("❌ 認証エラー");
  }
});

export default app;
export const handler = serverless(app);
