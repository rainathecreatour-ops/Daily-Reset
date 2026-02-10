"use client";

import React, { useEffect, useMemo, useState } from "react";

type Entry = {
  id: string;
  text: string;
  createdAt: number; // Date.now()
};

const LS_KEY = "dailyreset_journal_entries";

function formatDateTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function JournalWithEntries() {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [now, setNow] = useState(Date.now());

  // Live clock (updates time display)
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000); // every 30s
    return () => clearInterval(t);
  }, []);

  // Load saved entries
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Entry[];
      if (Array.isArray(parsed)) setEntries(parsed);
    } catch {
      // ignore
    }
  }, []);

  // Persist entries
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(entries));
    } catch {
      // storage full or blocked
    }
  }, [entries]);

  const headerDate = useMemo(() => formatDateTime(now), [now]);

  function addEntry() {
    const trimmed = text.trim();
    if (!trimmed) return;

    const e: Entry = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      text: trimmed,
      createdAt: Date.now(),
    };

    setEntries((prev) => [e, ...prev]);
    setText("");
  }

  function deleteEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function clearAll() {
    setEntries([]);
    try {
      localStorage.removeItem(LS_KEY);
    } catch {}
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Journal</h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {headerDate} • Entries save on this device
          </p>
        </div>

        <button
          type="button"
          onClick={clearAll}
          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs hover:bg-gray-50"
          disabled={entries.length === 0}
        >
          Clear all
        </button>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-white p-4">
        <label htmlFor="journalText" className="text-sm font-medium">
          New entry
        </label>

        <textarea
          id="journalText"
          name="journalText"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write one page…"
          className="mt-2 h-40 w-full resize-none rounded-xl border border-[var(--border)] px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5"
        />

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="text-xs text-[var(--muted)]">
            Tip: press “Save entry” to lock it in.
          </div>

          <button
            type="button"
            onClick={addEntry}
            className="rounded-xl border border-[var(--border)] bg-black px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60"
            disabled={!text.trim()}
          >
            Save entry
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {entries.length === 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-white p-4 text-sm text-[var(--muted)]">
            No entries yet. Write your first one above.
          </div>
        ) : (
          entries.map((e) => (
            <div
              key={e.id}
              className="rounded-xl border border-[var(--border)] bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-xs text-[var(--muted)]">
                  {formatDateTime(e.createdAt)}
                </div>
                <button
                  type="button"
                  onClick={() => deleteEntry(e.id)}
                  className="text-xs underline opacity-70 hover:opacity-100"
                >
                  Delete
                </button>
              </div>

              <div className="mt-2 whitespace-pre-wrap text-sm">{e.text}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
