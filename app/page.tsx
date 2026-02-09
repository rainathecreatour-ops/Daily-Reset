"use client";

import UserAudioUpload from "../components/UserAudioUpload";
import DailyPlanner from "../components/DailyPlanner";

const BUILT_IN = [
  { title: "Calm Start", src: "/audio/calm-start.mp3" },
  { title: "Gentle Focus", src: "/audio/gentle-focus.mp3" },
  { title: "Soft Motivation", src: "/audio/soft-motivation.mp3" },
];

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm">
          <span className="font-semibold">Daily Reset</span>
          <span className="text-[var(--muted)]">Audio + One Page</span>
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Start your day calmly.
        </h1>
        <p className="mt-2 max-w-2xl text-[var(--muted)]">
          Press play, write one page, and move forward with clarity.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Built-in audio</h2>

            <div className="mt-4 space-y-4">
              {BUILT_IN.map((t) => (
                <div
                  key={t.src}
                  className="rounded-xl border border-[var(--border)] p-4"
                >
                  <div className="text-sm font-medium">{t.title}</div>
                  <audio controls className="mt-2 w-full">
                    <source src={t.src} type="audio/mpeg" />
                  </audio>
                </div>
              ))}
            </div>
          </div>

          <UserAudioUpload />
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <DailyPlanner />
        </div>
      </section>
    </main>
  );
}
