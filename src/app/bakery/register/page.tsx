"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@/components/bakery/Button";
import Input from "@/components/bakery/Input";

export default function BakeryRegistrationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock registration logic
    setTimeout(() => {
      setIsLoading(false);
      router.push("/bakery/dashboard");
    }, 1000);
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

        <form onSubmit={handleRegister} className="space-y-4 flex-1 pb-10">
          <Input label="Bakery Name" placeholder="e.g. Golden Crust Bakery" required />
          <Input label="Owner Name" placeholder="e.g. Jane Doe" required />
          <Input type="email" label="Email Address" placeholder="hello@bakery.com" required />
          <Input type="tel" label="Phone Number" placeholder="082 123 4567" required />
          <Input label="Address" placeholder="123 Main St, City" required />
          
          <div className="flex gap-4">
            <Input type="time" label="Opening Time" className="flex-1" required />
            <Input type="time" label="Closing Time" className="flex-1" required />
          </div>
          
          <Input type="password" label="Password" placeholder="••••••••" required />

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
