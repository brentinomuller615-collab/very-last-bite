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
        {/* Navigation */}
        <header className="border-b border-[#F3F0EB] bg-[#FEFCFA] sticky top-0 z-50">
          <div className="max-w-xl mx-auto px-6 h-16 flex items-center justify-between">
            <span
              className="font-black text-sm tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Very Last Bite
            </span>
            <button
              onClick={() => signOut().then(() => router.push("/"))}
              className="flex items-center gap-2 text-xs font-semibold text-[#B45309] hover:opacity-75 transition-opacity"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-xl mx-auto px-6 pt-20 sm:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Badge */}
            <p className="text-[11px] font-bold tracking-widest uppercase text-[#B45309] mb-6">
              Founding Club Member
            </p>

            {/* Heading */}
            <h1
              className="text-5xl sm:text-6xl font-black tracking-tight leading-none text-[#1C1917] mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Welcome!
            </h1>

            {/* Thank you */}
            <p className="text-base sm:text-lg text-[#78716C] leading-relaxed mb-4">
              Thanks for joining the Very Last Bite Founding Club.
            </p>

            {/* Member since — inline metadata */}
            {joinDate && (
              <p className="text-sm text-[#A8A29E] mb-10">
                Member since {joinDate}.
              </p>
            )}

            {/* Closing line */}
            <p className="text-base sm:text-lg text-[#78716C] leading-relaxed">
              We&apos;ll let you know as soon as Very Last Bite is ready.
            </p>
          </motion.div>
        </main>
      </div>
    </AuthGuard>
  );
}
