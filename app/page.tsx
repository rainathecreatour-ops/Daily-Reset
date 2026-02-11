"use client";

import { useEffect, useState } from "react";
import UserAudioUpload from "../components/UserAudioUpload";
import JournalWithEntries from "../components/JournalWithEntries";

const BUILT_IN = [
  { title: "Neon Twilight", src: "/audio/neon-twilight.mp3" },
  { title: "Money Overflow", src: "/audio/money-overflow.mp3" },
  { title: "Soft Motivation", src: "/audio/soft-motivation.mp3" },

  { title: "Calm Grounding", src: "/audio/calm-grounding.mp3" },
  { title: "LoFi Reset", src: "/audio/lofi-reset.mp3" },
  { title: "Afrobeat Reset", src: "/audio/afrobeat-reset.mp3" },

  { title: "Soul Reset", src: "/audio/soul-reset.mp3" },
  { title: "Classical Reset", src: "/audio/classical-reset.mp3" },
  { title: "Soft Rock Reset", src: "/audio/soft-rock-reset.mp3" },
];

const BG_KEY = "dailyreset_bg";

const BG_OPTIONS = [
  { name: "Soft White", value: "#f8fafc" },
  { name: "Warm Cream", value: "#fff7ed" },
  { name: "Pale Blush", value: "#fff1f2" },
  { name: "Light Lavender", value: "#f5f3ff" },
  { name: "Soft Mint", value: "#ecfdf5" },
  { name: "Cool Gray", value: "#f3f4f6" },
];

export default function Page() {
  const [bg, setBg] = useState<string>(BG_OPTIONS[0].value);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(BG_KEY);
      if (saved) setBg(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.body.style.background = bg;
    try {
      localStorage.setItem(BG_KEY, bg);
    } catch {}
  }, [bg]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm">
            <span className="font-semibold">Daily Reset</span>
            <span className="text-[var(--muted)]">Audio + Journal</span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Press play. Write one page.
          </h1>
          <p className="mt-2 max-w-2xl text-[var(--muted)]">
            Your entries and background preference save on this device.
          </p>
        </div>

        {/* Background picker */}
        <div className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold">Background</div>
          <select
            value={bg}
            onChange={(e) => setBg(e.target.value)}
            className="mt-2 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
          >
            {BG_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* 3 columns layout: audio (1 col) + journal (2 cols) */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Audio column */}
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Built-in audio</h2>

            {/* 9 tracks in a 3-column grid */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {BUILT_IN.map((t) => (
                <div
                  key={t.src}
                  className="rounded-xl border border-[var(--border)] p-4 bg-white"
                >
                  <div className="text-sm font-semibold">{t.title}</div>
                  <audio controls className="mt-2 w-full">
                    <source src={t.src} type="audio/mpeg" />
                  </audio>
                </div>
              ))}
            </div>
          </div>

          <UserAudioUpload />
        </div>

        {/* Journal column */}
        <div className="lg:col-span-2 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <JournalWithEntries />
        </div>
      </section>
    </main>
  );
}
