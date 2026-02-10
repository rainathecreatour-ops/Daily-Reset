"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Entry = {
  id: string;
  createdAt: number; // timestamp (ms)
  updatedAt: number; // timestamp (ms)
  text: string;
};

const LS_ENTRIES = "dailyreset_entries_v2";
const LS_DRAFT = "dailyreset_draft_v2";

function formatDateTime(ms: number) {
  const d = new Date(ms);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function makeId(ts: number) {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : String(ts);
}

export default function JournalWithEntries() {
  const [now, setNow] = useState(() => Date.now());
  const [entries, setEntries] = useState<Entry[]>([]);
  const [text, setText] = useState("");

  // which saved entry is currently open in the editor (or null = draft/new)
  const [activeId, setActiveId] = useState<string | null>(null);

  // debounce timer
  const saveTimer = useRef<number | null>(null);

  // live clock (update every minute)
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  // load entries + draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_ENTRIES);
      if (raw) {
        const parsed = JSON.parse(raw) as Entry[];
        if (Array.isArray(parsed)) setEntries(parsed);
      }
    } catch {}

    try {
      const draft = localStorage.getItem(LS_DRAFT);
      if (draft) setText(draft);
    } catch {}
  }, []);

  // persist entries
  useEffect(() => {
    try {
      localStorage.setItem(LS_ENTRIES, JSON.stringify(entries));
    } catch {}
  }, [entries]);

  // autosave draft + autosave into active entry (debounced)
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (saveTimer.current) window.clearTimeout(saveTimer.current);

    saveTimer.current = window.setTimeout(() => {
      try {
        // always save draft (so they never lose writing)
        localStorage.setItem(LS_DRAFT, text);
      } catch {}

      const trimmed = text.trim();
      if (trimmed.length === 0) return;

      const ts = Date.now();

      // If editing an existing entry, update it
      if (activeId) {
        setEntries((prev) =>
          prev.map((e) =>
            e.id === activeId ? { ...e, text: trimmed, updatedAt: ts } : e
          )
        );
        return;
      }

      // If not editing an entry, create a new entry ONCE (then continue editing it)
      const id = makeId(ts);
      const entry: Entry = { id, createdAt: ts, updatedAt: ts, text: trimmed };
      setEntries((prev) => [entry, ...prev]);
      setActiveId(id);
    }, 400);

    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [text, activeId]);

  const sorted = useMemo(() => {
    return [...entries].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [entries]);

  function newEntry() {
    setActiveId(null);
    setText("");
    try {
      localStorage.removeItem(LS_DRAFT);
    } catch {}
  }

  function openEntry(id: string) {
    const e = entries.find((x) => x.id === id);
    if (!e) return;
    setActiveId(id);
    setText(e.text);
  }

  function deleteEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (activeId === id) {
      setActiveId(null);
      setText("");
      try {
        localStorage.removeItem(LS_DRAFT);
      } catch {}
    }
  }

  const headerLabel = useMemo(() => {
    if (!activeId) return "New entry (auto-saves)";
    const e = entries.find((x) => x.id === activeId);
    if (!e) return "Editing (auto-saves)";
    return `Editing • Started ${formatDateTime(e.createdAt)} • Updated ${formatDateTime(
      e.updatedAt
    )}`;
  }, [activeId, entries]);

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">One Page Journal</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{formatDateTime(now)}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">{headerLabel}</p>
        </div>

        <button
          type="button"
          onClick={newEntry}
          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs hover:bg-gray-50"
        >
          New
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start writing here… (auto-saves as you type)"
        className="mt-4 w-full min-h-[260px] rounded-xl border border-[var(--border)] p-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
      />

      <div className="mt-4">
        <div className="text-sm font-semibold">Saved entries</div>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Click an entry to open it. Everything auto-saves.
        </p>

        {sorted.length === 0 ? (
          <div className="mt-3 text-sm text-[var(--muted)]">No entries yet.</div>
        ) : (
          <div className="mt-3 space-y-2">
            {sorted.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-white p-3"
              >
                <button
                  type="button"
                  onClick={() => openEntry(e.id)}
                  className="text-left"
                >
                  <div className="text-xs text-[var(--muted)]">
                    {formatDateTime(e.updatedAt)}
                  </div>
                  <div className="mt-1 line-clamp-2 text-sm">{e.text}</div>
                </button>

                <button
                  type="button"
                  onClick={() => deleteEntry(e.id)}
                  className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs hover:bg-gray-50"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
