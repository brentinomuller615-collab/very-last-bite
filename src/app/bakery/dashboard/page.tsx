"use client";

import React from "react";
import StatCard from "@/components/bakery/StatCard";
import BundleCard from "@/components/bakery/BundleCard";
import { mockStats, mockBundles } from "@/lib/bakeryMockData";

export default function BakeryDashboardPage() {
  return (
    <div className="p-6 pt-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl">🍞</span>
          <h1 className="text-xl font-bold font-display text-[#1F2937]">Very Last Bite</h1>
        </div>
        <h2 className="text-2xl font-black font-display text-[var(--bakery-text)]">
          Good Afternoon, <br /> Golden Crust Bakery
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard title="Bundles Sold This Month" value={mockStats.bundlesSoldThisMonth} icon={<span className="text-xl">📈</span>} />
        <StatCard title="Estimated Food Saved" value={mockStats.estimatedFoodSaved} icon={<span className="text-xl">🌍</span>} />
        <StatCard title="Revenue Generated" value={mockStats.revenueGenerated} icon={<span className="text-xl">💰</span>} />
        <StatCard title="Active Bundles" value={mockStats.activeBundles} icon={<span className="text-xl">📦</span>} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold font-display text-[#1F2937]">Active Bundles</h3>
        </div>
        
        <div className="space-y-4">
          {mockBundles.map(bundle => (
            <BundleCard key={bundle.id} bundle={bundle} onEdit={(id) => console.log("Edit", id)} />
          ))}
        </div>
      </div>
    </div>
  );
}
