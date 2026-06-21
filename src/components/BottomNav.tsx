"use client";

import { motion } from "framer-motion";
import { Home, Search, Ticket, User } from "lucide-react";

export type TabId = "spin" | "browse" | "reserved" | "profile";

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; Icon: React.FC<{ size?: number; strokeWidth?: number }> }[] = [
  { id: "spin", label: "Spin", Icon: Home },
  { id: "browse", label: "Browse", Icon: Search },
  { id: "reserved", label: "Reserved", Icon: Ticket },
  { id: "profile", label: "Profile", Icon: User },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 nav-bottom"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="max-w-[430px] mx-auto flex items-center justify-around px-2 py-2">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <motion.button
              key={id}
              id={`nav-${id}`}
              whileTap={{ scale: 0.9 }}
              onClick={() => onTabChange(id)}
              className="flex flex-col items-center gap-0.5 px-5 py-2 rounded-2xl relative"
              style={{
                color: isActive ? "var(--accent-orange)" : "var(--text-muted)",
                transition: "color 0.2s ease",
                minWidth: 60,
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: "rgba(245,158,11,0.1)" }}
                  transition={{ type: "spring", bounce: 0.25, duration: 0.35 }}
                />
              )}
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-semibold relative z-10">{label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
