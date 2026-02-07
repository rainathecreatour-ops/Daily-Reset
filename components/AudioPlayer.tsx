"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export type Track = {
  id: string;
  title: string;
  src: string;
  durationHint?: string;
};

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function AudioPlayer({ tracks }: { tracks: Track[] }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [selectedId, setSelectedId] = useState(tracks[0]?.id ?? "");
  const selected = useMemo(
    () => tracks.find((t) => t.id === selectedId) ?? tracks[0],
    [tracks, selectedId]
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const a = audioRef.current;
    if (!a || !selected) return;

    setError(null);
    setIsPlaying(false);
    setCurrent(0);
    setDuration(0);

    a.pause();
    a.src = selected.src;
    a.load();
    a.volume = volume;

    const onLoaded = () => setDuration(a.duration || 0);
    const onTime = () => setCurrent(a.currentTime || 0);
    const onEnded = () => setIsPlaying(false);
    const onErr = () => {
      setIsPlaying(false);
      setError("Audio not found. Add MP3s to /public/audio with the expected filenames.");
    };

    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnded);
    a.addEventListener("error", onErr);

    return () => {
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("error", onErr);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.src]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = volume;
  }, [volume]);

  async function togglePlay() {
    const a = audioRef.current;
    if (!a) return;

    try {
      if (isPlaying) {
        a.pause();
        setIsPlaying(false);
      } else {
        await a.play();
        setIsPlaying(true);
      }
    } catch {
      setIsPlaying(false);
      setError("Playback failed. Try clicking Play again.");
    }
  }

  function stop() {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
    setIsPlaying(false);
    setCurrent(0);
  }

  function seek(next: number) {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = next;
    setCurrent(next);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-semibold">Audio Companion</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Pick a track and press play. No autoplay — you’re in control.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium">Today’s Audio</label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black/5"
        >
          {tracks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title} {t.durationHint ? `• ${t.durationHint}` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-semibold">{selected?.title ?? "Track"}</p>
            <p className="text-xs text-[var(--muted)]">
              {formatTime(current)} / {formatTime(duration)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="rounded-xl border border-[var(--border)] bg-white px-4 py-2 hover:bg-gray-50"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button
              onClick={stop}
              className="rounded-xl border border-[var(--border)] bg-white px-4 py-2 hover:bg-gray-50"
            >
              Stop
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="w-14 text-xs text-[var(--muted)]">Seek</span>
            <input
              type="range"
              min={0}
              max={Math.max(duration, 1)}
              step={0.1}
              value={Math.min(current, duration || 0)}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="w-14 text-xs text-[var(--muted)]">Volume</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>

      <audio ref={audioRef} preload="metadata" />
    </div>
  );
}
