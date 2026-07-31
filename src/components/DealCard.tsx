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
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="deal-card flex items-center gap-4 p-4 cursor-pointer"
        onClick={() => onReserve?.(deal)}
      >
        {/* Emoji box */}
        <div
          className="relative flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: deal.bgColor + "20" }}
        >
          <span>{deal.emoji}</span>
          <div
            className="discount-badge absolute -top-1.5 -left-1.5 text-[10px] px-1.5 py-0.5"
          >
            -{deal.discountPercent}%
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div
            className="font-bold text-base leading-snug truncate"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            {deal.title}
          </div>
          <div className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
            {deal.businessName}
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <Clock size={11} className="text-[var(--accent-orange)]" />
              {deal.pickupTime && deal.pickupEndTime ? `${deal.pickupTime} – ${deal.pickupEndTime}` : "Confirmed by bakery"}
            </span>
            {deal.bakeryAddress && (
              <span className="flex items-center gap-1 truncate">
                <MapPin size={11} className="text-[var(--accent-orange)]" />
                {deal.bakeryAddress}
              </span>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="text-right flex-shrink-0">
          <div className="text-xs line-through" style={{ color: "var(--text-muted)" }}>
            R{deal.originalPrice}
          </div>
          <div
            className="text-lg font-black"
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
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="deal-card p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
          style={{ background: deal.bgColor + "20" }}
        >
          {deal.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="text-xl font-black leading-tight truncate"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            {deal.title}
          </h3>
          <p className="text-xs font-medium text-[var(--text-secondary)] mt-0.5">
            {deal.businessName}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <Star size={12} fill="var(--accent-orange)" stroke="none" />
            <span className="text-xs font-bold text-[var(--accent-orange)]">{deal.rating}</span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              ({deal.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
        {deal.description}
      </p>

      <div className="flex items-center justify-between text-xs mb-5 text-[var(--text-secondary)] border-y border-[var(--border-subtle)] py-3">
        <div className="flex items-center gap-1.5">
          <Clock size={13} className="text-[var(--accent-orange)]" />
          <span>
            {deal.pickupTime && deal.pickupEndTime ? `${deal.pickupTime} – ${deal.pickupEndTime}` : "Pickup time confirmed by bakery"}
          </span>
        </div>
        {deal.bakeryAddress && (
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-[var(--accent-orange)]" />
            <span>{deal.bakeryAddress}</span>
          </div>
        )}
      </div>

      {/* Price + Reserve */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="text-xs line-through" style={{ color: "var(--text-muted)" }}>
            R{deal.originalPrice}
          </div>
          <div
            className="text-2xl font-black"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            R{deal.discountedPrice}
          </div>
        </div>
        <motion.button
          whileHover={{ translateY: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onReserve?.(deal)}
          className="reserve-btn w-full"
        >
          Reserve Now
        </motion.button>
      </div>
    </motion.div>
  );
}


