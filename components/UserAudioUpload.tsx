"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { Track } from "./AudioPlayer";

const LS_KEY = "dailyreset_user_track";
const MAX_BYTES = 2_000_000; // ~2MB safe limit for localStorage

type Stored = {
  name: string;
  dataUrl: string;
};

export default function UserAudioUpload({
  onAddTrack,
}: {
  onAddTrack: (t: Track) => void;
}) {
  const [stored, setStored] = useState<Stored | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Load saved audio on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as Stored;
      if (parsed?.dataUrl) setStored(parsed);
    } catch {
      // ignore bad data
    }
  }, []);

  // Convert stored audio to Track
  const track: Track | null = useMemo(() => {
    if (!stored) return null;

    return {
      id: "user-upload",
      title: `Your audio: ${stored.name}`,
      src: stored.dataUrl,
      durationHint: "your file",
    };
  }, [stored]);

  // Send track to parent when it changes
  useEffect(() => {
    if (track) onAddTrack(track);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track?.src]);

  function onPick(file: File | null) {
    setMessage(null);
    if (!file) return;

    // Too big for localStorage → play only (temporary)
    if (file.size > MAX_BYTES) {
      setMessage(
        "File too large to save. It will play now but won’t persist after refresh."
      );

      const tempUrl = URL.createObjectURL(file);
      onAddTrack({
        id: "user-upload-temp",
        title: `Your audio (temp): ${file.name}`,
        src: tempUrl,
        durationHint: "temp",
      });
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
    setMessage("Cleared ✅");
  }

  return (
    <div className="mt-4 rounded-xl border border-[var(--border)] bg-white p-4">
      <div className="text-sm font-semibold">Upload your own MP3</div>
      <p className="mt-1 text-xs text-[var(--muted)]">
        Saved locally on this device (under ~2MB).
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
          disabled={!stored}
          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs hover:bg-gray-50 disabled:opacity-50"
        >
          Clear
        </button>

        {loading && (
          <span className="text-xs text-[var(--muted)]">Loading…</span>
        )}
      </div>

      {stored && (
        <div className="mt-2 text-xs text-[var(--muted)]">
          Saved: <span className="font-mono">{stored.name}</span>
        </div>
      )}

      {message && <div className="mt-2 text-xs">{message}</div>}
    </div>
  );
}
