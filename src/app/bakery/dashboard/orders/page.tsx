"use client";

import React, { useState } from "react";
import OrderCard from "@/components/bakery/OrderCard";
import { mockOrders } from "@/lib/bakeryMockData";

export default function BakeryOrdersPage() {
  const [orders, setOrders] = useState(mockOrders);

  const handleVerify = (orderId: string, code: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order && order.pickupCode.toUpperCase() === code.toUpperCase()) {
      // Success, mark as collected
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "Collected" } : o));
      return true;
    }
    return false;
  };

  return (
    <div className="p-6 pt-10">
      <div className="mb-6">
        <h1 className="text-2xl font-black font-display text-[#1F2937] mb-2">
          Customer Orders
        </h1>
        <p className="text-sm text-[#6B7280]">Verify pickups and manage reservations.</p>
      </div>

      <div className="space-y-4">
        {orders.map(order => (
          <OrderCard key={order.id} order={order} onVerify={handleVerify} />
        ))}
      </div>
    </div>
  );
}
