"use client";
import { useRouter } from "next/navigation";

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  loading,
  message,
}) {
  const router = useRouter();

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
