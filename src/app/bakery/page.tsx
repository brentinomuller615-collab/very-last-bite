"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@/components/bakery/Button";
import Input from "@/components/bakery/Input";

export default function BakeryLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock login logic
    setTimeout(() => {
      setIsLoading(false);
      router.push("/bakery/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col p-6 pt-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col flex-1"
      >
        <div className="mb-10 text-center">
          <div className="text-6xl mb-4">🍞</div>
          <h1 className="text-3xl font-black font-display text-[var(--bakery-text)] mb-2">
            Very Last Bite
          </h1>
          <p className="text-[#6B7280] font-semibold">Bakery Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 flex-1">
          <Input 
            type="email"
            label="Email Address"
            placeholder="hello@bakery.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="pt-4 space-y-4">
            <Button type="submit" isLoading={isLoading}>
              Login
            </Button>
            <Link href="/bakery/register" className="block w-full">
              <Button type="button" variant="secondary" className="w-full">
                Create Bakery Account
              </Button>
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
