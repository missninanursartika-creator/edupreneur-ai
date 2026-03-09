import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AIResultCard } from "@/components/AIResultCard";
import { useAI } from "@/hooks/use-ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dna } from "lucide-react";

export default function DnaSekolah() {
  const { result, isLoading, generate } = useAI();
  const [konsep, setKonsep] = useState("");
  const [target, setTarget] = useState("");
  const [keunikan, setKeunikan] = useState("");

  const handleSubmit = () => {
    if (!konsep) return;
    generate(
      "Kamu adalah ahli pengembangan budaya dan identitas sekolah di Indonesia.",
      `Desain DNA sekolah berdasarkan:
- Konsep sekolah: ${konsep}
- Target market: ${target || "Umum"}
- Keunikan: ${keunikan || "Belum ditentukan"}

Berikan:
1. Visi Sekolah (singkat, inspiratif, terukur)
2. Misi Sekolah (3-5 poin)
3. Core Values (5 nilai inti dengan penjelasan)
4. Budaya Sekolah (kebiasaan dan ritual harian)

Jawab dalam Bahasa Indonesia.`
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1"><Dna className="h-5 w-5 text-primary" /><h1 className="text-xl font-bold">Desain DNA Sekolah</h1></div>
          <p className="text-sm text-muted-foreground">Rancang visi, misi, core values, dan budaya sekolah</p>
        </div>
        <Card>
          <CardHeader><CardTitle className="text-base">Input Data</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Konsep Sekolah *</Label><Input value={konsep} onChange={(e) => setKonsep(e.target.value)} placeholder="contoh: Sekolah Islam Modern Berwawasan Global" /></div>
            <div><Label>Target Market (opsional)</Label><Input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="contoh: Menengah Atas" /></div>
            <div><Label>Keunikan Sekolah (opsional)</Label><Textarea value={keunikan} onChange={(e) => setKeunikan(e.target.value)} placeholder="Jelaskan keunikan sekolah Anda" /></div>
            <Button onClick={handleSubmit} disabled={isLoading || !konsep} className="w-full">{isLoading ? "Mendesain..." : "Desain DNA Sekolah"}</Button>
          </CardContent>
        </Card>
        <AIResultCard title="DNA Sekolah" content={result} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}
