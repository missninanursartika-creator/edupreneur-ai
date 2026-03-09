import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AIResultCard } from "@/components/AIResultCard";
import { useAI } from "@/hooks/use-ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3 } from "lucide-react";

export default function SwotAnalyzer() {
  const { result, isLoading, generate } = useAI();
  const [nama, setNama] = useState("");
  const [jenjang, setJenjang] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  const handleSubmit = () => {
    if (!nama || !jenjang || !lokasi) return;
    generate(
      "Kamu adalah konsultan pendidikan dan strategi sekolah ahli di Indonesia. Berikan analisis SWOT yang mendalam, terstruktur, dan actionable.",
      `Lakukan analisis SWOT lengkap untuk sekolah berikut:
- Nama Sekolah: ${nama}
- Jenjang: ${jenjang}
- Lokasi: ${lokasi}
${deskripsi ? `- Deskripsi/Kondisi Sekolah: ${deskripsi}` : ""}

Berikan analisis SWOT yang komprehensif:

## Strengths (Kekuatan)
Identifikasi minimal 5 kekuatan internal sekolah berdasarkan informasi yang diberikan.

## Weaknesses (Kelemahan)
Identifikasi minimal 5 kelemahan internal yang perlu diperbaiki.

## Opportunities (Peluang)
Identifikasi minimal 5 peluang eksternal yang bisa dimanfaatkan.

## Threats (Ancaman)
Identifikasi minimal 5 ancaman eksternal yang perlu diantisipasi.

## Strategi SO (Strength-Opportunity)
Bagaimana memanfaatkan kekuatan untuk menangkap peluang.

## Strategi WO (Weakness-Opportunity)
Bagaimana mengatasi kelemahan dengan memanfaatkan peluang.

## Strategi ST (Strength-Threat)
Bagaimana menggunakan kekuatan untuk menghadapi ancaman.

## Strategi WT (Weakness-Threat)
Bagaimana meminimalkan kelemahan dan menghindari ancaman.

## Rekomendasi Prioritas
Berikan 5 rekomendasi aksi prioritas berdasarkan analisis SWOT di atas.

Jawab dalam Bahasa Indonesia yang terstruktur dan profesional.`
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">AI SWOT Analyzer</h1>
          </div>
          <p className="text-sm text-muted-foreground">Analisis Strengths, Weaknesses, Opportunities & Threats sekolah Anda</p>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Input Data Sekolah</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nama Sekolah *</Label>
              <Input placeholder="contoh: SMA Nusantara Unggul" value={nama} onChange={(e) => setNama(e.target.value)} />
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
                  <SelectItem value="SMK">SMK</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Lokasi *</Label>
              <Input placeholder="contoh: Jakarta Selatan" value={lokasi} onChange={(e) => setLokasi(e.target.value)} />
            </div>
            <div>
              <Label>Deskripsi / Kondisi Sekolah (opsional)</Label>
              <Textarea
                placeholder="Ceritakan kondisi sekolah saat ini: jumlah siswa, kurikulum, fasilitas, program unggulan, tantangan yang dihadapi, dll."
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                rows={4}
              />
            </div>
            <Button onClick={handleSubmit} disabled={isLoading || !nama || !jenjang || !lokasi} className="w-full">
              {isLoading ? "Menganalisis SWOT..." : "Analisis SWOT"}
            </Button>
          </CardContent>
        </Card>

        <AIResultCard title="Hasil Analisis SWOT" content={result} isLoading={isLoading} module="SWOT Analyzer" inputData={{ nama, jenjang, lokasi, deskripsi }} />
      </div>
    </DashboardLayout>
  );
}
