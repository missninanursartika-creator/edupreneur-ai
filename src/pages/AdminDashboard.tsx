import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Users, UserCheck, UserX, BarChart3, LogOut, Shield, Trash2, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface AdminStats {
  total_users: number;
  approved_users: number;
  pending_users: number;
  total_analyses: number;
  analyses_by_module: { module: string; count: number }[];
  daily_activity: { date: string; count: number }[];
}

interface UserRow {
  id: string;
  full_name: string | null;
  email: string;
  is_approved: boolean;
  created_at: string;
  analysis_count: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "users">("overview");

  const loadData = useCallback(async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        supabase.rpc("get_admin_stats"),
        supabase.rpc("get_all_users"),
      ]);

      if (statsRes.error) throw statsRes.error;
      if (usersRes.error) throw usersRes.error;

      setStats(statsRes.data as unknown as AdminStats);
      setUsers(usersRes.data as unknown as UserRow[]);
    } catch (error: any) {
      console.error("[AdminDashboard] loadData error:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const checkAndLoad = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          window.location.href = "/admin";
          return;
        }

        const { data: isAdmin } = await supabase.rpc("has_role", {
          _user_id: session.user.id,
          _role: "admin",
        });

        if (!isAdmin) {
          window.location.href = "/admin";
          return;
        }

        if (!cancelled) {
          await loadData();
        }
      } catch (err) {
        console.error("[AdminDashboard] checkAndLoad error:", err);
        if (!cancelled) {
          setLoading(false);
          window.location.href = "/admin";
        }
      }
    };

    checkAndLoad();

    return () => { cancelled = true; };
  }, [loadData]);

  const handleApproval = async (userId: string, approved: boolean) => {
    try {
      const { error } = await supabase.rpc("admin_set_user_approval", {
        _user_id: userId,
        _approved: approved,
      });
      if (error) throw error;
      toast({ title: approved ? "User disetujui" : "User ditolak" });
      loadData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Yakin hapus user ini? Semua data akan hilang.")) return;
    try {
      const { error } = await supabase.rpc("admin_delete_user", { _user_id: userId });
      if (error) throw error;
      toast({ title: "User dihapus" });
      loadData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Memuat data admin...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={activeTab === "overview" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("overview")}>
            <BarChart3 className="h-4 w-4 mr-1" /> Overview
          </Button>
          <Button variant={activeTab === "users" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("users")}>
            <Users className="h-4 w-4 mr-1" /> Users
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" /> Keluar
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {activeTab === "overview" && stats && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Users</p><p className="text-3xl font-bold text-foreground">{stats.total_users}</p></div><Users className="h-10 w-10 text-primary/30" /></div></CardContent></Card>
              <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Pending</p><p className="text-3xl font-bold text-destructive">{stats.pending_users}</p></div><UserX className="h-10 w-10 text-destructive/30" /></div></CardContent></Card>
              <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Approved</p><p className="text-3xl font-bold text-foreground">{stats.approved_users}</p></div><UserCheck className="h-10 w-10 text-primary/30" /></div></CardContent></Card>
              <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Analisis</p><p className="text-3xl font-bold text-foreground">{stats.total_analyses}</p></div><Activity className="h-10 w-10 text-primary/30" /></div></CardContent></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-lg">Penggunaan per Modul</CardTitle></CardHeader>
                <CardContent>
                  {stats.analyses_by_module.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stats.analyses_by_module}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="module" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} className="fill-muted-foreground" />
                        <YAxis className="fill-muted-foreground" />
                        <Tooltip />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground text-sm text-center py-12">Belum ada data</p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-lg">Aktivitas Harian (30 hari)</CardTitle></CardHeader>
                <CardContent>
                  {stats.daily_activity.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stats.daily_activity}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                        <YAxis className="fill-muted-foreground" />
                        <Tooltip />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground text-sm text-center py-12">Belum ada data</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {activeTab === "users" && (
          <Card>
            <CardHeader><CardTitle className="text-lg">Manajemen User</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Analisis</TableHead>
                    <TableHead>Terdaftar</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name || "-"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.is_approved ? "default" : "destructive"}>
                          {user.is_approved ? "Approved" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.analysis_count}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        {!user.is_approved ? (
                          <Button size="sm" variant="default" onClick={() => handleApproval(user.id, true)}>
                            <UserCheck className="h-3 w-3 mr-1" /> Setujui
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => handleApproval(user.id, false)}>
                            <UserX className="h-3 w-3 mr-1" /> Tolak
                          </Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(user.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Belum ada user terdaftar
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
