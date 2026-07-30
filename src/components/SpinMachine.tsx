"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { Zap, Clock, MapPin, CheckCircle2, X } from "lucide-react";
import { Deal } from "@/lib/data";
import { useMarketplaceDeals } from "@/lib/marketplace";

interface SpinMachineProps {
  onSpinComplete: (deal: Deal) => void;
  onAddToHistory: (deal: Deal) => void;
  onReserve?: (deal: Deal) => void;
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
    <div className="flex items-center justify-between px-3 py-2">
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

// Spinning deal slot view
function SpinSlot({
  currentDeal,
  isSpinning,
}: {
  currentDeal: Deal | null;
  isSpinning: boolean;
}) {
  return (
    <div
      className="mx-3 mb-3 rounded-xl overflow-hidden"
      style={{
        background: "var(--bg-card)",
        minHeight: 96,
      }}
    >
      <AnimatePresence mode="popLayout">
        {currentDeal && (
          <motion.div
            key={currentDeal.id + (isSpinning ? Date.now() : "final")}
            initial={isSpinning ? { y: -50, opacity: 0 } : { scale: 0.96, opacity: 0 }}
            animate={isSpinning ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1 }}
            exit={isSpinning ? { y: 50, opacity: 0 } : { scale: 0.96, opacity: 0 }}
            transition={
              isSpinning
                ? { duration: 0.12, ease: "easeOut" }
                : { duration: 0.35, type: "spring", bounce: 0.25 }
            }
            className="flex items-center gap-4 p-4"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: currentDeal.bgColor + "25" }}
            >
              {currentDeal.emoji}
            </div>
            <div className="min-w-0">
              <div
                className="font-bold text-base leading-snug truncate"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
              >
                {currentDeal.title}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {currentDeal.businessName}
              </div>
              {!isSpinning && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="badge-save flex items-center gap-1 px-2.5 py-0.5 mt-1.5 w-fit"
                >
                  <Zap size={10} className="text-emerald-400" />
                  <span className="text-[11px] font-bold text-emerald-400">
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
  onConfirm,
}: {
  deal: Deal;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.2 }}
        className="w-full max-w-sm rounded-3xl p-6"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-glow)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <div className="flex justify-end mb-1">
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        {/* Success icon */}
        <div className="flex flex-col items-center text-center mb-5">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1, bounce: 0.4 }}
          >
            <CheckCircle2 size={44} className="text-emerald-400 mb-2" />
          </motion.div>
          <h2
            className="text-xl font-bold mb-0.5"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Reserved! 🎉
          </h2>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Your deal has been secured. Show code at pickup.
          </p>
        </div>

        {/* Deal summary text (clean layout) */}
        <div className="flex items-center gap-3.5 mb-4 py-3 border-y border-[var(--border-subtle)]">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: deal.bgColor + "25" }}
          >
            {deal.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-sm truncate" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
              {deal.title}
            </div>
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {deal.businessName}
            </div>
            <div className="flex items-center justify-between text-xs pt-1" style={{ color: "var(--text-muted)" }}>
              <span>Pickup: {deal.pickupTime}–{deal.pickupEndTime}</span>
              <span>{deal.distance} km</span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Amount due at pickup</span>
          <span
            className="text-xl font-black"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            R{deal.discountedPrice}
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="reserve-btn w-full py-4 text-xs font-bold"
        >
          Got it, I&apos;ll be there!
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default function SpinMachine({ onSpinComplete, onAddToHistory, onReserve }: SpinMachineProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const { deals, loading } = useMarketplaceDeals();
  const [currentDisplayDeal, setCurrentDisplayDeal] = useState<Deal | null>(null);
  const [resultDeal, setResultDeal] = useState<Deal | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const spinInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const controls = useAnimationControls();

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

    if ("vibrate" in navigator) navigator.vibrate([30, 20, 30]);

    const finalDeal = deals[Math.floor(Math.random() * deals.length)];

    let idx = 0;
    let speed = 80;
    let elapsed = 0;
    const totalDuration = 3200;

    spinInterval.current = setInterval(() => {
      setCurrentDisplayDeal(deals[idx % deals.length]);
      idx++;
      elapsed += speed;

      if (elapsed > 2000) {
        speed = Math.min(speed + 30, 350);
        if (spinInterval.current) clearInterval(spinInterval.current);
        setTimeout(() => {
          setCurrentDisplayDeal(finalDeal);
          setIsSpinning(false);
          setResultDeal(finalDeal);
          setShowResult(true);
          onSpinComplete(finalDeal);
          onAddToHistory(finalDeal);

          controls.start({
            x: [0, -4, 4, -2, 2, 0],
            transition: { duration: 0.35, ease: "easeInOut" },
          });

          if ("vibrate" in navigator) navigator.vibrate([50, 30, 80]);
        }, speed);
      }
    }, speed);

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
      <div className="px-6 pt-4 pb-4 text-center">
        <h2
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Spin For <span style={{ color: "var(--accent-orange)" }}>Today&apos;s Bite</span>
        </h2>
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
          Discover available bakery surplus bundles near you.
        </p>
      </div>

      {/* Slot machine frame */}
      <div className="px-6">
        <motion.div
          animate={controls}
          className="slot-machine-frame"
        >
          <div className="text-center py-2">
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--accent-orange)", fontFamily: "var(--font-display)" }}
            >
              ✦ Available Surplus Bundle
            </span>
          </div>

          <BulbRow isSpinning={isSpinning} />
          <SpinSlot currentDeal={currentDisplayDeal} isSpinning={isSpinning} />
          <BulbRow isSpinning={isSpinning} />
        </motion.div>
      </div>

      {/* Expanded deal result */}
      <AnimatePresence>
        {showResult && resultDeal && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: "spring", bounce: 0.25 }}
            className="px-6 mt-4"
          >
            <div className="deal-card p-5">
              <div className="flex items-center gap-4 mb-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background: resultDeal.bgColor + "20" }}
                >
                  {resultDeal.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <h3
                    className="text-lg font-black leading-tight truncate"
                    style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                  >
                    {resultDeal.title}
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    {resultDeal.businessName}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                    <span className="flex items-center gap-1">
                      <Clock size={11} className="text-[var(--accent-orange)]" />
                      {resultDeal.pickupTime}–{resultDeal.pickupEndTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={11} className="text-[var(--accent-orange)]" />
                      {resultDeal.distance} km
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                {resultDeal.description}
              </p>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="text-xs line-through" style={{ color: "var(--text-muted)" }}>
                    R{resultDeal.originalPrice}
                  </div>
                  <div
                    className="text-2xl font-black"
                    style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                  >
                    R{resultDeal.discountedPrice}
                  </div>
                </div>
                <motion.button
                  whileHover={{ translateY: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowReserveModal(true)}
                  className="reserve-btn px-6 py-3.5 text-xs font-bold"
                >
                  Reserve Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spin button */}
      <div className="px-6 mt-5 pb-2">
        <motion.button
          onClick={handleSpin}
          disabled={isSpinning}
          className="spin-btn w-full py-4 text-base tracking-wide"
          whileTap={!isSpinning ? { scale: 0.98 } : {}}
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
            "🎰 SPIN FOR FOOD"
          )}
        </motion.button>
      </div>

      {/* Reserve modal */}
      <AnimatePresence>
        {showReserveModal && resultDeal && (
          <ReserveModal
            deal={resultDeal}
            onClose={() => setShowReserveModal(false)}
            onConfirm={() => onReserve?.(resultDeal)}
          />
        )}
      </AnimatePresence>
    </>
  );
}


