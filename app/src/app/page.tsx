import EmailCapture from "@/components/EmailCapture";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-100">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <span className="flex items-center gap-2.5 text-lg font-semibold tracking-tight"><span className="inline-block w-7 h-7 rounded-md bg-blue-600" />LessonLock</span>
        <div className="flex items-center gap-4">
          <a
            href="/login"
            className="text-sm font-medium text-slate-400 hover:text-slate-100"
          >
            Log in
          </a>
          <a
            href="/signup"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            Sign up
          </a>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-1.5 text-xs font-medium text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          For online music teachers · US / UK / CA / AU
        </p>
        <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
          Never chase a
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"> no-show again.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-400">
          Students put a card on file once. You get paid automatically when they flake — no awkward texts, no chasing Venmo, no eating the lesson.
        </p>
        <p className="mt-3 text-sm font-medium text-slate-500">
          Set up in 2 minutes · One kept piano lesson ($45) pays for 4 months of LessonLock.
        </p>

        <div id="early-access" className="mt-10 flex w-full justify-center">
          <EmailCapture />
        </div>

        <div className="mt-20 grid w-full max-w-4xl gap-5 text-left sm:grid-cols-3">
          {[
            { t: "Set policy once", d: "Free up to 24h, 50% kept after. Or pick any of 10 templates.", icon: "📋" },
            { t: "Card on file", d: "Stripe Checkout + SetupIntent. You never touch or store the card.", icon: "💳" },
            { t: "Auto-charge + refund", d: "Late cancel / no-show charged automatically. 1-click refund.", icon: "⚡" },
          ].map((f) => (
            <div
              key={f.t}
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-0.5"
            >
              <div className="mb-3 text-2xl">{f.icon}</div>
              <h3 className="font-semibold">{f.t}</h3>
              <p className="mt-1 text-sm text-slate-400">{f.d}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="mx-auto w-full max-w-5xl px-6 py-6 text-center text-xs text-zinc-500">
        © 2026 LessonLock. Early access.
      </footer>
    </div>
  );
}