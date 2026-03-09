import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Trash2, Eye, Loader2, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";

interface AnalysisResult {
  id: string;
  module: string;
  title: string;
  input_data: any;
  result: string;
  created_at: string;
}

export default function Riwayat() {
  const { user } = useAuth();
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AnalysisResult | null>(null);

  const fetchResults = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("analysis_results")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setResults(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, [user]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("analysis_results").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Dihapus!" });
      setResults((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <History className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold">Riwayat Analisis</h1>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Memuat...
          </div>
        ) : results.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Belum ada hasil analisis yang disimpan.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {results.map((r) => (
              <Card key={r.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.module} • {formatDate(r.created_at)}</p>
                  </div>
                  <div className="flex gap-2 ml-4 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => setSelected(r)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(r.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selected?.title}</DialogTitle>
            </DialogHeader>
            {selected && (
              <div className="prose max-w-none">
                <ReactMarkdown>{selected.result}</ReactMarkdown>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
