import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AIResultCard } from "@/components/AIResultCard";
import { useAI } from "@/hooks/use-ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function RisetMarket() {
  const { result, isLoading, generate } = useAI();
  const [kota, setKota] = useState("");
  const [jenjang, setJenjang] = useState("");
  const [target, setTarget] = useState("");
  const [kompetitor, setKompetitor] = useState("");

  const handleSubmit = () => {
    if (!kota || !jenjang || !target) return;
    const prompt = `Lakukan analisis riset market sekolah dengan detail berikut:
- Kota/Kabupaten: ${kota}
- Jenjang Sekolah: ${jenjang}
- Target Market: ${target}
${kompetitor ? `- Jumlah Sekolah Kompetitor: ${kompetitor}` : ""}

Berikan analisis lengkap mencakup:
1. Analisis peluang pasar pendidikan di wilayah tersebut
2. Kebutuhan dan harapan orang tua di wilayah tersebut
3. Tren pendidikan terkini di wilayah tersebut
4. Potensi jumlah siswa yang bisa diraih
5. Rekomendasi konsep sekolah yang tepat

Gunakan data dan pengetahuan terbaikmu. Berikan jawaban dalam Bahasa Indonesia yang terstruktur.`;

    generate(
      "Kamu adalah konsultan pendidikan dan strategi sekolah ahli di Indonesia. Berikan analisis mendalam dan actionable.",
      prompt
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Search className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">Riset Market Sekolah</h1>
          </div>
          <p className="text-sm text-muted-foreground">Analisis peluang pasar pendidikan di suatu wilayah</p>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Input Data</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Kota/Kabupaten *</Label>
              <Input placeholder="contoh: Bandung" value={kota} onChange={(e) => setKota(e.target.value)} />
            </div>
            <div>
              <Label>Jenjang Sekolah *</Label>
              <Select value={jenjang} onValueChange={setJenjang}>
                <SelectTrigger><SelectValue placeholder="Pilih jenjang" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="TK">TK</SelectItem>
                  <SelectItem value="SD">SD</SelectItem>
                  <SelectItem value="SMP">SMP</SelectItem>
                  <SelectItem value="SMA">SMA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Target Market *</Label>
              <Select value={target} onValueChange={setTarget}>
                <SelectTrigger><SelectValue placeholder="Pilih target" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Menengah">Menengah</SelectItem>
                  <SelectItem value="Menengah Atas">Menengah Atas</SelectItem>
                  <SelectItem value="Pesantren">Pesantren</SelectItem>
                  <SelectItem value="Internasional">Internasional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Jumlah Sekolah Kompetitor (opsional)</Label>
              <Input placeholder="contoh: 5" value={kompetitor} onChange={(e) => setKompetitor(e.target.value)} />
            </div>
            <Button onClick={handleSubmit} disabled={isLoading || !kota || !jenjang || !target} className="w-full">
              {isLoading ? "Menganalisis..." : "Analisis Market"}
            </Button>
          </CardContent>
        </Card>

        <AIResultCard title="Hasil Riset Market" content={result} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}
