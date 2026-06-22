import React, { useState } from "react";
import { Order } from "@/lib/bakeryMockData";
import Button from "./Button";
import Input from "./Input";

interface OrderCardProps {
  order: Order;
  onVerify: (orderId: string, code: string) => boolean;
}

export default function OrderCard({ order, onVerify }: OrderCardProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleVerify = () => {
    if (order.status !== "Reserved") return;

    if (!isVerifying) {
      setIsVerifying(true);
      return;
    }

    if (!code) {
      setError("Please enter a code");
      return;
    }

    const isValid = onVerify(order.id, code);
    if (isValid) {
      setSuccess(true);
      setError("");
      setIsVerifying(false);
    } else {
      setError("Invalid pickup code");
    }
  };

  return (
    <div className={`p-5 rounded-2xl border transition-all ${
      success || order.status === "Collected" 
        ? "bg-[#F0FDF4] border-[#86EFAC] shadow-sm" 
        : "bg-white border-[#F3F4F6] shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-[#1F2937] font-display">Code: {order.pickupCode}</h3>
          <p className="text-sm font-semibold text-[#6B7280]">{order.bundleType}</p>
        </div>
        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
          success || order.status === "Collected"
            ? "bg-[#DCFCE7] text-[#166534] border-[#86EFAC]"
            : "bg-[#FFFDF8] text-[#D97706] border-[#FCD34D]"
        }`}>
          {success ? "Collected" : order.status}
        </span>
      </div>

      {(order.status === "Reserved" && !success) && (
        <p className="text-sm text-[#4B5563] mb-4 flex items-center">
          <span className="mr-1.5">🕒</span> Collect Before <span className="font-bold ml-1">{order.pickupDeadline}</span>
        </p>
      )}

      {success || order.status === "Collected" ? (
        <div className="bg-[#DCFCE7] text-[#166534] p-3 rounded-xl text-center font-bold text-sm flex items-center justify-center">
          <span className="mr-2">✓</span> Bundle Collected
        </div>
      ) : (
        <div className="space-y-3">
          {isVerifying && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <Input
                placeholder="Enter pickup code..."
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError("");
                }}
                error={error}
                className="mb-2"
                autoFocus
              />
            </div>
          )}
          <div className="flex gap-2">
            {isVerifying && (
              <Button 
                variant="secondary" 
                onClick={() => { setIsVerifying(false); setCode(""); setError(""); }}
                className="!py-2.5 !rounded-xl !px-4 w-auto"
              >
                Cancel
              </Button>
            )}
            <Button onClick={handleVerify} className="!py-2.5 !rounded-xl flex-1">
              Verify Pickup
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
