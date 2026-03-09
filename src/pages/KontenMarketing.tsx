import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AIResultCard } from "@/components/AIResultCard";
import { useAI } from "@/hooks/use-ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PenTool } from "lucide-react";

export default function KontenMarketing() {
  const { result, isLoading, generate } = useAI();
  const [konsep, setKonsep] = useState("");
  const [target, setTarget] = useState("");

  const handleSubmit = () => {
    if (!konsep) return;
    generate(
      "Kamu adalah ahli content marketing dan social media marketing untuk sekolah di Indonesia.",
      `Generate konten marketing sekolah:
- Konsep sekolah: ${konsep}
- Target audience: ${target || "Orang tua umum"}

Berikan:
1. 10 Ide Konten Instagram Sekolah (dengan deskripsi singkat)
2. 5 Caption Instagram siap pakai
3. 3 Script Video Promosi Sekolah (30-60 detik)
4. 5 Ide Reels/Short Video

Jawab dalam Bahasa Indonesia.`
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1"><PenTool className="h-5 w-5 text-primary" /><h1 className="text-xl font-bold">Generator Konten Marketing</h1></div>
          <p className="text-sm text-muted-foreground">Generate konten Instagram, caption, dan script video</p>
        </div>
        <Card>
          <CardHeader><CardTitle className="text-base">Input Data</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Konsep Sekolah *</Label><Input value={konsep} onChange={(e) => setKonsep(e.target.value)} placeholder="contoh: Sekolah Islam Modern" /></div>
            <div><Label>Target Audience (opsional)</Label><Input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="contoh: Orang tua muda menengah atas" /></div>
            <Button onClick={handleSubmit} disabled={isLoading || !konsep} className="w-full">{isLoading ? "Menggenerate..." : "Generate Konten"}</Button>
          </CardContent>
        </Card>
        <AIResultCard title="Konten Marketing Sekolah" content={result} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}
