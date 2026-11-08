"use client";
import { useEffect, useState } from "react";

export default function DemoBanner() {
  const [demo, setDemo] = useState(false);
  useEffect(() => {
    setDemo(new URLSearchParams(window.location.search).get("demo") === "1");
  }, []);
  if (!demo) return null;
  return (
    <div className="w-full bg-amber-400 px-4 py-2 text-center text-sm font-medium text-amber-950">
      DEMO MODE — data is mock, resets on reload. Not a real account.
    </div>
  );
}
