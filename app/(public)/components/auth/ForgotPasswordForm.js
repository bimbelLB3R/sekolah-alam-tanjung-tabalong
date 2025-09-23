"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMsg(data.message);
    setLoading(false);
  };

  return (
    <Card className="max-w-md mx-auto mt-10 p-4">
      <CardHeader>
        <CardTitle>Lupa Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Mengirim..." : <><Mail className="mr-2 h-4 w-4"/> Kirim Link Reset</>}
          </Button>
          {msg && <p className="text-sm mt-2">{msg}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
