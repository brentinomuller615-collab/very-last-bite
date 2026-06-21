"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Full-screen branded loading spinner while resolving auth state
  if (loading) {
    return (
      <div
        className="flex flex-col items-center justify-center"
        style={{
          minHeight: "100dvh",
          background: "var(--bg-primary)",
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          {/* Logo mark */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{
              background: "linear-gradient(135deg, var(--accent-orange-dark), var(--accent-orange))",
              boxShadow: "var(--glow-orange-strong)",
            }}
          >
            🍱
          </div>

          {/* Spinner ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 rounded-full"
            style={{
              border: "2px solid rgba(245, 158, 11, 0.15)",
              borderTopColor: "var(--accent-orange)",
            }}
          />
        </motion.div>
      </div>
    );
  }

  // Show nothing while redirect is happening
  if (!user) return null;

  return <>{children}</>;
}
