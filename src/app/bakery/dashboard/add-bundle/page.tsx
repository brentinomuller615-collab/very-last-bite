"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/bakery/Button";
import Input from "@/components/bakery/Input";
import { BundleType } from "@/lib/bakeryMockData";

import { db, auth } from "@/lib/firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const BUNDLE_TYPES: BundleType[] = ["Bread Bundle", "Sweet Bundle", "Mixed Bundle", "Family Bundle", "Mystery Box"];

export default function AddBundlePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [error, setError] = useState("");

  // Form State
  const [type, setType] = useState<BundleType | "">("");
  const [quantity, setQuantity] = useState(1);
  const [retailValue, setRetailValue] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");

  // Verify status on mount
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
        } else {
          setError("Bakery profile not found.");
        }
      } catch (err) {
        console.error("Error verifying status:", err);
        setError("Failed to verify account status.");
      } finally {
        setIsCheckingStatus(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Calculate recommended price and discount when retail value changes
  useEffect(() => {
    if (retailValue && !isNaN(Number(retailValue))) {
      const val = Number(retailValue);
      // Recommend 70% discount => price is 30% of retail
      const rec = Math.round(val * 0.3);
      setSellingPrice(rec.toString());
    }
  }, [retailValue]);

  const discountPercentage = React.useMemo(() => {
    if (!retailValue || !sellingPrice) return 0;
    const r = Number(retailValue);
    const s = Number(sellingPrice);
    if (r === 0) return 0;
    return Math.round(((r - s) / r) * 100);
  }, [retailValue, sellingPrice]);

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handlePublish = async () => {
    setIsPublishing(true);
    setError("");
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user session.");

      // Re-verify status before publish
      const bakerySnap = await getDoc(doc(db, "bakeries", user.uid));
      if (!bakerySnap.exists() || bakerySnap.data().status !== "approved") {
        throw new Error("Listing creation blocked: account is not approved.");
      }

      const bakeryData = bakerySnap.data();

      // Save to Firestore listings collection
      await addDoc(collection(db, "listings"), {
        bakeryId: user.uid,
        businessName: bakeryData.businessName || "Unknown Bakery",
        type,
        quantity,
        retailValue: Number(retailValue),
        sellingPrice: Number(sellingPrice),
        status: "Active",
        active: true,
        createdAt: new Date().toISOString(),
        category: "bakery"
      });

      router.push("/bakery/dashboard");
    } catch (err: any) {
      console.error("Publish listing error:", err);
      setError(err.message || "Failed to publish listing.");
    } finally {
      setIsPublishing(false);
    }
  };

  const isPriceValid = discountPercentage >= 60 && discountPercentage <= 80;

  if (isCheckingStatus) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-90px)] p-6 bg-[var(--bakery-bg)]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full border-4 border-amber-100 border-t-[var(--bakery-gold)]"
        />
        <p className="mt-4 text-sm font-semibold text-[#6B7280]">Verifying account details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 pt-10 flex flex-col min-h-[calc(100dvh-90px)] justify-center items-center text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-3xl">
          ⚠️
        </div>
        <h2 className="text-xl font-black font-display text-[var(--bakery-text)]">Listing Creation Blocked</h2>
        <p className="text-sm font-semibold text-[#6B7280] max-w-xs">{error}</p>
        <Button onClick={() => router.push("/bakery/dashboard")} className="w-full max-w-xs">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 pt-10 flex flex-col min-h-[calc(100dvh-90px)]">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-bold text-[#9CA3AF] mb-2 px-1">
          <span>Step {step} of 5</span>
          <span className="text-[#F59E0B]">{Math.round((step / 5) * 100)}%</span>
        </div>
        <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#F59E0B]"
            initial={{ width: `${((step - 1) / 5) * 100}%` }}
            animate={{ width: `${(step / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-black font-display text-[#1F2937] mb-6">Select Bundle Type</h2>
              <div className="space-y-3">
                {BUNDLE_TYPES.map(bt => (
                  <button
                    key={bt}
                    onClick={() => setType(bt)}
                    className={`w-full p-4 rounded-2xl border-2 text-left font-bold transition-all ${
                      type === bt ? "border-[#F59E0B] bg-[#FFFDF8] text-[#D97706]" : "border-[#F3F4F6] bg-white text-[#4B5563]"
                    }`}
                  >
                    {bt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-black font-display text-[#1F2937] mb-2">Quantity Available</h2>
              <p className="text-[#6B7280] mb-8 text-sm">How many of these bundles can you offer today?</p>
              
              <div className="flex items-center justify-center gap-6 my-12">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center text-3xl font-bold text-[#4B5563] active:bg-[#E5E7EB]"
                >
                  -
                </button>
                <span className="text-6xl font-black font-display text-[#1F2937] w-24 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-16 h-16 rounded-full bg-[#FFFDF8] border-2 border-[#FCD34D] flex items-center justify-center text-3xl font-bold text-[#D97706] active:bg-[#FCD34D]"
                >
                  +
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-black font-display text-[#1F2937] mb-2">Retail Value</h2>
              <p className="text-[#6B7280] mb-8 text-sm">What would these items normally sell for?</p>
              
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-[#9CA3AF]">R</span>
                <input 
                  type="number"
                  value={retailValue}
                  onChange={(e) => setRetailValue(e.target.value)}
                  placeholder="120"
                  className="w-full pl-12 pr-4 py-5 rounded-2xl text-4xl font-black text-[#1F2937] bg-[#F9FAFB] border-2 border-[#F3F4F6] focus:border-[#F59E0B] outline-none"
                />
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-black font-display text-[#1F2937] mb-2">Pricing</h2>
              <p className="text-[#6B7280] mb-6 text-sm">Set a minimum 60% discount to attract buyers.</p>
              
              <div className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-2xl p-4 mb-6 flex justify-between items-center">
                <span className="text-[#4B5563] font-semibold">Retail Value</span>
                <span className="text-xl font-bold text-[#1F2937]">R{retailValue}</span>
              </div>

              <div className="relative mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-[#9CA3AF]">R</span>
                <input 
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className={`w-full pl-12 pr-4 py-5 rounded-2xl text-4xl font-black text-[#1F2937] bg-white border-2 outline-none transition-colors ${
                    !isPriceValid ? "border-red-400 focus:border-red-500 text-red-600" : "border-[#F59E0B] shadow-[0_0_0_4px_rgba(245,158,11,0.1)]"
                  }`}
                />
              </div>

              <div className={`flex justify-between items-center p-4 rounded-2xl border ${
                !isPriceValid ? "bg-red-50 border-red-200" : "bg-[#DCFCE7] border-[#86EFAC]"
              }`}>
                <span className={`font-bold ${!isPriceValid ? "text-red-700" : "text-[#166534]"}`}>Discount</span>
                <span className={`text-2xl font-black ${!isPriceValid ? "text-red-700" : "text-[#166534]"}`}>
                  {discountPercentage}%
                </span>
              </div>
              
              {!isPriceValid && (
                <p className="text-red-500 text-sm mt-2 font-semibold">
                  Discount must be between 60% and 80%.
                </p>
              )}
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-black font-display text-[#1F2937] mb-6">Review & Publish</h2>
              
              <div className="bg-white border border-[#F3F4F6] rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between border-b border-[#F3F4F6] pb-3">
                  <span className="text-[#6B7280]">Bundle Type</span>
                  <span className="font-bold text-[#1F2937]">{type}</span>
                </div>
                <div className="flex justify-between border-b border-[#F3F4F6] pb-3">
                  <span className="text-[#6B7280]">Quantity</span>
                  <span className="font-bold text-[#1F2937]">{quantity}</span>
                </div>
                <div className="flex justify-between border-b border-[#F3F4F6] pb-3">
                  <span className="text-[#6B7280]">Retail Value</span>
                  <span className="font-bold text-[#1F2937] line-through">R{retailValue}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div>
                    <span className="text-[#6B7280] block text-sm mb-1">Selling Price</span>
                    <span className="bg-[#DCFCE7] text-[#166534] px-2 py-0.5 rounded-lg text-xs font-bold border border-[#86EFAC]">
                      {discountPercentage}% OFF
                    </span>
                  </div>
                  <span className="text-3xl font-black text-[#D97706]">R{sellingPrice}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pt-6 flex gap-3">
        {step > 1 && (
          <Button variant="secondary" onClick={prevStep} className="w-auto px-6">
            Back
          </Button>
        )}
        
        {step < 5 ? (
          <Button 
            onClick={nextStep} 
            className="flex-1"
            disabled={(step === 1 && !type) || (step === 3 && !retailValue) || (step === 4 && !isPriceValid)}
          >
            Continue
          </Button>
        ) : (
          <Button 
            onClick={handlePublish} 
            className="flex-1"
            isLoading={isPublishing}
          >
            Publish Bundle
          </Button>
        )}
      </div>
    </div>
  );
}
