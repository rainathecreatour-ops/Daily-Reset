"use client";

import { useState } from "react";
import AudioPlayer, { type Track } from "@/components/AudioPlayer";
import UserAudioUpload from "@/components/UserAudioUpload";
import DailyPlanner from "@/components/DailyPlanner";

const DEFAULT_TRACKS: Track[] = [
  { id: "calm-start", title: "Calm Start", src: "/audio/calm-start.mp3", durationHint: "2–3 min" },
  { id: "gentle-focus", title: "Gentle Focus", src: "/audio/gentle-focus.mp3", durationHint: "2–3 min" },
  { id: "soft-motivation", title: "Soft Motivation", src: "/audio/soft-motivation.mp3", durationHint: "2–3 min" }
];

export default function Page() {
  const [tracks, setTracks] = useState<Track[]>(DEFAULT_TRACKS);

  const onAddTrack = (t: Track) => {
    setTracks((prev) => {
      const withoutSame = prev.filter((x) => x.id !== t.id);
      return [t, ...withoutSame];
    });
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <AudioPlayer tracks={tracks} />
          <UserAudioUpload onAddTrack={onAddTrack} />
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <DailyPlanner />
        </div>
      </section>
    </main>
  );
}
