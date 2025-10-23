import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  async function getAppToken() {
    const res = await fetch('/api/token');
    const data = await res.json();
    return data.access_token;
  }

  async function search() {
    const token = await getAppToken(); // ← ここでトークンを取得！
    const res = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setResults(data.tracks.items);
  }

  return (
    <div>
      <h1>Spotify 曲検索</h1>
      <input
        type="text"
        placeholder="曲名を入力"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={search}>検索</button>

      <ul>
        {results.map((track) => (
          <li key={track.id}>
            {track.name} — {track.artists.map((a) => a.name).join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}
