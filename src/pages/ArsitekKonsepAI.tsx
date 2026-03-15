import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Compass, Star, Brain, Megaphone, Save, Printer, Loader2, RotateCcw, Check, ArrowLeft } from "lucide-react";
import { useAI } from "@/hooks/use-ai";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

const demografisOptions = ["Menengah Bawah", "Menengah", "Menengah Atas", "Ekspatriat"];

const dnaOptions = [
  { id: "akademik", label: "Akademik Ekselen" },
  { id: "karakter", label: "Character Building & Agama" },
  { id: "skill", label: "Skill-Based & Entrepreneurship" },
  { id: "nature", label: "Nature & Ecological" },
];

const kurikulumAddonOptions = [
  "Tidak Ada",
  "Internasional (Cambridge/IB)",
  "Local Wisdom/Kewirausahaan",
  "Pendekatan Khas (Montessori/Tahfidz)",
];

const metodeOptions = [
  "Project-Based Learning (PjBL)",
  "Inquiry-Based Learning",
  "Dual Language / Bilingual",
  "Personalized Learning",
];

const SYSTEM_PROMPT = `Kamu adalah arsitek konsep sekolah dan konsultan strategi pendidikan terkemuka di Indonesia. Tugasmu adalah mensintesa seluruh input dari pengelola sekolah menjadi sebuah konsep sekolah yang utuh, unik, dan siap dipasarkan.

PENTING: Jawab dalam format Markdown berikut secara ketat:

## 🌟 THE BIG IDEA
[Tulis 1-2 kalimat konsep besar sekolah yang memukau, unik, dan mudah diingat. Ini adalah "elevator pitch" sekolah.]

## 📋 Breakdown Konsep Utama
- 🎯 **Target Pasar**: [Rangkum target demografis dan pain point mereka]
- 🧬 **DNA Utama**: [Rangkum core values yang dipilih dan bagaimana diwujudkan]
- 📚 **Mesin Kurikulum**: [Rangkum kombinasi kurikulum yang akan digunakan]
- ⚙️ **Model Belajar**: [Rangkum metode pembelajaran dan pengalaman belajar siswa]

## 📣 Sudut Pandang Marketing (Marketing Angle)
[Tulis 2-3 paragraf tentang bagaimana menjual konsep ini ke orang tua. Fokus pada pain point solving, bukan fitur. Berikan contoh pesan marketing yang bisa langsung digunakan.]

## 💡 Rekomendasi Program Unggulan
1. **[Nama Program 1]**: [Deskripsi singkat dan dampaknya]
2. **[Nama Program 2]**: [Deskripsi singkat dan dampaknya]
3. **[Nama Program 3]**: [Deskripsi singkat dan dampaknya]

Gunakan bahasa Indonesia yang profesional, inspiratif, dan actionable. Setiap rekomendasi harus spesifik dan bisa langsung dieksekusi.`;

