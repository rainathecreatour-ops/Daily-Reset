"use client";

import { useState } from "react";

export default function DailyPlanner() {
  const [text, setText] = useState("");

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Your Daily Journal</h2>
      <p className="text-sm text-gray-500 mb-3">
        Write one page. No pressure. Just start.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start writing here…"
        className="w-full min-h-[260px] rounded-xl border border-gray-300 p-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
      />

      <p className="mt-2 text-xs text-gray-400">
        This stays on this device.
      </p>
    </div>
  );
}
