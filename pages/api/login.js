export default function handler(req, res) {
  const scope = 'user-read-private user-read-email';
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope,
    redirect_uri,
  });

  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  res.redirect(authUrl);
}
