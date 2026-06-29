import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "admin" | "restaurant" | "customer";

export interface UserRoleDocument {
  role: UserRole;
  email: string;
  createdAt: unknown; // Firestore Timestamp or FieldValue
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Fetch the role for a given Firebase UID from `users/{uid}`.
 * Returns null if the document does not exist.
 */
export async function getUserRole(uid: string): Promise<UserRole | null> {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    return (snap.data() as UserRoleDocument).role ?? null;
  } catch {
    return null;
  }
}

/**
 * Write (or overwrite) the role document for a user.
 * In production this should only be callable by admins (enforced by Firestore rules).
 */
export async function setUserRole(
  uid: string,
  email: string,
  role: UserRole
): Promise<void> {
  await setDoc(
    doc(db, "users", uid),
    { role, email, createdAt: serverTimestamp() },
    { merge: true }
  );
}

/**
 * Creates the initial role document for a brand-new user if none exists yet.
 * Does NOT overwrite an existing document (uses merge: false guard).
 */
export async function createUserRoleIfMissing(
  uid: string,
  email: string,
  role: UserRole
): Promise<void> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { role, email, createdAt: serverTimestamp() });
  }
}
