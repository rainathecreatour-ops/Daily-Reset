import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Daily Reset",
  description: "A calm daily reset: audio + a single planner page."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
