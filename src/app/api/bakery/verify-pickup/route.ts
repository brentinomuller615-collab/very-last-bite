import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken, getAdminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    console.log("[DIAG-API] verify-pickup route entered");

    // 1. Verify caller ID token
    const authHeader = request.headers.get("authorization") ?? "";
    const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    console.log("[DIAG-API] idToken present:", !!idToken);

    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let callerClaims;
    try {
      callerClaims = await verifyIdToken(idToken);
      console.log("[DIAG-API] Token verified, bakeryId:", callerClaims.uid);
    } catch (err) {
      console.error("[verify-pickup] Token verification failed:", err);
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const bakeryId = callerClaims.uid;

    // 2. Parse request body
    const body = await request.json().catch(() => ({}));
    const { pickupCode } = body;
    console.log("[DIAG-API] pickupCode received:", pickupCode);

    if (!pickupCode || typeof pickupCode !== "string") {
      return NextResponse.json({ error: "Invalid pickup code format" }, { status: 400 });
    }

    const code = pickupCode.trim().toUpperCase();
    console.log("[DIAG-API] Searching reservations for code:", code);
    const db = getAdminDb();

    // 3. Find the reservation
    const snapshot = await db.collection("reservations").where("pickupCode", "==", code).limit(1).get();
    console.log("[DIAG-API] Search query executed. Empty:", snapshot.empty, "Docs found:", snapshot.size);

    if (snapshot.empty) {
      console.log("[DIAG-API] No reservation found for code:", code);
      return NextResponse.json({ error: "Invalid pickup code" }, { status: 400 });
    }

    const resDoc = snapshot.docs[0];
    const resData = resDoc.data();
    console.log("[DIAG-API] Reservation found:", resDoc.id, "| bakeryId:", resData.bakeryId, "| status:", resData.status, "| pickupCodeUsed:", resData.pickupCodeUsed);

    // 4. Security checks
    if (resData.bakeryId !== bakeryId) {
      console.log("[DIAG-API] bakeryId mismatch. Reservation bakeryId:", resData.bakeryId, "Caller bakeryId:", bakeryId);
      return NextResponse.json({ error: "Reservation belongs to another bakery" }, { status: 403 });
    }

    if (resData.pickupCodeUsed === true || resData.status === "collected") {
      console.log("[DIAG-API] Code already used. pickupCodeUsed:", resData.pickupCodeUsed, "status:", resData.status);
      return NextResponse.json({ error: "Code already used" }, { status: 400 });
    }

    if (resData.status !== "reserved") {
      console.log("[DIAG-API] Reservation not active. status:", resData.status);
      return NextResponse.json({ error: "Reservation is not active" }, { status: 400 });
    }

    // 5. Update reservation
    console.log("[DIAG-API] Attempting Firestore update on doc:", resDoc.id);
    try {
      await resDoc.ref.update({
        pickupCodeUsed: true,
        status: "collected",
        collectedAt: FieldValue.serverTimestamp(),
      });
      console.log("[DIAG-API] Firestore update succeeded");
    } catch (updateErr) {
      console.error("[DIAG-API] Firestore update FAILED:", updateErr);
      throw updateErr;
    }

    return NextResponse.json({ success: true, message: "Verified" });

  } catch (error) {
    console.error("[verify-pickup] Internal error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
