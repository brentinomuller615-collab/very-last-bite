"use client";

import { motion } from "framer-motion";
import { ChevronRight, Heart, Bell, Shield, HelpCircle, Star, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { icon: Heart, label: "Favourite Stores", badge: "3" },
  { icon: Bell, label: "Notifications", badge: "On" },
  { icon: Shield, label: "Privacy & Security", badge: null },
  { icon: Star, label: "Rate the App", badge: null },
  { icon: HelpCircle, label: "Help & Support", badge: null },
  { icon: LogOut, label: "Sign Out", badge: null, danger: true },
];

export default function ProfilePage() {
  const { user, signOut } = useAuth();

  const handleMenuClick = (label: string) => {
    if (label === "Sign Out") {
      signOut();
    }
  };

  return (
    <div className="page-content">
      <div className="px-4 pt-6 pb-5">
        <h1
          className="text-2xl font-black"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Profile
        </h1>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center pb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl mb-3"
          style={{
            background: "linear-gradient(135deg, var(--accent-orange-dark), var(--accent-orange))",
            boxShadow: "0 0 30px rgba(245,158,11,0.3)",
          }}
        >
          👤
        </motion.div>
        <h2
          className="text-xl font-black"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          {user?.displayName || "Foodie"}
        </h2>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Stellenbosch · Member since 2024
        </p>

        {/* Impact summary */}
        <div className="flex gap-4 mt-4">
          {[
            { label: "Meals saved", value: "47" },
            { label: "kg rescued", value: "18.3" },
            { label: "Total saved", value: "R1 240" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div
                className="text-xl font-black"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
              >
                {value}
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu items */}
      <div className="px-4 flex flex-col gap-2">
        {menuItems.map(({ icon: Icon, label, badge, danger }, i) => (
          <motion.button
            key={label}
            onClick={() => handleMenuClick(label)}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between p-4 rounded-2xl"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div className="flex items-center gap-3">
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
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
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
      <p className="text-center text-xs mt-6 pb-4" style={{ color: "var(--text-muted)" }}>
        Very Last Bite v1.0.0 · Made with 💛 in Stellenbosch
      </p>
    </div>
  );
}
