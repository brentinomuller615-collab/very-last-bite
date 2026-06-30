"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Deal } from "@/lib/data";

import StatsHeader from "@/components/StatsHeader";
import SpinMachine from "@/components/SpinMachine";
import SpinHistory from "@/components/SpinHistory";
import ReservedPage from "@/components/ReservedPage";
import ProfilePage from "@/components/ProfilePage";
import BottomNav, { TabId } from "@/components/BottomNav";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, deleteDoc, doc, runTransaction } from "firebase/firestore";

const MAX_HISTORY = 5;

// Simple page transition
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function SpinPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("spin");
  const [spinHistory, setSpinHistory] = useState<Deal[]>([]);
  const [reservations, setReservations] = useState<Deal[]>([]);

  // Load reservations from Firestore in real-time
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "reservations"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snap) => {
      const fetched: Deal[] = [];
      snap.forEach((doc) => {
        const d = doc.data();
        fetched.push({
          id: doc.id,
          businessName: d.businessName || "Local Bakery",
          title: d.title || "Surprise Pastry Bag",
          category: d.category || "bakery",
          emoji: d.emoji || "🥐",
          originalPrice: d.originalPrice || 100,
          discountedPrice: d.discountedPrice || 35,
          discountPercent: d.discountPercent || 65,
          pickupTime: d.pickupTime || undefined,
          pickupEndTime: d.pickupEndTime || undefined,
          distance: d.distance || 0.8,
          description: d.description || "",
          tags: d.tags || [],
          rating: d.rating || 4.8,
          reviewCount: d.reviewCount || 94,
          bgColor: d.bgColor || "#F59E0B",
          bakeryAddress: d.bakeryAddress || "Stellenbosch",
          bakeryPhone: d.bakeryPhone || "",
          bakeryId: d.bakeryId || "",
          pickupCode: d.pickupCode,
          pickupCodeUsed: d.pickupCodeUsed,
          status: d.status || "reserved",
          collectedAt: d.collectedAt,
        });
      });
      fetched.sort((a, b) => b.discountPercent - a.discountPercent);
      setReservations(fetched);
    });
    return () => unsubscribe();
  }, [user]);

  // Handle tab from query param
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab") as TabId | null;
      if (tab && (tab === "spin" || tab === "reserved" || tab === "profile")) {
        setActiveTab(tab);
      }
    }
  }, []);

  const handleSpinComplete = (_deal: Deal) => {
    // Could trigger global celebrations etc.
  };

  const handleAddToHistory = (deal: Deal) => {
    setSpinHistory((prev) => [deal, ...prev].slice(0, MAX_HISTORY));
  };

  const handleReserve = async (deal: Deal) => {
    if (!user) return;
    try {
      const listingRef = doc(db, "listings", deal.id);

      await runTransaction(db, async (transaction) => {
        const listingDoc = await transaction.get(listingRef);
        if (!listingDoc.exists()) {
          throw new Error("Listing does not exist!");
        }

        const data = listingDoc.data();
        const currentQty = Number(data.quantity) || 0;

        if (currentQty <= 0 || !data.active) {
          throw new Error("Out of stock!");
        }

        const newQty = currentQty - 1;

        // 1. Update the listing quantity and active status
        transaction.update(listingRef, {
          quantity: newQty,
          active: newQty > 0,
          status: newQty > 0 ? "Active" : "Sold Out"
        });

        // 2. Add the reservation document
        const resRef = doc(collection(db, "reservations"));
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";
        for (let i = 0; i < 6; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        transaction.set(resRef, {
          userId: user.uid,
          listingId: deal.id,
          bakeryId: deal.bakeryId || "",
          businessName: deal.businessName,
          bakeryAddress: deal.bakeryAddress || "Stellenbosch",
          title: deal.title,
          emoji: deal.emoji,
          originalPrice: deal.originalPrice,
          discountedPrice: deal.discountedPrice,
          discountPercent: deal.discountPercent,
          pickupTime: deal.pickupTime || null,
          pickupEndTime: deal.pickupEndTime || null,
          distance: deal.distance,
          description: deal.description,
          tags: deal.tags,
          rating: deal.rating,
          reviewCount: deal.reviewCount,
          bgColor: deal.bgColor,
          status: "reserved",
          pickupCode: code,
          pickupCodeUsed: false,
          collectedAt: null,
          createdAt: new Date().toISOString(),
        });
      });

      setActiveTab("reserved");
    } catch (err: any) {
      console.error("Failed to write reservation transaction:", err);
      alert(err.message === "Out of stock!" ? "Sorry, this bundle was just reserved by another customer!" : "Failed to make reservation.");
    }
  };

  const handleCancelReservation = async (dealId: string) => {
    try {
      await deleteDoc(doc(db, "reservations", dealId));
    } catch (err) {
      console.error("Failed to delete reservation from Firestore:", err);
    }
  };

  return (
    <AuthGuard>
      <main
        className="max-mobile relative"
        style={{ background: "var(--bg-primary)", minHeight: "100dvh" }}
      >
        <AnimatePresence mode="wait">
          {activeTab === "spin" && (
            <motion.div
              key="spin"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="page-content overflow-y-auto"
            >
              <StatsHeader />
              <SpinMachine
                onSpinComplete={handleSpinComplete}
                onAddToHistory={handleAddToHistory}
                onReserve={handleReserve}
              />
              <SpinHistory history={spinHistory} />
            </motion.div>
          )}

          {activeTab === "reserved" && (
            <motion.div
              key="reserved"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="overflow-y-auto"
            >
              <ReservedPage
                reservations={reservations}
                onCancel={handleCancelReservation}
              />
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div
              key="profile"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="overflow-y-auto"
            >
              <ProfilePage />
            </motion.div>
          )}
        </AnimatePresence>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </main>
    </AuthGuard>
  );
}
