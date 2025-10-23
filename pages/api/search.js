export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Query is required' });

  try {
    // Vercel上では自分自身のドメインを明示
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const tokenRes = await fetch(`${baseUrl}/api/token`);
    const tokenData = await tokenRes.json();

    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(q)}`,
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      }
    );

    const searchData = await searchRes.json();
    res.status(200).json(searchData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Spotify search failed' });
  }
}
