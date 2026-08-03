"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const joinDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#FEFCFA] text-[#1C1917] font-sans antialiased">

        {/* Navigation — full width, slightly taller */}
        <header className="border-b border-[#F0EDE8] bg-[#FEFCFA] sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-8 sm:px-12 h-[68px] flex items-center justify-between">
            <span
              className="font-black text-base tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "#1C1917" }}
            >
              Very Last Bite
            </span>
            <button
              onClick={() => signOut().then(() => router.push("/"))}
              className="flex items-center gap-2 text-xs font-semibold text-[#B45309] hover:opacity-70 transition-opacity"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex justify-center px-6 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-[640px] text-center"
            style={{ paddingTop: "72px" }}
          >

            {/* Badge */}
            <div style={{ marginBottom: "24px" }}>
              <span
                className="inline-block text-[11px] font-bold tracking-[0.12em] uppercase bg-[#FEF3C7] text-[#B45309] rounded-full px-4 py-1.5"
              >
                Founding Club Member
              </span>
            </div>

            {/* Heading */}
            <h1
              className="font-black tracking-tight leading-none text-[#1C1917]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(52px, 8vw, 72px)",
                marginBottom: "24px",
              }}
            >
              Welcome!
            </h1>

            {/* Thank-you message */}
            <p
              className="text-[#78716C] leading-relaxed mx-auto"
              style={{
                fontSize: "clamp(17px, 2.5vw, 18px)",
                maxWidth: "520px",
                marginBottom: "20px",
              }}
            >
              Thank you for joining the Very Last Bite Founding Club.
            </p>

            {/* Member since — quiet metadata */}
            {joinDate && (
              <div style={{ marginBottom: "48px" }}>
                <p className="text-sm text-[#A8A29E]">
                  Member since {joinDate}
                </p>
              </div>
            )}

            {/* Final sentence */}
            <p
              className="text-[#78716C] leading-relaxed mx-auto"
              style={{
                fontSize: "clamp(17px, 2.5vw, 18px)",
                maxWidth: "520px",
              }}
            >
              We&apos;ll let you know as soon as Very Last Bite is ready.
            </p>

          </motion.div>
        </main>

      </div>
    </AuthGuard>
  );
}
