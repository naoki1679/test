import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import axios from "axios";
import querystring from "querystring";

const app = express();
app.use(cors());

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI; // Vercel環境変数に登録

// 🎧 認証開始エンドポイント
app.get("/login", (req, res) => {
  const scope = "user-read-private user-read-email";
  const authUrl =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id,
      scope,
      redirect_uri,
    });

  res.redirect(authUrl);
});

// 🎯 コールバック
app.get("/callback", async (req, res) => {
  const code = req.query.code || null;

  try {
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri,
      }),
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(client_id + ":" + client_secret).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = tokenResponse.data;

    res.send(`<h2>✅ Spotify 認証成功！</h2>
              <p>Access Token: ${access_token}</p>`);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(400).send("❌ 認証エラー");
  }
});

export default app;
export const handler = serverless(app);
