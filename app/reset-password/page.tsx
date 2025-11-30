'use client'
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPassword() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const reset = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword: password }),
    });

    const data = await res.json();

    if (data.success) {
      router.push("/");
    } else {
      setMsg(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <form
        onSubmit={reset}
        className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

        <input
          type="password"
          className="w-full p-3 bg-gray-700 rounded-lg mb-3"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {msg && <p className="text-red-400 mb-2">{msg}</p>}

        <button className="w-full bg-pharmed-blue py-3 rounded-lg">
          Reset Password
        </button>
      </form>
    </div>
  );
}
