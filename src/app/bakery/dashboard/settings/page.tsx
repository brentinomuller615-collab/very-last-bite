"use client";

import React from "react";
import Button from "@/components/bakery/Button";
import Input from "@/components/bakery/Input";

export default function BakerySettingsPage() {
  return (
    <div className="p-6 pt-10 pb-10 space-y-8">
      <div>
        <h1 className="text-2xl font-black font-display text-[#1F2937] mb-2">Settings</h1>
        <p className="text-sm text-[#6B7280]">Manage your bakery profile and account.</p>
      </div>

      <section>
        <h2 className="text-lg font-bold font-display text-[#1F2937] mb-4">Business Information</h2>
        <div className="space-y-4">
          <Input label="Bakery Name" defaultValue="Golden Crust Bakery" />
          <Input label="Phone Number" defaultValue="082 123 4567" />
          <Input label="Address" defaultValue="123 Main St, City" />
          <div className="flex gap-4">
            <Input type="time" label="Opening Time" defaultValue="06:00" className="flex-1" />
            <Input type="time" label="Closing Time" defaultValue="18:00" className="flex-1" />
          </div>
          <Button variant="secondary" className="w-full mt-2">Save Changes</Button>
        </div>
      </section>

      <section className="bg-white p-5 rounded-2xl border border-[#F3F4F6] shadow-sm">
        <h2 className="text-lg font-bold font-display text-[#1F2937] mb-4">Subscription</h2>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="font-bold text-[#1F2937]">Starter Plan</p>
            <p className="text-sm text-[#6B7280]">R20/month</p>
          </div>
          <span className="bg-[#DCFCE7] text-[#166534] px-3 py-1 rounded-lg text-xs font-bold border border-[#86EFAC]">
            Active
          </span>
        </div>
        <p className="text-xs text-[#9CA3AF] mb-4">Next billing date: 15 July 2026</p>
        <Button variant="outline" className="w-full !py-2.5">Manage Subscription</Button>
      </section>

      <section className="bg-[#FFFDF8] border border-[#FCD34D] p-5 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🌍</div>
        <h2 className="text-lg font-bold font-display text-[#D97706] mb-4 relative z-10">Food Impact</h2>
        
        <div className="grid grid-cols-2 gap-4 relative z-10">
          <div>
            <p className="text-xs font-bold text-[#B45309] mb-1">Bundles Saved</p>
            <p className="text-2xl font-black text-[#92400E]">142</p>
          </div>
          <div>
            <p className="text-xs font-bold text-[#B45309] mb-1">Value Rescued</p>
            <p className="text-2xl font-black text-[#92400E]">R4,260</p>
          </div>
        </div>
      </section>
      
      <div className="pt-4">
         <Button className="w-full bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none" variant="secondary">
           Log Out
         </Button>
      </div>
    </div>
  );
}
