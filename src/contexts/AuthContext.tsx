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

    const checkApproval = async (userId: string) => {
      try {
        const { data, error } = await supabase.rpc("is_user_approved", { _user_id: userId });
        if (error) {
          console.error("[AuthContext] approval check error:", error);
          return false;
        }
        return !!data;
      } catch (err) {
        console.error("[AuthContext] approval check exception:", err);
        return false;
      }
    };

    const handleSession = async (newSession: Session | null) => {
      if (!mounted) return;
      
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        const approved = await checkApproval(newSession.user.id);
        if (mounted) {
          setIsApproved(approved);
          setLoading(false);
        }
      } else {
        setIsApproved(false);
        setLoading(false);
      }
    };

    // Set up auth listener - this handles INITIAL_SESSION too
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        await handleSession(newSession);
      }
    );

    // Fallback timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn("[AuthContext] Loading timeout reached, forcing load complete");
        setLoading(false);
      }
    }, 5000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
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
