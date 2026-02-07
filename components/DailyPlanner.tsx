"use client";

import React, { useMemo, useState } from "react";

type PlannerState = {
  focus: string;
  p1: string;
  p2: string;
  p3: string;
  win: string;
  gratitude: string;
};

const DEFAULTS: PlannerState = { focus: "", p1: "", p2: "", p3: "", win: "", gratitude: "" };

function todayString() {
  const d = new Date();
  return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

export default function DailyPlanner() {
  const [state, setState] = useState<PlannerState>(DEFAULTS);

  const isEmpty = useMemo(() => Object.values(state).every((v) => v.trim().length === 0), [state]);

  function set<K extends keyof PlannerState>(key: K, value: PlannerState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Today’s Page</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{todayString()}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="rounded-xl border border-[var(--border)] bg-white px-4 py-2 hover:bg-gray-50"
          >
            Print
          </button>
          <button
            onClick={() => setState(DEFAULTS)}
            disabled={isEmpty}
            className="rounded-xl border border-[var(--border)] bg-white px-4 py-2 hover:bg-gray-50 disabled:opacity-60"
          >
            Reset
          </button>
        </div>
      </div>

      <Field
        label="Today’s Focus"
        value={state.focus}
        onChange={(v) => set("focus", v)}
        placeholder="What matters most today?"
      />

      <div className="rounded-2xl border border-[var(--border)] p-4">
        <p className="font-semibold">Top 3 Priorities</p>
        <div className="mt-3 grid gap-3">
          <Field label="Priority 1" compact value={state.p1} onChange={(v) => set("p1", v)} placeholder="Priority one" />
          <Field label="Priority 2" compact value={state.p2} onChange={(v) => set("p2", v)} placeholder="Priority two" />
          <Field label="Priority 3" compact value={state.p3} onChange={(v) => set("p3", v)} placeholder="Priority three" />
        </div>
      </div>

      <Field
        label="One Small Win I Want Today"
        value={state.win}
        onChange={(v) => set("win", v)}
        placeholder="A small win counts. What is it?"
      />

      <Field
        label="Gratitude"
        value={state.gratitude}
        onChange={(v) => set("gratitude", v)}
        placeholder="What are you grateful for right now?"
      />

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4">
        <p className="text-sm text-[var(--muted)]">When you’re done, close the tab like a ritual. You showed up today.</p>
      </div>
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  compact?: boolean;
}) {
  const { label, value, onChange, placeholder, compact } = props;

  return (
    <label className="flex flex-col gap-2">
      <span className={`text-sm font-medium ${compact ? "text-[var(--muted)]" : ""}`}>{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={compact ? 2 : 3}
        className="w-full resize-none rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:ring-2 focus:ring-black/5"
      />
    </label>
  );
}
