"use client";

import { motion } from "framer-motion";
import { ChevronRight, Bell, Shield, HelpCircle, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const menuItems = [
  { icon: Bell, label: "Notifications", badge: "On" },
  { icon: Shield, label: "Privacy & Security", badge: null },
  { icon: HelpCircle, label: "Help & Support", badge: null },
  { icon: LogOut, label: "Sign Out", badge: null, danger: true },
];

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleMenuClick = (label: string) => {
    if (label === "Sign Out") {
      signOut();
    } else if (label === "Privacy & Security") {
      router.push("/privacy");
    }
  };

  return (
    <div className="page-content">
      <div className="px-6 pt-8 pb-4">
        <h1
          className="text-2xl font-black tracking-tight"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Profile
        </h1>
      </div>

      {/* Avatar & Info */}
      <div className="flex flex-col items-center pb-8 px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.3 }}
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-md"
          style={{
            background: "linear-gradient(135deg, var(--accent-orange-dark), var(--accent-orange))",
          }}
        >
          👤
        </motion.div>
        <h2
          className="text-xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          {user?.displayName || "Food Rescuer"}
        </h2>
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
          Stellenbosch · Member since {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).getFullYear() : 2024}
        </p>

        {/* Impact Summary - Clean whitespace alignment */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-xs mt-6 pt-5 border-t border-[var(--border-subtle)]">
          {[
            { label: "Rescued", value: "47" },
            { label: "Food saved", value: "18.3kg" },
            { label: "Saved", value: "R1 240" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div
                className="text-base font-black"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
              >
                {value}
              </div>
              <div className="text-[11px] mt-0.5 font-medium" style={{ color: "var(--text-muted)" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu items - Clean list layout with borders between items */}
      <div className="px-6 flex flex-col divide-y divide-[var(--border-subtle)]">
        {menuItems.map(({ icon: Icon, label, badge, danger }, i) => (
          <motion.button
            key={label}
            onClick={() => handleMenuClick(label)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between py-4 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <Icon
                size={18}
                style={{ color: danger ? "#EF4444" : "var(--accent-orange)" }}
              />
              <span
                className="font-medium text-sm"
                style={{ color: danger ? "#EF4444" : "var(--text-primary)" }}
              >
                {label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {badge && (
                <span
                  className="text-[11px] px-2.5 py-0.5 rounded-full font-medium"
                  style={{ background: "var(--bg-surface)", color: "var(--text-secondary)" }}
                >
                  {badge}
                </span>
              )}
              <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
            </div>
          </motion.button>
        ))}
      </div>

      {/* App version */}
      <p className="text-center text-xs mt-10 pb-6" style={{ color: "var(--text-muted)" }}>
        Very Last Bite v1.0.0 · Stellenbosch
      </p>
    </div>
  );
}


