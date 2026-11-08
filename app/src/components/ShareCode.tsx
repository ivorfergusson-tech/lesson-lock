"use client";

import { useState } from "react";

export default function ShareCode({ link }: { link: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  const code = link.split("/").pop() || "";
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(link)}`;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-300">
        Code: <span className="font-mono text-slate-100">{code}</span>
      </span>
      <button onClick={copy} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500">
        {copied ? "Copied!" : "Copy link"}
      </button>
      <button onClick={() => setOpen(true)} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500">
        Show QR
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div className="my-auto max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm text-slate-400 mb-3">Scan to open booking page</p>
            <img src={qr} alt="QR code" className="mx-auto h-40 w-40 rounded-lg bg-white p-2" />
            <p className="mt-3 break-all text-xs text-slate-500">{link}</p>
            <button onClick={() => setOpen(false)} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
