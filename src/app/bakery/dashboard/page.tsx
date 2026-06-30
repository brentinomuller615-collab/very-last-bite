"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BundleCard from "@/components/bakery/BundleCard";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Bundle } from "@/lib/bakeryMockData";

export default function BakeryDashboardPage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setBusinessName(user.displayName || "");

        const q = query(
          collection(db, "listings"),
          where("bakeryId", "==", user.uid)
        );

        const unsubscribeSnap = onSnapshot(q, (snapshot) => {
          const fetchedBundles: Bundle[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            fetchedBundles.push({
              id: doc.id,
              type: data.type,
              quantity: data.quantity,
              retailValue: data.retailValue,
              sellingPrice: data.sellingPrice,
              status: data.status || (data.active ? "Active" : "Sold Out"),
              createdAt: data.createdAt,
              pickupTime: data.pickupTime,
              pickupEndTime: data.pickupEndTime,
            });
          });
          fetchedBundles.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setBundles(fetchedBundles);
          setLoading(false);
        }, (err) => {
          console.error("Error fetching listings:", err);
          setLoading(false);
        });

        return () => unsubscribeSnap();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const activeBundlesCount = bundles.filter((b) => b.status === "Active").length;
  const totalQty = bundles
    .filter((b) => b.status === "Active")
    .reduce((s, b) => s + b.quantity, 0);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-[80dvh]"
        style={{ background: "var(--bg-primary)" }}
      >
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
    <div className="px-4 pt-10 pb-6" style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--accent-orange)" }}>
          Very Last Bite · Bakery Portal
        </p>
        <h1 className="text-2xl font-black font-display" style={{ color: "var(--text-primary)" }}>
          {getGreeting()},<br />
          <span style={{ color: "var(--text-secondary)" }}>{businessName || "Baker"}</span>
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {[
          { label: "Active Listings", value: activeBundlesCount, icon: "📦" },
          { label: "Bundles Available", value: totalQty, icon: "🥐" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl relative overflow-hidden"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="text-3xl font-black font-display" style={{ color: "var(--text-primary)" }}>
              {stat.value}
            </p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: "var(--text-muted)" }}>
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Bundles section */}
      <div>
        <h2
          className="text-sm font-bold uppercase tracking-widest mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Your Bundles
        </h2>

        {bundles.length === 0 ? (
          <div
            className="text-center py-12 rounded-2xl"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <span className="text-4xl block mb-3">📦</span>
            <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
              No bundles published yet
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Tap Add Bundle below to list surplus food
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bundles.map((bundle) => (
              <BundleCard key={bundle.id} bundle={bundle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}
