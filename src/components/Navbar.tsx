"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Wand2, BookMarked, Library, User, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { href: "/wizard", label: "Generar Prompt", icon: Wand2 },
  { href: "/mis-prompts", label: "Mis Prompts", icon: BookMarked },
  { href: "/biblioteca", label: "Biblioteca", icon: Library },
  { href: "/perfil", label: "Perfil", icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-navy-deep border-b border-navy text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
            <span className="text-navy-deep font-bold text-sm">PJ</span>
          </div>
          <span className="font-semibold text-sm hidden sm:block">Generador de Prompts</span>
        </Link>

        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  active
                    ? "bg-navy text-gold"
                    : "text-blue-mist hover:bg-navy hover:text-white"
                }`}
              >
                <Icon size={15} />
                <span className="hidden md:inline">{label}</span>
              </Link>
            );
          })}

          {user && (
            <button
              onClick={() => logout()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-mist hover:bg-navy hover:text-white transition-colors ml-2"
            >
              <LogOut size={15} />
              <span className="hidden md:inline">Salir</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
