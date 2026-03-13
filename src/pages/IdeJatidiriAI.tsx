import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Target, Gem, Tag, Rocket, Save, Printer, Loader2, RotateCcw, Check } from "lucide-react";
import { useAI } from "@/hooks/use-ai";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

const filosofiOptions = [
  "Agama/Religius",
  "Akademik Ketat",
  "Karakter & Leadership",
  "Minat & Bakat",
  "Teknologi & Sains",
  "Alam & Lingkungan",
];

const ekonomiOptions = [
  "Menengah Bawah",
  "Menengah",
  "Menengah Atas",
  "Ekspatriat/High-End",
];

const SYSTEM_PROMPT = `Kamu adalah konsultan branding dan positioning sekolah terbaik di Indonesia. Tugas kamu adalah merumuskan identitas sekolah (Core Value & Positioning) yang unik berdasarkan data karakteristik yang diberikan.

PENTING: Jawab dalam format berikut secara ketat menggunakan Markdown:

## 🎯 Positioning Statement
[Tulis 2-3 kalimat pernyataan posisi utama sekolah yang kuat, emosional, dan membedakan dari kompetitor]

## 💎 3 Pilar Core Values
1. **[Nama Nilai 1]**: [Penjelasan singkat bagaimana nilai ini diwujudkan di sekolah]
2. **[Nama Nilai 2]**: [Penjelasan singkat]
3. **[Nama Nilai 3]**: [Penjelasan singkat]

## 🏷️ Rekomendasi Ide Tagline
1. "[Tagline 1]"
2. "[Tagline 2]"
3. "[Tagline 3]"

## 🚀 Ide Program "Pembeda" (Wow Factor)
[Tulis 1 ide program unik yang bisa jadi pembeda utama sekolah, lengkap dengan cara eksekusi dan cara menjadikannya konten marketing]

Gunakan bahasa Indonesia yang profesional, inspiratif, dan actionable.`;

