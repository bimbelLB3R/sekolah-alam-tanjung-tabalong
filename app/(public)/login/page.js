"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false) // 🔄 state loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(`✅ ${data.message}, Selamat datang ${data.user.name}`);
      setLoading(false)
      // arahkan ke dashboard setelah 1 detik
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      setMessage(`❌ ${data.error}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-96 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Forgot Password link */}
        <div className="text-right">
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="text-sm text-green-500 hover:underline"
          >
            Lupa Password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
          disabled={loading}
        >
          {loading ? "proses masuk..." : "Login"}
        </button>
        {message && <p className="text-center mt-2">{message}</p>}
      </form>
    </div>
  );
}
