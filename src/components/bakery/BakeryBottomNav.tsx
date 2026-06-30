"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, ClipboardList, PlusCircle, Settings } from "lucide-react";

const tabs = [
  { id: "dashboard", label: "Dashboard", path: "/bakery/dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", path: "/bakery/dashboard/orders", icon: ClipboardList },
  { id: "add-bundle", label: "Add Bundle", path: "/bakery/dashboard/add-bundle", icon: PlusCircle },
  { id: "settings", label: "Settings", path: "/bakery/dashboard/settings", icon: Settings },
];

export default function BakeryBottomNav() {
  const pathname = usePathname();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-3 max-mobile mx-auto"
      style={{
        background: "linear-gradient(0deg, var(--bg-primary) 0%, rgba(26,10,0,0.96) 100%)",
        borderTop: "1px solid var(--border-subtle)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="flex justify-between items-center px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.id === "dashboard"
              ? pathname === "/bakery/dashboard"
              : pathname.startsWith(tab.path);

          return (
            <Link
              key={tab.id}
              href={tab.path}
              className="relative flex flex-col items-center gap-1 py-1 w-16"
            >
              <motion.div
                animate={{
                  color: isActive ? "var(--accent-orange)" : "var(--text-muted)",
                  scale: isActive ? 1 : 0.9,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              </motion.div>

              <span
                className="text-[10px] font-semibold transition-colors"
                style={{ color: isActive ? "var(--accent-orange)" : "var(--text-muted)" }}
              >
                {tab.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="bakery-nav-indicator"
                  className="absolute -top-3 w-8 h-0.5 rounded-full"
                  style={{ background: "var(--accent-orange)" }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
