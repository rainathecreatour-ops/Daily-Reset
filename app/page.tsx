import DailyPlanner from "@/components/DailyPlanner";
"use client";

import React, { useMemo, useState } from "react";
import AudioPlayer, { type Track } from "@/components/AudioPlayer";
import DailyPlanner from "@/components/DailyPlanner";
import UserAudioUpload from "@/components/UserAudioUpload";

const DEFAULT_TRACKS: Track[] = [
  { id: "calm-start", title: "Calm Start", src: "/audio/calm-start.mp3", durationHint: "2–3 min" },
  { id: "gentle-focus", title: "Gentle Focus", src: "/audio/gentle-focus.mp3", durationHint: "2–3 min" },
  { id: "soft-motivation", title: "Soft Motivation", src: "/audio/soft-motivation.mp3", durationHint: "2–3 min" }
];

export default function Page() {
  const [userTrack, setUserTrack] = useState<Track | null>(null);

  const tracks = useMemo(() => {
    return userTrack ? [userTrack, ...DEFAULT_TRACKS] : DEFAULT_TRACKS;
  }, [userTrack]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      {/* ...keep your existing header exactly the same... */}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <AudioPlayer tracks={tracks} />
          <UserAudioUpload onAddTrack={(t) => setUserTrack(t)} />
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <DailyPlanner />
        </div>
      </section>
    </main>
  );
}


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
