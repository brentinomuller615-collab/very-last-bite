"use client";

import { motion } from "framer-motion";
import { Home, Ticket, User } from "lucide-react";

export type TabId = "spin" | "reserved" | "profile";

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; Icon: React.FC<{ size?: number; strokeWidth?: number }> }[] = [
  { id: "spin", label: "Spin", Icon: Home },
  { id: "reserved", label: "Reserved", Icon: Ticket },
  { id: "profile", label: "Profile", Icon: User },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 nav-bottom"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="max-w-[430px] mx-auto flex items-center justify-around px-4 py-3">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <motion.button
              key={id}
              id={`nav-${id}`}
              whileTap={{ scale: 0.92 }}
              onClick={() => onTabChange(id)}
              className="flex flex-col items-center gap-1 px-6 py-2 rounded-xl relative"
              style={{
                color: isActive ? "var(--accent-orange)" : "var(--text-muted)",
                transition: "color 0.2s ease",
                minWidth: 68,
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "rgba(245,158,11,0.12)" }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                />
              )}
              <Icon size={21} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="text-[11px] font-semibold relative z-10 tracking-tight">{label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}


