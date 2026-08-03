"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { LogOut, Calendar, ShieldCheck, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const formattedDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const timelineSteps = [
    { label: "Joined the Founding Club", done: true },
    { label: "Pilot Launch Prep", done: false },
    { label: "Participating Businesses Live", done: false },
    { label: "Public Launch", done: false },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#FEFCFA] text-[#1C1917] font-sans antialiased pb-12">
        {/* Navigation */}
        <header className="border-b border-[#F3F0EB] bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🍞</span>
              <span className="font-extrabold text-sm tracking-tight font-display">
                Very Last Bite
              </span>
            </div>
            <button
              onClick={() => signOut().then(() => router.push("/"))}
              className="flex items-center gap-2 text-xs font-semibold text-[#78716C] hover:text-[#1C1917] transition-colors py-2 px-3 rounded-lg hover:bg-[#F5F0EA]"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="max-w-2xl mx-auto px-6 pt-10 space-y-8">
          
          {/* Welcome Card */}
          <section className="space-y-3">
            <span className="inline-block text-[10px] font-bold tracking-wider uppercase text-[#B45309] bg-[#B45309]/10 rounded-full px-3 py-1">
              Founding Member Dashboard
            </span>
            <h1 className="text-3xl font-black font-display tracking-tight leading-tight">
              Welcome to the Founding Club
            </h1>
            <p className="text-sm text-[#78716C] leading-relaxed">
              You&apos;re one of the first members helping bring Very Last Bite to life before its official launch.
            </p>
          </section>

          {/* Membership Card */}
          <section>
            <div className="relative overflow-hidden bg-gradient-to-br from-[#1C1917] to-[#292524] text-[#FAFAF9] rounded-2xl p-6 shadow-xl border border-white/5">
              {/* Subtle background glow */}
              <div className="absolute -right-16 -top-16 w-36 h-36 rounded-full bg-[#B45309]/20 blur-2xl pointer-events-none" />
              
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-wider text-[#A8A29E] font-medium">Membership</div>
                  <h2 className="text-lg font-black font-display tracking-tight">Founding Club Member</h2>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D97706]/20 text-[#F59E0B] border border-[#F59E0B]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                  Active Status
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-xs">
                <div>
                  <div className="text-[#A8A29E] font-medium mb-1 flex items-center gap-1">
                    <Calendar size={12} className="text-[#D97706]" /> Join Date
                  </div>
                  <div className="font-bold">{formattedDate}</div>
                </div>
                <div>
                  <div className="text-[#A8A29E] font-medium mb-1 flex items-center gap-1">
                    <ShieldCheck size={12} className="text-[#D97706]" /> Member Since
                  </div>
                  <div className="font-bold">{new Date().getFullYear()}</div>
                </div>
              </div>
            </div>
          </section>

          {/* Journey timeline */}
          <section className="bg-white border border-[#F3F0EB] rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#57534E] font-display">
              Your Journey
            </h3>
            
            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#F3F0EB]">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-3">
                  <div className="absolute -left-[21px] mt-0.5 bg-white p-0.5 rounded-full z-10">
                    {step.done ? (
                      <CheckCircle2 size={16} className="text-[#B45309]" />
                    ) : (
                      <Circle size={16} className="text-[#E7E5E4]" />
                    )}
                  </div>
                  <div className="text-xs">
                    <span className={`font-semibold ${step.done ? "text-[#1C1917]" : "text-[#A8A29E]"}`}>
                      {step.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Updates & Announcements */}
          <section className="bg-[#F5F0EA] border border-[#EDE9E3] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#57534E] font-display">
              Latest Updates
            </h3>
            <div className="space-y-4">
              <div className="bg-white/60 rounded-xl p-4 border border-[#EDE9E3]/60">
                <div className="text-[10px] font-bold text-[#B45309] uppercase tracking-wider mb-1">
                  System Update
                </div>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  We&apos;re currently preparing for launch and welcoming participating food businesses. We&apos;ll keep you updated as we continue building Very Last Bite.
                </p>
              </div>
            </div>
          </section>

          {/* Start Discovering placeholder for future launch */}
          <section className="pt-2">
            <div className="opacity-40 pointer-events-none cursor-not-allowed border border-dashed border-[#EDE9E3] rounded-2xl p-5 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#1C1917]">Discover Food</h4>
                <p className="text-[10px] text-[#78716C] mt-0.5">Will become active when the pilot launches</p>
              </div>
              <button className="flex items-center gap-1 text-xs font-bold text-[#B45309]">
                <span>Start Discovering Food</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </section>

        </main>
      </div>
    </AuthGuard>
  );
}
