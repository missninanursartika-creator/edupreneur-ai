import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AIResultCard } from "@/components/AIResultCard";
import { useAI } from "@/hooks/use-ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Megaphone } from "lucide-react";

export default function MarketingPPDB() {
  const { result, isLoading, generate } = useAI();
  const [jenjang, setJenjang] = useState("");
  const [target, setTarget] = useState("");
  const [kapasitas, setKapasitas] = useState("");

  const handleSubmit = () => {
    if (!jenjang || !target) return;
    generate(
      "Kamu adalah ahli marketing pendidikan dan strategi PPDB di Indonesia.",
      `Buat strategi marketing PPDB:
- Jenjang: ${jenjang}
- Target Market: ${target}
- Kapasitas Siswa: ${kapasitas || "Belum ditentukan"}

Berikan:
1. Strategi Marketing PPDB (online & offline)
2. Funnel Marketing Sekolah
3. Ide Kampanye Promosi (min 5 ide)
4. Strategi Open House yang efektif

Jawab dalam Bahasa Indonesia.`
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1"><Megaphone className="h-5 w-5 text-primary" /><h1 className="text-xl font-bold">Strategi Marketing PPDB</h1></div>
          <p className="text-sm text-muted-foreground">Rancang strategi marketing penerimaan siswa baru</p>
        </div>
        <Card>
          <CardHeader><CardTitle className="text-base">Input Data</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Jenjang Sekolah *</Label>
              <Select value={jenjang} onValueChange={setJenjang}><SelectTrigger><SelectValue placeholder="Pilih jenjang" /></SelectTrigger>
                <SelectContent><SelectItem value="TK">TK</SelectItem><SelectItem value="SD">SD</SelectItem><SelectItem value="SMP">SMP</SelectItem><SelectItem value="SMA">SMA</SelectItem></SelectContent>
              </Select>
            </div>
            <div>
              <Label>Target Market *</Label>
              <Select value={target} onValueChange={setTarget}><SelectTrigger><SelectValue placeholder="Pilih target" /></SelectTrigger>
                <SelectContent><SelectItem value="Menengah">Menengah</SelectItem><SelectItem value="Menengah Atas">Menengah Atas</SelectItem><SelectItem value="Pesantren">Pesantren</SelectItem><SelectItem value="Internasional">Internasional</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label>Kapasitas Siswa (opsional)</Label><Input value={kapasitas} onChange={(e) => setKapasitas(e.target.value)} placeholder="contoh: 100 siswa" /></div>
            <Button onClick={handleSubmit} disabled={isLoading || !jenjang || !target} className="w-full">{isLoading ? "Menganalisis..." : "Buat Strategi PPDB"}</Button>
          </CardContent>
        </Card>
        <AIResultCard title="Strategi Marketing PPDB" content={result} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}
