"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const tabs = [
  { id: "dashboard", label: "Dashboard", path: "/bakery/dashboard", icon: "📊" },
  { id: "orders", label: "Orders", path: "/bakery/dashboard/orders", icon: "🧾" },
  { id: "add-bundle", label: "Add Bundle", path: "/bakery/dashboard/add-bundle", icon: "➕" },
  { id: "settings", label: "Settings", path: "/bakery/dashboard/settings", icon: "⚙️" },
];

export default function BakeryBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-4 bg-white/80 backdrop-blur-xl border-t border-[#F3F4F6] max-mobile mx-auto">
      <div className="flex justify-between items-center px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path || (tab.id === 'dashboard' && pathname === '/bakery/dashboard');
          
          // Special case for dashboard root path vs other paths
          const isReallyActive = tab.id === 'dashboard' 
            ? pathname === '/bakery/dashboard'
            : pathname.includes(tab.path);

          return (
            <Link key={tab.id} href={tab.path} className="relative flex flex-col items-center p-2 w-16">
              <span className={`text-2xl mb-1 transition-transform ${isReallyActive ? "scale-110" : "grayscale opacity-50"}`}>
                {tab.icon}
              </span>
              <span className={`text-[10px] font-semibold transition-colors ${
                isReallyActive ? "text-[#D97706]" : "text-[#9CA3AF]"
              }`}>
                {tab.label}
              </span>
              
              {isReallyActive && (
                <motion.div
                  layoutId="bakery-bottom-nav-indicator"
                  className="absolute -top-4 w-8 h-1 rounded-full bg-[#F59E0B]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
