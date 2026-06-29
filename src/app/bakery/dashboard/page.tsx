"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/bakery/StatCard";
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
        setBusinessName(user.displayName || "Golden Crust Bakery");
        
        // Fetch listings
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
              status: data.status,
              createdAt: data.createdAt,
            });
          });
          // Sort by createdAt descending
          fetchedBundles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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

  const activeBundlesCount = bundles.filter(b => b.status === "Active").length;
  // Compute some dashboard display values
  const bundlesSold = 18; 
  const foodSaved = `${bundlesSold * 2} kg`;
  const revenue = `R${bundlesSold * 39}`;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80dvh] bg-[var(--bakery-bg)] p-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full border-4 border-amber-100 border-t-[var(--bakery-gold)]"
        />
      </div>
    );
  }

  return (
    <div className="p-6 pt-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl">🍞</span>
          <h1 className="text-xl font-bold font-display text-[#1F2937]">Very Last Bite</h1>
        </div>
        <h2 className="text-2xl font-black font-display text-[var(--bakery-text)]">
          Good Afternoon, <br /> {businessName}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard title="Bundles Sold This Month" value={bundlesSold} icon={<span className="text-xl">📈</span>} />
        <StatCard title="Estimated Food Saved" value={foodSaved} icon={<span className="text-xl">🌍</span>} />
        <StatCard title="Revenue Generated" value={revenue} icon={<span className="text-xl">💰</span>} />
        <StatCard title="Active Bundles" value={activeBundlesCount} icon={<span className="text-xl">📦</span>} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold font-display text-[#1F2937]">Active Bundles</h3>
        </div>
        
        {bundles.length === 0 ? (
          <div className="text-center py-10 bg-white border border-[#F2ECE4] rounded-2xl p-6">
            <span className="text-4xl block mb-2">📦</span>
            <p className="font-semibold text-gray-500 text-sm">No bundles published yet</p>
            <p className="text-xs text-gray-400 mt-1">Tap the plus button below to list surplus food!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bundles.map(bundle => (
              <BundleCard key={bundle.id} bundle={bundle} onEdit={(id) => console.log("Edit", id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
