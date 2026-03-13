import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, ArrowRight, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const jatidiriQuestions = [
  "Visi dan misi sekolah bukan sekadar pajangan, tapi benar-benar dipahami dan dijalankan oleh seluruh guru.",
  "Sekolah kami memiliki minimal 1 program khas unggulan yang tidak dimiliki oleh sekolah kompetitor di sekitar.",
  "Mayoritas orang tua mendaftarkan anaknya ke sini karena alasan spesifik (misal: karakter/agama/metode), bukan sekadar karena lokasinya dekat.",
  "Jika ada 3 sekolah berjejer, warga sekitar bisa dengan mudah menyebutkan apa bedanya sekolah kami dengan yang lain.",
  "Sikap, gaya bicara, dan pelayanan seluruh staf (dari satpam hingga kepala sekolah) mencerminkan nilai budaya yang sama.",
  "Sekolah berani menolak calon siswa/orang tua yang secara prinsip tidak sejalan dengan budaya sekolah.",
  "Materi promosi (brosur/sosmed) kami selalu konsisten menonjolkan satu pesan utama, tidak berubah-ubah setiap tahun.",
  "Siswa dan alumni merasa bangga dan memiliki 'label' positif tertentu ketika menyebut asal sekolah mereka.",
  "Guru-guru kami merasa sedang membangun sebuah peradaban/karya besar, bukan sekadar datang untuk mengajar dan pulang.",
  "Kepala sekolah dan yayasan memiliki pandangan yang sama persis tentang mau dibawa ke mana sekolah ini 5 tahun ke depan.",
];

type ResultCategory = {
  status: string;
  colorClass: string;
  badgeBg: string;
  narasi: string;
};

function getResult(score: number): ResultCategory {
  if (score >= 40) {
    return {
      status: "Sekolah Sudah Punya Jatidiri yang Kuat",
      colorClass: "text-green-600 dark:text-green-400",
      badgeBg: "bg-green-500 text-white border-green-500",
      narasi:
        "Luar biasa! Identitas sekolah Anda sudah sangat tajam dan mengakar. Tugas Anda di fase marketing selanjutnya hanyalah memperluas jangkauan (amplifying) pesan ini agar terdengar oleh lebih banyak orang tua yang tepat.",
    };
  }
  if (score >= 25) {
    return {
      status: "Jatidiri Ada, Tapi Masih Belum Kuat (Inkonsisten)",
      colorClass: "text-orange-600 dark:text-orange-400",
      badgeBg: "bg-orange-500 text-white border-orange-500",
      narasi:
        "Sekolah Anda sebenarnya memiliki keunikan, namun eksekusinya di lapangan masih abu-abu. Pesan yang ditangkap oleh orang tua mungkin berbeda dengan yang dipahami oleh guru. Anda perlu menyamakan frekuensi internal sebelum melakukan promosi besar-besaran.",
    };
  }
  return {
    status: "Sekolah Belum Punya Jatidiri (Sangat Generik)",
    colorClass: "text-red-600 dark:text-red-400",
    badgeBg: "bg-red-500 text-white border-red-500",
    narasi:
      "Hati-hati, sekolah Anda saat ini terlihat sama persis dengan sekolah lain di mata masyarakat. Tidak ada alasan kuat mengapa orang tua harus memilih sekolah ini. Fokuslah merumuskan Core Value dan program pembeda terlebih dahulu sebelum membuang anggaran untuk iklan.",
  };
}

export default function AnalisisJatidiri() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const allAnswered = Object.keys(answers).length === jatidiriQuestions.length;
  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const result = getResult(totalScore);

  const handleSelect = (qIndex: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: value }));
  };

  const handleSubmit = async () => {
    if (!allAnswered || !user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("analysis_results").insert({
        user_id: user.id,
        module: "analisis-jatidiri",
        title: `Analisis Jatidiri Sekolah — Skor ${totalScore}/50`,
        result: JSON.stringify({ score: totalScore, ...result, answers }),
        input_data: { answers },
      });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Hasil tersimpan!", description: "Analisis jatidiri berhasil disimpan." });
    } catch {
      toast({ title: "Gagal menyimpan", description: "Terjadi kesalahan, coba lagi.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-2 mb-1">
            <Fingerprint className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">Hasil Analisis Jatidiri</h1>
          </div>

          <Card>
            <CardHeader className="text-center pb-2">
              <p className="text-sm text-muted-foreground mb-2">Total Skor Anda</p>
              <p className={`text-5xl font-extrabold ${result.colorClass}`}>{totalScore}<span className="text-lg font-normal text-muted-foreground">/50</span></p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <Badge className={`${result.badgeBg} text-sm px-4 py-1`}>{result.status}</Badge>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground text-center">{result.narasi}</p>

              <div className="border-t pt-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Detail Skor per Pertanyaan:</p>
                {jatidiriQuestions.map((q, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="font-semibold text-primary shrink-0 w-5 text-right">{answers[i]}</span>
                    <span className="text-muted-foreground">{q}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" /> Ulangi Analisis
            </Button>
            <Button onClick={() => navigate("/marketing-ppdb")} className="flex-1">
              Lanjut ke Strategi Marketing PPDB <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Fingerprint className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">Analisis Jatidiri Sekolah</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Diagnosis seberapa kuat identitas, budaya, dan diferensiasi sekolah Anda. Jawab setiap pernyataan dengan skala 1 (Sangat Tidak Setuju) hingga 5 (Sangat Setuju).
          </p>
        </div>

        <div className="space-y-4">
          {jatidiriQuestions.map((question, idx) => (
            <Card key={idx} className={answers[idx] ? "border-primary/30" : ""}>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs font-medium text-primary">Pertanyaan {idx + 1}/10</CardDescription>
                <CardTitle className="text-sm font-medium leading-snug">{question}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleSelect(idx, val)}
                      className={`h-10 w-10 rounded-lg text-sm font-semibold transition-all border
                        ${answers[idx] === val
                          ? "bg-primary text-primary-foreground border-primary shadow-md scale-110"
                          : "bg-muted text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
                        }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground">Sangat Tidak Setuju</span>
                  <span className="text-[10px] text-muted-foreground">Sangat Setuju</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <Button onClick={handleSubmit} disabled={!allAnswered || saving} className="w-full" size="lg">
            {saving ? "Menyimpan..." : "Submit Analisis"}
          </Button>
          {!allAnswered && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Jawab semua {jatidiriQuestions.length} pertanyaan untuk melanjutkan ({Object.keys(answers).length}/{jatidiriQuestions.length})
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
