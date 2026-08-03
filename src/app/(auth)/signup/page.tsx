"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
    <div className="min-h-[100dvh] w-full flex bg-[#FEFCFA]">
      {/* Left Column — Sign Up Form Container */}
      <div className="w-full lg:w-[54%] flex flex-col justify-between p-6 sm:p-12 lg:p-16 min-h-[100dvh]">
        {/* Logo */}
        <div className="mb-6 sm:mb-10 lg:mb-0">
          <Link
            href="/"
            className="inline-block text-2xl sm:text-3xl font-black tracking-tight hover:opacity-90 transition-opacity"
            style={{ fontFamily: "var(--font-display)", color: "#1C1917" }}
          >
            Very Last Bite
          </Link>
        </div>

        {/* Form Container Stack — Positioned slightly higher on mobile (pt-2 sm:pt-0 my-auto) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-[460px] mx-auto pt-2 pb-6 sm:py-12 lg:my-auto flex flex-col items-stretch"
        >
          {/* Group 1: Badge & Title */}
          <div className="mb-7 sm:mb-11">
            <div className="inline-flex items-center text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[#B45309] bg-[#B45309]/10 rounded-full px-4 py-1.5 mb-3.5 sm:mb-5">
              Founding Club Member
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-[40px] font-black tracking-tight leading-[1.12] mb-3 sm:mb-4"
              style={{ fontFamily: "var(--font-display)", color: "#1C1917" }}
            >
              Join the Founding Club
            </h1>

            <p className="text-sm sm:text-base text-[#78716C] leading-relaxed max-w-[380px]">
              Become part of the first Very Last Bite community before our official launch.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-4 text-xs sm:text-sm text-red-600 bg-red-500/10 border border-red-500/20 rounded-xl text-center mb-7">
              {error}
            </div>
          )}

          {/* Group 2: Continue with Google */}
          <motion.button
            whileTap={{ scale: 0.985 }}
            disabled={googleLoading || loading}
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full py-4 px-5 min-h-[52px] rounded-xl font-semibold text-sm sm:text-base text-[#1C1917] bg-white border border-[#E7E5E4] flex items-center justify-center gap-3.5 shadow-xs hover:border-[#D6D3D1] hover:bg-[#FAF8F5] transition-all disabled:opacity-50 mb-7 sm:mb-10"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
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

          {/* Group 3: Divider */}
          <div className="relative flex items-center justify-center mb-7 sm:mb-10">
            <div className="border-t border-[#E7E5E4] w-full" />
            <span className="bg-[#FEFCFA] px-4 text-xs font-bold uppercase tracking-widest text-[#A8A29E] absolute">
              or with email
            </span>
          </div>

          {/* Group 4: Email Form */}
          <form onSubmit={handleSignup} className="flex flex-col">
            <div className="space-y-4 mb-7 sm:mb-8">
              <div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-4.5 py-4 min-h-[52px] rounded-xl outline-none text-base transition-all duration-200"
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
                  className="w-full px-4.5 py-4 min-h-[52px] rounded-xl outline-none text-base transition-all duration-200"
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
                  className="w-full px-4.5 py-4 min-h-[52px] rounded-xl outline-none text-base transition-all duration-200"
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

            {/* Group 5: Primary Action Button */}
            <motion.button
              whileTap={{ scale: 0.985 }}
              disabled={loading || googleLoading}
              type="submit"
              className="w-full py-4 px-5 min-h-[52px] rounded-xl font-bold text-base text-[#1C1917] transition-all disabled:opacity-50 shadow-sm hover:brightness-105"
              style={{
                background: "#F59E0B",
              }}
            >
              {loading ? "Joining Founding Club..." : "Join the Founding Club"}
            </motion.button>
          </form>

          {/* Group 6: Footer Link */}
          <p className="text-center text-sm text-[#78716C] mt-7 sm:mt-10">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#B45309] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </motion.div>

        {/* Footer Info */}
        <div className="text-xs text-[#A8A29E] text-center lg:text-left pt-4">
          © {new Date().getFullYear()} Very Last Bite. Built with purpose.
        </div>
      </div>

      {/* Right Column — Brand Panel (Desktop only) */}
      <div className="hidden lg:flex lg:w-[46%] relative bg-[#1C1917] p-12 lg:p-16 text-[#FAFAF9] flex-col justify-between overflow-hidden">
        {/* Background Image & Overlay */}
        <Image
          src="/community-warmth.png"
          alt="Very Last Bite Community"
          fill
          quality={90}
          className="object-cover opacity-35 filter contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/70 to-[#1C1917]/30" />

        {/* Top Tag */}
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#F59E0B] bg-[#F59E0B]/15 border border-[#F59E0B]/30 rounded-full px-4 py-1.5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
            Stellenbosch Pilot Launch
          </span>
        </div>

        {/* Bottom Messaging Card */}
        <div className="relative z-10 max-w-lg space-y-4">
          <blockquote
            className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug text-[#FAFAF9]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            &ldquo;Very Last Bite is being built alongside its founding members — connecting food lovers with exceptional local cafés, bakeries and food businesses.&rdquo;
          </blockquote>
          <p className="text-xs font-semibold text-[#A8A29E] uppercase tracking-wider">
            The Founding Team · Very Last Bite
          </p>
        </div>
      </div>
    </div>
  );
}
