import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Berhasil masuk!" });
        navigate("/");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        
        // Check if email confirmation is needed
        if (data.user && !data.session) {
          toast({ 
            title: "Cek email Anda!", 
            description: "Kami telah mengirim link verifikasi ke email Anda. Silakan verifikasi email terlebih dahulu, lalu tunggu persetujuan admin." 
          });
        } else {
          toast({ title: "Akun berhasil dibuat!", description: "Menunggu persetujuan admin." });
          navigate("/");
        }
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">School Strategy AI</CardTitle>
          <CardDescription>
            {isLogin ? "Masuk ke akun Anda" : "Buat akun baru"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label>Nama Lengkap</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nama lengkap Anda" required />
              </div>
            )}
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@contoh.com" required />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" required minLength={6} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : isLogin ? "Masuk" : "Daftar"}
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground mt-4 space-y-2">
            <p>
              {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
              <button onClick={() => { setIsLogin(!isLogin); setEmail(""); setPassword(""); setFullName(""); }} className="text-primary font-medium hover:underline">
                {isLogin ? "Daftar" : "Masuk"}
              </button>
            </p>
            <p>
              <a href="/admin" className="text-muted-foreground hover:text-primary hover:underline text-xs">
                Login sebagai Admin
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
