import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query) return;
    const res = await fetch(`/api/search?q=${query}`);
    const data = await res.json();
    setResults(data.tracks?.items || []);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Spotify曲検索</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="曲名を入力"
        style={{ padding: '0.5rem', width: '300px' }}
      />
      <button onClick={handleSearch} style={{ marginLeft: '1rem', padding: '0.5rem' }}>
        検索
      </button>

      <ul style={{ marginTop: '2rem' }}>
        {results.map((track) => (
          <li key={track.id}>
            <img src={track.album.images[2]?.url} alt="" width={64} style={{ verticalAlign: 'middle' }} />
            <span style={{ marginLeft: '1rem' }}>
              {track.name} - {track.artists[0].name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
