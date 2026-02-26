"use client";
"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEMO } from "@/content/es";

type AuthMode = "supabase" | "local";
type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "error";

interface AuthContextValue {
  mode: AuthMode;
  status: AuthStatus;
  user: { email: string } | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

interface StoredSession {
  mode: AuthMode;
  email: string;
  accessToken?: string;
  refreshToken?: string;
}

const STORAGE_KEY = "ai-escuela-auth";

const AuthContext = createContext<AuthContextValue>({
  mode: "local",
  status: "loading",
  user: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(_email: string, _password: string) {
    return { ok: false, error: "Auth provider no inicializado" };
  },
  async logout() {
    return Promise.resolve();
  },
});

const readStoredSession = (): StoredSession | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
};

const persistSession = (session: StoredSession | null) => {
  if (typeof window === "undefined") return;
  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

  const initialMode: AuthMode = hasSupabaseConfig ? "supabase" : "local";
  const [mode] = useState<AuthMode>(initialMode);

  const initialStored = typeof window !== "undefined" ? readStoredSession() : null;
  const localSession = !hasSupabaseConfig && initialStored?.mode === "local" ? initialStored : null;

  const [status, setStatus] = useState<AuthStatus>(
    hasSupabaseConfig ? "loading" : localSession ? "authenticated" : "unauthenticated",
  );
  const [user, setUser] = useState<{ email: string } | null>(
    localSession ? { email: localSession.email } : null,
  );
  const [session, setSession] = useState<StoredSession | null>(localSession);

  const supabaseAuthEndpoint = useMemo(() => {
    if (!supabaseUrl) return null;
    return `${supabaseUrl.replace(/\/$/, "")}/auth/v1`;
  }, [supabaseUrl]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = readStoredSession();

    if (!hasSupabaseConfig) return;

    // Supabase path: validate stored token if it exists
    const validateSupabaseToken = async (accessToken: string, email: string) => {
      if (!supabaseAuthEndpoint || !supabaseAnonKey) return false;
      try {
        const res = await fetch(`${supabaseAuthEndpoint}/user`, {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${accessToken}`,
          },
          cache: "no-store",
        });

        if (!res.ok) return false;
        const data = (await res.json()) as { email?: string };
        setUser({ email: data.email || email });
        setSession({ mode: "supabase", email: data.email || email, accessToken });
        setStatus("authenticated");
        return true;
      } catch {
        return false;
      }
    };

    if (stored?.mode === "supabase" && stored.accessToken) {
      validateSupabaseToken(stored.accessToken, stored.email).then((ok) => {
        if (!ok) {
          persistSession(null);
          setStatus("unauthenticated");
        }
      });
    } else {
      setStatus("unauthenticated");
    }
  }, [hasSupabaseConfig, supabaseAnonKey, supabaseAuthEndpoint]);

  const login = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const matchesDemo =
      normalizedEmail === DEMO.credentials.email && password === DEMO.credentials.password;

    if (hasSupabaseConfig && supabaseAuthEndpoint && supabaseAnonKey) {
      setStatus("loading");
      try {
        const res = await fetch(`${supabaseAuthEndpoint}/token?grant_type=password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseAnonKey,
          },
          body: JSON.stringify({ email: normalizedEmail, password }),
        });

        if (res.ok) {
          const data = (await res.json()) as {
            access_token?: string;
            refresh_token?: string;
            user?: { email?: string };
          };

          const accessToken = data.access_token;
          if (!accessToken) {
            setStatus("error");
            return { ok: false, error: "Respuesta de Supabase sin token" };
          }

          const sessionPayload: StoredSession = {
            mode: "supabase",
            email: data.user?.email || normalizedEmail,
            accessToken,
            refreshToken: data.refresh_token,
          };

          persistSession(sessionPayload);
          setSession(sessionPayload);
          setUser({ email: sessionPayload.email });
          setStatus("authenticated");
          return { ok: true };
        }
      } catch {
        // fallback handled below
      }

      if (matchesDemo) {
        const demoSession: StoredSession = { mode: "local", email: DEMO.credentials.email };
        persistSession(demoSession);
        setSession(demoSession);
        setUser({ email: DEMO.credentials.email });
        setStatus("authenticated");
        return { ok: true };
      }

      setStatus("error");
      return {
        ok: false,
        error: "No se pudo iniciar sesión en Supabase. Verifica credenciales o usa la cuenta demo.",
      };
    }

    if (matchesDemo) {
      const demoSession: StoredSession = { mode: "local", email: DEMO.credentials.email };
      persistSession(demoSession);
      setSession(demoSession);
      setUser({ email: DEMO.credentials.email });
      setStatus("authenticated");
      return { ok: true };
    }

    setStatus("error");
    return { ok: false, error: DEMO.error };
  };

  const logout = async () => {
    if (mode === "supabase" && session?.accessToken && supabaseAuthEndpoint && supabaseAnonKey) {
      try {
        await fetch(`${supabaseAuthEndpoint}/logout`, {
          method: "POST",
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
      } catch {
        // Silently ignore logout network errors to avoid trapping the user
      }
    }

    persistSession(null);
    setSession(null);
    setUser(null);
    setStatus("unauthenticated");
  };

  const value: AuthContextValue = {
    mode,
    status,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
