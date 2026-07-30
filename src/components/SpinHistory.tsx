"use client";

import { motion } from "framer-motion";
import { Deal } from "@/lib/data";

interface SpinHistoryProps {
  history: Deal[];
}

export default function SpinHistory({ history }: SpinHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div className="px-6 pt-6 pb-6">
      <h3
        className="text-[11px] font-bold mb-3 tracking-wider uppercase"
        style={{ color: "var(--text-muted)" }}
      >
        Recent Spins
      </h3>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
        {history.map((deal, i) => (
          <motion.div
            key={`${deal.id}-${i}`}
            initial={{ opacity: 0, scale: 0.9, x: -16 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="flex-shrink-0 flex items-center gap-2.5 px-3 py-2 rounded-xl"
            style={{
              background: "var(--bg-secondary)",
              minWidth: 140,
            }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-base flex-shrink-0"
              style={{ background: deal.bgColor + "20" }}
            >
              {deal.emoji}
            </div>
            <div className="min-w-0">
              <div
                className="text-xs font-bold truncate"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
              >
                {deal.title}
              </div>
              <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                R{deal.discountedPrice}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


