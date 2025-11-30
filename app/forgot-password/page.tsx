'use client'

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail] = useState(params.get("email") || "");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      router.push(`/verify-reset-otp?email=${email}`);
    } else {
      setMsg(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Forgot Password
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Enter your email and we’ll send you a reset OTP.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white 
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pharmed-blue 
                         focus:border-transparent transition-all"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {msg && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
              {msg}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full bg-pharmed-blue hover:bg-blue-600 text-white font-semibold 
                       py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed 
                       shadow-lg hover:shadow-xl"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          <p className="text-center text-sm text-gray-400 mt-4">
            Remember your password?{" "}
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-pharmed-blue hover:underline font-medium"
            >
              Back to Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
