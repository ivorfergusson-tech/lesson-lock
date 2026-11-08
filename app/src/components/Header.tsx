import Link from "next/link";

export default function Header({ initials = "MC" }: { initials?: string }) {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 font-semibold tracking-tight text-lg">
          <span className="inline-block w-7 h-7 rounded-md bg-blue-600" />
          LessonLock
        </Link>
        <Link href="/account" className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-medium hover:bg-slate-700">
          {initials}
        </Link>
      </div>
    </header>
  );
}
