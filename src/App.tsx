import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import RisetMarket from "./pages/RisetMarket";
import AnalisisKompetitor from "./pages/AnalisisKompetitor";
import Positioning from "./pages/Positioning";
import ProgramUnggulan from "./pages/ProgramUnggulan";
import ValueProposition from "./pages/ValueProposition";
import GeneratorNama from "./pages/GeneratorNama";
import DnaSekolah from "./pages/DnaSekolah";
import ModelBisnis from "./pages/ModelBisnis";
import MarketingPPDB from "./pages/MarketingPPDB";
import KontenMarketing from "./pages/KontenMarketing";
import KonsultanAI from "./pages/KonsultanAI";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/riset-market" element={<RisetMarket />} />
          <Route path="/analisis-kompetitor" element={<AnalisisKompetitor />} />
          <Route path="/positioning" element={<Positioning />} />
          <Route path="/program-unggulan" element={<ProgramUnggulan />} />
          <Route path="/value-proposition" element={<ValueProposition />} />
          <Route path="/generator-nama" element={<GeneratorNama />} />
          <Route path="/dna-sekolah" element={<DnaSekolah />} />
          <Route path="/model-bisnis" element={<ModelBisnis />} />
          <Route path="/marketing-ppdb" element={<MarketingPPDB />} />
          <Route path="/konten-marketing" element={<KontenMarketing />} />
          <Route path="/konsultan-ai" element={<KonsultanAI />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
