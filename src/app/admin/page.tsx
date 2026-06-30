"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Bakery {
  uid: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  openingTime: string;
  closingTime: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  createdAt?: string;
}

interface Listing {
  id: string;
  bakeryId: string;
  type: string;
  retailValue: number;
  sellingPrice: number;
  active: boolean;
  createdAt?: { seconds: number };
  bakeryName?: string; // resolved client-side
}

type BakeryTab = "pending" | "approved" | "suspended-rejected";
type MainTab = "bakeries" | "listings";

// ─── Status badge helper ──────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Bakery["status"] }) {
  const map: Record<Bakery["status"], { label: string; cls: string }> = {
    pending: {
      label: "Pending",
      cls: "bg-amber-50 text-amber-600 border-amber-200",
    },
    approved: {
      label: "Approved",
      cls: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    rejected: {
      label: "Rejected",
      cls: "bg-gray-50 text-gray-500 border-gray-200",
    },
    suspended: {
      label: "Suspended",
      cls: "bg-red-50 text-red-500 border-red-200",
    },
  };
  const { label, cls } = map[status];
  return (
    <span
      className={`text-[10px] uppercase font-black border px-2 py-0.5 rounded ${cls}`}
    >
      {label}
    </span>
  );
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const { user, loading: authLoading, isAdminUser, roleLoading, signOut } = useAuth();
  const router = useRouter();

  // Combined loading: wait for both Firebase Auth AND the Firestore role to resolve
  const resolving = authLoading || roleLoading;

  const [mainTab, setMainTab] = useState<MainTab>("bakeries");
  const [bakeries, setBakeries] = useState<Bakery[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [bakeryTab, setBakeryTab] = useState<BakeryTab>("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [actioningId, setActioningId] = useState<string | null>(null);

  // ── Guard: redirect after auth + role have both resolved ─────────────────────
  useEffect(() => {
    if (resolving) return;      // still loading — do nothing
    if (isAdminUser) return;    // confirmed admin — let them in
    // Resolved AND not admin → redirect
    router.replace("/");
  }, [resolving, isAdminUser, router]);

  // ── Firestore listeners ──────────────────────────────────────────────────────
  useEffect(() => {
    // Wait for auth + role to resolve before touching Firestore
    if (resolving) return;
    if (!isAdminUser) return;

    let bakeriesReady = false;
    let listingsReady = false;
    const checkReady = () => {
      if (bakeriesReady && listingsReady) setDataLoading(false);
    };

    const bakeryMap = new Map<string, string>(); // uid → businessName

    const unsubBakeries = onSnapshot(
      collection(db, "bakeries"),
      (snap) => {
        const fetched: Bakery[] = [];
        snap.forEach((d) => {
          const data = d.data();
          bakeryMap.set(d.id, data.businessName || "Unknown Bakery");
          fetched.push({ uid: d.id, ...data } as Bakery);
        });
        fetched.sort((a, b) => {
          const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tB - tA;
        });
        setBakeries(fetched);
        bakeriesReady = true;
        checkReady();
      },
      (err) => {
        console.error("Error reading bakeries:", err);
        bakeriesReady = true;
        checkReady();
      }
    );

    const unsubListings = onSnapshot(
      collection(db, "listings"),
      (snap) => {
        const fetched: Listing[] = [];
        snap.forEach((d) => {
          const data = d.data();
          fetched.push({
            id: d.id,
            bakeryId: data.bakeryId || "",
            type: data.type || "Unknown Type",
            retailValue: data.retailValue || 0,
            sellingPrice: data.sellingPrice || 0,
            active: data.active === true,
            createdAt: data.createdAt,
            bakeryName: bakeryMap.get(data.bakeryId) || data.bakeryId || "—",
          });
        });
        fetched.sort((a, b) => {
          const tA = a.createdAt?.seconds ?? 0;
          const tB = b.createdAt?.seconds ?? 0;
          return tB - tA;
        });
        setListings(fetched);
        listingsReady = true;
        checkReady();
      },
      (err) => {
        console.error("Error reading listings:", err);
        listingsReady = true;
        checkReady();
      }
    );

    return () => {
      unsubBakeries();
      unsubListings();
    };
  }, [authLoading, user]);

  // ── Bakery actions ───────────────────────────────────────────────────────────
  const updateBakeryStatus = useCallback(
    async (uid: string, newStatus: Bakery["status"]) => {
      setActioningId(uid);
      try {
        const ref = doc(db, "bakeries", uid);
        const update: Record<string, unknown> = { status: newStatus };
        if (newStatus === "approved") update.approvedAt = serverTimestamp();
        if (newStatus === "rejected") update.rejectedAt = serverTimestamp();
        await updateDoc(ref, update);
      } catch (err) {
        console.error(`Failed to set status "${newStatus}":`, err);
        alert("Permission denied. Make sure you are signed in as an admin.");
      } finally {
        setActioningId(null);
      }
    },
    []
  );

  // ── Listing actions ──────────────────────────────────────────────────────────
  const toggleListingActive = useCallback(
    async (id: string, currentActive: boolean) => {
      setActioningId(id);
      try {
        await updateDoc(doc(db, "listings", id), { active: !currentActive });
      } catch (err) {
        console.error("Failed to toggle listing:", err);
        alert("Permission denied.");
      } finally {
        setActioningId(null);
      }
    },
    []
  );

  const deleteListing = useCallback(async (id: string) => {
    if (!confirm("Delete this listing permanently?")) return;
    setActioningId(id);
    try {
      await deleteDoc(doc(db, "listings", id));
    } catch (err) {
      console.error("Failed to delete listing:", err);
      alert("Permission denied.");
    } finally {
      setActioningId(null);
    }
  }, []);

  // ── Derived stats ─────────────────────────────────────────────────────────
  const totalBakeries = bakeries.length;
  const pendingCount = bakeries.filter((b) => b.status === "pending").length;
  const approvedCount = bakeries.filter((b) => b.status === "approved").length;
  const restrictedCount = bakeries.filter(
    (b) => b.status === "suspended" || b.status === "rejected"
  ).length;
  const totalListings = listings.length;
  const activeListings = listings.filter((l) => l.active).length;

  // ── Filtered bakeries ─────────────────────────────────────────────────────
  const filteredBakeries = bakeries.filter((b) => {
    const matchesTab =
      bakeryTab === "pending"
        ? b.status === "pending"
        : bakeryTab === "approved"
          ? b.status === "approved"
          : b.status === "suspended" || b.status === "rejected";
    const q = searchTerm.toLowerCase();
    return (
      matchesTab &&
      (b.businessName.toLowerCase().includes(q) ||
        b.ownerName?.toLowerCase().includes(q) ||
        b.email?.toLowerCase().includes(q))
    );
  });

  // ── Render guards (in priority order) ─────────────────────────────────────────
  // 1. Auth or role not yet resolved — show spinner, do NOT redirect.
  if (resolving) {
    return <LoadingScreen label="Authenticating…" />;
  }
  // 2. Resolved but not an admin — show brief message while router.replace fires.
  if (!isAdminUser) {
    return <LoadingScreen label="Access denied. Redirecting…" />;
  }
  // 3. Admin confirmed, Firestore data still loading.
  if (dataLoading) {
    return <LoadingScreen label="Loading admin console…" />;
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3E2723] font-body selection:bg-[#FCD34D] selection:text-[#5D4037] pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#F2ECE4] py-4 px-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-black font-display text-[#5D4037]"
          >
            <span className="text-2xl">🍞</span>
            <span>Very Last Bite</span>
            <span className="text-xs bg-amber-500/10 text-amber-600 px-2.5 py-0.5 rounded-full font-bold">
              Admin
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-xs font-semibold text-[#8D6E63]">
              {user?.email}
            </span>
            <button
              onClick={() => signOut()}
              className="text-xs font-bold bg-[#5D4037] text-white px-3 py-1.5 rounded-lg hover:bg-[#4E342E] transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-black font-display tracking-tight text-[#3E2723]">
            Admin Dashboard
          </h1>
          <p className="text-[#8D6E63] text-sm mt-1">
            Manage bakery approvals, listings, and marketplace health.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard label="Total Bakeries" value={totalBakeries} color="neutral" />
          <StatCard label="Pending" value={pendingCount} color="amber" />
          <StatCard label="Approved" value={approvedCount} color="green" />
          <StatCard label="Total Listings" value={totalListings} color="blue" />
          <StatCard label="Active Listings" value={activeListings} color="green" />
        </div>

        {/* Main Tab Toggle */}
        <div className="flex gap-2 bg-white/50 p-1 border border-[#F2ECE4] rounded-full w-fit">
          <button
            onClick={() => setMainTab("bakeries")}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${mainTab === "bakeries"
              ? "bg-[#5D4037] text-white shadow-sm"
              : "text-[#8D6E63] hover:text-[#3E2723]"
              }`}
          >
            🏪 Bakeries
          </button>
          <button
            onClick={() => setMainTab("listings")}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${mainTab === "listings"
              ? "bg-[#5D4037] text-white shadow-sm"
              : "text-[#8D6E63] hover:text-[#3E2723]"
              }`}
          >
            📦 Listings
            {totalListings > 0 && (
              <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
                {totalListings}
              </span>
            )}
          </button>
        </div>

        {/* ── Bakeries Panel ─────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {mainTab === "bakeries" && (
            <motion.div
              key="bakeries"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {/* Sub-tabs + Search */}
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-[#F2ECE4] pb-4">
                <div className="flex gap-2 bg-white/50 p-1 border border-[#F2ECE4] rounded-full">
                  {(
                    [
                      { id: "pending", label: `⏳ Pending`, count: pendingCount },
                      { id: "approved", label: `✅ Approved`, count: approvedCount },
                      {
                        id: "suspended-rejected",
                        label: `🚫 Restricted`,
                        count: restrictedCount,
                      },
                    ] as { id: BakeryTab; label: string; count: number }[]
                  ).map(({ id, label, count }) => (
                    <button
                      key={id}
                      onClick={() => setBakeryTab(id)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${bakeryTab === id
                        ? "bg-amber-500 text-white shadow-sm"
                        : "text-[#8D6E63] hover:text-[#3E2723]"
                        }`}
                    >
                      {label} ({count})
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Search business, owner, or email…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-72 px-4 py-2.5 bg-white border border-[#F2ECE4] rounded-xl outline-none focus:border-amber-500 text-sm placeholder-[#A1887F] transition-all"
                />
              </div>

              {/* Bakery Cards */}
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredBakeries.length === 0 ? (
                    <EmptyState message="No bakeries found in this category." />
                  ) : (
                    filteredBakeries.map((bakery) => {
                      const isActioning = actioningId === bakery.uid;
                      const formattedDate = bakery.createdAt
                        ? new Date(bakery.createdAt).toLocaleDateString("en-ZA", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                        : "—";

                      return (
                        <motion.div
                          key={bakery.uid}
                          layoutId={bakery.uid}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          className="bg-white border border-[#F2ECE4] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:shadow-md transition-shadow"
                        >
                          {/* Info */}
                          <div className="space-y-3 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-xl font-bold font-display text-[#3E2723]">
                                {bakery.businessName}
                              </h3>
                              <StatusBadge status={bakery.status} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-1.5 gap-x-4 text-xs font-semibold text-[#8D6E63]">
                              <div>
                                👤 <span className="text-[#3E2723]">{bakery.ownerName || "—"}</span>
                              </div>
                              <div>
                                ✉️ <span className="text-[#3E2723]">{bakery.email || "—"}</span>
                              </div>
                              <div>
                                📞 <span className="text-[#3E2723]">{bakery.phone || "—"}</span>
                              </div>
                              <div>
                                📍 <span className="text-[#3E2723]">{bakery.address || "—"}</span>
                              </div>
                              <div>
                                ⏰{" "}
                                <span className="text-[#3E2723]">
                                  {bakery.openingTime} – {bakery.closingTime}
                                </span>
                              </div>
                              <div>
                                📅 <span className="text-[#3E2723]">{formattedDate}</span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 self-start md:self-auto">
                            {bakery.status !== "approved" && (
                              <ActionButton
                                disabled={isActioning}
                                onClick={() => updateBakeryStatus(bakery.uid, "approved")}
                                variant="green"
                                label="✓ Approve"
                              />
                            )}
                            {bakery.status === "pending" && (
                              <ActionButton
                                disabled={isActioning}
                                onClick={() => updateBakeryStatus(bakery.uid, "rejected")}
                                variant="outline-red"
                                label="✕ Reject"
                              />
                            )}
                            {bakery.status === "approved" && (
                              <ActionButton
                                disabled={isActioning}
                                onClick={() => updateBakeryStatus(bakery.uid, "suspended")}
                                variant="red"
                                label="⛔ Suspend"
                              />
                            )}
                            {(bakery.status === "suspended" ||
                              bakery.status === "rejected") && (
                                <ActionButton
                                  disabled={isActioning}
                                  onClick={() => updateBakeryStatus(bakery.uid, "pending")}
                                  variant="outline-amber"
                                  label="⏳ Re-review"
                                />
                              )}
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ── Listings Panel ─────────────────────────────────────── */}
          {mainTab === "listings" && (
            <motion.div
              key="listings"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#8D6E63] font-semibold">
                  {totalListings} listing{totalListings !== 1 ? "s" : ""} ·{" "}
                  {activeListings} active
                </p>
              </div>

              {listings.length === 0 ? (
                <EmptyState message="No listings found in Firestore." />
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-[#F2ECE4] shadow-sm">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#FFF8F0] text-[#8D6E63] text-xs font-extrabold uppercase tracking-wider">
                        <th className="px-5 py-3.5 text-left">Type</th>
                        <th className="px-5 py-3.5 text-left">Bakery</th>
                        <th className="px-5 py-3.5 text-right">Retail</th>
                        <th className="px-5 py-3.5 text-right">Price</th>
                        <th className="px-5 py-3.5 text-center">Status</th>
                        <th className="px-5 py-3.5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2ECE4] bg-white">
                      <AnimatePresence>
                        {listings.map((listing) => {
                          const isActioning = actioningId === listing.id;
                          const discount = listing.retailValue
                            ? Math.round(
                              ((listing.retailValue - listing.sellingPrice) /
                                listing.retailValue) *
                              100
                            )
                            : 0;
                          return (
                            <motion.tr
                              key={listing.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0, height: 0 }}
                              className="hover:bg-[#FFF8F0] transition-colors"
                            >
                              <td className="px-5 py-4 font-semibold text-[#3E2723]">
                                {listing.type}
                              </td>
                              <td className="px-5 py-4 text-[#5D4037]">
                                {listing.bakeryName}
                              </td>
                              <td className="px-5 py-4 text-right text-[#8D6E63]">
                                R{listing.retailValue}
                              </td>
                              <td className="px-5 py-4 text-right">
                                <span className="font-bold text-[#3E2723]">
                                  R{listing.sellingPrice}
                                </span>
                                {discount > 0 && (
                                  <span className="ml-1 text-[10px] font-bold text-emerald-600">
                                    -{discount}%
                                  </span>
                                )}
                              </td>
                              <td className="px-5 py-4 text-center">
                                <span
                                  className={`text-[10px] font-black uppercase border px-2 py-0.5 rounded ${listing.active
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                    : "bg-gray-50 text-gray-400 border-gray-200"
                                    }`}
                                >
                                  {listing.active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    disabled={isActioning}
                                    onClick={() =>
                                      toggleListingActive(listing.id, listing.active)
                                    }
                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 cursor-pointer ${listing.active
                                      ? "bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100"
                                      : "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100"
                                      }`}
                                  >
                                    {listing.active ? "Deactivate" : "Activate"}
                                  </button>
                                  <button
                                    disabled={isActioning}
                                    onClick={() => deleteListing(listing.id)}
                                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-all disabled:opacity-50 cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "neutral" | "amber" | "green" | "blue" | "red";
}) {
  const colorMap = {
    neutral: "bg-white border-[#F2ECE4] text-[#3E2723]",
    amber: "bg-[#FFF8E7] border-[#FCD34D]/40 text-[#D97706]",
    green: "bg-[#ECFDF5] border-[#A7F3D0]/40 text-emerald-600",
    blue: "bg-[#EFF6FF] border-blue-200/40 text-blue-600",
    red: "bg-[#FEF2F2] border-[#FEE2E2]/40 text-red-600",
  };

  return (
    <div className={`border rounded-2xl p-4 shadow-sm ${colorMap[color]}`}>
      <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#8D6E63] block">
        {label}
      </span>
      <span className="text-3xl font-black block mt-1.5 font-display">{value}</span>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  disabled,
  variant,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  variant: "green" | "red" | "outline-red" | "outline-amber";
}) {
  const cls = {
    green:
      "bg-emerald-500 hover:bg-emerald-600 text-white",
    red: "bg-red-500 hover:bg-red-600 text-white",
    "outline-red":
      "bg-white border-2 border-[#F2ECE4] hover:bg-[#FEF2F2] hover:border-red-200 text-red-500",
    "outline-amber":
      "bg-white border-2 border-[#F2ECE4] hover:bg-[#FFF8E7] hover:border-amber-200 text-amber-600",
  }[variant];

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`font-bold text-xs px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer ${cls}`}
    >
      {label}
    </button>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center py-16 bg-white border border-[#F2ECE4] rounded-2xl"
    >
      <span className="text-4xl block mb-2">🤷‍♂️</span>
      <p className="font-semibold text-gray-500 text-sm">{message}</p>
    </motion.div>
  );
}

function LoadingScreen({ label }: { label: string }) {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 rounded-full border-4 border-amber-200 border-t-amber-500"
      />
      <p className="mt-4 font-semibold text-[#8D6E63]">{label}</p>
    </div>
  );
}
