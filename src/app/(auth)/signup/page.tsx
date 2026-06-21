"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth, formatAuthError } from "@/contexts/AuthContext";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signUp(email, password, name);
      router.push("/");
    } catch (err: any) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="text-center space-y-2">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6"
            style={{
              background: "linear-gradient(135deg, var(--accent-orange-dark), var(--accent-orange))",
              boxShadow: "var(--glow-orange-strong)",
            }}
          >
            🍱
          </div>
          <h1
            className="text-3xl font-black"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Create Account
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Join the surplus food rescue movement
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  border: "2px solid var(--border-subtle)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-orange)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-subtle)")}
              />
            </div>
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  border: "2px solid var(--border-subtle)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-orange)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-subtle)")}
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 chars)"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  border: "2px solid var(--border-subtle)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-orange)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-subtle)")}
              />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="w-full py-4 rounded-xl font-bold text-white transition-opacity disabled:opacity-50 mt-4"
            style={{
              background: "linear-gradient(135deg, var(--accent-orange-dark), var(--accent-orange))",
              boxShadow: "var(--glow-orange)",
            }}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </motion.button>
        </form>

        <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold transition-colors hover:opacity-80"
            style={{ color: "var(--accent-orange)" }}
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
