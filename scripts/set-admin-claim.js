/**
 * scripts/set-admin-claim.js
 *
 * One-time CLI script that sets role: "admin" as a Firebase custom claim
 * on brentino@verylastbite.co.za (or any email you pass as an argument).
 *
 * Prerequisites:
 *   1. Download your service account key from:
 *      Firebase Console → Project Settings → Service Accounts → Generate New Private Key
 *   2. Save the file as: scripts/serviceAccountKey.json
 *      (NEVER commit this file — it is already in .gitignore)
 *   3. Run:
 *        node scripts/set-admin-claim.js brentino@verylastbite.co.za
 *
 * Usage:
 *   node scripts/set-admin-claim.js <email>
 *   node scripts/set-admin-claim.js brentino@verylastbite.co.za
 */

const path = require("path");

// ─── Config ───────────────────────────────────────────────────────────────────

const SERVICE_ACCOUNT_PATH = path.join(__dirname, "serviceAccountKey.json");
const TARGET_EMAIL = process.argv[2] || "brentino@verylastbite.co.za";

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  let serviceAccount;
  try {
    serviceAccount = require(SERVICE_ACCOUNT_PATH);
  } catch {
    console.error(`
❌  Service account key not found at: ${SERVICE_ACCOUNT_PATH}

Steps to fix:
  1. Open https://console.firebase.google.com → Project Settings → Service Accounts
  2. Click "Generate New Private Key"
  3. Save the downloaded JSON as: scripts/serviceAccountKey.json
  4. Re-run this script
`);
    process.exit(1);
  }

  let admin;
  try {
    admin = require("firebase-admin");
  } catch {
    console.error("❌  firebase-admin not found. Run: npm install firebase-admin");
    process.exit(1);
  }

  if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  }

  console.log(`\n🔍  Looking up user: ${TARGET_EMAIL} …`);

  try {
    const userRecord = await admin.auth().getUserByEmail(TARGET_EMAIL);
    console.log(`✅  Found user: uid=${userRecord.uid}`);
    console.log(`    Current custom claims: ${JSON.stringify(userRecord.customClaims ?? {})}`);

    await admin.auth().setCustomUserClaims(userRecord.uid, { role: "admin" });

    const updated = await admin.auth().getUser(userRecord.uid);
    console.log(`\n✅  Custom claims set successfully!`);
    console.log(`    New custom claims: ${JSON.stringify(updated.customClaims)}`);
    console.log(`\n📝  Next steps:`);
    console.log(`    • The user must sign out and sign back in (or call getIdToken(true))`);
    console.log(`      for the new claim to appear in their ID token.`);
    console.log(`    • The app's AuthContext will pick up the claim automatically on next login.`);
  } catch (err) {
    console.error(`❌  Error:`, err.message);
    process.exit(1);
  }

  process.exit(0);
}

main();
