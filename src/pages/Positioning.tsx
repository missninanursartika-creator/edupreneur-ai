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
import { Target } from "lucide-react";

export default function Positioning() {
  const { result, isLoading, generate } = useAI();
  const [lokasi, setLokasi] = useState("");
  const [target, setTarget] = useState("");
  const [visi, setVisi] = useState("");
  const [fasilitas, setFasilitas] = useState("");

  const handleSubmit = () => {
    if (!lokasi || !target || !visi) return;
    generate(
      "Kamu adalah konsultan branding dan positioning sekolah di Indonesia.",
      `Bantu temukan positioning sekolah:
- Lokasi: ${lokasi}
- Target Market: ${target}
- Visi Yayasan: ${visi}
- Fasilitas: ${fasilitas || "Belum ditentukan"}

Berikan:
1. Rekomendasi positioning sekolah
2. Value proposition
3. Diferensiasi sekolah
4. 5 ide tagline sekolah

Jawab dalam Bahasa Indonesia.`
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1"><Target className="h-5 w-5 text-primary" /><h1 className="text-xl font-bold">Temukan Positioning Sekolah</h1></div>
          <p className="text-sm text-muted-foreground">Temukan positioning unik untuk sekolah Anda</p>
        </div>
        <Card>
          <CardHeader><CardTitle className="text-base">Input Data</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Lokasi Sekolah *</Label><Input value={lokasi} onChange={(e) => setLokasi(e.target.value)} placeholder="contoh: Depok, Jawa Barat" /></div>
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
            <div><Label>Visi Yayasan *</Label><Textarea value={visi} onChange={(e) => setVisi(e.target.value)} placeholder="Deskripsikan visi yayasan Anda" /></div>
            <div><Label>Fasilitas yang Dimiliki (opsional)</Label><Textarea value={fasilitas} onChange={(e) => setFasilitas(e.target.value)} placeholder="contoh: Lab komputer, kolam renang, dll" /></div>
            <Button onClick={handleSubmit} disabled={isLoading || !lokasi || !target || !visi} className="w-full">{isLoading ? "Menganalisis..." : "Temukan Positioning"}</Button>
          </CardContent>
        </Card>
        <AIResultCard title="Rekomendasi Positioning" content={result} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}
