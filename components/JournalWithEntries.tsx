"use client";

import React, { useEffect, useMemo, useState } from "react";

type Entry = {
  id: string;
  text: string;
  createdAt: number;
  updatedAt?: number;
};

type Pattern = "none" | "dots" | "grid" | "stars";

type Settings = {
  bgColor: string;
  pattern: Pattern;
};

const ENTRIES_KEY = "dailyreset_entries_v2";
const SETTINGS_KEY = "dailyreset_journal_settings_v2";

const BG_COLORS = [
  { name: "Soft White", value: "#ffffff" },
  { name: "Warm Cream", value: "#fff7ed" },
  { name: "Pale Blush", value: "#fff1f2" },
  { name: "Light Lavender", value: "#f5f3ff" },
  { name: "Soft Mint", value: "#ecfdf5" },
  { name: "Cool Gray", value: "#f3f4f6" },
  { name: "Sky", value: "#eff6ff" },
  { name: "Sand", value: "#faf7f2" },
];

const PATTERNS: { label: string; value: Pattern }[] = [
  { label: "None", value: "none" },
  { label: "Dots", value: "dots" },
  { label: "Grid", value: "grid" },
  { label: "Stars", value: "stars" },
];

function formatDateTime(ms: number) {
  return new Date(ms).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function cardBackground(bgColor: string, pattern: Pattern): React.CSSProperties {
  const base: React.CSSProperties = { backgroundColor: bgColor };

  if (pattern === "none") return base;

  if (pattern === "dots") {
    return {
      ...base,
      backgroundImage:
        "radial-gradient(rgba(0,0,0,0.12) 1px, transparent 1px)",
      backgroundSize: "18px 18px",
    };
  }

  if (pattern === "grid") {
    return {
      ...base,
      backgroundImage:
        "linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)",
      backgroundSize: "22px 22px",
    };
  }

  // stars
  return {
    ...base,
    backgroundImage:
      "radial-gradient(rgba(0,0,0,0.18) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.10) 1px, transparent 1px)",
    backgroundSize: "28px 28px, 44px 44px",
    backgroundPosition: "0 0, 14px 18px",
  };
}

export default function JournalWithEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [draft, setDraft] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");

  const [settings, setSettings] = useState<Settings>({
    bgColor: BG_COLORS[0].value,
    pattern: "none",
  });

  // load entries + settings
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ENTRIES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setEntries(parsed);
      }
    } catch {}

    try {
      const rawS = localStorage.getItem(SETTINGS_KEY);
      if (rawS) {
        const parsed = JSON.parse(rawS) as Settings;
        if (parsed?.bgColor && parsed?.pattern) setSettings(parsed);
      }
    } catch {}
  }, []);

  // save entries
  useEffect(() => {
    try {
      localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
    } catch {}
  }, [entries]);

  // save settings
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  const nowLabel = useMemo(() => formatDateTime(Date.now()), []);

  function addEntry() {
    const text = draft.trim();
    if (!text) return;

    const next: Entry = {
      id: crypto?.randomUUID?.() ? crypto.randomUUID() : String(Date.now()),
      text,
      createdAt: Date.now(),
    };

    setEntries((prev) => [next, ...prev]);
    setDraft("");
  }

  function startEdit(e: Entry) {
    setEditingId(e.id);
    setEditDraft(e.text);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft("");
  }

  function saveEdit(id: string) {
    const text = editDraft.trim();
    if (!text) return;

    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, text, updatedAt: Date.now() } : e))
    );
    cancelEdit();
  }

  function deleteEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (editingId === id) cancelEdit();
  }

  function clearAll() {
    setEntries([]);
    cancelEdit();
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Journal</h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {nowLabel} • Entries save on this device
          </p>
        </div>

        <button
          type="button"
          onClick={clearAll}
          className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-xs hover:bg-gray-50"
        >
          Clear all
        </button>
      </div>

      {/* Journal-only background controls (colors + patterns) */}
      <div className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold">Journal background</div>

        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-xs text-[var(--muted)] mb-2">Color</div>
            <div className="flex flex-wrap gap-2">
              {BG_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() =>
                    setSettings((s) => ({ ...s, bgColor: c.value }))
                  }
                  className="h-8 w-8 rounded-full border"
                  style={{
                    backgroundColor: c.value,
                    borderColor:
                      settings.bgColor === c.value ? "black" : "rgba(0,0,0,0.15)",
                  }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-[var(--muted)] mb-2">Pattern</div>
            <div className="flex flex-wrap gap-2">
              {PATTERNS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() =>
                    setSettings((s) => ({ ...s, pattern: p.value }))
                  }
                  className={`rounded-lg border px-3 py-1.5 text-xs hover:bg-gray-50 ${
                    settings.pattern === p.value ? "font-semibold" : ""
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Entry */}
      <div
        className="rounded-2xl border border-[var(--border)] p-6 shadow-sm"
        style={cardBackground(settings.bgColor, settings.pattern)}
      >
        <div className="text-sm font-semibold">New entry</div>

        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write one page..."
          className="mt-3 w-full min-h-[320px] rounded-xl border border-[var(--border)] bg-white/80 p-4 text-sm outline-none focus:ring-2 focus:ring-black/10"
        />

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="text-xs text-[var(--muted)]">
            Tip: press “Save entry” to lock it in.
          </div>

          <button
            type="button"
            onClick={addEntry}
            className="rounded-xl bg-black px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
            disabled={!draft.trim()}
          >
            Save entry
          </button>
        </div>
      </div>

      {/* Entries */}
      <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
        {entries.length === 0 ? (
          <div className="text-sm text-[var(--muted)]">
            No entries yet. Write your first one above.
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((e) => {
              const isEditing = editingId === e.id;
              return (
                <div
                  key={e.id}
                  className="rounded-xl border border-[var(--border)] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-xs text-[var(--muted)]">
                      Created: {formatDateTime(e.createdAt)}
                      {e.updatedAt ? ` • Edited: ${formatDateTime(e.updatedAt)}` : ""}
                    </div>

                    <div className="flex items-center gap-2">
                      {!isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(e)}
                            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs hover:bg-gray-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteEntry(e.id)}
                            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs hover:bg-gray-50"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => saveEdit(e.id)}
                            className="rounded-lg bg-black px-3 py-1.5 text-xs text-white hover:opacity-90"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {!isEditing ? (
                    <pre className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
                      {e.text}
                    </pre>
                  ) : (
                    <textarea
                      value={editDraft}
                      onChange={(ev) => setEditDraft(ev.target.value)}
                      className="mt-3 w-full min-h-[180px] rounded-xl border border-[var(--border)] p-3 text-sm outline-none"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
