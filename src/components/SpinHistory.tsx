"use client";

import { motion } from "framer-motion";
import { Deal } from "@/lib/data";

interface SpinHistoryProps {
  history: Deal[];
}

export default function SpinHistory({ history }: SpinHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div className="px-4 pb-6">
      <h3
        className="text-sm font-semibold mb-2.5"
        style={{ color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}
      >
        Spin History
      </h3>
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {history.map((deal, i) => (
          <motion.div
            key={`${deal.id}-${i}`}
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-2xl"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              minWidth: 160,
            }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: deal.bgColor + "30" }}
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
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                R{deal.discountedPrice}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
