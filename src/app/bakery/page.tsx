"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@/components/bakery/Button";
import Input from "@/components/bakery/Input";

import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { formatAuthError } from "@/contexts/AuthContext";

export default function BakeryLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/bakery/dashboard");
    } catch (err: any) {
      console.error("Bakery Login Error:", err);
      setError(formatAuthError(err) || "Failed to log in.");
    } finally {
      setIsLoading(false);
    }
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
          <h1
            className="text-3xl font-black font-display mb-1"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Very Last Bite
          </h1>
          <p
            className="text-sm font-bold"
            style={{ color: "var(--accent-orange)" }}
          >
            Bakery Portal
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl text-center font-semibold">
            {error}
          </div>
        )}

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
