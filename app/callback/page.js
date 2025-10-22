"use client";

import { useEffect, useState } from "react";

export default function CallbackPage() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) return;

    // サーバー側を使わずにトークン交換（RenderではHTTPS通信OK）
    fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          btoa(
            process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID +
              ":" +
              process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET
          ),
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
      }),
    })
      .then((res) => res.json())
      .then((data) => setToken(data.access_token))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Spotify Callback</h1>
      {token ? (
        <p>Access Token: {token}</p>
      ) : (
        <p>Loading or error retrieving token...</p>
      )}
    </main>
  );
}
