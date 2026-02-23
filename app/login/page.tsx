"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginUser } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(email, password);

      // ✅ Admin check
      if (data.user.role !== "admin") {
        setError("Access Denied: Only administrators can access this panel");
        return;
      }

      // ✅ Save token
      localStorage.setItem("admin_token", data.accessToken);

      router.replace("/master");
    } catch (err: any) {
      setError(err?.message || "Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="Logo" width={98} height={96} />
          <h1 className="text-2xl font-bold text-gray-800 mt-4">
            Jal Jeevan Mission
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#136FB6] outline-none"
              placeholder="user@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#136FB6] outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#136FB6] hover:bg-[#105E9A] text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
