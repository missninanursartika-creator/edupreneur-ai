import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AIResultCard } from "@/components/AIResultCard";
import { useAI } from "@/hooks/use-ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lightbulb } from "lucide-react";

export default function GeneratorNama() {
  const { result, isLoading, generate } = useAI();
  const [nilai, setNilai] = useState("");
  const [konsep, setKonsep] = useState("");
  const [lokasi, setLokasi] = useState("");

  const handleSubmit = () => {
    if (!nilai || !konsep) return;
    generate(
      "Kamu adalah ahli branding dan naming sekolah di Indonesia.",
      `Generate nama sekolah berdasarkan:
- Nilai inti: ${nilai}
- Konsep sekolah: ${konsep}
- Lokasi: ${lokasi || "Tidak ditentukan"}

Berikan:
1. 10 ide nama sekolah yang unik dan bermakna
2. Arti filosofis dari setiap nama
3. Ide branding untuk setiap nama (tagline, warna, nuansa)

Jawab dalam Bahasa Indonesia.`
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1"><Lightbulb className="h-5 w-5 text-primary" /><h1 className="text-xl font-bold">Generator Nama Sekolah</h1></div>
          <p className="text-sm text-muted-foreground">Dapatkan ide nama sekolah yang kreatif dan bermakna</p>
        </div>
        <Card>
          <CardHeader><CardTitle className="text-base">Input Data</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Nilai Inti Sekolah *</Label><Input value={nilai} onChange={(e) => setNilai(e.target.value)} placeholder="contoh: Integritas, Kreativitas, Kemandirian" /></div>
            <div><Label>Konsep Sekolah *</Label><Input value={konsep} onChange={(e) => setKonsep(e.target.value)} placeholder="contoh: Sekolah Alam Islam Modern" /></div>
            <div><Label>Lokasi (opsional)</Label><Input value={lokasi} onChange={(e) => setLokasi(e.target.value)} placeholder="contoh: Bogor" /></div>
            <Button onClick={handleSubmit} disabled={isLoading || !nilai || !konsep} className="w-full">{isLoading ? "Menggenerate..." : "Generate Nama"}</Button>
          </CardContent>
        </Card>
        <AIResultCard title="Ide Nama Sekolah" content={result} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}
