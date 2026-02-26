"use client";

import { useState, type FormEvent } from "react";
import { LockKeyhole, LogIn, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { DEMO } from "@/content/es";

export default function DemoSandbox() {
  const [email, setEmail] = useState<string>(DEMO.credentials.email);
  const [password, setPassword] = useState<string>(DEMO.credentials.password);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid =
      email.trim().toLowerCase() === DEMO.credentials.email &&
      password === DEMO.credentials.password;
    setStatus(isValid ? "success" : "error");
  };

  return (
    <section id="demo" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl shadow-slate-200/60 dark:shadow-none overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-8 sm:p-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs uppercase tracking-[0.2em]">
              <Sparkles size={14} />
              {DEMO.subtitle}
            </div>
            <div className="space-y-3">
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-white">
                {DEMO.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                {DEMO.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {DEMO.quickStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-4"
                >
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
              {DEMO.steps.map((step) => (
                <li key={step} className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900 text-white p-8 sm:p-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-white/10 flex items-center justify-center">
                <LockKeyhole />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">Acceso demo</p>
                <p className="font-semibold text-white">Panel ficticio</p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  className="text-sm text-white/80 flex items-center gap-2"
                  htmlFor="demo-email"
                >
                  <UserRound className="w-4 h-4" /> Email
                </label>
                <input
                  id="demo-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl bg-white text-slate-900 px-4 py-3 border-0 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  autoComplete="off"
                />
              </div>
              <div>
                <label
                  className="text-sm text-white/80 flex items-center gap-2"
                  htmlFor="demo-password"
                >
                  <LogIn className="w-4 h-4" /> Password
                </label>
                <input
                  id="demo-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-xl bg-white text-slate-900 px-4 py-3 border-0 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 text-slate-900 font-semibold py-3 shadow-lg shadow-amber-500/30 hover:translate-y-[-2px] transition"
              >
                Probar acceso
              </button>
            </form>

            {status === "success" ? (
              <p
                className="rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 px-4 py-3 text-sm"
                aria-live="polite"
              >
                {DEMO.success}
              </p>
            ) : null}
            {status === "error" ? (
              <p
                className="rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-100 px-4 py-3 text-sm"
                aria-live="assertive"
              >
                {DEMO.error}
              </p>
            ) : null}

            <div className="text-xs text-white/70 space-y-1">
              <p>Credenciales demo:</p>
              <p className="font-mono">{DEMO.credentials.email}</p>
              <p className="font-mono">{DEMO.credentials.password}</p>
              <p className="text-white/50">Solo simulación local, sin backend de autenticación.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
