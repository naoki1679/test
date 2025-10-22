"use client";

export default function HomePage() {
  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
    const scope = "user-read-private user-read-email";
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = authUrl;
  };

  return (
    <main style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Spotify Login Demo</h1>
      <button onClick={handleLogin} style={{ padding: "10px 20px", marginTop: "30px" }}>
        Login with Spotify
      </button>
    </main>
  );
}
