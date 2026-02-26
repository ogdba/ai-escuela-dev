"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, ArrowLeft, Sparkles, UserRound, LockKeyhole } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { DEMO, SITE } from "@/content/es";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/dashboard";
  const { login, status } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await login(email, password);
    if (result.ok) {
      router.push(nextUrl);
    } else {
      setError(result.error || "Error al iniciar sesión");
    }
    setSubmitting(false);
  };

  if (status === "authenticated") {
    router.push(nextUrl);
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-semibold">
              <Sparkles size={14} />
              {SITE.name}
            </span>
          </div>
          <h1 className="font-display text-3xl font-semibold text-slate-900 dark:text-white">
            Inicia sesión
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Accede a la plataforma de aprendizaje
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-5"
        >
          <div>
            <label
              htmlFor="login-email"
              className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2"
            >
              <UserRound size={16} />
              Correo electrónico
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder={DEMO.credentials.email}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2"
            >
              <LockKeyhole size={16} />
              Contraseña
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error ? (
            <p className="text-sm text-rose-600 bg-rose-50/80 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800 rounded-xl px-4 py-3">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 text-white font-semibold py-3.5 shadow-lg shadow-violet-500/25 hover:-translate-y-0.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              "Verificando..."
            ) : (
              <>
                <LogIn size={18} />
                Iniciar sesión
              </>
            )}
          </button>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 p-4">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
              Cuenta demo disponible:
            </p>
            <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
              <p>
                Email:{" "}
                <code className="font-mono text-violet-600 dark:text-violet-400">
                  {DEMO.credentials.email}
                </code>
              </p>
              <p>
                Password:{" "}
                <code className="font-mono text-violet-600 dark:text-violet-400">
                  {DEMO.credentials.password}
                </code>
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail(DEMO.credentials.email);
                setPassword(DEMO.credentials.password);
              }}
              className="mt-3 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
            >
              Llenar con credenciales demo
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950">
          <p className="text-slate-500">Cargando...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
