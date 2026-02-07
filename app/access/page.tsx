"use client";

import React, { useState } from "react";

export default function AccessPage() {
  const [licenseKey, setLicenseKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function unlock() {
    setLoading(true);
    setError(null);

   const res = await fetch("/api/license", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ licenseKey })
});

const data = await res.json();

if (!res.ok || !data?.ok) {
  // show Gumroad’s real message if available
  const gumMsg =
    data?.gumroad?.message ||
    data?.gumroad?.error ||
    JSON.stringify(data?.gumroad || "");

  setError(gumMsg ? `Gumroad: ${gumMsg}` : (data?.error || "Invalid key."));
  setLoading(false);
  return;
}

window.location.href = "/";


      window.location.href = "/";
    } catch {
      setError("Could not verify. Try again.");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-14">
      <div className="rounded-2xl border border-[var(--border)] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Daily Reset</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Enter the Gumroad license key from your purchase receipt to unlock.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <label className="text-sm font-medium">License key</label>
          <input
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
            placeholder="XXXX-XXXX-XXXX-XXXX"
            className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:ring-2 focus:ring-black/5"
          />

          <button
            onClick={unlock}
            disabled={loading}
            className="rounded-xl border border-[var(--border)] bg-black px-5 py-3 text-white hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Unlock"}
          </button>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <p className="mt-6 text-xs text-[var(--muted)]">
          After unlocking once, you’ll stay signed in on this device for about 30 days.
        </p>
      </div>
    </main>
  );
}
