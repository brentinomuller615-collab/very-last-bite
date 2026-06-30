import React from "react";
import { Bundle } from "@/lib/bakeryMockData";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Pencil, Clock } from "lucide-react";

interface BundleCardProps {
  bundle: Bundle;
}

const STATUS_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  Active: {
    color: "var(--accent-orange)",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
  },
  "Sold Out": {
    color: "var(--text-muted)",
    bg: "rgba(255,255,255,0.05)",
    border: "var(--border-subtle)",
  },
  Expired: {
    color: "#EF4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.3)",
  },
};

export default function BundleCard({ bundle }: BundleCardProps) {
  const router = useRouter();
  const status = STATUS_STYLES[bundle.status] || STATUS_STYLES["Active"];
  const discount = Math.round(
    ((bundle.retailValue - bundle.sellingPrice) / bundle.retailValue) * 100
  );

  return (
    <motion.div
      whileHover={{ y: -1 }}
      className="p-5 rounded-2xl relative overflow-hidden"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      {/* Orange top accent for active */}
      {bundle.status === "Active" && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, var(--accent-orange), transparent)",
          }}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3
            className="text-base font-black font-display"
            style={{ color: "var(--text-primary)" }}
          >
            {bundle.type}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {bundle.quantity} remaining
          </p>
        </div>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-lg"
          style={{
            color: status.color,
            background: status.bg,
            border: `1px solid ${status.border}`,
          }}
        >
          {bundle.status}
        </span>
      </div>

      {/* Pricing */}
      <div
        className="flex justify-between items-center px-4 py-3 rounded-xl mb-4"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
      >
        <div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Retail</p>
          <p
            className="text-sm font-semibold line-through"
            style={{ color: "var(--text-muted)" }}
          >
            R{bundle.retailValue}
          </p>
        </div>
        <div
          className="text-xs font-bold px-2 py-0.5 rounded-lg"
          style={{
            background: "rgba(245,158,11,0.15)",
            color: "var(--accent-orange)",
          }}
        >
          {discount}% OFF
        </div>
        <div className="text-right">
          <p className="text-xs" style={{ color: "var(--accent-orange)" }}>Selling</p>
          <p
            className="text-lg font-black font-display"
            style={{ color: "var(--text-primary)" }}
          >
            R{bundle.sellingPrice}
          </p>
        </div>
      </div>

      {/* Pickup Window */}
      <div className="flex items-center gap-1.5 text-xs px-1 mb-4" style={{ color: "var(--text-muted)" }}>
        <Clock size={12} className="text-amber-400" />
        {bundle.pickupTime && bundle.pickupEndTime ? (
          <span>Pickup Window: {bundle.pickupTime} – {bundle.pickupEndTime}</span>
        ) : (
          <span className="italic">Pickup window to be confirmed</span>
        )}
      </div>

      {/* Edit */}
      <button
        onClick={() => router.push(`/bakery/dashboard/add-bundle?edit=${bundle.id}`)}
        className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-secondary)",
        }}
      >
        <Pencil size={13} />
        Edit Bundle
      </button>
    </motion.div>
  );
}
