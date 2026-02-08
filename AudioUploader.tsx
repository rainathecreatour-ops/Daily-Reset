"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { useEffect, useState } from "react";

const STORAGE_KEY = "daily-reset-user-audio";

export default function AudioUploader() {
  const [url, setUrl] = useState<string | null>(null);

  // 🔁 Load saved audio on page load
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setUrl(saved);
    }
  }, []);

  // 💾 Save audio whenever it changes
  useEffect(() => {
    if (url) {
      localStorage.setItem(STORAGE_KEY, url);
    }
  }, [url]);

  const clearAudio = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUrl(null);
  };

  return (
    <div className="rounded-xl border border-[var(--border)] p-4">
      <p className="font-medium">Your personal reset audio</p>

      {!url && (
        <div className="mt-3">
          <UploadButton<OurFileRouter>
            endpoint="audioUploader"
            onClientUploadComplete={(res) => {
              const uploadedUrl = res?.[0]?.url;
              if (uploadedUrl) setUrl(uploadedUrl);
            }}
            onUploadError={(error: Error) => {
              alert(error.message);
            }}
          />
        </div>
      )}

      {url && (
        <div className="mt-4 space-y-3">
          <audio className="w-full" controls src={url} />
          <button
            onClick={clearAudio}
            className="text-sm text-red-600 underline"
          >
            Remove uploaded audio
          </button>
        </div>
      )}
    </div>
  );
}
