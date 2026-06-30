"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import Button from "@/components/bakery/Button";
import Input from "@/components/bakery/Input";
import { LogOut, CreditCard } from "lucide-react";

export default function BakerySettingsPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [openingTime, setOpeningTime] = useState("06:00");
  const [closingTime, setClosingTime] = useState("18:00");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/bakery");
        return;
      }
      setUserId(user.uid);
      try {
        const snap = await getDoc(doc(db, "bakeries", user.uid));
        if (snap.exists()) {
          const d = snap.data();
          setBusinessName(d.businessName || "");
          setPhone(d.phone || "");
          setAddress(d.address || "");
          setOpeningTime(d.openingTime || "06:00");
          setClosingTime(d.closingTime || "18:00");
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  const handleSave = async () => {
    if (!userId) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateDoc(doc(db, "bakeries", userId), {
        businessName,
        phone,
        address,
        openingTime,
        closingTime,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/bakery");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80dvh]" style={{ background: "var(--bg-primary)" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-9 h-9 rounded-full border-2 border-t-[var(--accent-orange)]"
          style={{ borderColor: "var(--border-subtle)" }}
        />
      </div>
    );
  }

  return (
    <div className="px-4 pt-10 pb-6 space-y-8" style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--accent-orange)" }}>
          Account
        </p>
        <h1 className="text-2xl font-black font-display" style={{ color: "var(--text-primary)" }}>
          Settings
        </h1>
      </div>

      {/* Business Information */}
      <section
        className="p-5 rounded-2xl space-y-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
      >
        <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          Business Info
        </h2>
        <Input
          label="Bakery Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />
        <Input
          label="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Input
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className="flex gap-3">
          <Input
            type="time"
            label="Opening Time"
            value={openingTime}
            onChange={(e) => setOpeningTime(e.target.value)}
            className="flex-1"
          />
          <Input
            type="time"
            label="Closing Time"
            value={closingTime}
            onChange={(e) => setClosingTime(e.target.value)}
            className="flex-1"
          />
        </div>
        <Button onClick={handleSave} isLoading={isSaving}>
          {saveSuccess ? "✓ Saved!" : "Save Changes"}
        </Button>
      </section>

      {/* Subscription — Coming Soon */}
      <section
        className="p-5 rounded-2xl relative overflow-hidden"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          opacity: 0.7,
        }}
      >
        <div
          className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full"
          style={{
            background: "rgba(245,158,11,0.1)",
            color: "var(--accent-orange)",
            border: "1px solid rgba(245,158,11,0.25)",
          }}
        >
          Coming Soon
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "var(--bg-secondary)" }}
          >
            <CreditCard size={18} style={{ color: "var(--accent-orange)" }} />
          </div>
          <div>
            <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              Subscription
            </h2>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Payment integration coming soon
            </p>
          </div>
        </div>

        <button
          disabled
          className="w-full py-3 rounded-xl text-sm font-bold cursor-not-allowed"
          style={{
            background: "var(--bg-secondary)",
            color: "var(--text-muted)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          Manage Subscription
        </button>
      </section>

      {/* Sign Out */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSignOut}
        className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
        style={{
          background: "rgba(239,68,68,0.08)",
          color: "#EF4444",
          border: "1px solid rgba(239,68,68,0.2)",
        }}
      >
        <LogOut size={15} />
        Log Out
      </motion.button>
    </div>
  );
}
