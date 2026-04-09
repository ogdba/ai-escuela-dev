"use client";

import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthProvider";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PerfilPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <AuthGuard>
      <Navbar />
      <main className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-navy mb-6">Perfil</h1>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-gray-text uppercase tracking-wide">Correo electronico</span>
              <p className="text-sm text-navy font-medium mt-1">{user?.email}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-text uppercase tracking-wide">ID de usuario</span>
              <p className="text-xs text-gray-text font-mono mt-1">{user?.id}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="mt-6 flex items-center gap-2 rounded-xl border border-red text-red font-semibold px-5 py-2.5 text-sm hover:bg-red hover:text-white transition">
            <LogOut size={16} />
            Cerrar sesion
          </button>
        </div>
      </main>
    </AuthGuard>
  );
}
