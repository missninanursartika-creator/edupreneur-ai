import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Loader2, Save, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef } from "react";

interface AIResultCardProps {
  title: string;
  content: string;
  isLoading: boolean;
  module?: string;
  inputData?: Record<string, any>;
}

export function AIResultCard({ title, content, isLoading, module, inputData }: AIResultCardProps) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!content && !isLoading) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({ title: "Disalin!", description: "Hasil telah disalin ke clipboard." });
  };

  const handleSave = async () => {
    if (!user || !module) {
      toast({ title: "Login diperlukan", description: "Silakan login untuk menyimpan hasil.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("analysis_results").insert({
      user_id: user.id,
      module,
      title,
      input_data: inputData || {},
      result: content,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSaved(true);
      toast({ title: "Tersimpan!", description: "Hasil analisis telah disimpan." });
    }
  };

  const handleExportPDF = async () => {
    if (!contentRef.current) return;
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.createElement("div");
    element.innerHTML = `
      <div style="font-family: 'Helvetica', 'Arial', sans-serif; padding: 20px; color: #1a1a2e;">
        <div style="border-bottom: 3px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 22px; color: #2563eb;">School Strategy AI</h1>
          <p style="margin: 4px 0 0; font-size: 11px; color: #6b7280;">Laporan Analisis</p>
        </div>
        <h2 style="font-size: 18px; margin-bottom: 4px;">${title}</h2>
        ${module ? `<p style="font-size: 12px; color: #6b7280; margin-bottom: 16px;">Modul: ${module} • ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>` : ""}
        <div style="font-size: 13px; line-height: 1.7;">${contentRef.current.innerHTML}</div>
        <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 10px; font-size: 10px; color: #9ca3af; text-align: center;">
          Dibuat dengan School Strategy AI • ${new Date().toLocaleDateString("id-ID")}
        </div>
      </div>
    `;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${(title || "laporan").replace(/\s+/g, "-").toLowerCase()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
    };

    html2pdf().set(opt).from(element).save();
    toast({ title: "PDF berhasil diunduh!" });
  };

  return (
    <Card className="mt-6 border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {content && !isLoading && (
          <div className="flex gap-2 flex-wrap">
            {module && !saved && (
              <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-1" /> {saving ? "Menyimpan..." : "Simpan"}
              </Button>
            )}
            {saved && (
              <Button variant="outline" size="sm" disabled className="text-primary">
                ✓ Tersimpan
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-1" /> PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-1" /> Salin
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading && !content && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>AI sedang menganalisis...</span>
          </div>
        )}
        {content && (
          <div className="prose max-w-none" ref={contentRef}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
        {isLoading && content && (
          <Loader2 className="h-4 w-4 animate-spin mt-2 text-primary" />
        )}
      </CardContent>
    </Card>
  );
}
