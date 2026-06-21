"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Star } from "lucide-react";
import { Deal } from "@/lib/data";

interface DealCardProps {
  deal: Deal;
  onReserve?: (deal: Deal) => void;
  compact?: boolean;
}

export default function DealCard({ deal, onReserve, compact = false }: DealCardProps) {
  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="deal-card flex items-center gap-3 p-3 cursor-pointer"
        onClick={() => onReserve?.(deal)}
      >
        {/* Emoji box */}
        <div
          className="relative flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{ background: deal.bgColor + "30" }}
        >
          <span>{deal.emoji}</span>
          <div
            className="discount-badge absolute -top-1.5 -left-1.5 text-xs px-1.5 py-0.5"
            style={{ color: "#1a0800", fontSize: "10px" }}
          >
            -{deal.discountPercent}%
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div
            className="font-bold text-base leading-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            {deal.title}
          </div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {deal.businessName}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
              <Clock size={10} />
              {deal.pickupTime}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
              <MapPin size={10} />
              {deal.distance} km
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="text-right flex-shrink-0">
          <div className="text-xs line-through" style={{ color: "var(--text-muted)" }}>
            R{deal.originalPrice}
          </div>
          <div
            className="text-xl font-black"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            R{deal.discountedPrice}
          </div>
        </div>
      </motion.div>
    );
  }

  // Full card (used in deal detail overlay)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="deal-card p-5"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
          style={{ background: deal.bgColor + "25", border: `1px solid ${deal.bgColor}40` }}
        >
          {deal.emoji}
        </div>
        <div className="flex-1">
          <h3
            className="text-xl font-black leading-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            {deal.title}
          </h3>
          <p className="text-sm font-medium mt-0.5" style={{ color: "var(--text-secondary)" }}>
            {deal.businessName}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <Star size={12} fill="#F59E0B" stroke="none" />
            <span className="text-xs font-semibold text-amber-400">{deal.rating}</span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              ({deal.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
        {deal.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {deal.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{
              background: "var(--bg-surface)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Details row */}
      <div
        className="flex items-center justify-between p-3 rounded-xl mb-4"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
      >
        <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
          <Clock size={14} className="text-amber-400" />
          <span>
            {deal.pickupTime} – {deal.pickupEndTime}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
          <MapPin size={14} className="text-amber-400" />
          <span>{deal.distance} km away</span>
        </div>
      </div>

      {/* Price + Reserve */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm line-through" style={{ color: "var(--text-muted)" }}>
            R{deal.originalPrice}
          </div>
          <div
            className="text-3xl font-black"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            R{deal.discountedPrice}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onReserve?.(deal)}
          className="reserve-btn px-6 py-3.5 text-sm font-bold"
          style={{ color: "#1a0800" }}
        >
          Reserve Now
        </motion.button>
      </div>
    </motion.div>
  );
}
