"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { Track } from "@/components/AudioPlayer";

const LS_KEY = "dailyreset_user_track";

type Stored = { name: string; dataUrl: string };

export default function UserAudioUpload({
  onAddTrack
}: {
  onAddTrack: (t: Track) => void;
}) {
  const [stored, setStored] = useState<Stored | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Stored;
      setStored(parsed);
    } catch {}
  }, []);

  const track: Track | null = useMemo(() => {
    if (!stored) return null;
    return {
      id: "user-upload",
      title: `Your audio: ${stored.name}`,
      src: stored.dataUrl,
      durationHint: "your file"
    };
  }, [stored]);

  useEffect(() => {
    if (track) onAddTrack(track);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track?.src]);

  async function onPick(file: File | null) {
    if (!file) return;
    setLoading(true);

    // Read as base64 DataURL so it persists in localStorage
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      const next = { name: file.name, dataUrl };
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      setStored(next);
      setLoading(false);
    };
    reader.onerror = () => setLoading(false);
    reader.readAsDataURL(file);
  }

  function clear() {
    localStorage.removeItem(LS_KEY);
    setStored(null);
  }

  return (
    <div className="mt-4 rounded-xl border border-[var(--border)] bg-white p-4">
      <div className="text-sm font-semibold">Upload your own MP3</div>
      <p className="mt-1 text-xs text-[var(--muted)]">
        This stays on this device (localStorage). No server upload.
      </p>

      <div className="mt-3 flex items-center gap-3">
        <input
          id="user-audio"
          name="user-audio"
          type="file"
          accept="audio/*"
          onChange={(e) => onPick(e.target.files?.[0] || null)}
          className="text-sm"
        />
        <button
          type="button"
          onClick={clear}
          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs hover:bg-gray-50"
          disabled={!stored}
        >
          Clear
        </button>
        {loading && <span className="text-xs text-[var(--muted)]">Loading…</span>}
      </div>

      {stored && (
        <div className="mt-2 text-xs text-[var(--muted)]">
          Saved: <span className="font-mono">{stored.name}</span>
        </div>
      )}
    </div>
  );
}
