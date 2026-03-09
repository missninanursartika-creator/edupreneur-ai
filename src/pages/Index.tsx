import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Users, Target, BookOpen, Heart, Lightbulb, Dna, Briefcase, Megaphone, PenTool, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  { title: "Riset Market Sekolah", desc: "Analisis peluang pasar pendidikan di wilayah Anda", icon: Search, url: "/riset-market" },
  { title: "Analisis Kompetitor", desc: "Pelajari kekuatan dan kelemahan kompetitor", icon: Users, url: "/analisis-kompetitor" },
  { title: "Positioning Sekolah", desc: "Temukan positioning unik sekolah Anda", icon: Target, url: "/positioning" },
  { title: "Program Unggulan", desc: "Desain program flagship sekolah", icon: BookOpen, url: "/program-unggulan" },
  { title: "Value Proposition Canvas", desc: "Rancang value proposition sekolah", icon: Heart, url: "/value-proposition" },
  { title: "Generator Nama", desc: "Dapatkan ide nama sekolah kreatif", icon: Lightbulb, url: "/generator-nama" },
  { title: "DNA Sekolah", desc: "Desain visi, misi, dan budaya sekolah", icon: Dna, url: "/dna-sekolah" },
  { title: "Model Bisnis", desc: "Rancang Business Model Canvas", icon: Briefcase, url: "/model-bisnis" },
  { title: "Marketing PPDB", desc: "Strategi marketing penerimaan siswa", icon: Megaphone, url: "/marketing-ppdb" },
  { title: "Konten Marketing", desc: "Generate konten Instagram & video", icon: PenTool, url: "/konten-marketing" },
  { title: "AI Konsultan", desc: "Tanya apa saja tentang sekolah", icon: MessageCircle, url: "/konsultan-ai" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            School Strategy AI
          </h1>
          <p className="text-muted-foreground mt-1">
            Bangun Sekolah Unggul dengan Bantuan AI — Riset Market, Positioning, Program Unggulan & Strategi Marketing
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <Card
              key={f.url}
              className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all group"
              onClick={() => navigate(f.url)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{f.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
