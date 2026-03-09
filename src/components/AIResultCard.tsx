import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Loader2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

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

  return (
    <Card className="mt-6 border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {content && !isLoading && (
          <div className="flex gap-2">
            {module && !saved && (
              <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-1" /> {saving ? "Menyimpan..." : "Simpan"}
              </Button>
            )}
            {saved && (
              <Button variant="outline" size="sm" disabled className="text-green-600">
                ✓ Tersimpan
              </Button>
            )}
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
          <div className="prose max-w-none">
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
