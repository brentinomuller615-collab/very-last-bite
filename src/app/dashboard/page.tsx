"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import {
  LogOut,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Store,
  Sparkles,
  Lock,
  ArrowRight,
  Bell,
} from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Parse join date directly from Firebase Auth user metadata
  const creationTime = user?.metadata?.creationTime;
  const joinDateObj = creationTime ? new Date(creationTime) : new Date();
  const formattedJoinDate = joinDateObj.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const memberSinceYear = joinDateObj.getFullYear();

  const timelineSteps = [
    {
      title: "Joined the Founding Club",
      supporting: "You're part of the first community helping bring Very Last Bite to life.",
      done: true,
      icon: CheckCircle2,
    },
    {
      title: "Pilot Launch Prep",
      supporting: "Finalising app infrastructure and local pilot testing in Stellenbosch.",
      done: false,
      icon: Clock,
    },
    {
      title: "Participating Businesses Live",
      supporting: "Onboarding participating cafés, bakeries, restaurants and food businesses.",
      done: false,
      icon: Store,
    },
    {
      title: "Public Launch",
      supporting: "Opening surplus food discovery and spin reservations to founding members.",
      done: false,
      icon: Sparkles,
    },
  ];

  const updates = [
    {
      id: "1",
      category: "Launch Preparation",
      title: "Welcoming Participating Food Businesses",
      description:
        "We're currently preparing for launch in Stellenbosch and welcoming participating local cafés, bakeries, restaurants and food businesses. We'll keep you updated right here as we continue building Very Last Bite.",
      date: "August 2026",
    },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#FEFCFA] text-[#1C1917] font-sans antialiased pb-20">
        {/* Navigation Bar */}
        <header className="border-b border-[#F3F0EB] bg-white/85 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🍞</span>
              <span className="font-black text-sm tracking-tight font-display text-[#1C1917]">
                Very Last Bite
              </span>
            </div>
            <button
              onClick={() => signOut().then(() => router.push("/"))}
              className="flex items-center gap-2 text-xs font-semibold text-[#78716C] hover:text-[#1C1917] transition-colors py-2 px-3.5 rounded-xl hover:bg-[#F5F0EA] border border-transparent hover:border-[#E7E5E4]"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Dashboard Main Container */}
        <main className="max-w-2xl mx-auto px-6 pt-10 sm:pt-14 space-y-12 sm:space-y-14">
          {/* Welcome Section */}
          <section className="space-y-4">
            <div>
              <span className="inline-flex items-center text-xs font-bold tracking-wider uppercase text-[#B45309] bg-[#B45309]/10 rounded-full px-3.5 py-1.5 mb-4">
                Founding Member Dashboard
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-[#1C1917] leading-tight">
              Welcome to the Founding Club
            </h1>

            <p className="text-sm sm:text-base text-[#78716C] leading-relaxed max-w-xl">
              You&apos;re one of the first members helping bring Very Last Bite to life before its official launch.
            </p>
          </section>

          {/* Membership Card */}
          <section>
            <div className="relative overflow-hidden bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#1C1917] text-[#FAFAF9] rounded-2xl p-7 sm:p-8 shadow-xl border border-white/10">
              {/* Glow element */}
              <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-[#B45309]/20 blur-3xl pointer-events-none" />

              {/* Card Header Row */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#A8A29E] mb-1">
                    Membership Status
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-[#FAFAF9]">
                    Founding Club Member
                  </h2>
                </div>

                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D97706]/20 text-[#F59E0B] border border-[#F59E0B]/30 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                  Active Status
                </span>
              </div>

              {/* Account Metadata Row */}
              <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-6 text-xs sm:text-sm">
                <div>
                  <div className="text-[#A8A29E] font-medium mb-1 flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#F59E0B]" />
                    <span>Join Date</span>
                  </div>
                  <div className="font-bold text-[#FAFAF9]">{formattedJoinDate}</div>
                </div>

                <div>
                  <div className="text-[#A8A29E] font-medium mb-1 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-[#F59E0B]" />
                    <span>Member Since</span>
                  </div>
                  <div className="font-bold text-[#FAFAF9]">{memberSinceYear}</div>
                </div>
              </div>
            </div>
          </section>

          {/* Journey Section */}
          <section className="bg-white border border-[#F3F0EB] rounded-2xl p-7 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-[#F3F0EB]">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#57534E] font-display">
                Your Journey
              </h3>
              <span className="text-xs font-medium text-[#78716C]">Stellenbosch Pilot</span>
            </div>

            <div className="relative pl-7 space-y-7 before:absolute before:left-[11px] before:top-2.5 before:bottom-2.5 before:w-[2px] before:bg-[#F3F0EB]">
              {timelineSteps.map((step, idx) => {
                const IconComponent = step.icon;
                return (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div className="absolute -left-[27px] mt-0.5 bg-white p-0.5 rounded-full z-10">
                      {step.done ? (
                        <IconComponent size={18} className="text-[#B45309]" />
                      ) : (
                        <IconComponent size={18} className="text-[#D6D3D1]" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <div
                        className={`text-sm font-bold ${
                          step.done ? "text-[#1C1917]" : "text-[#78716C]"
                        }`}
                      >
                        {step.title}
                      </div>
                      <p className="text-xs text-[#78716C] leading-relaxed">
                        {step.supporting}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Latest Updates Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-[#B45309]" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#57534E] font-display">
                Latest Updates
              </h3>
            </div>

            <div className="space-y-4">
              {updates.map((update) => (
                <div
                  key={update.id}
                  className="bg-[#F5F0EA] border border-[#EDE9E3] rounded-2xl p-6 space-y-3 transition-shadow hover:shadow-xs"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#B45309] uppercase tracking-wider text-[11px]">
                      {update.category}
                    </span>
                    <span className="text-[#A8A29E] font-medium">{update.date}</span>
                  </div>

                  <h4 className="text-base font-bold text-[#1C1917] leading-snug">
                    {update.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed">
                    {update.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Future Feature Placeholder (Discover Food) */}
          <section>
            <div className="bg-[#FAF8F5] border border-dashed border-[#E7E5E4] rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Lock size={15} className="text-[#A8A29E]" />
                  <h4 className="text-sm font-bold text-[#1C1917]">Start Discovering Food</h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] bg-[#E7E5E4]/60 px-2.5 py-0.5 rounded-full">
                    Available at Launch
                  </span>
                </div>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  Food discovery and spin reservations will activate when the pilot officially goes live.
                </p>
              </div>

              <button
                disabled
                className="px-5 py-3 rounded-xl font-bold text-xs bg-[#E7E5E4] text-[#A8A29E] cursor-not-allowed flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto"
              >
                <span>Coming Soon</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </section>
        </main>
      </div>
    </AuthGuard>
  );
}
