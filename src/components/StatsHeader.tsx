"use client";

import { motion } from "framer-motion";
import { UtensilsCrossed, Leaf, PiggyBank, MapPin } from "lucide-react";
import { stats } from "@/lib/data";

function formatNumber(n: number) {
  return n.toLocaleString("en-ZA");
}

export default function StatsHeader() {
  return (
    <header className="px-4 pt-6 pb-2">
      {/* Brand */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍔</span>
            <h1
              className="text-2xl font-black tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              Very Last Bite
            </h1>
          </div>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Save food. Save money.
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-secondary)",
          }}
        >
          <MapPin size={13} className="text-amber-400" />
          <span>Stellenbosch</span>
        </motion.button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2.5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="stat-card"
        >
          <UtensilsCrossed
            size={16}
            className="mx-auto mb-1.5"
            style={{ color: "var(--accent-orange)" }}
          />
          <div
            className="text-lg font-black leading-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            {formatNumber(stats.mealsRescued)}
          </div>
          <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Meals rescued
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="stat-card"
        >
          <Leaf
            size={16}
            className="mx-auto mb-1.5"
            style={{ color: "var(--accent-green)" }}
          />
          <div
            className="text-lg font-black leading-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            {formatNumber(stats.foodWastePrevented)}kg
          </div>
          <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Food waste prevented
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="stat-card"
        >
          <PiggyBank
            size={16}
            className="mx-auto mb-1.5"
            style={{ color: "var(--accent-orange)" }}
          />
          <div
            className="text-lg font-black leading-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            R{formatNumber(stats.communitySavings)}
          </div>
          <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Community savings
          </div>
        </motion.div>
      </div>
    </header>
  );
}
