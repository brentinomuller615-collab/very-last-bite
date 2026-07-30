"use client";

import { motion } from "framer-motion";
import { UtensilsCrossed, Leaf, PiggyBank, MapPin } from "lucide-react";
import { stats } from "@/lib/data";

function formatNumber(n: number) {
  return n.toLocaleString("en-ZA");
}

export default function StatsHeader() {
  return (
    <header className="px-6 pt-8 pb-6">
      {/* Brand & Location */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍞</span>
            <h1
              className="text-2xl font-black tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              Very Last Bite
            </h1>
          </div>
          <p className="text-xs mt-1 font-medium" style={{ color: "var(--text-secondary)" }}>
            Save food. Stretch your budget.
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: "rgba(245,158,11,0.08)",
            color: "var(--accent-orange)",
            border: "1px solid rgba(245,158,11,0.2)",
          }}
        >
          <MapPin size={13} className="text-amber-400" />
          <span>Stellenbosch</span>
        </motion.button>
      </div>

      {/* Stats Row - Clean, cardless, whitespace-driven */}
      <div className="grid grid-cols-3 gap-4 pt-2 pb-2 border-y border-[rgba(245,158,11,0.1)]">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-center py-2"
        >
          <UtensilsCrossed
            size={16}
            className="mx-auto mb-1.5"
            style={{ color: "var(--accent-orange)" }}
          />
          <div
            className="text-xl font-black leading-none"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            {formatNumber(stats.mealsRescued)}
          </div>
          <div className="text-[11px] mt-1 font-medium" style={{ color: "var(--text-muted)" }}>
            Rescued
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center py-2"
        >
          <Leaf
            size={16}
            className="mx-auto mb-1.5"
            style={{ color: "var(--accent-green)" }}
          />
          <div
            className="text-xl font-black leading-none"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            {formatNumber(stats.foodWastePrevented)}kg
          </div>
          <div className="text-[11px] mt-1 font-medium" style={{ color: "var(--text-muted)" }}>
            Saved
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-center py-2"
        >
          <PiggyBank
            size={16}
            className="mx-auto mb-1.5"
            style={{ color: "var(--accent-orange)" }}
          />
          <div
            className="text-xl font-black leading-none"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            R{formatNumber(stats.communitySavings)}
          </div>
          <div className="text-[11px] mt-1 font-medium" style={{ color: "var(--text-muted)" }}>
            Saved total
          </div>
        </motion.div>
      </div>
    </header>
  );
}


