"use client";

import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import { createContext, useContext, type ReactNode } from "react";

interface AuthContextValue {
  user: { id?: string; email?: string | null; name?: string | null } | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  async login() { return { ok: false, error: "No inicializado" }; },
  async logout() {},
});

export function useAuth() {
  return useContext(AuthContext);
}

function AuthInner({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const user = session?.user ? {
    id: (session.user as { id?: string }).id,
    email: session.user.email,
    name: session.user.name,
  } : null;

  const login = async (email: string, password: string) => {
    const res = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });
    if (res?.error) return { ok: false, error: "Credenciales incorrectas" };
    return { ok: true };
  };

  const logout = async () => {
    await signOut({ redirect: false });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthInner>{children}</AuthInner>
    </SessionProvider>
  );
}
