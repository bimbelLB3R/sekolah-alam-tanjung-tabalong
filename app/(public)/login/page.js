"use client";
import { Suspense } from "react";
import LoginWithCallback from "../components/login/LoginWithCallback";

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading...</p>}>
      <LoginWithCallback />
    </Suspense>
  );
}
