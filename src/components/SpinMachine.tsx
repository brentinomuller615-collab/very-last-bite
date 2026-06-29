"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { Zap, Clock, MapPin, CheckCircle2, X } from "lucide-react";
import { Deal } from "@/lib/data";
import { useMarketplaceDeals } from "@/lib/marketplace";

interface SpinMachineProps {
  onSpinComplete: (deal: Deal) => void;
  onAddToHistory: (deal: Deal) => void;
}

// Slot-machine bulb row
function BulbRow({ isSpinning }: { isSpinning: boolean }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isSpinning) { setPhase(0); return; }
    const interval = setInterval(() => setPhase((p) => (p + 1) % 4), 150);
    return () => clearInterval(interval);
  }, [isSpinning]);

  const COUNT = 12;
  return (
    <div className="flex items-center justify-between px-3 py-2.5">
      {Array.from({ length: COUNT }).map((_, i) => {
        const active = isSpinning ? i % 4 === phase : i % 2 === 0;
        return (
          <div
            key={i}
            className={`bulb-light ${active ? "active" : "dim"}`}
            style={{ animationDelay: `${(i * 80) % 400}ms` }}
          />
        );
      })}
    </div>
  );
}

// Spinning deal slot view (shows deal cycling during spin)
function SpinSlot({
  currentDeal,
  isSpinning,
}: {
  currentDeal: Deal | null;
  isSpinning: boolean;
}) {
  return (
    <div
      className="mx-3 mb-3 rounded-2xl overflow-hidden"
      style={{
        background: "var(--bg-card)",
        border: "1px solid rgba(245,158,11,0.15)",
        minHeight: 100,
      }}
    >
      <AnimatePresence mode="popLayout">
        {currentDeal && (
          <motion.div
            key={currentDeal.id + (isSpinning ? Date.now() : "final")}
            initial={isSpinning ? { y: -60, opacity: 0 } : { scale: 0.95, opacity: 0 }}
            animate={isSpinning ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1 }}
            exit={isSpinning ? { y: 60, opacity: 0 } : { scale: 0.95, opacity: 0 }}
            transition={
              isSpinning
                ? { duration: 0.12, ease: "easeOut" }
                : { duration: 0.4, type: "spring", bounce: 0.3 }
            }
            className="flex items-center gap-4 p-4"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: currentDeal.bgColor + "30" }}
            >
              {currentDeal.emoji}
            </div>
            <div>
              <div
                className="font-bold text-lg leading-tight"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
              >
                {currentDeal.title}
              </div>
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {currentDeal.businessName}
              </div>
              {!isSpinning && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="badge-save flex items-center gap-1 px-2.5 py-1 mt-1.5 w-fit"
                >
                  <Zap size={11} className="text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-400">
                    Save {currentDeal.discountPercent}%
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Reserve confirmation modal
function ReserveModal({
  deal,
  onClose,
}: {
  deal: Deal;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.25 }}
        className="w-full max-w-sm rounded-3xl p-6"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-glow)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <div className="flex justify-end mb-2">
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}>
            <X size={20} />
          </button>
        </div>

        {/* Success icon */}
        <div className="flex flex-col items-center text-center mb-5">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1, bounce: 0.5 }}
          >
            <CheckCircle2 size={52} className="text-emerald-400 mb-3" />
          </motion.div>
          <h2
            className="text-2xl font-black mb-1"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Reserved! 🎉
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Your deal has been secured. Show this at pickup.
          </p>
        </div>

        {/* Deal summary */}
        <div
          className="rounded-2xl p-4 mb-5"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: deal.bgColor + "30" }}
            >
              {deal.emoji}
            </div>
            <div>
              <div className="font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                {deal.title}
              </div>
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {deal.businessName}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
              <Clock size={13} className="text-amber-400" />
              <span>Pickup: {deal.pickupTime} – {deal.pickupEndTime}</span>
            </div>
            <div className="flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
              <MapPin size={13} className="text-amber-400" />
              <span>{deal.distance} km</span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Amount due at pickup</span>
          <span
            className="text-2xl font-black"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            R{deal.discountedPrice}
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          className="reserve-btn w-full py-4 text-base"
          style={{ color: "#1a0800" }}
        >
          Got it, I&apos;ll be there!
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default function SpinMachine({ onSpinComplete, onAddToHistory }: SpinMachineProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const { deals, loading } = useMarketplaceDeals();
  const [currentDisplayDeal, setCurrentDisplayDeal] = useState<Deal | null>(null);
  const [resultDeal, setResultDeal] = useState<Deal | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [glowActive, setGlowActive] = useState(false);
  const spinInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const controls = useAnimationControls();

  // Set initial display deal once deals are loaded
  useEffect(() => {
    if (!loading && deals.length > 0 && !currentDisplayDeal && !isSpinning && !resultDeal) {
      setCurrentDisplayDeal(deals[0]);
    }
  }, [deals, loading, currentDisplayDeal, isSpinning, resultDeal]);

  const handleSpin = async () => {
    if (isSpinning || loading || deals.length === 0) return;

    setIsSpinning(true);
    setShowResult(false);
    setResultDeal(null);
    setGlowActive(false);

    // Haptic feedback on mobile
    if ("vibrate" in navigator) navigator.vibrate([30, 20, 30]);

    // Pick final result first
    const finalDeal = deals[Math.floor(Math.random() * deals.length)];

    // Slot cycling animation: fast → slow
    let idx = 0;
    let speed = 80;
    let elapsed = 0;
    const totalDuration = 3200;

    spinInterval.current = setInterval(() => {
      setCurrentDisplayDeal(deals[idx % deals.length]);
      idx++;
      elapsed += speed;

      // Gradually slow down after 2s
      if (elapsed > 2000) {
        speed = Math.min(speed + 30, 350);
        if (spinInterval.current) clearInterval(spinInterval.current);
        setTimeout(() => {
          // Final landing
          setCurrentDisplayDeal(finalDeal);
          setIsSpinning(false);
          setGlowActive(true);
          setResultDeal(finalDeal);
          setShowResult(true);
          onSpinComplete(finalDeal);
          onAddToHistory(finalDeal);

          // Celebratory shake
          controls.start({
            x: [0, -6, 6, -4, 4, 0],
            transition: { duration: 0.4, ease: "easeInOut" },
          });

          if ("vibrate" in navigator) navigator.vibrate([50, 30, 80]);
        }, speed);
      }
    }, speed);

    // Safety stop at totalDuration
    setTimeout(() => {
      if (spinInterval.current) clearInterval(spinInterval.current);
    }, totalDuration);
  };

  useEffect(() => {
    return () => {
      if (spinInterval.current) clearInterval(spinInterval.current);
    };
  }, []);

  return (
    <>
      {/* Spin section title */}
      <div className="px-4 pt-6 pb-3 text-center">
        <h2
          className="text-2xl font-black"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Spin For{" "}
          <span style={{ color: "var(--accent-orange)" }}>Today&apos;s Bite</span>
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Spin to discover discounted surplus food near you.
        </p>
      </div>

      {/* Slot machine frame */}
      <div className="px-4">
        <motion.div
          animate={controls}
          className="slot-machine-frame"
          style={{
            boxShadow: glowActive ? "var(--glow-orange-strong)" : "none",
            transition: "box-shadow 0.5s ease",
          }}
        >
          {/* Marquee title */}
          <div
            className="text-center py-2"
            style={{ borderBottom: "1px solid rgba(245,158,11,0.12)" }}
          >
            <span
              className="text-sm font-bold tracking-wide"
              style={{ color: "var(--accent-orange)", fontFamily: "var(--font-display)" }}
            >
              ✦ Today&apos;s Bite
            </span>
          </div>

          {/* Bulb rows */}
          <BulbRow isSpinning={isSpinning} />

          {/* Deal slot */}
          <SpinSlot currentDeal={currentDisplayDeal} isSpinning={isSpinning} />

          {/* Bottom bulbs */}
          <BulbRow isSpinning={isSpinning} />
        </motion.div>
      </div>

      {/* Expanded deal result */}
      <AnimatePresence>
        {showResult && resultDeal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="px-4 mt-4"
          >
            {/* Deal detail card */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid rgba(245,158,11,0.3)",
                boxShadow: "0 0 30px rgba(245,158,11,0.15)",
              }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div
                  className="w-18 h-18 w-[72px] h-[72px] rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                  style={{
                    background: resultDeal.bgColor + "25",
                    border: `1px solid ${resultDeal.bgColor}40`,
                  }}
                >
                  {resultDeal.emoji}
                </div>
                <div>
                  <h3
                    className="text-xl font-black leading-tight"
                    style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                  >
                    {resultDeal.title}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {resultDeal.businessName}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                      <Clock size={11} />
                      {resultDeal.pickupTime}–{resultDeal.pickupEndTime}
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                      <MapPin size={11} />
                      {resultDeal.distance} km
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                {resultDeal.description}
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs line-through" style={{ color: "var(--text-muted)" }}>
                    R{resultDeal.originalPrice}
                  </div>
                  <div
                    className="text-3xl font-black"
                    style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                  >
                    R{resultDeal.discountedPrice}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowReserveModal(true)}
                  className="reserve-btn px-6 py-3.5 text-sm font-bold"
                  style={{ color: "#1a0800" }}
                >
                  Reserve Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spin button */}
      <div className="px-4 mt-5 pb-4">
        <motion.button
          onClick={handleSpin}
          disabled={isSpinning}
          className="spin-btn w-full py-5 text-xl"
          style={{ color: "#1a0800" }}
          whileTap={!isSpinning ? { scale: 0.97 } : {}}
        >
          {isSpinning ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                className="inline-block"
              >
                🎰
              </motion.span>
              Spinning...
            </span>
          ) : (
            "🎰 SPIN"
          )}
        </motion.button>
      </div>

      {/* Reserve modal */}
      <AnimatePresence>
        {showReserveModal && resultDeal && (
          <ReserveModal deal={resultDeal} onClose={() => setShowReserveModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
