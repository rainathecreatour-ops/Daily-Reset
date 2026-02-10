"use client";

import React, { useEffect, useMemo, useState } from "react";

type Entry = {
  id: string;
  createdAt: number; // unix ms
  text: string;
};

const LS_KEY = "dailyreset_journal_entries";

function formatDateTime(ts: number) {
  try {
    return new Date(ts).toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return String(ts);
  }
}

export default function JournalWithEntries() {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);

  // Load entries
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Entry[];
      if (Array.isArray(parsed)) setEntries(parsed);
    } catch {}
  }, []);

  // Save entries
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(entries));
    } catch {}
  }, [entries]);

  const nowLabel = useMemo(() => formatDateTime(Date.now()), []);

  function saveEntry() {
    const trimmed = text.trim();
    if (!trimmed) return;

    const next: Entry = {
      id: crypto?.randomUUID?.() ? crypto.randomUUID() : String(Date.now()),
      createdAt: Date.now(),
      text: trimmed,
    };

    setEntries((prev) => [next, ...prev]);
    setText("");
  }

  function deleteEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function clearAll() {
    setEntries([]);
    setText("");
    try {
      localStorage.removeItem(LS_KEY);
    } catch {}
  }

  return (
    <div>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Journal</h2>
          <p className="text-xs text-[var(--muted)] mt-1">
            {nowLabel} • Entries save on this device
          </p>
        </div>

        <button
          type="button"
          onClick={clearAll}
          className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs hover:bg-gray-50"
        >
          Clear all
        </button>
      </div>

      {/* Bigger writing area */}
      <div className="rounded-2xl border border-[var(--border)] p-5">
        <div className="text-sm font-semibold">New entry</div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write one page..."
          className="mt-3 w-full min-h-[260px] rounded-xl border border-[var(--border)] p-4 text-sm outline-none focus:ring-2 focus:ring-black/10"
        />

        <div className="mt-3 flex items-center justify-between">
          <div className="text-xs text-[var(--muted)]">
            Tip: press “Save entry” to lock it in.
          </div>

          <button
            type="button"
            onClick={saveEntry}
            className="rounded-xl bg-black px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
            disabled={!text.trim()}
          >
            Save entry
          </button>
        </div>
      </div>

      {/* Entry list */}
      <div className="mt-6 space-y-4">
        {entries.length === 0 ? (
          <div className="rounded-xl border border-[var(--border)] p-4 text-sm text-[var(--muted)]">
            No entries yet. Write your first one above.
          </div>
        ) : (
          entries.map((e) => (
            <div key={e.id} className="rounded-2xl border border-[var(--border)] p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="text-xs text-[var(--muted)]">
                  {formatDateTime(e.createdAt)}
                </div>

                <button
                  type="button"
                  onClick={() => deleteEntry(e.id)}
                  className="text-xs underline text-[var(--muted)] hover:text-black"
                >
                  Delete
                </button>
              </div>

              <div className="mt-3 whitespace-pre-wrap text-sm leading-6">
                {e.text}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
