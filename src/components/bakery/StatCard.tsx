import React from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

export default function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white p-5 rounded-2xl border border-[#F3F4F6] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-[#6B7280]">{title}</h3>
        {icon && <div className="text-[#F59E0B]">{icon}</div>}
      </div>
      <p className="text-2xl font-black font-display text-[#1F2937]">{value}</p>
    </motion.div>
  );
}
