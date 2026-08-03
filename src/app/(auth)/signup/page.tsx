"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth, formatAuthError } from "@/contexts/AuthContext";
import { createUserRoleIfMissing } from "@/lib/userRoles";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signUp(email, password, name);
      const currentUser = (await import("@/lib/firebase")).auth.currentUser;
      if (currentUser) {
        await createUserRoleIfMissing(currentUser.uid, email, "customer");
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
      const currentUser = (await import("@/lib/firebase")).auth.currentUser;
      if (currentUser) {
        await createUserRoleIfMissing(currentUser.uid, currentUser.email || "", "customer");
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(formatAuthError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-[#FEFCFA]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="text-center space-y-3">
          <Link
            href="/"
            className="inline-block text-2xl font-black tracking-tight mb-2"
            style={{ fontFamily: "var(--font-display)", color: "#1C1917" }}
          >
            Very Last Bite
          </Link>
          <div className="inline-block text-[10px] font-bold tracking-wider uppercase text-[#B45309] bg-[#B45309]/10 rounded-full px-3 py-1 mb-1">
            Founding Club Member
          </div>
          <h1
            className="text-3xl font-black tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "#1C1917" }}
          >
            Join the Founding Club
          </h1>
          <p className="text-xs leading-relaxed" style={{ color: "#78716C" }}>
            Become part of the first Very Last Bite community before our official launch.
          </p>
        </div>

        {error && (
          <div className="p-4 text-xs text-red-600 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Continue with Google */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          disabled={googleLoading || loading}
          onClick={handleGoogleSignIn}
          type="button"
          className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm text-[#1C1917] bg-white border border-[#E7E5E4] flex items-center justify-center gap-3 shadow-sm hover:border-[#D6D3D1] transition-all disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{googleLoading ? "Connecting..." : "Continue with Google"}</span>
        </motion.button>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-[#E7E5E4] w-full" />
          <span className="bg-[#FEFCFA] px-3 text-[11px] uppercase tracking-wider text-[#A8A29E] font-semibold absolute">
            or with email
          </span>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-3">
            <div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-3.5 rounded-xl outline-none text-sm transition-all duration-200"
                style={{
                  background: "#FFFFFF",
                  color: "#1C1917",
                  border: "1px solid #E7E5E4",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#B45309")}
                onBlur={(e) => (e.target.style.borderColor = "#E7E5E4")}
              />
            </div>
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-4 py-3.5 rounded-xl outline-none text-sm transition-all duration-200"
                style={{
                  background: "#FFFFFF",
                  color: "#1C1917",
                  border: "1px solid #E7E5E4",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#B45309")}
                onBlur={(e) => (e.target.style.borderColor = "#E7E5E4")}
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 chars)"
                className="w-full px-4 py-3.5 rounded-xl outline-none text-sm transition-all duration-200"
                style={{
                  background: "#FFFFFF",
                  color: "#1C1917",
                  border: "1px solid #E7E5E4",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#B45309")}
                onBlur={(e) => (e.target.style.borderColor = "#E7E5E4")}
              />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={loading || googleLoading}
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-opacity disabled:opacity-50"
            style={{
              background: "#F59E0B",
              color: "#1C1917",
            }}
          >
            {loading ? "Joining Founding Club..." : "Join the Founding Club"}
          </motion.button>
        </form>

        <p className="text-center text-xs text-[#78716C]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-[#B45309] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
