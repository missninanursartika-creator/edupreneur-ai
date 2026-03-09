import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AIResultCard } from "@/components/AIResultCard";
import { useAI } from "@/hooks/use-ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";

export default function ValueProposition() {
  const { result, isLoading, generate } = useAI();
  const [harapan, setHarapan] = useState("");
  const [kekhawatiran, setKekhawatiran] = useState("");
  const [kebutuhan, setKebutuhan] = useState("");

  const handleSubmit = () => {
    if (!harapan || !kekhawatiran || !kebutuhan) return;
    generate(
      "Kamu adalah ahli strategi pendidikan dan Value Proposition Canvas.",
      `Buat Value Proposition Canvas sekolah berdasarkan:
- Harapan orang tua: ${harapan}
- Kekhawatiran orang tua: ${kekhawatiran}
- Kebutuhan siswa: ${kebutuhan}

Berikan dalam format:
1. Customer Jobs (pekerjaan pelanggan)
2. Pains (rasa sakit/masalah)
3. Gains (harapan/manfaat)
4. Solusi Pendidikan yang ditawarkan
5. Nilai Unik Sekolah

Jawab dalam Bahasa Indonesia.`
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1"><Heart className="h-5 w-5 text-primary" /><h1 className="text-xl font-bold">Value Proposition Canvas Sekolah</h1></div>
          <p className="text-sm text-muted-foreground">Rancang value proposition sekolah Anda</p>
        </div>
        <Card>
          <CardHeader><CardTitle className="text-base">Input Data</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Harapan Orang Tua *</Label><Textarea value={harapan} onChange={(e) => setHarapan(e.target.value)} placeholder="contoh: Anak bisa mandiri, berakhlak baik, berprestasi" /></div>
            <div><Label>Kekhawatiran Orang Tua *</Label><Textarea value={kekhawatiran} onChange={(e) => setKekhawatiran(e.target.value)} placeholder="contoh: Bullying, gadget, pergaulan bebas" /></div>
            <div><Label>Kebutuhan Siswa *</Label><Textarea value={kebutuhan} onChange={(e) => setKebutuhan(e.target.value)} placeholder="contoh: Lingkungan belajar nyaman, guru kreatif" /></div>
            <Button onClick={handleSubmit} disabled={isLoading || !harapan || !kekhawatiran || !kebutuhan} className="w-full">{isLoading ? "Menganalisis..." : "Buat Value Proposition Canvas"}</Button>
          </CardContent>
        </Card>
        <AIResultCard title="Value Proposition Canvas" content={result} isLoading={isLoading} module="Value Proposition" inputData={{ harapan, kekhawatiran, kebutuhan }} />
      </div>
    </DashboardLayout>
  );
}
