/**
 * firebaseAdmin.ts — SERVER-ONLY module
 *
 * This file uses the Firebase Admin SDK and must NEVER be imported in
 * client-side code. It is only safe to use in Next.js API routes (route.ts)
 * or Server Components.
 *
 * Required environment variables (add to .env.local):
 *   FIREBASE_ADMIN_PROJECT_ID
 *   FIREBASE_ADMIN_CLIENT_EMAIL
 *   FIREBASE_ADMIN_PRIVATE_KEY
 */

import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";

// ─── Singleton Admin App ──────────────────────────────────────────────────────

function createAdminApp(): App {
  if (getApps().length > 0) return getApps()[0];

  // Try to load from serviceAccountKey.json first (local development)
  try {
    const fs = require("fs");
    const path = require("path");
    // Use process.cwd() to resolve paths from the project root instead of __dirname (which points into .next at runtime)
    const keyPath = path.join(process.cwd(), "src", "serviceAccountKey.json");
    if (fs.existsSync(keyPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));
      return initializeApp({
        credential: cert(serviceAccount),
      });
    }
  } catch (err) {
    console.warn("[firebaseAdmin] Failed to load local serviceAccountKey.json, falling back to env vars:", err);
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  // .env.local stores `\n` as a literal backslash-n — convert back to newline
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "[firebaseAdmin] Missing credentials. Neither src/serviceAccountKey.json nor environment variables " +
      "(FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY) are set."
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

// ─── Exported helpers ─────────────────────────────────────────────────────────

/** Returns the Admin Auth instance. Initialises the app if needed. */
export function getAdminAuth(): Auth {
  return getAuth(createAdminApp());
}

/**
 * Verifies a Firebase ID token and returns the decoded claims.
 * Throws if the token is invalid or expired.
 */
export async function verifyIdToken(idToken: string) {
  return getAdminAuth().verifyIdToken(idToken);
}

/**
 * Sets a custom claim on a Firebase Auth user.
 * The next time the user refreshes their ID token they will receive the claim.
 */
export async function setCustomClaims(
  uid: string,
  claims: Record<string, unknown>
): Promise<void> {
  await getAdminAuth().setCustomUserClaims(uid, claims);
}

/**
 * Returns the full UserRecord for a given UID.
 */
export async function getAdminUser(uid: string) {
  return getAdminAuth().getUser(uid);
}