export default function IdeJatidiriAI() {
  const [filosofi, setFilosofi] = useState("");
  const [fasilitas, setFasilitas] = useState("");
  const [karakterLulusan, setKarakterLulusan] = useState("");
  const [targetEkonomi, setTargetEkonomi] = useState("");
  const [keluhan, setKeluhan] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { result, isLoading, generate, reset } = useAI();
  const { user } = useAuth();
  const { toast } = useToast();

  const isFormValid = filosofi && fasilitas.trim() && karakterLulusan.trim() && targetEkonomi && keluhan.trim();

  const handleGenerate = () => {
    if (!isFormValid) return;
    const userPrompt = `Berikut adalah data karakteristik sekolah kami:

- **Fokus Filosofi Dasar**: ${filosofi}
- **Fasilitas Paling Menonjol**: ${fasilitas}
- **Karakter Lulusan Impian**: ${karakterLulusan}
- **Target Ekonomi & Demografi Orang Tua**: ${targetEkonomi}
- **Keluhan/Masalah Utama di Lingkungan Sekitar**: ${keluhan}

Tolong buatkan rumusan identitas sekolah lengkap berdasarkan data di atas.`;

    generate(SYSTEM_PROMPT, userPrompt);
  };

  const handleSave = async () => {
    if (!user || !result) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("analysis_results").insert({
        user_id: user.id,
        module: "ide-jatidiri-ai",
        title: `Ide Jatidiri AI — ${filosofi}`,
        result,
        input_data: { filosofi, fasilitas, karakterLulusan, targetEkonomi, keluhan },
      });
      if (error) throw error;
      setSaved(true);
      toast({ title: "Berhasil disimpan!", description: "Hasil ide jatidiri telah tersimpan ke riwayat Anda." });
    } catch {
      toast({ title: "Gagal menyimpan", description: "Terjadi kesalahan, coba lagi.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    reset();
    setSaved(false);
    setFilosofi("");
    setFasilitas("");
    setKarakterLulusan("");
    setTargetEkonomi("");
    setKeluhan("");
  };

  // Show results
  if (result || isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto space-y-6 print:max-w-none">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1 print:mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">Hasil Ide Jatidiri AI</h1>
          </div>

          {isLoading && !result && (
            <Card className="border-primary/20">
              <CardContent className="py-16 text-center space-y-4">
                <div className="relative mx-auto w-16 h-16">
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                  <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                    <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                </div>
                <p className="text-sm font-medium text-muted-foreground animate-pulse">
                  AI sedang menganalisis karakteristik sekolah dan mencari celah pasar...
                </p>
              </CardContent>
            </Card>
          )}

          {result && (
            <>
              {/* AI Result rendered as markdown in styled cards */}
              <Card className="border-primary/20 shadow-md">
                <CardContent className="pt-6">
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>

              {/* Action buttons - hidden on print */}
              <div className="flex flex-col sm:flex-row gap-3 print:hidden">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-2" /> Mulai Ulang
                </Button>
                <Button
                  variant="outline"
                  onClick={handlePrint}
                  className="flex-1"
                >
                  <Printer className="h-4 w-4 mr-2" /> Cetak PDF
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving || saved || isLoading}
                  className="flex-1"
                >
                  {saved ? (
                    <><Check className="h-4 w-4 mr-2" /> Tersimpan</>
                  ) : saving ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Menyimpan...</>
                  ) : (
                    <><Save className="h-4 w-4 mr-2" /> Simpan ke Riwayat</>
                  )}
                </Button>
              </div>
            </>
          )}

          {isLoading && result && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>AI masih menulis...</span>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  // Form view
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">Ide Jatidiri AI</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Bantu AI memahami karakteristik sekolah Anda untuk merancang identitas (Core Value & Positioning) yang unik dan kuat.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Konteks Sekolah Anda</CardTitle>
            <CardDescription>Isi data berikut agar AI bisa memberikan rekomendasi yang tepat sasaran.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Filosofi */}
            <div className="space-y-2">
              <Label htmlFor="filosofi">Fokus Filosofi Dasar</Label>
              <Select value={filosofi} onValueChange={setFilosofi}>
                <SelectTrigger id="filosofi">
                  <SelectValue placeholder="Pilih fokus filosofi sekolah..." />
                </SelectTrigger>
                <SelectContent>
                  {filosofiOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fasilitas */}
            <div className="space-y-2">
              <Label htmlFor="fasilitas">Fasilitas Paling Menonjol</Label>
              <Input
                id="fasilitas"
                value={fasilitas}
                onChange={(e) => setFasilitas(e.target.value)}
                placeholder="Cth: Laboratorium Komputer, Lapangan Luas, Masjid Besar"
              />
            </div>

            {/* Karakter Lulusan */}
            <div className="space-y-2">
              <Label htmlFor="karakter">Karakter Lulusan Impian</Label>
              <Textarea
                id="karakter"
                value={karakterLulusan}
                onChange={(e) => setKarakterLulusan(e.target.value)}
                placeholder="Cth: Anak yang sopan, hafal Al-Quran, dan berani berbicara di depan umum"
                rows={3}
              />
            </div>

            {/* Target Ekonomi */}
            <div className="space-y-2">
              <Label htmlFor="ekonomi">Target Ekonomi & Demografi Orang Tua</Label>
              <Select value={targetEkonomi} onValueChange={setTargetEkonomi}>
                <SelectTrigger id="ekonomi">
                  <SelectValue placeholder="Pilih target ekonomi..." />
                </SelectTrigger>
                <SelectContent>
                  {ekonomiOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Keluhan */}
            <div className="space-y-2">
              <Label htmlFor="keluhan">Keluhan/Masalah Utama di Lingkungan Sekitar</Label>
              <Textarea
                id="keluhan"
                value={keluhan}
                onChange={(e) => setKeluhan(e.target.value)}
                placeholder="Cth: Banyak orang tua sibuk bekerja sehingga anak kurang perhatian karakter di rumah"
                rows={3}
              />
            </div>

            {/* Submit */}
            <Button
              onClick={handleGenerate}
              disabled={!isFormValid}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              ✨ Rancang Ide Jatidiri dengan AI
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
