"use client";

import React from "react";
import BakeryBottomNav from "@/components/bakery/BakeryBottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-[100dvh]">
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="pb-[90px]" // Space for Bottom Nav
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <BakeryBottomNav />
    </div>
  );
}
