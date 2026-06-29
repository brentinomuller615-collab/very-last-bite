/**
 * POST /api/auth/set-admin-claim
 *
 * Sets role: "admin" as a Firebase Auth custom claim on a user.
 *
 * Authorization:
 *   - The caller must send their own Firebase ID token in the Authorization header:
 *       Authorization: Bearer <id-token>
 *   - The caller must already hold  role: "admin"  in their own custom claims.
 *   - There is no self-promotion pathway — admins are created exclusively via
 *     the server-side CLI script (scripts/set-admin-claim.js).
 *
 * Request body (JSON):
 *   { "uid": "<Firebase UID of the user to promote>" }
 *
 * Response:
 *   200 { success: true, message: string }
 *   400 { error: string }
 *   401 { error: string }
 *   403 { error: string }
 *   500 { error: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken, setCustomClaims, getAdminUser } from "@/lib/firebaseAdmin";

export async function POST(request: NextRequest) {
  // ── 1. Extract and verify the caller's ID token ───────────────────────────
  const authHeader = request.headers.get("authorization") ?? "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!idToken) {
    return NextResponse.json(
      { error: "Authorization header required. Send: Authorization: Bearer <id-token>" },
      { status: 401 }
    );
  }

  let callerClaims: Awaited<ReturnType<typeof verifyIdToken>>;
  try {
    callerClaims = await verifyIdToken(idToken);
  } catch (err) {
    console.error("[set-admin-claim] Token verification failed:", err);
    return NextResponse.json({ error: "Invalid or expired ID token." }, { status: 401 });
  }

  const callerEmail = callerClaims.email ?? "";

  // ── 2. Authorisation: caller must already hold role=admin ────────────────────
  // There is no self-promotion pathway. Admins are provisioned exclusively
  // via the server-side CLI script (scripts/set-admin-claim.js).
  const callerIsAdmin = callerClaims.role === "admin";

  if (!callerIsAdmin) {
    console.warn(`[set-admin-claim] Forbidden: ${callerEmail} does not hold role=admin.`);
    return NextResponse.json(
      { error: "Forbidden. Only existing administrators may set admin claims." },
      { status: 403 }
    );
  }

  // ── 3. Parse the request body ─────────────────────────────────────────────
  let body: { uid?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const targetUid = body.uid;
  if (!targetUid) {
    return NextResponse.json(
      { error: "Request body must include { uid: string }." },
      { status: 400 }
    );
  }

  // ── 4. Set the custom claim ───────────────────────────────────────────────
  try {
    // Fetch the target user so we can include their email in the response log
    const targetUser = await getAdminUser(targetUid);

    await setCustomClaims(targetUid, { role: "admin" });

    console.log(
      `[set-admin-claim] ✅ Set role:admin on ${targetUser.email} (uid: ${targetUid}) ` +
      `by caller ${callerEmail}`
    );

    return NextResponse.json({
      success: true,
      message: `Custom claim { role: "admin" } set on ${targetUser.email}. ` +
        "The user must refresh their ID token (re-login or call getIdToken(true)) to receive it.",
    });
  } catch (err) {
    console.error("[set-admin-claim] Failed to set custom claim:", err);
    return NextResponse.json(
      { error: "Failed to set custom claim. Check server logs." },
      { status: 500 }
    );
  }
}
