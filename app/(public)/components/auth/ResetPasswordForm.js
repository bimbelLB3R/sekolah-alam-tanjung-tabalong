"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setMsg("Token tidak ditemukan. Cek kembali link dari email.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMsg("Password dan konfirmasi tidak sama.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setMsg(data.message);
    setLoading(false);

    if (res.ok) {
      setTimeout(() => router.push("/login"), 2000); // redirect ke login
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-10 p-4">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Password baru"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Konfirmasi password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading || !token} className="w-full">
            {loading ? "Menyimpan..." : (
              <>
                <Lock className="mr-2 h-4 w-4" /> Simpan Password
              </>
            )}
          </Button>
          {msg && <p className="text-sm mt-2">{msg}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
