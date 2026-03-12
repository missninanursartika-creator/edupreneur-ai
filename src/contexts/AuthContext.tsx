import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isApproved: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isApproved: false,
  signOut: async () => {},
});

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number, timeoutMessage: string): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkApproval = async (userId: string) => {
      try {
        const { data } = await withTimeout(
          supabase.rpc("is_user_approved", { _user_id: userId }),
          5000,
          "Approval check timeout"
        );
        return !!data;
      } catch (err) {
        console.error("[AuthContext] approval check error:", err);
        return false;
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (!newSession?.user) {
        setIsApproved(false);
        return;
      }

      void checkApproval(newSession.user.id).then((approved) => {
        if (mounted) setIsApproved(approved);
      });
    });

    const initializeAuth = async () => {
      const hardTimeout = setTimeout(() => {
        if (mounted) setLoading(false);
      }, 6000);

      try {
        const { data: { session: initialSession } } = await withTimeout(
          supabase.auth.getSession(),
          5000,
          "Session check timeout"
        );

        if (!mounted) return;

        setSession(initialSession ?? null);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          const approved = await checkApproval(initialSession.user.id);
          if (mounted) setIsApproved(approved);
        } else {
          setIsApproved(false);
        }
      } catch (err) {
        console.error("[AuthContext] init error:", err);
        if (mounted) setIsApproved(false);
      } finally {
        clearTimeout(hardTimeout);
        if (mounted) setLoading(false);
      }
    };

    void initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isApproved, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
