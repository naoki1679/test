export default async function handler(req, res) {
  const code = req.query.code || null;

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

  // アクセストークンを取得
  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri,
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenData.access_token) {
    return res.status(400).json({ error: 'Failed to get access token', details: tokenData });
  }

  // Spotifyユーザー情報を取得
  const userResponse = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: 'Bearer ' + tokenData.access_token },
  });

  const userData = await userResponse.json();

  // 結果をJSONで返す
  res.status(200).json({
    message: 'ログイン成功！Spotifyユーザー情報:',
    user: userData,
  });
}
