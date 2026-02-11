"use client";

import { useEffect, useState } from "react";
import UserAudioUpload from "../components/UserAudioUpload";
import JournalWithEntries from "../components/JournalWithEntries";

const BUILT_IN = [
  { title: "Calm Start", src: "/audio/calm-start.mp3" },
  { title: "Gentle Focus", src: "/audio/gentle-focus.mp3" },
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

      </header>

      {/* Make Journal bigger: 3 columns, Journal spans 2 */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Audio column (1/3) */}
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

        {/* Journal column (2/3) */}
        <div className="lg:col-span-2 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <JournalWithEntries />
        </div>
      </section>
    </main>
  );
}
