'use client'

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyResetOTP() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const verify = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const res = await fetch("/api/auth/verify-reset-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    if (data.success) {
      router.push(`/reset-password?email=${email}`);
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">

        <h2 className="text-3xl font-bold text-white text-center mb-4">
          Enter OTP
        </h2>

        <p className="text-gray-400 text-center mb-6">
          A reset code was sent to <span className="text-white font-semibold">{email}</span>
        </p>

        <form onSubmit={verify} className="space-y-4">
          <input
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pharmed-blue focus:border-transparent"
            placeholder="6-digit OTP"
            value={otp}
            maxLength={6}
            onChange={(e) => setOtp(e.target.value)}
          />

          {error && (
            <p className="text-red-400 bg-red-900/40 border border-red-600 p-2 rounded-lg text-center">
              {error}
            </p>
          )}

          <button
            className="w-full bg-pharmed-blue hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            Verify OTP
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Didn’t receive the code?
          <span className="text-pharmed-blue hover:underline ml-1 cursor-pointer">
            Resend OTP
          </span>
        </div>
      </div>
    </div>
  );
}
