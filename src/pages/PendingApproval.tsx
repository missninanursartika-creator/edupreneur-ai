import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Lock, LogOut } from "lucide-react";

export default function PendingApproval() {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(222,47%,11%)] to-[hsl(217,33%,17%)] p-4">
      <Card className="w-full max-w-lg border-0 shadow-2xl bg-card/95 backdrop-blur">
        <CardHeader className="text-center pb-2 pt-8">
          <div className="flex justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-green-500/15">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="p-3 rounded-full bg-amber-500/15">
              <Lock className="h-8 w-8 text-amber-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Pendaftaran Berhasil! Satu Langkah Lagi...
          </CardTitle>
          <CardDescription className="text-base mt-3 leading-relaxed">
            Akun Anda telah terdaftar namun masih dalam status{" "}
            <span className="font-semibold text-amber-500">Belum Aktif</span>.
            Untuk mulai menggunakan fitur Audit Marketing & AI, silakan
            selesaikan pembayaran lisensi Anda terlebih dahulu. Setelah
            pembayaran terkonfirmasi, Admin akan segera mengaktifkan akun Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-4 pb-8">
          <Button
            asChild
            size="lg"
            className="w-full text-base font-bold h-14 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-900 shadow-lg shadow-amber-500/25"
          >
            <a
              href="https://growthschool.myscalev.com/co-asistenbranding"
              target="_blank"
              rel="noopener noreferrer"
            >
              💳 BAYAR LISENSI SEKARANG
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full text-base h-12 border-green-500/50 text-green-600 hover:bg-green-500/10 hover:text-green-500"
          >
            <a
              href="https://wa.me/6289649936466?text=Halo%20Admin,%20saya%20sudah%20melakukan%20pembayaran%20lisensi%20GrowthSchool.%20Mohon%20aktifkan%20akun%20saya."
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 Sudah Bayar? Konfirmasi via WhatsApp
            </a>
          </Button>

          <div className="pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="w-full text-muted-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
