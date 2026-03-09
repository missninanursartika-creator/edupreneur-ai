import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AIResultCardProps {
  title: string;
  content: string;
  isLoading: boolean;
}

export function AIResultCard({ title, content, isLoading }: AIResultCardProps) {
  if (!content && !isLoading) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({ title: "Disalin!", description: "Hasil telah disalin ke clipboard." });
  };

  return (
    <Card className="mt-6 border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {content && !isLoading && (
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-1" /> Salin
          </Button>
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
