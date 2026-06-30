import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken, getAdminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    // 1. Verify caller ID token
    const authHeader = request.headers.get("authorization") ?? "";
    const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let callerClaims;
    try {
      callerClaims = await verifyIdToken(idToken);
    } catch (err) {
      console.error("[verify-pickup] Token verification failed:", err);
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const bakeryId = callerClaims.uid;

    // 2. Parse request body
    const body = await request.json().catch(() => ({}));
    const { pickupCode } = body;

    if (!pickupCode || typeof pickupCode !== "string") {
      return NextResponse.json({ error: "Invalid pickup code format" }, { status: 400 });
    }

    const code = pickupCode.trim().toUpperCase();
    const db = getAdminDb();

    // 3. Find the reservation
    const snapshot = await db.collection("reservations").where("pickupCode", "==", code).limit(1).get();

    if (snapshot.empty) {
      return NextResponse.json({ error: "Invalid pickup code" }, { status: 400 });
    }

    const resDoc = snapshot.docs[0];
    const resData = resDoc.data();

    // 4. Security checks
    if (resData.bakeryId !== bakeryId) {
      return NextResponse.json({ error: "Reservation belongs to another bakery" }, { status: 403 });
    }

    if (resData.pickupCodeUsed === true || resData.status === "collected") {
      return NextResponse.json({ error: "Code already used" }, { status: 400 });
    }

    if (resData.status !== "reserved") {
      return NextResponse.json({ error: "Reservation is not active" }, { status: 400 });
    }

    // 5. Update reservation
    await resDoc.ref.update({
      pickupCodeUsed: true,
      status: "collected",
      collectedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, message: "Verified" });

  } catch (error) {
    console.error("[verify-pickup] Internal error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
