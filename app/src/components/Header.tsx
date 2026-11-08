import Link from "next/link";
import ShareCode from "./ShareCode";

export default function Header({ initials = "MC", shareLink }: { initials?: string; shareLink?: string }) {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/dashboard" className="flex items-center gap-2.5 font-semibold tracking-tight text-lg shrink-0">
          <img src="/logo.svg" alt="LessonLock" className="w-7 h-7" />
          LessonLock
        </Link>
        {shareLink && <ShareCode link={shareLink} />}
        <Link href="/account" className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-medium hover:bg-slate-700 shrink-0">
          {initials}
        </Link>
      </div>
    </header>
  );
}

