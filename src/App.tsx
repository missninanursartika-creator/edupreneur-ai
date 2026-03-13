import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";
import PendingApproval from "./pages/PendingApproval";
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
import SwotAnalyzer from "./pages/SwotAnalyzer";
import Riwayat from "./pages/Riwayat";
import Profil from "./pages/Profil";
import AnalisisJatidiri from "./pages/AnalisisJatidiri";
import IdeJatidiriAI from "./pages/IdeJatidiriAI";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isApproved } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Memuat...</div>;
  if (!user) return <Navigate to="/" replace />;
  if (!isApproved) return <PendingApproval />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isApproved } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Memuat...</div>;
  if (user && isApproved) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Auth /></PublicRoute>} />
      <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
      <Route path="/admin" element={<AdminAuth />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/riset-market" element={<ProtectedRoute><RisetMarket /></ProtectedRoute>} />
      <Route path="/analisis-kompetitor" element={<ProtectedRoute><AnalisisKompetitor /></ProtectedRoute>} />
      <Route path="/positioning" element={<ProtectedRoute><Positioning /></ProtectedRoute>} />
      <Route path="/program-unggulan" element={<ProtectedRoute><ProgramUnggulan /></ProtectedRoute>} />
      <Route path="/value-proposition" element={<ProtectedRoute><ValueProposition /></ProtectedRoute>} />
      <Route path="/generator-nama" element={<ProtectedRoute><GeneratorNama /></ProtectedRoute>} />
      <Route path="/dna-sekolah" element={<ProtectedRoute><DnaSekolah /></ProtectedRoute>} />
      <Route path="/model-bisnis" element={<ProtectedRoute><ModelBisnis /></ProtectedRoute>} />
      <Route path="/analisis-jatidiri" element={<ProtectedRoute><AnalisisJatidiri /></ProtectedRoute>} />
      <Route path="/ide-jatidiri-ai" element={<ProtectedRoute><IdeJatidiriAI /></ProtectedRoute>} />
      <Route path="/marketing-ppdb" element={<ProtectedRoute><MarketingPPDB /></ProtectedRoute>} />
      <Route path="/konten-marketing" element={<ProtectedRoute><KontenMarketing /></ProtectedRoute>} />
      <Route path="/konsultan-ai" element={<ProtectedRoute><KonsultanAI /></ProtectedRoute>} />
      <Route path="/swot-analyzer" element={<ProtectedRoute><SwotAnalyzer /></ProtectedRoute>} />
      <Route path="/riwayat" element={<ProtectedRoute><Riwayat /></ProtectedRoute>} />
      <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
