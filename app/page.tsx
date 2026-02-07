"use client";

import AudioPlayer, { type Track } from "@/components/AudioPlayer";
import DailyPlanner from "@/components/DailyPlanner";

const TRACKS: Track[] = [
  { id: "calm-start", title: "Calm Start", src: "/audio/calm-start.mp3", durationHint: "2–3 min" },
  { id: "gentle-focus", title: "Gentle Focus", src: "/audio/gentle-focus.mp3", durationHint: "2–3 min" },
  { id: "soft-motivation", title: "Soft Motivation", src: "/audio/soft-motivation.mp3", durationHint: "2–3 min" }
];

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm">
            <span className="font-semibold">Daily Reset</span>
            <span className="text-[var(--muted)]">Audio + One Page</span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Start your day calmly.</h1>
          <p className="mt-2 max-w-2xl text-[var(--muted)]">
            Press play, write one page, and move forward with clarity.
          </p>
        </div>

        <button
          onClick={async () => {
            await fetch("/api/logout", { method: "POST" });
            window.location.href = "/access";
          }}
          className="rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm hover:bg-gray-50"
        >
          Log out
        </button>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <AudioPlayer tracks={TRACKS} />
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <DailyPlanner />
        </div>
      </section>

      <footer className="mt-8 text-xs text-[var(--muted)]">
        Add your MP3 files into <span className="font-mono">/public/audio</span> named{" "}
        <span className="font-mono">calm-start.mp3</span>,{" "}
        <span className="font-mono">gentle-focus.mp3</span>,{" "}
        <span className="font-mono">soft-motivation.mp3</span>.
      </footer>
    </main>
  );
}
