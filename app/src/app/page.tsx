import EmailCapture from "@/components/EmailCapture";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <span className="text-lg font-semibold tracking-tight">LessonLock</span>
        <div className="flex items-center gap-4">
          <a
            href="/login"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            Log in
          </a>
          <a
            href="/signup"
            className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Sign up
          </a>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/5 bg-white px-4 py-1.5 text-xs font-medium text-zinc-600 shadow-sm dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          For online music teachers · US / UK / CA / AU
        </p>
        <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
          Never chase a
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"> no-show again.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Students put a card on file once. You get paid automatically when they flake — no awkward texts, no chasing Venmo, no eating the lesson.
        </p>
        <p className="mt-3 text-sm font-medium text-zinc-500">
          Set up in 2 minutes · One kept piano lesson ($45) pays for 4 months of LessonLock.
        </p>

        <div id="early-access" className="mt-10 w-full">
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
              className="group rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-900"
            >
              <div className="mb-3 text-2xl">{f.icon}</div>
              <h3 className="font-semibold">{f.t}</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{f.d}</p>
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