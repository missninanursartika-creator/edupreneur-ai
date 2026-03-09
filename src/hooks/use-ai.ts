import { useState, useCallback } from "react";
import { streamChat } from "@/lib/ai-stream";
import { toast } from "@/hooks/use-toast";

export function useAI() {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generate = useCallback(async (systemPrompt: string, userPrompt: string) => {
    setResult("");
    setIsLoading(true);

    try {
      await streamChat({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        onDelta: (chunk) => {
          setResult((prev) => prev + chunk);
        },
        onDone: () => {
          setIsLoading(false);
        },
        onError: (error) => {
          setIsLoading(false);
          toast({ title: "Error", description: error, variant: "destructive" });
        },
      });
    } catch {
      setIsLoading(false);
      toast({ title: "Error", description: "Gagal menghubungi AI", variant: "destructive" });
    }
  }, []);

  const reset = useCallback(() => {
    setResult("");
    setIsLoading(false);
  }, []);

  return { result, isLoading, generate, reset };
}
