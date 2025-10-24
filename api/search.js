export default async function handler(req, res) {
  const { q, limit = 20 } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Missing 'q' parameter" });
  }

  try {
    // 🔑 Spotify APIのトークンを取得
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;

    // 🎵 Spotifyで曲検索
    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const searchData = await searchRes.json();
    res.status(200).json(searchData);

  } catch (err) {
    console.error("Spotify API Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
