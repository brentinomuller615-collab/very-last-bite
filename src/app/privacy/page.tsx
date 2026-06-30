"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import AuthGuard from "@/components/AuthGuard";

export default function PrivacyPage() {
  return (
    <AuthGuard>
      <main
        className="max-mobile mx-auto min-h-screen px-4 pt-6 pb-12 relative flex flex-col"
        style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
      >
        {/* Header */}
        <header className="flex items-center gap-4 mb-8">
          <Link
            href="/spin?tab=profile"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
            }}
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1
              className="text-xl font-black font-display"
              style={{ color: "var(--text-primary)" }}
            >
              Privacy & Security
            </h1>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Terms, Policies, and Disclaimers
            </p>
          </div>
        </header>

        {/* Scrollable Content Container */}
        <div className="flex-1 space-y-10 overflow-y-auto pr-1">
          {/* Section 1: Privacy Policy */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: "var(--border-subtle)" }}>
              <span className="text-xl">📜</span>
              <h2
                className="text-lg font-black font-display"
                style={{ color: "var(--accent-orange)" }}
              >
                1. PRIVACY POLICY (Very Last Bite)
              </h2>
            </div>
            
            <div className="text-xs space-y-3" style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
              <p>
                <strong>Effective Date:</strong> [Insert Launch Date]<br />
                <strong>Contact:</strong> brentinomuller615@gmail.com
              </p>
              <p>
                Very Last Bite (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates a digital platform that connects customers with approved bakeries, cafés, and restaurants offering surplus food.
              </p>

              <div className="space-y-2 mt-4">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">1. Information We Collect</h3>
                <p>We may collect:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Account login information</li>
                  <li>User activity within the app</li>
                  <li>Bakery business information (for approved vendors)</li>
                </ul>
                <p className="italic text-[var(--text-muted)] mt-2">
                  We do NOT collect or store payment information, as all transactions occur directly between customers and bakeries.
                </p>
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">2. How We Use Information</h3>
                <p>We use data to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Create and manage accounts</li>
                  <li>Display bakery listings</li>
                  <li>Manage bakery approvals</li>
                  <li>Improve platform functionality</li>
                  <li>Communicate important updates</li>
                </ul>
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">3. Data Sharing</h3>
                <p>We do not sell personal data.</p>
                <p>We may share information only:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Between users and approved bakeries (as part of platform functionality)</li>
                  <li>If required by law</li>
                </ul>
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">4. Data Storage</h3>
                <p>Data is securely stored using third-party infrastructure providers.</p>
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">5. Your Rights (POPIA Compliance)</h3>
                <p>Under South African law, users may:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Request access to their data</li>
                  <li>Request correction or deletion of their data</li>
                </ul>
                <p className="mt-2">
                  Contact: brentinomuller615@gmail.com
                </p>
              </div>
            </div>
          </motion.section>

          {/* Section 2: Terms of Service */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: "var(--border-subtle)" }}>
              <span className="text-xl">📜</span>
              <h2
                className="text-lg font-black font-display"
                style={{ color: "var(--accent-orange)" }}
              >
                2. TERMS OF SERVICE
              </h2>
            </div>
            
            <div className="text-xs space-y-3" style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">1. Platform Role</h3>
                <p>
                  Very Last Bite is a listing and discovery platform. We connect customers with independent food providers.
                </p>
                <p>
                  We do not sell food directly and do not process payments.
                </p>
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">2. Account Types</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Customers may register freely</li>
                  <li>Bakeries must be approved before appearing on the platform</li>
                </ul>
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">3. Bakery Responsibility</h3>
                <p>Approved bakeries are solely responsible for:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Food quality</li>
                  <li>Food safety</li>
                  <li>Pricing</li>
                  <li>Order fulfillment</li>
                </ul>
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">4. Prohibited Use</h3>
                <p>Users may not:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Misuse the platform</li>
                  <li>Post false listings</li>
                  <li>Attempt fraud or manipulation</li>
                </ul>
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">5. Platform Rights</h3>
                <p>We may:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Approve or reject bakeries</li>
                  <li>Remove listings at any time</li>
                  <li>Suspend accounts for violations</li>
                </ul>
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">6. Limitation of Liability</h3>
                <p>We are not responsible for:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Food quality or safety</li>
                  <li>Customer-bakery disputes</li>
                  <li>Financial transactions between users and bakeries</li>
                </ul>
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">7. Service Availability</h3>
                <p>We may modify or discontinue features at any time.</p>
              </div>
            </div>
          </motion.section>

          {/* Section 3: Bakery Partner Agreement */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: "var(--border-subtle)" }}>
              <span className="text-xl">🤝</span>
              <h2
                className="text-lg font-black font-display"
                style={{ color: "var(--accent-orange)" }}
              >
                3. BAKERY PARTNER AGREEMENT
              </h2>
            </div>
            
            <div className="text-xs space-y-3" style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
              <p>By joining Very Last Bite, the bakery agrees:</p>

              <div className="space-y-2 mt-4">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">1. Listing Rights</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Bakery may list surplus food items via the platform system</li>
                  <li>All listings must be accurate and truthful</li>
                </ul>
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">2. Food Responsibility</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Bakery is fully responsible for food safety, handling, and quality</li>
                </ul>
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">3. Pricing Rules</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Pricing must follow platform discount rules (up to 60–70% off original value cap)</li>
                </ul>
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">4. Subscription Fee</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Bakery agrees to pay a monthly subscription fee to remain active on the platform</li>
                </ul>
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">5. Platform Control</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>The platform may approve, suspend, or remove listings or accounts at its discretion</li>
                </ul>
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">6. Conduct</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Misuse of the platform may result in immediate removal</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Section 4: Refund Policy */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: "var(--border-subtle)" }}>
              <span className="text-xl">💸</span>
              <h2
                className="text-lg font-black font-display"
                style={{ color: "var(--accent-orange)" }}
              >
                4. REFUND POLICY
              </h2>
            </div>
            
            <div className="text-xs space-y-3" style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">1. No Platform Refunds</h3>
                <p>Very Last Bite does not process payments and does not issue refunds.</p>
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">2. Bakery Transactions</h3>
                <p>All payments are handled directly between customers and bakeries.</p>
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">3. Disputes</h3>
                <p>Any refund requests or disputes must be handled directly with the bakery.</p>
              </div>
            </div>
          </motion.section>

          {/* Section 5: Food & Allergy Disclaimer */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: "var(--border-subtle)" }}>
              <span className="text-xl">⚠️</span>
              <h2
                className="text-lg font-black font-display"
                style={{ color: "var(--accent-orange)" }}
              >
                5. FOOD & ALLERGY DISCLAIMER
              </h2>
            </div>
            
            <div className="text-xs space-y-3" style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
              <p>Very Last Bite does not prepare, handle, or package food.</p>
              <p>All food is provided by independent bakeries, cafés, and restaurants.</p>
              
              <div className="space-y-2 mt-4">
                <p>Users acknowledge:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Food may contain allergens (gluten, dairy, nuts, etc.)</li>
                  <li>It is the user’s responsibility to check with the bakery before consumption</li>
                  <li>The platform is not liable for allergic reactions or food-related health issues</li>
                </ul>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </AuthGuard>
  );
}
