"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, CheckCircle2, X } from "lucide-react";
import { Deal } from "@/lib/data";

interface ReservedPageProps {
  reservations: Deal[];
  onCancel: (dealId: string) => void;
}

export default function ReservedPage({ reservations, onCancel }: ReservedPageProps) {
  const [cancelling, setCancelling] = useState<string | null>(null);

  const handleCancel = (id: string) => {
    setCancelling(null);
    onCancel(id);
  };

  if (reservations.length === 0) {
    return (
      <div className="page-content flex flex-col items-center justify-center min-h-[70vh] px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
        >
          <p className="text-6xl mb-4">🎟️</p>
          <h2
            className="text-xl font-black mb-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            No reservations yet
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Spin to discover deals or browse nearby offers to make your first reservation.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="px-4 pt-6 pb-4">
        <h1
          className="text-2xl font-black"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Your Reservations
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
          {reservations.length} active {reservations.length === 1 ? "deal" : "deals"}
        </p>
      </div>

      <div className="px-4 flex flex-col gap-3">
        <AnimatePresence>
          {reservations.map((deal, i) => (
            <motion.div
              key={deal.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: i * 0.05, layout: { type: "spring", bounce: 0.2 } }}
              className="deal-card p-4"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: deal.bgColor + "30" }}
                >
                  {deal.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="font-bold leading-tight"
                      style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                    >
                      {deal.title}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-emerald-400">
                      <CheckCircle2 size={11} />
                      Reserved
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {deal.businessName}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                      <Clock size={10} />
                      {deal.pickupTime}–{deal.pickupEndTime}
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                      <MapPin size={10} />
                      {deal.distance} km
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div
                    className="text-lg font-black"
                    style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                  >
                    R{deal.discountedPrice}
                  </div>
                  <button
                    onClick={() => setCancelling(deal.id)}
                    className="text-xs mt-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Progress bar showing time to pickup */}
              <div
                className="mt-3 h-1 rounded-full overflow-hidden"
                style={{ background: "var(--bg-surface)" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ background: "var(--accent-orange)" }}
                />
              </div>
              <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                Pickup window opens soon
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Cancel confirm dialog */}
      <AnimatePresence>
        {cancelling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={() => setCancelling(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl p-6"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-5">
                <X size={40} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
                <h3
                  className="text-xl font-black mb-1"
                  style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                >
                  Cancel reservation?
                </h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  This deal will go back to the pool. You can spin for it again.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setCancelling(null)}
                  className="flex-1 py-3 rounded-2xl text-sm font-semibold"
                  style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}
                >
                  Keep it
                </button>
                <button
                  onClick={() => handleCancel(cancelling)}
                  className="flex-1 py-3 rounded-2xl text-sm font-semibold"
                  style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}
                >
                  Yes, cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
