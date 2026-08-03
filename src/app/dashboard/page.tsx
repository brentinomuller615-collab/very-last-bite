"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { LogOut, Calendar, Megaphone, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const creationTime = user?.metadata?.creationTime;
  const joinDate = creationTime
    ? new Date(creationTime).toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#FEFCFA] text-[#1C1917] font-sans antialiased">
        {/* Navigation */}
        <header className="border-b border-[#F3F0EB] bg-white sticky top-0 z-50">
          <div className="max-w-xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🍞</span>
              <span className="font-black text-sm tracking-tight font-display text-[#1C1917]">
                Very Last Bite
              </span>
            </div>
            <button
              onClick={() => signOut().then(() => router.push("/"))}
              className="flex items-center gap-2 text-xs font-semibold text-[#B45309] hover:text-[#92400E] transition-colors"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="max-w-xl mx-auto px-6 pt-14 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            {/* Icon Circle */}
            <div className="w-20 h-20 rounded-full bg-[#FEF3C7] flex items-center justify-center mb-7">
              <UserCheck size={34} className="text-[#B45309]" />
            </div>

            {/* Badge */}
            <span className="inline-flex items-center text-[11px] font-bold tracking-wider uppercase text-[#B45309] bg-[#FEF3C7] rounded-full px-4 py-1.5 mb-5">
              Founding Club Member
            </span>

            {/* Heading */}
            <h1
              className="text-[52px] sm:text-[64px] font-black tracking-tight leading-none text-[#1C1917] mb-5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Welcome!
            </h1>

            {/* Supporting text */}
            <p className="text-base sm:text-lg text-[#78716C] leading-relaxed max-w-sm mx-auto mb-12">
              Thank you for joining the Very Last Bite Founding Club.
            </p>

            {/* Cards */}
            <div className="w-full space-y-4 text-left">
              {/* Member Since Card */}
              <div className="bg-white border border-[#F3F0EB] rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] flex items-center justify-center shrink-0">
                  <Calendar size={22} className="text-[#B45309]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1C1917] mb-0.5">Member Since</div>
                  <div className="text-sm text-[#78716C]">
                    {joinDate ?? "—"}
                  </div>
                </div>
              </div>

              {/* What's Next Card */}
              <div className="bg-white border border-[#F3F0EB] rounded-2xl p-5 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] flex items-center justify-center shrink-0 mt-0.5">
                  <Megaphone size={22} className="text-[#B45309]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1C1917] mb-1">What&apos;s Next?</div>
                  <p className="text-sm text-[#78716C] leading-relaxed">
                    We&apos;re currently preparing for launch and welcoming participating cafés, bakeries, restaurants and food businesses. We&apos;ll let you know when Very Last Bite is ready.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-14 flex flex-col items-center gap-3">
              <span className="text-2xl">❤️</span>
              <p className="text-sm text-[#78716C] leading-relaxed text-center max-w-xs">
                Together, we&apos;re building something that matters.
              </p>
            </div>
          </motion.div>
        </main>
      </div>
    </AuthGuard>
  );
}
