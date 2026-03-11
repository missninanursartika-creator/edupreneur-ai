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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Get initial session first
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      if (!mounted) return;

      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      if (initialSession?.user) {
        try {
          const { data } = await supabase.rpc("is_user_approved", { _user_id: initialSession.user.id });
          if (mounted) setIsApproved(!!data);
        } catch (err) {
          console.error("[AuthContext] approval check error:", err);
        }
      }

      if (mounted) setLoading(false);
    });

    // Then listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return;

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          try {
            const { data } = await supabase.rpc("is_user_approved", { _user_id: newSession.user.id });
            if (mounted) setIsApproved(!!data);
          } catch (err) {
            console.error("[AuthContext] approval check error:", err);
          }
        } else {
          setIsApproved(false);
        }
      }
    );

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
