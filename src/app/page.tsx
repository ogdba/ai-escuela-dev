"use client";

import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import { Wand2, BookMarked, Library } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const ACTIONS = [
  { href: "/wizard", icon: Wand2, title: "Generar Prompt", description: "Crea un prompt paso a paso con el wizard", color: "bg-gold" },
  { href: "/mis-prompts", icon: BookMarked, title: "Mis Prompts", description: "Revisa y reutiliza tus prompts guardados", color: "bg-navy" },
  { href: "/biblioteca", icon: Library, title: "Biblioteca", description: "Explora prompts compartidos por otros directores", color: "bg-navy/80" },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <AuthGuard>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-navy">Bienvenido/a</h1>
          <p className="text-sm text-gray-text mt-1">{user?.email} — Generador de Prompts PJENL</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ACTIONS.map(({ href, icon: Icon, title, description, color }) => (
            <motion.div key={href} whileHover={{ y: -3 }}>
              <Link href={href} className="block p-5 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-gold transition-all">
                <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
                  <Icon size={20} className="text-white" />
                </div>
                <h2 className="font-semibold text-navy text-sm">{title}</h2>
                <p className="text-xs text-gray-text mt-1">{description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </AuthGuard>
  );
}
