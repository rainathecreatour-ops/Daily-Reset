export default function Home() {
  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>
        Daily Reset
      </h1>

      <div style={{ marginBottom: 24 }}>
        <p style={{ fontWeight: 500 }}>Morning Reset</p>
        <audio controls style={{ width: "100%", marginTop: 8 }}>
          <source src="/audio/morning-reset.mp3" />
        </audio>
      </div>

      <div>
        <p style={{ fontWeight: 500 }}>Night Reset</p>
        <audio controls style={{ width: "100%", marginTop: 8 }}>
          <source src="/audio/night-reset.mp3" />
        </audio>
      </div>
    </main>
  );
}
