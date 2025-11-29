"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginForm from "./LoginForm";

export default function LoginWithCallback() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams(); 
//   ✅ AMAN karena dibungkus Suspense

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const data = await res.json();

    if (res.ok) {
      setMessage(`✅ ${data.message}, Selamat datang ${data.user.name}`);

      const callbackUrl = searchParams.get("callbackUrl");
      const safeRedirect = callbackUrl?.startsWith("/")
        ? callbackUrl
        : "/dashboard";

      setTimeout(() => {
        router.replace(safeRedirect);
      }, 1000);
    } else {
      setMessage(`❌ ${data.error}`);
    }

    setLoading(false);
  };

  return (
    <LoginForm
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      loading={loading}
      message={message}
    />
  );
}
