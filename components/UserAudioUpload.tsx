"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { Track } from "@/components/AudioPlayer";

const LS_KEY = "dailyreset_user_track";
const MAX_BYTES = 2_000_000; // ~2MB (safe-ish for localStorage after base64)

type Stored = { name: string; dataUrl: string };

export default function UserAudioUpload({
  onAddTrack
}: {
  onAddTrack: (t: Track) => void;
}) {
  const [stored, setStored] = useState<Stored | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Stored;
      if (parsed?.dataUrl) setStored(parsed);
    } catch {
      // ignore
    }
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
    setMsg(null);
    if (!file) return;

    // hard limit for localStorage
    if (file.size > MAX_BYTES) {
      setMsg(
        `That file is too big to save in localStorage. Keep it under ~2MB, or use the “server upload” option later.`
      );

      // Fallback: still let them PLAY it (not persistent)
      const tempUrl = URL.createObjectURL(file);
      onAddTrack({
        id: "user-upload-temp",
        title: `Your audio (temp): ${file.name}`,
        src: tempUrl,
        durationHint: "temp"
      });
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const dataUrl = String(reader.result || "");
        const next = { name: file.name, dataUrl };

        localStorage.setItem(LS_KEY, JSON.stringify(next)); // can throw
        setStored(next);
        setMsg("Saved on this device ✅");
      } catch (e) {
        setMsg("Could not save (storage limit). Try a smaller MP3 under ~2MB.");
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setLoading(false);
      setMsg("Could not read that file. Try another MP3.");
    };

    reader.readAsDataURL(file);
  }

  function clear() {
    try {
      localStorage.removeItem(LS_KEY);
    } catch {}
    setStored(null);
    setMsg("Cleared ✅");
  }

  return (
    <div className="mt-4 rounded-xl border border-[var(--border)] bg-white p-4">
      <div className="text-sm font-semibold">Upload your own MP3</div>
      <p className="mt-1 text-xs text-[var(--muted)]">
        Saves only if under ~2MB (localStorage). Bigger files will still play, but won’t save.
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

      {msg && <div className="mt-2 text-xs">{msg}</div>}
    </div>
  );
}
