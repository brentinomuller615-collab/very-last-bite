"use client";

import React, { useEffect, useState } from "react";
import BakeryBottomNav from "@/components/bakery/BakeryBottomNav";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
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
            setStatus((data.status as BakeryStatus) || "pending");
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
      <div
        className="flex flex-col items-center justify-center min-h-[100dvh]"
        style={{ background: "var(--bg-primary)" }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full border-2 border-t-[var(--accent-orange)]"
          style={{ borderColor: "var(--border-subtle)" }}
        />
        <p className="mt-4 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
          Loading portal…
        </p>
      </div>
    );
  }

  if (status !== "approved") {
    const states: Record<string, { title: string; message: string; icon: string; color: string }> = {
      pending: {
        title: "Under Review",
        message: "Your bakery is being reviewed. We'll notify you once you're approved.",
        icon: "⏳",
        color: "var(--accent-orange)",
      },
      rejected: {
        title: "Not Approved",
        message: "Your application was not approved. Please contact support.",
        icon: "✕",
        color: "#EF4444",
      },
      suspended: {
        title: "Account Suspended",
        message: "Your account has been suspended. Please contact support.",
        icon: "⊘",
        color: "#EF4444",
      },
    };

    const s = states[status || "pending"];

    return (
      <div
        className="flex flex-col min-h-[100dvh] p-6"
        style={{ background: "var(--bg-primary)" }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 py-4 mb-6"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
            style={{ background: "var(--bg-card)" }}
          >
            🍞
          </div>
          <span
            className="font-black font-display text-base"
            style={{ color: "var(--text-primary)" }}
          >
            {businessName}
          </span>
        </div>

        {/* Status block */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl relative"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              boxShadow: `0 0 40px rgba(245,158,11,0.15)`,
            }}
          >
            {s.icon}
            {status === "pending" && (
              <span
                className="absolute inset-0 rounded-3xl animate-ping opacity-20"
                style={{ background: s.color }}
              />
            )}
          </motion.div>

          <div className="space-y-2">
            <h2
              className="text-2xl font-black font-display"
              style={{ color: "var(--text-primary)" }}
            >
              {s.title}
            </h2>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--text-secondary)" }}>
              {s.message}
            </p>
          </div>
        </div>

        <div className="pb-6">
          <Button variant="secondary" onClick={handleSignOut} className="w-full">
            Log Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh]" style={{ background: "var(--bg-primary)" }}>
      {children}
      <BakeryBottomNav />
    </div>
  );
}

