"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export default function LandingPage() {
  const { user, isAdminUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Auth Button details - TODO: Add analytics or tracking trigger if needed
  const authButtonText = user ? "Open App" : "Get Started";
  const authButtonLink = user ? (isAdminUser ? "/admin" : "/spin") : "/signup";

  // Handle header scroll shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuOpen(false);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  // Shared animation variants
  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.6, ease: "easeOut" },
  } as const;

  return (
    <div
      className="min-h-screen font-body selection:bg-[#F59E0B]/30 selection:text-white"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      {/* Navigation */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(26, 10, 0, 0.85)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid var(--border-subtle)"
            : "1px solid transparent",
          padding: scrolled ? "12px 0" : "20px 0",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-black tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            <span className="text-2xl">🍞</span>
            <span>Very Last Bite</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {[
              { label: "Home", href: "#", target: "" },
              { label: "Mission", href: "#mission", target: "mission" },
              { label: "How It Works", href: "#how-it-works", target: "how-it-works" },
              { label: "Impact", href: "#impact", target: "impact" },
              { label: "Contact", href: "#contact", target: "contact" },
            ].map(({ label, href, target }) => (
              <a
                key={label}
                href={href}
                onClick={target ? (e) => handleSmoothScroll(e, target) : undefined}
                className="transition-colors duration-200"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-orange)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link href={authButtonLink}>
              <button
                className="font-bold px-6 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-sm"
                style={{
                  background: "linear-gradient(135deg, var(--accent-orange-dark), var(--accent-orange))",
                  color: "#1a0800",
                  boxShadow: "0 0 20px rgba(245, 158, 11, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 30px rgba(245, 158, 11, 0.4)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(245, 158, 11, 0.2)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {authButtonText}
              </button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 focus:outline-none"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <span className="text-2xl font-bold">✕</span>
            ) : (
              <span className="text-2xl font-bold">☰</span>
            )}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden px-6 py-4 overflow-hidden"
              style={{
                background: "var(--bg-secondary)",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <div className="flex flex-col gap-4 font-medium text-base pb-4">
                {[
                  { label: "Home", href: "#", target: "" },
                  { label: "Mission", href: "#mission", target: "mission" },
                  { label: "How It Works", href: "#how-it-works", target: "how-it-works" },
                  { label: "Impact", href: "#impact", target: "impact" },
                  { label: "Contact", href: "#contact", target: "contact" },
                ].map(({ label, href, target }) => (
                  <a
                    key={label}
                    href={href}
                    onClick={target ? (e) => handleSmoothScroll(e, target) : undefined}
                    className="transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {label}
                  </a>
                ))}
                <Link href={authButtonLink} className="w-full">
                  <button
                    className="w-full font-bold py-3 rounded-xl transition-colors mt-2"
                    style={{
                      background: "linear-gradient(135deg, var(--accent-orange-dark), var(--accent-orange))",
                      color: "#1a0800",
                    }}
                  >
                    {authButtonText}
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-28 md:pt-56 md:pb-48 px-6 overflow-hidden">
        {/* Ambient glow background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(245, 158, 11, 0.07) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-20 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(245, 158, 11, 0.04) 0%, transparent 60%)",
          }}
        />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">
          {/* Visual on Mobile - Stacked above text */}
          <div className="md:col-span-5 md:order-2 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-full max-w-sm h-72 md:h-[360px] flex items-center justify-center"
            >
              {/* Glow orb behind emoji */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle at center, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0.03) 40%, transparent 70%)",
                }}
              />
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center gap-5 text-center z-10"
              >
                <span className="text-8xl md:text-9xl drop-shadow-lg">🍞</span>
                <div
                  className="backdrop-blur-md rounded-2xl px-6 py-3"
                  style={{
                    background: "rgba(245, 158, 11, 0.08)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <span
                    className="font-extrabold text-lg"
                    style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                  >
                    South Africa&apos;s Food Rescue
                  </span>
                  <div className="flex gap-1 justify-center mt-1" style={{ color: "var(--accent-orange)" }}>
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Text Left */}
          <div className="md:col-span-7 md:order-1 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-5"
            >
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
              >
                Make every <br className="hidden sm:inline" />
                <span style={{ color: "var(--accent-orange)" }}>rand</span> go further.
              </h1>
              <p
                className="text-lg leading-relaxed max-w-lg"
                style={{ color: "var(--text-secondary)" }}
              >
                Very Last Bite helps people access available bakery food at reduced prices, making it easier to stretch every rand further while helping reduce unnecessary food waste.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="space-y-5 pt-2"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={authButtonLink} className="flex-1 sm:flex-none">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto font-bold px-8 py-4 rounded-2xl transition-all cursor-pointer text-base"
                    style={{
                      background: "linear-gradient(135deg, var(--accent-orange-dark), var(--accent-orange))",
                      color: "#1a0800",
                      boxShadow: "var(--glow-orange)",
                    }}
                  >
                    {authButtonText}
                  </motion.button>
                </Link>
                <a href="#mission" onClick={(e) => handleSmoothScroll(e, "mission")} className="flex-1 sm:flex-none">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto font-bold px-8 py-4 rounded-2xl transition-all cursor-pointer text-base text-center"
                    style={{
                      background: "transparent",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-subtle)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(245, 158, 11, 0.4)";
                      e.currentTarget.style.background = "rgba(245, 158, 11, 0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(245, 158, 11, 0.15)";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    Learn More
                  </motion.button>
                </a>
              </div>
              <p
                className="text-xs font-medium tracking-wide flex items-center gap-1.5 pl-1"
                style={{ color: "var(--text-muted)" }}
              >
                <span className="text-base" style={{ color: "var(--accent-orange)" }}>✨</span>
                Join the movement to make food go further.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quote Block */}
      <section className="py-20 md:py-32 px-6 relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(245, 158, 11, 0.03) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            {...fadeUp}
            className="space-y-4"
          >
            <span className="text-5xl block" style={{ color: "var(--accent-orange)", opacity: 0.6 }}>
              &ldquo;
            </span>
            <blockquote
              className="text-xl sm:text-2xl md:text-3xl font-bold italic max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-secondary)" }}
            >
              A small amount of money should still be enough to put good food on the table.
            </blockquote>
            <span className="text-5xl block leading-none" style={{ color: "var(--accent-orange)", opacity: 0.6 }}>
              &rdquo;
            </span>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-28 md:py-40 px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-20">
          <motion.div {...fadeUp}>
            <span
              className="text-xs uppercase font-extrabold tracking-widest"
              style={{ color: "var(--accent-orange)" }}
            >
              Our Mission
            </span>
          </motion.div>
          <motion.h2
            {...fadeUp}
            className="text-3xl sm:text-4xl font-black"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Bridging Value and Dignity
          </motion.h2>
          <motion.p
            {...fadeUp}
            className="text-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Food prices continue to rise while many hardworking people struggle to keep up. Very Last Bite exists to help everyday people access more food for their money while helping bakeries reduce unnecessary waste.
          </motion.p>
          <motion.p
            {...fadeUp}
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            We believe nobody should have to choose between hunger and dignity. By connecting available food with people who need it most, we can create stronger communities and a more sustainable food system.
          </motion.p>
        </div>

        {/* Completely borderless & flat mission grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {[
            {
              emoji: "🪙",
              title: "More Value",
              description:
                "Help people stretch their food budget further. Access premium baked goods at a massive discount when it matters most.",
            },
            {
              emoji: "🌍",
              title: "Less Waste",
              description:
                "Connect available food with people who can use it. Minimize end-of-day wastage for bakeries and protect our environment.",
            },
            {
              emoji: "🤝",
              title: "Fair Access",
              description:
                "Create equal opportunities for everyone to access available bundles. No queues, no hassle, just dignified, affordable food.",
            },
          ].map(({ emoji, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-start gap-4 cursor-default"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all duration-300"
                style={{
                  background: "rgba(245, 158, 11, 0.06)",
                }}
              >
                {emoji}
              </div>
              <h3
                className="text-xl font-bold mt-2"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
              >
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-28 md:py-40 px-6 scroll-mt-20 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-20">
            <motion.div {...fadeUp}>
              <span
                className="text-xs uppercase font-extrabold tracking-widest"
                style={{ color: "var(--accent-orange)" }}
              >
                The Process
              </span>
            </motion.div>
            <motion.h2
              {...fadeUp}
              className="text-3xl sm:text-4xl font-black"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              How It Works
            </motion.h2>
            <motion.p
              {...fadeUp}
              className="text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Simple steps connecting bakeries and consumers seamlessly.
            </motion.p>
          </div>

          {/* Completely borderless list columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                num: "01",
                emoji: "🏪",
                title: "Bakery food becomes available",
                desc: "Bakeries check unsold stock at the end of the day and bundle them together into available deals.",
              },
              {
                num: "02",
                emoji: "📱",
                title: "Users open Very Last Bite",
                desc: "Consumers check the platform to see what discount bakery bundles are currently available nearby.",
              },
              {
                num: "03",
                emoji: "⚡",
                title: "Users unlock food bundles",
                desc: "Secure a bundle instantly on the platform, receiving a unique verification pickup code.",
              },
              {
                num: "04",
                emoji: "🛍️",
                title: "Collect more food for less",
                desc: "Head to the bakery, show your pickup code, and collect your delicious food bundle with dignity.",
              },
            ].map(({ num, emoji, title, desc }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative flex flex-col gap-3"
              >
                <div
                  className="text-2xl font-black"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--accent-orange)",
                    opacity: 0.35,
                  }}
                >
                  {num}
                </div>
                <div className="text-2xl mt-1">{emoji}</div>
                <h4
                  className="font-bold pt-2 text-base"
                  style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                >
                  {title}
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-28 md:py-40 px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-20">
          <motion.div {...fadeUp}>
            <span
              className="text-xs uppercase font-extrabold tracking-widest"
              style={{ color: "var(--accent-orange)" }}
            >
              The Impact
            </span>
          </motion.div>
          <motion.h2
            {...fadeUp}
            className="text-3xl sm:text-4xl font-black"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Why It Matters
          </motion.h2>
          <motion.p
            {...fadeUp}
            className="text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            Real difference in pocket size and ecological footprint.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column Comparison: flat & borderless structure */}
          <motion.div
            {...fadeUp}
            className="lg:col-span-6 space-y-6"
          >
            <div className="space-y-6">
              <h3
                className="text-xl font-bold pb-2"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--text-primary)",
                }}
              >
                Budget Stretching Example
              </h3>

              <div className="space-y-4">
                <div className="py-2">
                  <span
                    className="text-xs font-extrabold uppercase tracking-wider block mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Traditional Purchase
                  </span>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
                    &ldquo;R30 may only cover a basic food item.&rdquo;
                  </p>
                </div>

                <div
                  className="p-5 rounded-xl"
                  style={{
                    background: "rgba(245, 158, 11, 0.05)",
                    borderLeft: "3px solid var(--accent-orange)",
                  }}
                >
                  <span
                    className="text-xs font-extrabold uppercase tracking-wider block mb-1"
                    style={{ color: "var(--accent-orange)" }}
                  >
                    Very Last Bite Difference
                  </span>
                  <p className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                    &ldquo;The same budget can stretch further through available food bundles.&rdquo;
                  </p>
                </div>
              </div>

              <p className="text-xs italic" style={{ color: "var(--text-muted)" }}>
                * Note: Exact items fluctuate daily based on available bakery surplus to guarantee freshness.
              </p>
            </div>
          </motion.div>

          {/* Right Column Stats: Flat stats */}
          <motion.div
            {...fadeUp}
            className="lg:col-span-6 space-y-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                {
                  emoji: "🍞",
                  title: "Better Food Access",
                  desc: "Making fresh items affordable to households daily.",
                },
                {
                  emoji: "♻️",
                  title: "Reduced Food Waste",
                  desc: "Rescuing kilograms of good bakery products daily.",
                },
              ].map(({ emoji, title, desc }) => (
                <div key={title} className="flex flex-col items-start">
                  <div className="text-3xl mb-2">{emoji}</div>
                  <h4
                    className="font-bold text-base mb-1"
                    style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                  >
                    {title}
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <div className="flex gap-4 items-start">
                <div className="text-4xl">🇿🇦</div>
                <div>
                  <h4
                    className="font-bold text-base mb-1"
                    style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                  >
                    Stronger Communities
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Connecting local neighborhood bakeries directly with residents in a cooperative, waste-free system.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-28 md:py-40 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">
          {/* Visual Left on desktop */}
          <motion.div
            {...fadeUp}
            className="md:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-sm h-64 md:h-80 flex items-center justify-center">
              {/* Glow orb */}
              <div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(circle at center, rgba(245, 158, 11, 0.08) 0%, transparent 60%)",
                }}
              />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <span className="text-8xl select-none filter drop-shadow-lg">🤝</span>
                <div
                  className="px-5 py-2.5 text-center text-sm font-bold"
                  style={{
                    color: "var(--text-secondary)",
                  }}
                >
                  Dignity · Community · Impact
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Right */}
          <motion.div
            {...fadeUp}
            className="md:col-span-7 space-y-6"
          >
            <span
              className="text-xs uppercase font-extrabold tracking-widest"
              style={{ color: "var(--accent-orange)" }}
            >
              The Vision
            </span>
            <h2
              className="text-3xl font-black"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              A Better Future
            </h2>
            <div className="space-y-4">
              <p className="text-base font-bold leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Very Last Bite was built on a simple belief: Good food should remain accessible to everyday people.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                By helping bakeries recover value from available food while helping people stretch their budgets further, we can create a system that benefits everyone.
              </p>

              <div className="flex flex-wrap gap-2.5 pt-2">
                {["🌱 Less waste", "✊ More dignity", "🥖 Better access"].map((pill) => (
                  <span
                    key={pill}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      background: "rgba(245, 158, 11, 0.05)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-28 md:py-40 px-6">
        <div className="max-w-xl mx-auto">
          <div className="text-center space-y-4 mb-14">
            <motion.div {...fadeUp}>
              <span
                className="text-xs uppercase font-extrabold tracking-widest"
                style={{ color: "var(--accent-orange)" }}
              >
                Contact Us
              </span>
            </motion.div>
            <motion.h2
              {...fadeUp}
              className="text-3xl font-black"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              Get In Touch
            </motion.h2>
            <motion.p
              {...fadeUp}
              className="text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Have questions, suggestions, or want to partner? Drop us a line.
            </motion.p>
          </div>

          {/* Flat contact form directly on the page background */}
          <motion.form
            {...fadeUp}
            onSubmit={handleContactSubmit}
            className="space-y-6"
          >
            <div>
              <label
                className="text-xs font-bold block mb-2 ml-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Name
              </label>
              <input
                type="text"
                required
                placeholder="Jane Doe"
                className="w-full px-4 py-3.5 rounded-xl outline-none text-sm transition-all duration-200"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-subtle)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-orange)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-subtle)")}
              />
            </div>

            <div>
              <label
                className="text-xs font-bold block mb-2 ml-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Email
              </label>
              <input
                type="email"
                required
                placeholder="jane@example.com"
                className="w-full px-4 py-3.5 rounded-xl outline-none text-sm transition-all duration-200"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-subtle)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-orange)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-subtle)")}
              />
            </div>

            <div>
              <label
                className="text-xs font-bold block mb-2 ml-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Message
              </label>
              <textarea
                rows={4}
                required
                placeholder="How can we help you stretch your budget or partner?"
                className="w-full px-4 py-3.5 rounded-xl outline-none text-sm transition-all duration-200 resize-none"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-subtle)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-orange)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-subtle)")}
              ></textarea>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full font-bold py-4 rounded-xl transition-all cursor-pointer mt-2"
              style={{
                background: "linear-gradient(135deg, var(--accent-orange-dark), var(--accent-orange))",
                color: "#1a0800",
                boxShadow: "var(--glow-orange)",
              }}
            >
              Submit Message
            </motion.button>

            {formSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-bold text-center p-3 rounded-xl mt-4"
                style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  color: "var(--accent-green)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                }}
              >
                ✓ Thank you! We&apos;ll get back to you shortly.
              </motion.div>
            )}
          </motion.form>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-16 px-6 mt-20"
        style={{
          background: "var(--bg-secondary)",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Logo & Statement */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-black tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              <span className="text-2xl">🍞</span>
              <span>Very Last Bite</span>
            </Link>
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              Helping food go further.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 text-lg">
              {["🌐", "🐦", "📸"].map((icon) => (
                <span
                  key={icon}
                  className="cursor-pointer transition-all duration-200"
                  style={{ opacity: 0.5 }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "0.5";
                  }}
                >
                  {icon}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <div className="space-y-3">
              <h5
                className="text-xs uppercase font-extrabold tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                Platform
              </h5>
              <ul className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
                <li>
                  <Link href="/" className="transition-colors hover:text-amber-400">Home</Link>
                </li>
                <li>
                  <a href="#mission" onClick={(e) => handleSmoothScroll(e, "mission")} className="transition-colors hover:text-amber-400">Mission</a>
                </li>
                <li>
                  <a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, "how-it-works")} className="transition-colors hover:text-amber-400">How It Works</a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5
                className="text-xs uppercase font-extrabold tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                Resources
              </h5>
              <ul className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
                <li>
                  <a href="#impact" onClick={(e) => handleSmoothScroll(e, "impact")} className="transition-colors hover:text-amber-400">Impact</a>
                </li>
                <li>
                  <a href="#contact" onClick={(e) => handleSmoothScroll(e, "contact")} className="transition-colors hover:text-amber-400">Contact</a>
                </li>
                <li>
                  <Link href="/bakery" className="font-bold transition-colors" style={{ color: "var(--accent-orange)" }}>
                    Bakery Portal
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          className="max-w-7xl mx-auto mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs"
          style={{
            borderTop: "1px solid var(--border-subtle)",
            color: "var(--text-muted)",
          }}
        >
          <p>© {new Date().getFullYear()} Very Last Bite. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer transition-colors hover:text-amber-400">Privacy Policy</span>
            <span className="cursor-pointer transition-colors hover:text-amber-400">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
