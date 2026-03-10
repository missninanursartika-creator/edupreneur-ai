import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Shield } from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user && !isAdminLogin) navigate("/");
  }, [user, navigate, isAdminLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isAdminLogin) {
        // Admin login flow
        await supabase.auth.signOut();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
          _user_id: data.user.id,
          _role: "admin",
        });

        if (roleError) throw roleError;

        if (!isAdmin) {
          await supabase.auth.signOut();
          toast({ title: "Akses ditolak", description: "Anda bukan admin.", variant: "destructive" });
          setLoading(false);
          return;
        }

        toast({ title: "Berhasil masuk sebagai Admin" });
        window.location.href = "/admin/dashboard";
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Berhasil masuk!" });
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        toast({ title: "Akun berhasil dibuat!", description: "Menunggu persetujuan admin." });
        navigate("/");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (mode: "login" | "register" | "admin") => {
    setIsLogin(mode === "login" || mode === "admin");
    setIsAdminLogin(mode === "admin");
    setEmail("");
    setPassword("");
    setFullName("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {isAdminLogin && (
            <div className="flex justify-center mb-3">
              <div className="p-3 rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
          )}
          <CardTitle className="text-2xl font-bold text-primary">
            {isAdminLogin ? "Admin Panel" : "School Strategy AI"}
          </CardTitle>
          <CardDescription>
            {isAdminLogin ? "Masuk sebagai administrator" : isLogin ? "Masuk ke akun Anda" : "Buat akun baru"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && !isAdminLogin && (
              <div>
                <Label>Nama Lengkap</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nama lengkap Anda" required />
              </div>
            )}
            <div>
              <Label>{isAdminLogin ? "Email Admin" : "Email"}</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={isAdminLogin ? "admin@sekolah.com" : "email@contoh.com"} required />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isAdminLogin ? "Password admin" : "Minimal 6 karakter"} required minLength={6} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : isAdminLogin ? "Masuk Admin" : isLogin ? "Masuk" : "Daftar"}
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground mt-4 space-y-2">
            {isAdminLogin ? (
              <p>
                Kembali ke{" "}
                <button onClick={() => switchMode("login")} className="text-primary font-medium hover:underline">
                  Login User
                </button>
              </p>
            ) : (
              <>
                <p>
                  {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
                  <button onClick={() => switchMode(isLogin ? "register" : "login")} className="text-primary font-medium hover:underline">
                    {isLogin ? "Daftar" : "Masuk"}
                  </button>
                </p>
                <p>
                  <button onClick={() => switchMode("admin")} className="text-muted-foreground hover:text-primary hover:underline">
                    Login sebagai Admin
                  </button>
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}