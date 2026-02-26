"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, LogIn, LogOut } from "lucide-react";
import { NAV, SITE } from "@/content/es";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "./AuthProvider";

const navItems = [
  { label: NAV.demo, href: "#demo" },
  { label: NAV.curriculum, href: "#curriculum" },
  { label: NAV.modules, href: "#modules" },
  { label: NAV.labs, href: "#labs" },
  { label: NAV.pricing, href: "#pricing" },
  { label: NAV.faq, href: "#faq" },
  { label: NAV.contact, href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { status, user, logout } = useAuth();
  const isAuthed = status === "authenticated";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="text-lg font-bold text-gray-900 dark:text-white">
            {SITE.name.split(" ").slice(0, 2).join(" ")}
          </a>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                {item.label}
              </a>
            ))}
            {isAuthed ? (
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
              >
                <LogOut size={16} /> Salir
              </button>
            ) : (
              <a
                href="#demo"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-400 text-slate-900 text-sm font-semibold hover:bg-amber-300 transition-colors"
              >
                <LogIn size={16} /> Iniciar sesión
              </a>
            )}
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300"
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 text-gray-600 dark:text-gray-300"
              aria-label="Menú"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-gray-700 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400"
                >
                  {item.label}
                </a>
              ))}
              {isAuthed ? (
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold"
                >
                  <LogOut size={16} /> Cerrar sesión ({user?.email})
                </button>
              ) : (
                <a
                  href="#demo"
                  onClick={() => setOpen(false)}
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-400 text-slate-900 text-sm font-semibold"
                >
                  <LogIn size={16} /> Iniciar sesión
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
