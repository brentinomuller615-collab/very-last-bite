"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth, formatAuthError } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  const { signIn, resetPassword } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);

      // Firebase has verified the credentials. Now force-refresh the ID token
      // to read the latest custom claims — role comes from the JWT, not the email.
      const tokenResult = await auth.currentUser!.getIdTokenResult(/* forceRefresh */ true);
      const claimRole = tokenResult.claims["role"] as string | undefined;

      const destination =
        claimRole === "admin"      ? "/admin" :
        claimRole === "restaurant" ? "/bakery/dashboard" :
        "/spin";

      const reason =
        claimRole === "admin"
          ? "role claim is 'admin'"
          : claimRole === "restaurant"
            ? "role claim is 'restaurant'"
            : "no matching role claim found (defaulting to customer)";

      console.group("[DEBUG] Auth State & Routing Audit");
      console.log("- user.email:", auth.currentUser?.email);
      console.log("- user.uid:", auth.currentUser?.uid);
      console.log("- tokenResult.claims:", tokenResult.claims);
      console.log("- tokenResult.claims.role:", claimRole);
      console.log("- the route the application chooses:", destination);
      console.log("- the reason for that route:", reason);
      console.groupEnd();

      router.push(destination);
    } catch (err: any) {
      setError(formatAuthError(err));
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email to reset password.");
      return;
    }

    try {
      setError("");
      setResetMessage("");
      await resetPassword(email);
      setResetMessage("Password reset email sent! Check your inbox.");
    } catch (err: any) {
      setError(formatAuthError(err));
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
            Welcome Back
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Sign in to discover surplus food deals
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
              {error}
            </div>
          )}
          {resetMessage && (
            <div className="p-3 text-sm text-green-500 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
              {resetMessage}
            </div>
          )}

          <div className="space-y-4">
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
                placeholder="Password"
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

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--accent-orange)" }}
            >
              Forgot password?
            </button>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="w-full py-4 rounded-xl font-bold text-white transition-opacity disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, var(--accent-orange-dark), var(--accent-orange))",
              boxShadow: "var(--glow-orange)",
            }}
          >
            {loading ? "Signing In…" : "Sign In"}
          </motion.button>
        </form>

        <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-bold transition-colors hover:opacity-80"
            style={{ color: "var(--accent-orange)" }}
          >
            Sign up
          </Link>
        </p>

        <div className="text-center pt-6 border-t border-dashed border-[#8B6B42]/20">
          <Link
            href="/bakery"
            className="text-xs font-semibold hover:opacity-80 transition-opacity"
            style={{ color: "var(--text-secondary)" }}
          >
            Own a bakery? Partner with us
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
