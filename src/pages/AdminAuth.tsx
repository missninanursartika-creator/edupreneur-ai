import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";

export default function AdminAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isSubmitting = useRef(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (isSubmitting.current) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.rpc("has_role", {
          _user_id: session.user.id,
          _role: "admin",
        });
        if (data) navigate("/admin/dashboard", { replace: true });
      }
    };
    checkAdmin();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    isSubmitting.current = true;

    try {
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
        isSubmitting.current = false;
        return;
      }

      toast({ title: "Berhasil masuk sebagai Admin" });
      navigate("/admin/dashboard", { replace: true });
    } catch (error: any) {
      console.error("[AdminAuth] Error:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setLoading(false);
      isSubmitting.current = false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-primary">Admin Panel</CardTitle>
          <CardDescription>Masuk sebagai administrator</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Email Admin</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@sekolah.com" required />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password admin" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Masuk Admin"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            <a href="/auth" className="text-primary font-medium hover:underline">
              Kembali ke Login User
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}