"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@/components/bakery/Button";
import Input from "@/components/bakery/Input";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { formatAuthError } from "@/contexts/AuthContext";
import { createUserRoleIfMissing } from "@/lib/userRoles";

export default function BakeryRegistrationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Input states
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [openingTime, setOpeningTime] = useState("08:00");
  const [closingTime, setClosingTime] = useState("17:00");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Create firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Set display name
      await updateProfile(user, { displayName: businessName });

      // 3. Save details to Firestore bakeries collection
      await setDoc(doc(db, "bakeries", user.uid), {
        uid: user.uid,
        businessName,
        ownerName,
        email,
        phone,
        address,
        openingTime,
        closingTime,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      // 4. Write restaurant role document
      await createUserRoleIfMissing(user.uid, email, "restaurant");

      router.push("/bakery/dashboard");
    } catch (err: any) {
      console.error("Bakery Registration Error:", err);
      setError(formatAuthError(err) || "Failed to create bakery account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col p-6 pt-10">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col flex-1"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-black font-display text-[var(--bakery-text)] mb-2">
            Create Bakery Account
          </h1>
          <p className="text-[#6B7280] text-sm">Join Very Last Bite to start saving food.</p>
        </div>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 flex-1 pb-10">
          <Input 
            label="Bakery Name" 
            placeholder="e.g. Golden Crust Bakery" 
            value={businessName} 
            onChange={(e) => setBusinessName(e.target.value)} 
            required 
          />
          <Input 
            label="Owner Name" 
            placeholder="e.g. Jane Doe" 
            value={ownerName} 
            onChange={(e) => setOwnerName(e.target.value)} 
            required 
          />
          <Input 
            type="email" 
            label="Email Address" 
            placeholder="hello@bakery.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            type="tel" 
            label="Phone Number" 
            placeholder="082 123 4567" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required 
          />
          <Input 
            label="Address" 
            placeholder="123 Main St, City" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            required 
          />
          
          <div className="flex gap-4">
            <Input 
              type="time" 
              label="Opening Time" 
              className="flex-1" 
              value={openingTime} 
              onChange={(e) => setOpeningTime(e.target.value)} 
              required 
            />
            <Input 
              type="time" 
              label="Closing Time" 
              className="flex-1" 
              value={closingTime} 
              onChange={(e) => setClosingTime(e.target.value)} 
              required 
            />
          </div>
          
          <Input 
            type="password" 
            label="Password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />

          <div className="bg-[#FFFDF8] border border-[#FCD34D] rounded-xl p-4 mt-6 mb-2">
            <p className="text-sm font-semibold text-[#D97706] text-center">
              R20/month subscription. No commissions.
            </p>
          </div>

          <div className="pt-4 space-y-4">
            <Button type="submit" isLoading={isLoading}>
              Create Account
            </Button>
            <p className="text-center text-sm text-[#6B7280]">
              Already have an account?{" "}
              <Link href="/bakery" className="font-bold text-[var(--bakery-gold-dark)]">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
