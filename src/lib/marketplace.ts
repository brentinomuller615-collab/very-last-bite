import { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Deal } from "./data";

type BakeryInfo = {
  businessName: string;
  openingTime: string;
  closingTime: string;
  status: string;
};

function buildDeal(docId: string, data: Record<string, unknown>, bakeryInfo: BakeryInfo): Deal {
  const retail = (data.retailValue as number) || 100;
  const selling = (data.sellingPrice as number) || 35;
  const discount = Math.round(((retail - selling) / retail) * 100);

  let emoji = "🥐";
  let bgColor = "#F59E0B";
  if (data.type === "Sweet Bundle") {
    emoji = "🧁";
    bgColor = "#EC4899";
  } else if (data.type === "Mixed Bundle") {
    emoji = "🥖";
    bgColor = "#10B981";
  } else if (data.type === "Family Bundle") {
    emoji = "🍞";
    bgColor = "#8B5CF6";
  } else if (data.type === "Mystery Box") {
    emoji = "📦";
    bgColor = "#3B82F6";
  }

  return {
    id: docId,
    businessName: bakeryInfo.businessName || (data.businessName as string) || "Local Bakery",
    title: (data.type as string) || "Surprise Pastry Bag",
    category: "bakery",
    emoji,
    originalPrice: retail,
    discountedPrice: selling,
    discountPercent: discount,
    pickupTime: bakeryInfo.openingTime || "16:00",
    pickupEndTime: bakeryInfo.closingTime || "18:00",
    distance: 0.8,
    description: `A surprise selection of premium surplus baked goods — freshly prepared and packaged.`,
    tags: [(data.type as string) || "Pastries", "Bread", "Surprise"],
    rating: 4.8,
    reviewCount: 94,
    bgColor,
  };
}

export function useMarketplaceDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeListings: (() => void) | null = null;
    let cancelled = false;

    async function init() {
      // Step 1: Fetch all bakeries once so the map is fully populated
      // before we open the listings listener.
      let bakeryMap: Map<string, BakeryInfo>;
      try {
        const bakerySnap = await getDocs(collection(db, "bakeries"));
        bakeryMap = new Map<string, BakeryInfo>();
        bakerySnap.forEach((doc) => {
          const d = doc.data();
          bakeryMap.set(doc.id, {
            businessName: d.businessName || "Artisan Bakery",
            openingTime: d.openingTime || "08:00",
            closingTime: d.closingTime || "17:00",
            status: d.status || "pending",
          });
        });
        console.log(
          `[marketplace] Loaded ${bakeryMap.size} bakeries:`,
          [...bakeryMap.keys()]
        );
      } catch (err) {
        console.error("[marketplace] Failed to load bakeries:", err);
        if (!cancelled) setLoading(false);
        return;
      }

      if (cancelled) return;

      // Step 2: Open a single, stable real-time listener on active listings.
      const listingsQuery = query(
        collection(db, "listings"),
        where("active", "==", true)
      );

      unsubscribeListings = onSnapshot(
        listingsQuery,
        (snap) => {
          const result: Deal[] = [];
          let skippedNoBakery = 0;

          snap.forEach((doc) => {
            const data = doc.data();
            const bakeryId = data.bakeryId as string | undefined;

            if (!bakeryId) {
              console.warn(`[marketplace] Listing ${doc.id} has no bakeryId — skipped`);
              return;
            }

            const bakeryInfo = bakeryMap.get(bakeryId);
            if (!bakeryInfo) {
              skippedNoBakery++;
              console.warn(
                `[marketplace] Listing ${doc.id} has bakeryId "${bakeryId}" which does not match any bakery — skipped`
              );
              return;
            }

            // Enforce approval: only show listings from approved bakeries.
            if (bakeryInfo.status !== "approved") {
              console.info(
                `[marketplace] Bakery "${bakeryInfo.businessName}" (${bakeryId}) is "${bakeryInfo.status}" — listing ${doc.id} hidden`
              );
              return;
            }

            result.push(buildDeal(doc.id, data as Record<string, unknown>, bakeryInfo));
          });

          console.log(
            `[marketplace] ${result.length} deals shown, ${skippedNoBakery} skipped (no matching bakery)`
          );
          setDeals(result);
          setLoading(false);
        },
        (err) => {
          console.error("[marketplace] Listings listener error:", err);
          setLoading(false);
        }
      );
    }

    init();

    return () => {
      cancelled = true;
      unsubscribeListings?.();
    };
  }, []);

  return { deals, loading };
}
