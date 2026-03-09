import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AIResultCard } from "@/components/AIResultCard";
import { useAI } from "@/hooks/use-ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen } from "lucide-react";

export default function ProgramUnggulan() {
  const { result, isLoading, generate } = useAI();
  const [jenjang, setJenjang] = useState("");
  const [positioning, setPositioning] = useState("");
  const [target, setTarget] = useState("");

  const handleSubmit = () => {
    if (!jenjang || !positioning || !target) return;
    generate(
      "Kamu adalah ahli kurikulum dan pengembangan program sekolah di Indonesia.",
      `Desain program unggulan sekolah:
- Jenjang: ${jenjang}
- Positioning: ${positioning}
- Target Market: ${target}

Berikan:
1. Program Flagship (program utama unggulan)
2. Program Akademik Unggulan
3. Kegiatan Khas Sekolah
4. Program Pembentuk Karakter

Jawab detail dalam Bahasa Indonesia.`
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1"><BookOpen className="h-5 w-5 text-primary" /><h1 className="text-xl font-bold">Desain Program Unggulan Sekolah</h1></div>
          <p className="text-sm text-muted-foreground">Rancang program flagship dan unggulan sekolah</p>
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
            <div><Label>Positioning Sekolah *</Label><Input value={positioning} onChange={(e) => setPositioning(e.target.value)} placeholder="contoh: Sekolah alam berbasis teknologi" /></div>
            <div>
              <Label>Target Market *</Label>
              <Select value={target} onValueChange={setTarget}><SelectTrigger><SelectValue placeholder="Pilih target" /></SelectTrigger>
                <SelectContent><SelectItem value="Menengah">Menengah</SelectItem><SelectItem value="Menengah Atas">Menengah Atas</SelectItem><SelectItem value="Pesantren">Pesantren</SelectItem><SelectItem value="Internasional">Internasional</SelectItem></SelectContent>
              </Select>
            </div>
            <Button onClick={handleSubmit} disabled={isLoading || !jenjang || !positioning || !target} className="w-full">{isLoading ? "Menganalisis..." : "Desain Program"}</Button>
          </CardContent>
        </Card>
        <AIResultCard title="Program Unggulan Sekolah" content={result} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}
