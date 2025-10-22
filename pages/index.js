export default function Home() {
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#121212',
      color: 'white',
      fontFamily: 'sans-serif'
    }}>
      <h1>Spotify Login Demo</h1>
      <p>Spotifyアカウントでログインしてみましょう</p>
      <button
        onClick={handleLogin}
        style={{
          marginTop: '20px',
          backgroundColor: '#1DB954',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '25px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Spotifyでログイン
      </button>
    </div>
  );
}
