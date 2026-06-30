"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { CheckCircle, Clock, Search } from "lucide-react";
import Input from "@/components/bakery/Input";
import Button from "@/components/bakery/Button";

interface Reservation {
  id: string;
  userId: string;
  listingId: string;
  title: string;
  pickupTime: string;
  pickupEndTime: string;
  status: "Reserved" | "Collected" | "Missed" | "reserved" | "collected";
  createdAt: string;
  discountedPrice: number;
  emoji: string;
}

export default function BakeryOrdersPage() {
  const [orders, setOrders] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // Verification state
  const [pickupCode, setPickupCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const q = query(
        collection(db, "reservations"),
        where("bakeryId", "==", user.uid)
      );

      const unsubscribeSnap = onSnapshot(q, (snapshot) => {
        const fetched: Reservation[] = [];
        snapshot.forEach((doc) => {
          const d = doc.data();
          fetched.push({
            id: doc.id,
            userId: d.userId || "",
            listingId: d.listingId || "",
            title: d.title || "Surprise Bundle",
            pickupTime: d.pickupTime || "16:00",
            pickupEndTime: d.pickupEndTime || "18:00",
            status: d.status || "Reserved",
            createdAt: d.createdAt || new Date().toISOString(),
            discountedPrice: d.discountedPrice || 0,
            emoji: d.emoji || "🥐",
          });
        });
        fetched.sort((a, b) => {
          if (a.status === "Reserved" && b.status !== "Reserved") return -1;
          if (b.status === "Reserved" && a.status !== "Reserved") return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setOrders(fetched);
        setLoading(false);
      }, (err) => {
        console.error("Error fetching reservations:", err);
        setLoading(false);
      });

      return () => unsubscribeSnap();
    });

    return () => unsubscribeAuth();
  }, []);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pickupCode.trim()) return;

    setIsVerifying(true);
    setVerifyMessage(null);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");

      const token = await user.getIdToken(true);

      const res = await fetch("/api/bakery/verify-pickup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pickupCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setVerifyMessage({ text: "Reservation verified and collected successfully!", type: "success" });
      setPickupCode("");
    } catch (err: any) {
      console.error("Error verifying code:", err);
      setVerifyMessage({ text: err.message || "An error occurred", type: "error" });
    } finally {
      setIsVerifying(false);
      // Clear message after 4s
      setTimeout(() => setVerifyMessage(null), 4000);
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

  const reserved = orders.filter((o) => o.status === "Reserved" || o.status === "reserved");
  const collected = orders.filter((o) => o.status === "Collected" || o.status === "collected");

  return (
    <div className="px-4 pt-10 pb-6" style={{ background: "var(--bg-primary)" }}>
      {/* Verify Section */}
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--accent-orange)" }}>
          Secure Verification
        </p>
        <h1 className="text-2xl font-black font-display mb-4" style={{ color: "var(--text-primary)" }}>
          Verify Pickup
        </h1>
        <form onSubmit={handleVerify} className="flex gap-3 items-start">
          <Input
            placeholder="Enter 6-digit code"
            value={pickupCode}
            onChange={(e) => setPickupCode(e.target.value.toUpperCase())}
            className="flex-1"
            maxLength={6}
          />
          <Button type="submit" isLoading={isVerifying} className="px-5 w-auto">
            <Search size={16} />
          </Button>
        </form>
        
        <AnimatePresence>
          {verifyMessage && (
            <motion.div
              key="verify-msg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 p-3 rounded-xl text-xs font-bold flex items-center justify-center text-center"
              style={{
                background: verifyMessage.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                color: verifyMessage.type === "success" ? "#10B981" : "#EF4444",
                border: `1px solid ${verifyMessage.type === "success" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
              }}
            >
              {verifyMessage.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--accent-orange)" }}>
          Customer Orders
        </p>
        <h1 className="text-2xl font-black font-display" style={{ color: "var(--text-primary)" }}>
          Pickup Queue
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          {reserved.length} active · {collected.length} collected
        </p>
      </div>

      {orders.length === 0 ? (
        <div
          className="text-center py-14 rounded-2xl"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
        >
          <span className="text-4xl block mb-3">🧾</span>
          <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>No orders yet</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Customer reservations will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderRow({
  order,
}: {
  order: Reservation;
}) {
  const isCollected = order.status === "collected" || order.status === "Collected";
  const isMissed = order.status === "Missed";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl relative overflow-hidden"
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${isCollected ? "rgba(16,185,129,0.3)" : "var(--border-subtle)"}`,
      }}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: isCollected
            ? "linear-gradient(90deg, transparent, #10B981, transparent)"
            : "linear-gradient(90deg, transparent, var(--accent-orange), transparent)",
        }}
      />

      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{order.emoji}</span>
          <div>
            <h3 className="text-sm font-black font-display" style={{ color: "var(--text-primary)" }}>
              {order.title}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <Clock size={11} style={{ color: "var(--text-muted)" }} />
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {order.pickupTime} – {order.pickupEndTime}
              </p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-lg"
            style={{
              color: isCollected ? "#10B981" : isMissed ? "#F59E0B" : "var(--accent-orange)",
              background: isCollected
                ? "rgba(16,185,129,0.1)"
                : isMissed
                ? "rgba(245,158,11,0.1)"
                : "rgba(245,158,11,0.1)",
              border: `1px solid ${isCollected ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}`,
            }}
          >
            {order.status}
          </span>
          <p className="text-sm font-black mt-1" style={{ color: "var(--accent-orange)" }}>
            R{order.discountedPrice}
          </p>
        </div>
      </div>

      <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
        Reserved {new Date(order.createdAt).toLocaleDateString("en-ZA", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      {isCollected ? (
        <div
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold"
          style={{ background: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}
        >
          <CheckCircle size={14} />
          Bundle Collected
        </div>
      ) : isMissed ? (
        <div
          className="py-2.5 rounded-xl text-xs font-bold text-center"
          style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", border: "1px solid var(--border-subtle)" }}
        >
          Pickup window passed
        </div>
      ) : (
        <div
          className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center text-center transition-all opacity-80"
          style={{
            background: "var(--bg-secondary)",
            color: "var(--text-muted)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          Awaiting Verification Code
        </div>
      )}
    </motion.div>
  );
}
