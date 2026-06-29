"use client";

import React, { useEffect, useState } from "react";
import BakeryBottomNav from "@/components/bakery/BakeryBottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import Button from "@/components/bakery/Button";

type BakeryStatus = "pending" | "approved" | "rejected" | "suspended";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<BakeryStatus | null>(null);
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/bakery");
      } else {
        const docRef = doc(db, "bakeries", user.uid);
        const unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setStatus(data.status as BakeryStatus || "pending");
            setBusinessName(data.businessName || "Bakery Partner");
          } else {
            setStatus("pending");
          }
          setLoading(false);
        }, (error) => {
          console.error("Firestore listener error:", error);
          setLoading(false);
        });

        return () => unsubscribeDoc();
      }
    });

    return () => unsubscribeAuth();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/bakery");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[var(--bakery-bg)] p-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-4 border-amber-100 border-t-[var(--bakery-gold)]"
        />
        <p className="mt-4 text-sm font-semibold text-[#6B7280]">Loading portal...</p>
      </div>
    );
  }

  // Intercept if not approved
  if (status !== "approved") {
    let title = "Under Review";
    let message = "Your account is under review. You will be notified once approved.";
    let icon = "⏳";
    let colorClass = "text-amber-500 bg-amber-50 border-amber-200";
    let pulseClass = "bg-amber-100/50 shadow-amber-500/20";

    if (status === "suspended") {
      title = "Account Suspended";
      message = "Your account has been suspended. Contact support.";
      icon = "⛔";
      colorClass = "text-red-500 bg-red-50 border-red-200";
      pulseClass = "bg-red-100/50 shadow-red-500/20";
    } else if (status === "rejected") {
      title = "Not Approved";
      message = "Your application was not approved.";
      icon = "❌";
      colorClass = "text-red-600 bg-red-50 border-red-200";
      pulseClass = "bg-red-100/50 shadow-red-500/20";
    }

    return (
      <div className="flex flex-col min-h-[100dvh] bg-[var(--bakery-bg)] p-6 justify-between">
        {/* Header */}
        <div className="flex items-center gap-2 py-4 border-b border-[#F2ECE4]">
          <span className="text-2xl">🍞</span>
          <span className="font-black font-display text-lg text-[#1F2937]">{businessName}</span>
        </div>

        {/* Message Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-sm mx-auto space-y-6 my-10"
        >
          <div className={`relative w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-xl ${pulseClass}`}>
            <span className="relative z-10">{icon}</span>
            <span className="absolute inset-0 rounded-3xl animate-ping opacity-25 bg-current" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black font-display text-[var(--bakery-text)]">{title}</h2>
            <p className="text-sm font-semibold text-[#6B7280] leading-relaxed">{message}</p>
          </div>
        </motion.div>

        {/* Footer actions */}
        <div className="space-y-4 pb-6">
          <Button variant="secondary" onClick={handleSignOut} className="w-full">
            Log Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh]">
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="pb-[90px]" // Space for Bottom Nav
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <BakeryBottomNav />
    </div>
  );
}
