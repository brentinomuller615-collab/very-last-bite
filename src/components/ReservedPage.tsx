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
      <div className="page-content flex flex-col items-center justify-center min-h-[65vh] px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", bounce: 0.3 }}
        >
          <p className="text-5xl mb-3">🎟️</p>
          <h2
            className="text-lg font-bold mb-1"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            No active reservations
          </h2>
          <p className="text-xs leading-relaxed max-w-xs" style={{ color: "var(--text-secondary)" }}>
            Spin to discover available bakery food bundles and make your first reservation.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="px-6 pt-8 pb-4">
        <h1
          className="text-2xl font-black tracking-tight"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Your Reservations
        </h1>
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
          {reservations.length} active {reservations.length === 1 ? "reservation" : "reservations"}
        </p>
      </div>

      <div className="px-6 flex flex-col gap-4">
        <AnimatePresence>
          {reservations.map((deal, i) => (
            <motion.div
              key={deal.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ delay: i * 0.04, layout: { type: "spring", bounce: 0.2 } }}
              className="deal-card p-5"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background: deal.bgColor + "20" }}
                >
                  {deal.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="font-bold text-base leading-snug truncate"
                      style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                    >
                      {deal.title}
                    </span>
                    {deal.status === "collected" ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-md">
                        <CheckCircle2 size={10} />
                        Collected
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md">
                        <CheckCircle2 size={10} />
                        Reserved
                      </span>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {deal.businessName}
                  </p>
                  <div className="flex flex-col gap-1 mt-2.5 text-xs" style={{ color: "var(--text-muted)" }}>
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} className="text-[var(--accent-orange)]" />
                      {deal.pickupTime && deal.pickupEndTime ? (
                        <span>Pickup: {deal.pickupTime} – {deal.pickupEndTime}</span>
                      ) : (
                        <span className="italic">
                          Pickup time confirmed by bakery
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={11} className="text-[var(--accent-orange)]" />
                      <span>{deal.bakeryAddress || "Stellenbosch"} ({deal.distance} km)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div
                    className="text-lg font-black"
                    style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                  >
                    R{deal.discountedPrice}
                  </div>
                  {deal.status !== "collected" && (
                    <button
                      onClick={() => setCancelling(deal.id)}
                      className="text-xs mt-1 transition-colors hover:text-white"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {deal.status === "collected" ? (
                <div
                  className="mt-4 p-3 rounded-xl flex items-center justify-between"
                  style={{ background: "rgba(59,130,246,0.1)" }}
                >
                  <span className="text-xs font-semibold text-blue-400">Collected</span>
                  <span className="text-[11px] text-blue-400/80">
                    {deal.collectedAt ? new Date(deal.collectedAt).toLocaleString() : "Recently"}
                  </span>
                </div>
              ) : (
                <>
                  <div
                    className="mt-4 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-1"
                    style={{ background: "var(--bg-secondary)" }}
                  >
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Show code to bakery at pickup:
                    </p>
                    <div className="text-2xl tracking-widest font-black py-0.5 font-mono" style={{ color: "var(--accent-orange)" }}>
                      {deal.pickupCode}
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div
                    className="mt-3 h-1 rounded-full overflow-hidden"
                    style={{ background: "var(--bg-surface)" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "65%" }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ background: "var(--accent-orange)" }}
                    />
                  </div>
                  <p className="text-[11px] mt-1.5" style={{ color: "var(--text-muted)" }}>
                    {deal.pickupTime ? "Pickup window open" : "Awaiting bakery confirmation"}
                  </p>
                </>
              )}
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
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
            onClick={() => setCancelling(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xs rounded-3xl p-6"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-glow)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-5">
                <X size={36} className="mx-auto mb-2 text-[var(--text-muted)]" />
                <h3
                  className="text-lg font-bold mb-1"
                  style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                >
                  Cancel reservation?
                </h3>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  This bundle will be returned to the available pool.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setCancelling(null)}
                  className="flex-1 py-3 rounded-xl text-xs font-semibold"
                  style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}
                >
                  Keep it
                </button>
                <button
                  onClick={() => handleCancel(cancelling)}
                  className="flex-1 py-3 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


