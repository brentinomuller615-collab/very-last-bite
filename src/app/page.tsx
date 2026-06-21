"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Deal } from "@/lib/data";

import StatsHeader from "@/components/StatsHeader";
import SpinMachine from "@/components/SpinMachine";
import SpinHistory from "@/components/SpinHistory";
import BrowsePage from "@/components/BrowsePage";
import ReservedPage from "@/components/ReservedPage";
import ProfilePage from "@/components/ProfilePage";
import BottomNav, { TabId } from "@/components/BottomNav";
import AuthGuard from "@/components/AuthGuard";

const MAX_HISTORY = 5;

// Simple page transition
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("spin");
  const [spinHistory, setSpinHistory] = useState<Deal[]>([]);
  const [reservations, setReservations] = useState<Deal[]>([]);

  const handleSpinComplete = (_deal: Deal) => {
    // Could trigger global celebrations etc.
  };

  const handleAddToHistory = (deal: Deal) => {
    setSpinHistory((prev) => [deal, ...prev].slice(0, MAX_HISTORY));
  };

  const handleReserve = (deal: Deal) => {
    setReservations((prev) => {
      // Avoid duplicates
      if (prev.find((d) => d.id === deal.id)) return prev;
      return [deal, ...prev];
    });
    setActiveTab("reserved");
  };

  const handleCancelReservation = (dealId: string) => {
    setReservations((prev) => prev.filter((d) => d.id !== dealId));
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
              />
              <SpinHistory history={spinHistory} />
            </motion.div>
          )}

          {activeTab === "browse" && (
            <motion.div
              key="browse"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="overflow-y-auto"
            >
              <BrowsePage onReserve={handleReserve} />
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
