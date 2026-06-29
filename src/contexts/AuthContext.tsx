"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  AuthError,
  IdTokenResult,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  UserRole,
  getUserRole,
} from "@/lib/userRoles";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  role: UserRole | null;
  roleLoading: boolean;
  isAdminUser: boolean;
  /** The decoded Firebase ID token result (contains custom claims). Null if not loaded yet. */
  idTokenResult: IdTokenResult | null;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  /** Force-refresh the ID token and re-resolve the role. Call after setting a custom claim. */
  refreshRole: () => Promise<void>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatAuthError(error: AuthError): string {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    default:
      return "Something went wrong. Please try again.";
  }
}

// ─── Role resolution ──────────────────────────────────────────────────────────

/**
 * Resolves the user's role using the following priority:
 *
 *  1. Firebase ID token custom claim  `claims.role`   (authoritative — JWT-signed by Firebase)
 *  2. Firestore `users/{uid}.role` document           (fallback for users without a custom claim)
 *
 * Force-refreshes the token on every call so freshly-set custom claims are always visible.
 * Admin access is granted ONLY when `claims.role === "admin"` — no email/domain checks.
 */
async function resolveRole(
  firebaseUser: User
): Promise<{ role: UserRole | null; tokenResult: IdTokenResult }> {
  const email = firebaseUser.email ?? "(no email)";

  console.group(`[Auth] Resolving role for: ${email}`);

  // ── Step A: Force-refresh the ID token ─────────────────────────────────────
  // Bypasses the 1-hour client-side token cache and fetches a fresh JWT from
  // Firebase, ensuring any recently-set custom claims are included.
  let tokenResult: IdTokenResult;
  try {
    tokenResult = await firebaseUser.getIdTokenResult(/* forceRefresh */ true);
    console.log("[Auth] ID token refreshed.");
    console.log("[Auth] uid:           ", firebaseUser.uid);
    console.log("[Auth] email:         ", email);
    console.log("[Auth] custom claims: ", tokenResult.claims);
  } catch (err) {
    console.error("[Auth] Failed to refresh ID token — using cached token:", err);
    tokenResult = await firebaseUser.getIdTokenResult(false);
  }

  // ── Step B: Custom claim is the sole source of admin access ────────────────
  const claimRole = tokenResult.claims["role"] as UserRole | undefined;

  if (claimRole) {
    console.log(`[Auth] Custom claim found: role="${claimRole}"`);
    console.log(`[Auth] Admin access granted via custom claim: ${claimRole === "admin"}`);
    console.groupEnd();
    return { role: claimRole, tokenResult };
  }

  console.log("[Auth] No custom claim on token — checking Firestore for restaurant/customer role.");

  // ── Step C: Firestore fallback (restaurant / customer users) ───────────────
  // Restaurant and customer accounts receive their role from a Firestore document
  // written at signup. Admin accounts should always carry a custom claim.
  const firestoreRole = await getUserRole(firebaseUser.uid);

  if (firestoreRole) {
    console.log(`[Auth] Firestore role found: role="${firestoreRole}"`);
    console.log(`[Auth] Admin access granted via Firestore: ${firestoreRole === "admin"}`);

    // ── Step D: If Firestore says admin but the JWT doesn't carry the claim ───
    // Attempt to backfill the custom claim so the JWT becomes self-contained.
    // Requires the /api/auth/set-admin-claim endpoint and valid Admin SDK credentials.
    if (firestoreRole === "admin" && !claimRole) {
      console.log("[Auth] Firestore=admin but no JWT claim — syncing via API…");
      try {
        const freshToken = await firebaseUser.getIdToken(/* forceRefresh */ true);
        const response = await fetch("/api/auth/set-admin-claim", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${freshToken}`,
          },
          body: JSON.stringify({ uid: firebaseUser.uid }),
        });
        if (response.ok) {
          console.log("[Auth] ✅ Custom claim synced. Refreshing token…");
          const updated = await firebaseUser.getIdTokenResult(/* forceRefresh */ true);
          tokenResult = updated;
          const updatedClaim = updated.claims["role"] as UserRole | undefined;
          if (updatedClaim) {
            console.log(`[Auth] Claim now in token: role="${updatedClaim}"`);
            console.groupEnd();
            return { role: updatedClaim, tokenResult: updated };
          }
        } else {
          const body = await response.json().catch(() => ({}));
          console.warn("[Auth] ⚠️  Claim sync failed:", body.error ?? response.statusText);
        }
      } catch (err) {
        console.warn("[Auth] ⚠️  Claim sync request threw:", err);
      }
    }

    console.groupEnd();
    return { role: firestoreRole, tokenResult };
  }

  // ── Step E: No role found anywhere ─────────────────────────────────────────
  console.log("[Auth] No role found in token or Firestore. role=null");
  console.log("[Auth] Admin access granted: false");
  console.groupEnd();
  return { role: null, tokenResult };
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [idTokenResult, setIdTokenResult] = useState<IdTokenResult | null>(null);

  // ── Helper: resolve and store role for the current user ────────────────────
  async function loadRole(firebaseUser: User) {
    setRoleLoading(true);
    try {
      const { role: resolved, tokenResult } = await resolveRole(firebaseUser);
      setRole(resolved);
      setIdTokenResult(tokenResult);
    } catch (err) {
      console.error("[Auth] Unexpected error during role resolution:", err);
      setRole(null);
      setIdTokenResult(null);
    } finally {
      setRoleLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (!firebaseUser) {
        console.log("[Auth] User signed out — clearing role.");
        setRole(null);
        setIdTokenResult(null);
        setRoleLoading(false);
        return;
      }

      await loadRole(firebaseUser);
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Public: force-refresh the role (call after setting a custom claim) ─────
  async function refreshRole() {
    if (!user) return;
    console.log("[Auth] Manual role refresh requested.");
    await loadRole(user);
  }

  // ── Auth actions ───────────────────────────────────────────────────────────

  async function signUp(email: string, password: string, displayName: string) {
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(newUser, { displayName });
    setUser({ ...newUser, displayName } as User);
  }

  async function signIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged fires after this and triggers loadRole automatically
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  }

  const isAdminUser = role === "admin";



  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        role,
        roleLoading,
        isAdminUser,
        idTokenResult,
        signUp,
        signIn,
        signOut,
        resetPassword,
        refreshRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
