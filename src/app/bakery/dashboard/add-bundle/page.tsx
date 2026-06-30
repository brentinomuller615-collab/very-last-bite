"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/bakery/Button";
import { BundleType } from "@/lib/bakeryMockData";
import { ChevronLeft } from "lucide-react";

import { db, auth } from "@/lib/firebase";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const BUNDLE_TYPES: BundleType[] = [
  "Bread Bundle",
  "Sweet Bundle",
  "Mixed Bundle",
  "Family Bundle",
  "Mystery Box",
];

const BUNDLE_EMOJIS: Record<BundleType, string> = {
  "Bread Bundle": "🍞",
  "Sweet Bundle": "🧁",
  "Mixed Bundle": "🥖",
  "Family Bundle": "🍞",
  "Mystery Box": "📦",
};

interface AddBundlePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function AddBundlePage({ searchParams }: AddBundlePageProps) {
  const router = useRouter();
  const resolvedParams = use(searchParams);
  const editId = typeof resolvedParams.edit === "string" ? resolvedParams.edit : null;
  const isEditing = !!editId;

  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 5;
  const [isPublishing, setIsPublishing] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [error, setError] = useState("");

  const [type, setType] = useState<BundleType | "">("");
  const [quantity, setQuantity] = useState(1);
  const [retailValue, setRetailValue] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [pickupTime, setPickupTime] = useState("16:00");
  const [pickupEndTime, setPickupEndTime] = useState("18:00");
  const [retailFocused, setRetailFocused] = useState(false);
  const [priceFocused, setPriceFocused] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/bakery");
        return;
      }
      try {
        const bakerySnap = await getDoc(doc(db, "bakeries", user.uid));
        if (bakerySnap.exists()) {
          const data = bakerySnap.data();
          if (data.status !== "approved") {
            setError("Your account is not approved to create listings.");
          }
          if (!isEditing) {
            if (data.openingTime) setPickupTime(data.openingTime);
            if (data.closingTime) setPickupEndTime(data.closingTime);
          }
        } else {
          setError("Bakery profile not found.");
        }

        if (editId) {
          const listingSnap = await getDoc(doc(db, "listings", editId));
          if (listingSnap.exists()) {
            const d = listingSnap.data();
            setType(d.type || "");
            setQuantity(d.quantity || 1);
            setRetailValue(d.retailValue?.toString() || "");
            setSellingPrice(d.sellingPrice?.toString() || "");
            setPickupTime(d.pickupTime || "16:00");
            setPickupEndTime(d.pickupEndTime || "18:00");
          }
        }
      } catch (err) {
        console.error("Error verifying status:", err);
        setError("Failed to verify account status.");
      } finally {
        setIsCheckingStatus(false);
      }
    });

    return () => unsubscribe();
  }, [router, editId, isEditing]);

  useEffect(() => {
    if (retailValue && !isNaN(Number(retailValue)) && !isEditing) {
      const rec = Math.round(Number(retailValue) * 0.3);
      setSellingPrice(rec.toString());
    }
  }, [retailValue, isEditing]);

  const discountPercentage = React.useMemo(() => {
    const r = Number(retailValue);
    const s = Number(sellingPrice);
    if (!r || !s) return 0;
    return Math.round(((r - s) / r) * 100);
  }, [retailValue, sellingPrice]);

  const isPriceValid = discountPercentage >= 60 && discountPercentage <= 80;

  const handlePublish = async () => {
    setIsPublishing(true);
    setError("");
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user session.");

      const bakerySnap = await getDoc(doc(db, "bakeries", user.uid));
      if (!bakerySnap.exists() || bakerySnap.data().status !== "approved") {
        throw new Error("Listing creation blocked: account is not approved.");
      }

      const bakeryData = bakerySnap.data();

      if (isEditing && editId) {
        await updateDoc(doc(db, "listings", editId), {
          type,
          quantity,
          retailValue: Number(retailValue),
          sellingPrice: Number(sellingPrice),
          pickupTime,
          pickupEndTime,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await addDoc(collection(db, "listings"), {
          bakeryId: user.uid,
          businessName: bakeryData.businessName || "Unknown Bakery",
          type,
          quantity,
          retailValue: Number(retailValue),
          sellingPrice: Number(sellingPrice),
          pickupTime,
          pickupEndTime,
          status: "Active",
          active: true,
          createdAt: new Date().toISOString(),
          category: "bakery",
        });
      }

      router.push("/bakery/dashboard");
    } catch (err: any) {
      console.error("Publish listing error:", err);
      setError(err.message || "Failed to publish listing.");
    } finally {
      setIsPublishing(false);
    }
  };

  // ── Loading ──
  if (isCheckingStatus) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[calc(100dvh-90px)]"
        style={{ background: "var(--bg-primary)" }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-9 h-9 rounded-full border-2 border-t-[var(--accent-orange)]"
          style={{ borderColor: "var(--border-subtle)" }}
        />
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div
        className="p-6 pt-10 flex flex-col min-h-[calc(100dvh-90px)] justify-center items-center text-center space-y-5"
        style={{ background: "var(--bg-primary)" }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          ⚠️
        </div>
        <h2 className="text-xl font-black font-display" style={{ color: "var(--text-primary)" }}>
          Access Blocked
        </h2>
        <p className="text-sm max-w-xs" style={{ color: "var(--text-secondary)" }}>
          {error}
        </p>
        <Button onClick={() => router.push("/bakery/dashboard")} className="w-full max-w-xs">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // ── Form ──
  return (
    <div
      className="px-4 pt-10 flex flex-col min-h-[calc(100dvh-90px)]"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        {step > 1 && (
          <button
            onClick={() => setStep((s) => Math.max(s - 1, 1))}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
            }}
          >
            <ChevronLeft size={18} />
          </button>
        )}
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--accent-orange)" }}>
            Step {step} of {TOTAL_STEPS}
          </p>
          <h1 className="text-xl font-black font-display" style={{ color: "var(--text-primary)" }}>
            {isEditing ? "Edit Bundle" : "Add Bundle"}
          </h1>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "var(--bg-secondary)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, var(--accent-orange), var(--accent-orange-dark))" }}
            initial={{ width: `${((step - 1) / TOTAL_STEPS) * 100}%` }}
            animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {/* Step 1: Bundle Type */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-black font-display mb-6" style={{ color: "var(--text-primary)" }}>
                Select Bundle Type
              </h2>
              <div className="space-y-3">
                {BUNDLE_TYPES.map((bt) => (
                  <button
                    key={bt}
                    onClick={() => setType(bt)}
                    className="w-full px-4 py-4 rounded-2xl border text-left font-bold transition-all flex items-center gap-3"
                    style={{
                      background: type === bt ? "rgba(245,158,11,0.08)" : "var(--bg-card)",
                      borderColor: type === bt ? "var(--accent-orange)" : "var(--border-subtle)",
                      color: type === bt ? "var(--accent-orange)" : "var(--text-secondary)",
                      boxShadow: type === bt ? "0 0 0 1px var(--accent-orange)" : "none",
                    }}
                  >
                    <span className="text-2xl">{BUNDLE_EMOJIS[bt]}</span>
                    <span>{bt}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Quantity */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-black font-display mb-2" style={{ color: "var(--text-primary)" }}>
                Quantity Available
              </h2>
              <p className="text-sm mb-10" style={{ color: "var(--text-secondary)" }}>
                How many bundles can you offer today?
              </p>

              <div className="flex items-center justify-center gap-8 my-10">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-secondary)",
                  }}
                >
                  −
                </motion.button>
                <span
                  className="text-7xl font-black font-display w-28 text-center"
                  style={{ color: "var(--text-primary)" }}
                >
                  {quantity}
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black"
                  style={{
                    background: "rgba(245,158,11,0.1)",
                    border: "1px solid rgba(245,158,11,0.3)",
                    color: "var(--accent-orange)",
                  }}
                >
                  +
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Retail Value */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-black font-display mb-2" style={{ color: "var(--text-primary)" }}>
                Retail Value
              </h2>
              <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
                What would these items normally sell for?
              </p>

              <div
                className="flex items-center rounded-2xl border-2 overflow-hidden transition-all"
                style={{
                  background: "var(--bg-card)",
                  borderColor: retailFocused ? "var(--accent-orange)" : "var(--border-subtle)",
                  boxShadow: retailFocused ? "0 0 0 3px rgba(245,158,11,0.15)" : "none",
                }}
              >
                <span
                  className="flex items-center justify-center self-stretch text-2xl font-black shrink-0 border-r px-5"
                  style={{
                    background: "var(--bg-secondary)",
                    color: "var(--text-muted)",
                    borderColor: "var(--border-subtle)",
                    minWidth: "3.5rem",
                  }}
                >
                  R
                </span>
                <input
                  type="number"
                  value={retailValue}
                  onChange={(e) => setRetailValue(e.target.value)}
                  placeholder="120"
                  className="flex-1 min-w-0 px-4 py-5 text-4xl font-black outline-none bg-transparent"
                  style={{ color: "var(--text-primary)" }}
                  onFocus={() => setRetailFocused(true)}
                  onBlur={() => setRetailFocused(false)}
                />
              </div>
            </motion.div>
          )}

          {/* Step 4: Pricing */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-black font-display mb-2" style={{ color: "var(--text-primary)" }}>
                Pricing
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                Set a minimum 60% discount to attract buyers.
              </p>

              {/* Retail reference */}
              <div
                className="flex justify-between items-center px-4 py-3 rounded-xl mb-5"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Retail Value
                </span>
                <span className="text-base font-bold line-through" style={{ color: "var(--text-muted)" }}>
                  R{retailValue}
                </span>
              </div>

              {/* Selling price input */}
              <div
                className="flex items-center rounded-2xl border-2 overflow-hidden transition-all mb-5"
                style={{
                  background: "var(--bg-card)",
                  borderColor: priceFocused
                    ? isPriceValid
                      ? "var(--accent-orange)"
                      : "#EF4444"
                    : isPriceValid
                    ? "var(--border-subtle)"
                    : "rgba(239,68,68,0.4)",
                  boxShadow: priceFocused
                    ? isPriceValid
                      ? "0 0 0 3px rgba(245,158,11,0.15)"
                      : "0 0 0 3px rgba(239,68,68,0.15)"
                    : "none",
                }}
              >
                <span
                  className="flex items-center justify-center self-stretch text-2xl font-black shrink-0 border-r px-5"
                  style={{
                    background: "var(--bg-secondary)",
                    color: isPriceValid ? "var(--text-muted)" : "#EF4444",
                    borderColor: "var(--border-subtle)",
                    minWidth: "3.5rem",
                  }}
                >
                  R
                </span>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className="flex-1 min-w-0 px-4 py-5 text-4xl font-black outline-none bg-transparent"
                  style={{ color: isPriceValid ? "var(--text-primary)" : "#EF4444" }}
                  onFocus={() => setPriceFocused(true)}
                  onBlur={() => setPriceFocused(false)}
                />
              </div>

              {/* Discount display */}
              <div
                className="flex justify-between items-center px-4 py-4 rounded-2xl"
                style={{
                  background: isPriceValid ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                  border: `1px solid ${isPriceValid ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
                }}
              >
                <span className="font-bold text-sm" style={{ color: isPriceValid ? "#10B981" : "#EF4444" }}>
                  Discount
                </span>
                <span
                  className="text-2xl font-black font-display"
                  style={{ color: isPriceValid ? "#10B981" : "#EF4444" }}
                >
                  {discountPercentage}%
                </span>
              </div>
              {!isPriceValid && discountPercentage > 0 && (
                <p className="text-xs mt-2 font-semibold" style={{ color: "#EF4444" }}>
                  Discount must be between 60% and 80%
                </p>
              )}
            </motion.div>
          )}

          {/* Step 5: Pickup Window + Review */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-black font-display mb-2" style={{ color: "var(--text-primary)" }}>
                  Pickup Window
                </h2>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  When should customers collect this bundle?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "From", value: pickupTime, setter: setPickupTime },
                  { label: "Until", value: pickupEndTime, setter: setPickupEndTime },
                ].map(({ label, value, setter }) => (
                  <div key={label} className="space-y-1.5">
                    <p className="text-xs font-bold uppercase tracking-wide ml-1" style={{ color: "var(--text-muted)" }}>
                      {label}
                    </p>
                    <input
                      type="time"
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl text-base font-bold outline-none transition-all"
                      style={{
                        background: "var(--bg-secondary)",
                        color: "var(--text-primary)",
                        border: "1px solid var(--border-subtle)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "var(--accent-orange)";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.15)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-subtle)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Review Card */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
              >
                <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                    Review Before Publishing
                  </p>
                </div>
                {[
                  { label: "Bundle Type", value: type },
                  { label: "Quantity", value: String(quantity) },
                  { label: "Retail Value", value: `R${retailValue}` },
                  { label: "Selling Price", value: `R${sellingPrice} · ${discountPercentage}% off` },
                  { label: "Pickup Window", value: `${pickupTime} – ${pickupEndTime}` },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex justify-between px-4 py-3"
                    style={{ borderBottom: "1px solid var(--border-subtle)" }}
                  >
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                      {label}
                    </span>
                    <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="pt-6 flex gap-3">
        {step < TOTAL_STEPS ? (
          <Button
            onClick={() => setStep((s) => Math.min(s + 1, TOTAL_STEPS))}
            className="flex-1"
            disabled={
              (step === 1 && !type) ||
              (step === 3 && !retailValue) ||
              (step === 4 && !isPriceValid)
            }
          >
            Continue
          </Button>
        ) : (
          <Button onClick={handlePublish} className="flex-1" isLoading={isPublishing}>
            {isEditing ? "Save Changes" : "Publish Bundle"}
          </Button>
        )}
      </div>
    </div>
  );
}
