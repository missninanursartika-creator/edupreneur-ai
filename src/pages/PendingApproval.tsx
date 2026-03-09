import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export default function PendingApproval() {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-full bg-muted">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="text-xl">Menunggu Persetujuan</CardTitle>
          <CardDescription>
            Akun Anda sedang menunggu persetujuan dari admin. Anda akan mendapatkan akses setelah admin menyetujui pendaftaran Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={signOut} className="w-full">
            Keluar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
