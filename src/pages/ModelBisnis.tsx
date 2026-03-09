import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AIResultCard } from "@/components/AIResultCard";
import { useAI } from "@/hooks/use-ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Briefcase } from "lucide-react";

export default function ModelBisnis() {
  const { result, isLoading, generate } = useAI();
  const [jenjang, setJenjang] = useState("");
  const [konsep, setKonsep] = useState("");
  const [kapasitas, setKapasitas] = useState("");

  const handleSubmit = () => {
    if (!jenjang || !konsep) return;
    generate(
      "Kamu adalah ahli business model dan manajemen keuangan sekolah di Indonesia.",
      `Buat model bisnis sekolah:
- Jenjang: ${jenjang}
- Konsep: ${konsep}
- Kapasitas: ${kapasitas || "Belum ditentukan"}

Berikan:
1. Business Model Canvas lengkap (9 blok)
2. Sumber Pendapatan (revenue streams)
3. Struktur Biaya (cost structure)
4. Strategi Keberlanjutan Finansial

Jawab dalam Bahasa Indonesia.`
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1"><Briefcase className="h-5 w-5 text-primary" /><h1 className="text-xl font-bold">Model Bisnis Sekolah</h1></div>
          <p className="text-sm text-muted-foreground">Rancang Business Model Canvas sekolah Anda</p>
        </div>
        <Card>
          <CardHeader><CardTitle className="text-base">Input Data</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Jenjang Sekolah *</Label><Input value={jenjang} onChange={(e) => setJenjang(e.target.value)} placeholder="contoh: SD" /></div>
            <div><Label>Konsep Sekolah *</Label><Textarea value={konsep} onChange={(e) => setKonsep(e.target.value)} placeholder="contoh: Sekolah alam full day school" /></div>
            <div><Label>Kapasitas Siswa (opsional)</Label><Input value={kapasitas} onChange={(e) => setKapasitas(e.target.value)} placeholder="contoh: 300 siswa" /></div>
            <Button onClick={handleSubmit} disabled={isLoading || !jenjang || !konsep} className="w-full">{isLoading ? "Menganalisis..." : "Buat Model Bisnis"}</Button>
          </CardContent>
        </Card>
        <AIResultCard title="Model Bisnis Sekolah" content={result} isLoading={isLoading} module="Model Bisnis" inputData={{ jenjang, konsep, kapasitas }} />
      </div>
    </DashboardLayout>
  );
}
