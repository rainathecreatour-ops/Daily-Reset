"use client";

import React, { useEffect, useState } from "react";

const LS_KEY = "dailyreset_user_audio";
const MAX_BYTES = 2_000_000; // ~2MB safe limit for localStorage

type Stored = {
  name: string;
  dataUrl: string;
};

export default function UserAudioUpload() {
  const [stored, setStored] = useState<Stored | null>(null);
  const [tempUrl, setTempUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Load saved audio (if any)
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as Stored;
      if (parsed?.dataUrl) setStored(parsed);
    } catch {
      // ignore
    }
  }, []);

  function onPick(file: File | null) {
    setMessage(null);
    if (!file) return;

    // Always allow immediate play (temporary URL)
    const url = URL.createObjectURL(file);
    setTempUrl(url);

    // Too big for localStorage → do not save
    if (file.size > MAX_BYTES) {
      setMessage(
        "Playing now ✅ (Too large to save. Keep under ~2MB to persist after refresh.)"
      );
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const dataUrl = String(reader.result || "");
        const next: Stored = { name: file.name, dataUrl };

        localStorage.setItem(LS_KEY, JSON.stringify(next));
        setStored(next);
        setMessage("Saved on this device ✅");
      } catch {
        setMessage("Could not save audio. Try a smaller file.");
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setLoading(false);
      setMessage("Could not read the file.");
    };

    reader.readAsDataURL(file);
  }

  function clear() {
    try {
      localStorage.removeItem(LS_KEY);
    } catch {}

    setStored(null);
    setTempUrl(null);
    setMessage("Cleared ✅");
  }

  // Prefer saved version, otherwise temporary
  const playSrc = stored?.dataUrl || tempUrl;

  return (
    <div className="mt-6 rounded-xl border border-[var(--border)] bg-white p-4">
      <div className="text-sm font-semibold">Upload your own MP3</div>
      <p className="mt-1 text-xs text-[var(--muted)]">
        Plays immediately. Saves only if under ~2MB (localStorage).
      </p>

     <div className="mt-3 flex flex-wrap items-center gap-3">
  <input
    id="user-audio"
    name="user-audio"
    type="file"
    accept="audio/*"
    onChange={(e) => onPick(e.target.files?.[0] || null)}
    className="w-full text-sm sm:w-auto"
  />

  <button
    type="button"
    onClick={clear}
    disabled={!stored}
    className="shrink-0 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs hover:bg-gray-50 disabled:opacity-50"
  >
    Clear
  </button>

  {loading && <span className="text-xs text-[var(--muted)]">Loading…</span>}
</div>

      {playSrc && (
        <div className="mt-4">
          <div className="text-xs text-[var(--muted)] mb-2">
            {stored ? `Saved: ${stored.name}` : "Temporary preview"}
          </div>
          <audio controls className="w-full">
            <source src={playSrc} type="audio/mpeg" />
          </audio>
        </div>
      )}

      {message && <div className="mt-2 text-xs">{message}</div>}
    </div>
  );
  className="shrink-0 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs hover:bg-gray-50 disabled:opacity-50"
}


