import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AIResultCard } from "@/components/AIResultCard";
import { useAI } from "@/hooks/use-ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";

export default function AnalisisKompetitor() {
  const { result, isLoading, generate } = useAI();
  const [nama, setNama] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [website, setWebsite] = useState("");

  const handleSubmit = () => {
    if (!nama || !lokasi) return;
    generate(
      "Kamu adalah konsultan pendidikan dan strategi sekolah ahli di Indonesia.",
      `Analisis kompetitor sekolah berikut:
- Nama Sekolah: ${nama}
- Lokasi: ${lokasi}
${website ? `- Website/Instagram: ${website}` : ""}

Berikan analisis:
1. Kekuatan kompetitor
2. Kelemahan kompetitor
3. Strategi positioning mereka
4. Celah diferensiasi yang bisa dimanfaatkan

Jawab dalam Bahasa Indonesia yang terstruktur.`
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">Analisis Kompetitor Sekolah</h1>
          </div>
          <p className="text-sm text-muted-foreground">Pelajari kekuatan dan kelemahan kompetitor</p>
        </div>
        <Card>
          <CardHeader><CardTitle className="text-base">Input Data</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Nama Sekolah Kompetitor *</Label><Input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="contoh: Sekolah ABC" /></div>
            <div><Label>Lokasi *</Label><Input value={lokasi} onChange={(e) => setLokasi(e.target.value)} placeholder="contoh: Jakarta Selatan" /></div>
            <div><Label>Website / Instagram (opsional)</Label><Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="contoh: @sekolah_abc" /></div>
            <Button onClick={handleSubmit} disabled={isLoading || !nama || !lokasi} className="w-full">{isLoading ? "Menganalisis..." : "Analisis Kompetitor"}</Button>
          </CardContent>
        </Card>
        <AIResultCard title="Hasil Analisis Kompetitor" content={result} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}
