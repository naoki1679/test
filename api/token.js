export default async function handler(req, res) {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await tokenResponse.json();
  res.status(tokenResponse.ok ? 200 : 400).json(data);
}
