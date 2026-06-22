export type BundleType = "Bread Bundle" | "Sweet Bundle" | "Mixed Bundle" | "Family Bundle" | "Mystery Box";

export interface Bundle {
  id: string;
  type: BundleType;
  quantity: number;
  retailValue: number;
  sellingPrice: number;
  status: "Active" | "Sold Out" | "Expired";
  createdAt: string;
}

export interface Order {
  id: string;
  pickupCode: string;
  bundleType: BundleType;
  status: "Reserved" | "Collected" | "Missed";
  pickupDeadline: string;
  customerName?: string;
}

export const mockBundles: Bundle[] = [
  {
    id: "b1",
    type: "Bread Bundle",
    quantity: 4,
    retailValue: 120,
    sellingPrice: 39,
    status: "Active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "b2",
    type: "Sweet Bundle",
    quantity: 2,
    retailValue: 150,
    sellingPrice: 50,
    status: "Active",
    createdAt: new Date().toISOString(),
  },
];

export const mockOrders: Order[] = [
  {
    id: "o1",
    pickupCode: "A7K9Q",
    bundleType: "Bread Bundle",
    status: "Reserved",
    pickupDeadline: "18:00",
    customerName: "Alex M.",
  },
  {
    id: "o2",
    pickupCode: "X2M4P",
    bundleType: "Mixed Bundle",
    status: "Collected",
    pickupDeadline: "17:30",
    customerName: "Sarah T.",
  },
];

export const mockStats = {
  bundlesSoldThisMonth: 42,
  estimatedFoodSaved: "85 kg",
  revenueGenerated: "R1,640",
  activeBundles: 6,
};