export default function ArsitekKonsepAI() {
  // Form state
  const [demografis, setDemografis] = useState("");
  const [painPoints, setPainPoints] = useState("");
  const [celahKompetitor, setCelahKompetitor] = useState("");
  const [dnaValues, setDnaValues] = useState<string[]>([]);
  const [kurikulumAddon, setKurikulumAddon] = useState("");
  const [metode, setMetode] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { result, isLoading, generate, reset } = useAI();
  const { user } = useAuth();
  const { toast } = useToast();

  const isFormValid =
    demografis &&
    painPoints.trim() &&
    celahKompetitor.trim() &&
    dnaValues.length > 0 &&
    kurikulumAddon &&
    metode;

  const handleDnaToggle = (id: string) => {
    setDnaValues((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : prev.length < 2 ? [...prev, id] : prev
    );
  };

  const handleGenerate = () => {
    if (!isFormValid) return;
    const selectedDna = dnaOptions.filter((o) => dnaValues.includes(o.id)).map((o) => o.label);

    const userPrompt = `Berikut data konsep sekolah yang ingin kami bangun:

**TAHAP 1: Analisis Kebutuhan Pasar**
- Target Demografis: ${demografis}
- Pain Points Orang Tua: ${painPoints}
- Celah Kompetitor: ${celahKompetitor}

**TAHAP 2: DNA / Core Values**
- Fokus Utama: ${selectedDna.join(", ")}

**TAHAP 3: Kurikulum**
- Kurikulum Wajib: Kurikulum Merdeka
- Kurikulum Add-on: ${kurikulumAddon}

**TAHAP 4: Model Pembelajaran**
- Metode Utama: ${metode}

Tolong sintesa semua data di atas menjadi konsep sekolah yang utuh dan siap dipasarkan.`;

    generate(SYSTEM_PROMPT, userPrompt);
  };

  const handleSave = async () => {
    if (!user || !result) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("analysis_results").insert({
        user_id: user.id,
        module: "arsitek-konsep-ai",
        title: `Arsitek Konsep AI — ${demografis}`,
        result,
        input_data: { demografis, painPoints, celahKompetitor, dnaValues, kurikulumAddon, metode },
      });
      if (error) throw error;
      setSaved(true);
      toast({ title: "Berhasil disimpan!", description: "Blueprint konsep sekolah tersimpan ke riwayat Anda." });
    } catch {
      toast({ title: "Gagal menyimpan", description: "Terjadi kesalahan, coba lagi.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    reset();
    setSaved(false);
  };

  // ── Result View ──
  if (result || isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto space-y-6 print:max-w-none">
          <div className="flex items-center gap-2 mb-1 print:mb-4">
            <Compass className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">Blueprint Konsep Sekolah</h1>
          </div>

          {isLoading && !result && (
            <Card className="border-primary/20">
              <CardContent className="py-16 text-center space-y-4">
                <div className="relative mx-auto w-16 h-16">
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                  <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                    <Brain className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                </div>
                <p className="text-sm font-medium text-muted-foreground animate-pulse">
                  AI sedang menyusun sintesa konsep strategis...
                </p>
              </CardContent>
            </Card>
          )}

          {result && (
            <>
              <Card className="border-primary/20 shadow-md">
                <CardContent className="pt-6">
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 print:hidden">
                <Button variant="outline" onClick={handleReset} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Ubah Input
                </Button>
                <Button variant="outline" onClick={() => window.print()} className="flex-1">
                  <Printer className="h-4 w-4 mr-2" /> Cetak Blueprint (PDF)
                </Button>
                <Button onClick={handleSave} disabled={saving || saved || isLoading} className="flex-1">
                  {saved ? (
                    <><Check className="h-4 w-4 mr-2" /> Tersimpan</>
                  ) : saving ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Menyimpan...</>
                  ) : (
                    <><Save className="h-4 w-4 mr-2" /> Simpan Konsep</>
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

  // ── Form View ──
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Compass className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">Arsitek Konsep Sekolah AI</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Rumuskan konsep sekolah Anda dari nol melalui 4 tahapan strategis, lalu biarkan AI mensintesa semuanya menjadi blueprint yang siap dieksekusi.
          </p>
        </div>

        <div className="space-y-5">
          {/* ── Tahap 1 ── */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                Analisis Kebutuhan Pasar
              </CardTitle>
              <CardDescription>Pahami siapa calon orang tua murid Anda dan apa yang mereka butuhkan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Target Demografis</Label>
                <Select value={demografis} onValueChange={setDemografis}>
                  <SelectTrigger><SelectValue placeholder="Pilih target demografis..." /></SelectTrigger>
                  <SelectContent>
                    {demografisOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Pain Points Orang Tua</Label>
                <Textarea
                  value={painPoints}
                  onChange={(e) => setPainPoints(e.target.value)}
                  placeholder="Misal: Jam pulang terlalu cepat, kurang penguatan agama, atau kurang life-skills..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Celah Kompetitor</Label>
                <Textarea
                  value={celahKompetitor}
                  onChange={(e) => setCelahKompetitor(e.target.value)}
                  placeholder="Sebutkan kelemahan 3 sekolah pesaing yang bisa Anda isi..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* ── Tahap 2 ── */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                Menentukan DNA / Core Values
              </CardTitle>
              <CardDescription>Pilih 1-2 fokus utama yang menjadi jati diri sekolah Anda.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dnaOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      dnaValues.includes(opt.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <Checkbox
                      checked={dnaValues.includes(opt.id)}
                      onCheckedChange={() => handleDnaToggle(opt.id)}
                    />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
              {dnaValues.length === 2 && (
                <p className="text-xs text-muted-foreground mt-2">Maksimal 2 fokus dipilih.</p>
              )}
            </CardContent>
          </Card>

          {/* ── Tahap 3 ── */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
                Kurikulum sebagai Mesin Penggerak
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-primary/30 bg-primary/5">
                <Checkbox checked disabled />
                <span className="text-sm font-medium">Kurikulum Merdeka <span className="text-xs text-muted-foreground">(wajib)</span></span>
              </label>
              <div className="space-y-2">
                <Label>Kurikulum Add-on</Label>
                <Select value={kurikulumAddon} onValueChange={setKurikulumAddon}>
                  <SelectTrigger><SelectValue placeholder="Pilih kurikulum tambahan..." /></SelectTrigger>
                  <SelectContent>
                    {kurikulumAddonOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* ── Tahap 4 ── */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">4</span>
                Model Pembelajaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Metode Utama</Label>
                <Select value={metode} onValueChange={setMetode}>
                  <SelectTrigger><SelectValue placeholder="Pilih metode pembelajaran..." /></SelectTrigger>
                  <SelectContent>
                    {metodeOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* ── Submit ── */}
          <Button
            onClick={handleGenerate}
            disabled={!isFormValid}
            className="w-full h-14 text-base font-semibold"
            size="lg"
          >
            <Brain className="h-5 w-5 mr-2" />
            🧠 Sintesa: Rangkum Konsep dengan AI
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
