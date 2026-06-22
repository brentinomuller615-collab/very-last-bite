import React from "react";
import { Bundle } from "@/lib/bakeryMockData";
import Button from "./Button";

interface BundleCardProps {
  bundle: Bundle;
  onEdit?: (id: string) => void;
}

export default function BundleCard({ bundle, onEdit }: BundleCardProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#F3F4F6] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#F59E0B]" />
      
      <div className="flex justify-between items-start pt-1">
        <div>
          <h3 className="text-lg font-bold text-[#1F2937] font-display">{bundle.type}</h3>
          <p className="text-sm text-[#6B7280]">Quantity: <span className="font-semibold text-[#1F2937]">{bundle.quantity}</span></p>
        </div>
        <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#FFFDF8] text-[#D97706] border border-[#FCD34D]">
          {bundle.status}
        </span>
      </div>

      <div className="flex justify-between items-center bg-[#F9FAFB] p-3 rounded-xl border border-[#F3F4F6]">
        <div>
          <p className="text-xs text-[#6B7280]">Retail Value</p>
          <p className="text-sm font-semibold text-gray-500 line-through">R{bundle.retailValue}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#F59E0B] font-bold">Selling Price</p>
          <p className="text-lg font-black text-[#1F2937]">R{bundle.sellingPrice}</p>
        </div>
      </div>

      {onEdit && (
        <Button variant="secondary" onClick={() => onEdit(bundle.id)} className="!py-2.5 !rounded-xl">
          Edit Bundle
        </Button>
      )}
    </div>
  );
}
