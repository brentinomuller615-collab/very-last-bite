"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { Deal, DealCategory } from "@/lib/data";
import { useMarketplaceDeals } from "@/lib/marketplace";
import DealCard from "./DealCard";

const categories: { id: DealCategory | "all"; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "🍽️" },
  { id: "bakery", label: "Bakery", emoji: "🥐" },
  { id: "cafe", label: "Café", emoji: "☕" },
  { id: "grocery", label: "Grocery", emoji: "🥦" },
  { id: "restaurant", label: "Restaurant", emoji: "🍕" },
];

interface BrowsePageProps {
  onReserve: (deal: Deal) => void;
}

export default function BrowsePage({ onReserve }: BrowsePageProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<DealCategory | "all">("all");
  const { deals, loading } = useMarketplaceDeals();

  const filtered = deals.filter((d) => {
    const matchesCategory = activeCategory === "all" || d.category === activeCategory;
    const matchesSearch =
      search === "" ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.businessName.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-content">
      {/* Header */}
      <div className="px-4 pt-6 pb-3">
        <h1
          className="text-2xl font-black mb-1"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Nearby deals
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {filtered.length} near you
        </p>
      </div>

      {/* Search bar */}
      <div className="px-4 mb-3">
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <Search size={16} style={{ color: "var(--text-muted)" }} />
          <input
            id="browse-search"
            type="text"
            placeholder="Search deals or restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--text-primary)" }}
          />
          <SlidersHorizontal size={16} style={{ color: "var(--text-muted)" }} />
        </div>
      </div>

      {/* Category filters */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {categories.map(({ id, label, emoji }) => (
            <motion.button
              key={id}
              whileTap={{ scale: 0.93 }}
              onClick={() => setActiveCategory(id)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-all"
              style={{
                background:
                  activeCategory === id ? "var(--accent-orange)" : "var(--bg-secondary)",
                color: activeCategory === id ? "#1a0800" : "var(--text-secondary)",
                border:
                  activeCategory === id
                    ? "1px solid var(--accent-orange)"
                    : "1px solid var(--border-subtle)",
              }}
            >
              <span>{emoji}</span>
              <span>{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Deal list */}
      <div className="px-4 flex flex-col gap-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 rounded-full border-2 border-orange-100 border-t-[var(--accent-orange)]"
            />
            <p className="mt-3 text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Finding active deals...</p>
          </div>
        ) : (
          <>
            {filtered.map((deal, i) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <DealCard deal={deal} compact onReserve={onReserve} />
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-semibold">No deals found</p>
                <p className="text-sm">Try a different search or category</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
