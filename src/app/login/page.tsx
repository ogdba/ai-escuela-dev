"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/";
  const { login, user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    router.push(nextUrl);
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login(email, password);
    if (result.ok) {
      router.push(nextUrl);
    } else {
      setError(result.error || "Error al iniciar sesion");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-bg flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gold mx-auto flex items-center justify-center mb-4">
            <span className="text-navy-deep font-bold text-xl">PJ</span>
          </div>
          <h1 className="text-xl font-bold text-navy">Generador de Prompts</h1>
          <p className="text-sm text-gray-text mt-1">Poder Judicial del Estado de Nuevo Leon</p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-navy flex items-center gap-1.5 mb-1.5">
              <Mail size={14} /> Correo electronico
            </label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
              required autoComplete="email" />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-navy flex items-center gap-1.5 mb-1.5">
              <LockKeyhole size={14} /> Contrasena
            </label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
              required autoComplete="current-password" />
          </div>
          {error && <p className="text-sm text-red bg-red/10 rounded-lg p-3">{error}</p>}
          <button type="submit" disabled={submitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-navy text-white font-semibold py-3 shadow-md hover:-translate-y-0.5 transition disabled:opacity-50">
            {submitting ? "Verificando..." : <><LogIn size={16} /> Iniciar sesion</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-bg"><p className="text-sm text-gray-text">Cargando...</p></div>}>
      <LoginForm />
    </Suspense>
  );
}
