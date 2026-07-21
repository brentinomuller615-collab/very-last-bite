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
        className="fixed top-0 left-0 right-0 z-50 py-4 md:py-[22px] transition-[background,backdrop-filter,border-color] duration-500"
        style={{
          background: scrolled
            ? "rgba(26, 10, 0, 0.90)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid var(--border-subtle)"
            : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg md:text-xl font-black tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            <span className="text-xl md:text-2xl">🍞</span>
            <span>Very Last Bite</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium">
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
                className="transition-colors duration-200 relative py-1.5"
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
                className="font-bold px-7 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-xs tracking-wider uppercase"
                style={{
                  background: "linear-gradient(135deg, var(--accent-orange-dark), var(--accent-orange))",
                  color: "#1a0800",
                  boxShadow: "0 0 24px rgba(245, 158, 11, 0.25)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 36px rgba(245, 158, 11, 0.45)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 24px rgba(245, 158, 11, 0.25)";
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

      <main>

        {/* Hero Section */}
        <section className="relative pt-24 pb-16 md:pt-36 md:pb-24 px-6 mb-20 md:mb-44 overflow-hidden">
          {/* Ambient glow background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(245, 158, 11, 0.08) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute top-20 right-0 w-[600px] h-[600px] pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(245, 158, 11, 0.06) 0%, transparent 60%)",
            }}
          />

          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08]"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
              >
                Make every <br className="hidden sm:inline" />
                <span style={{ color: "var(--accent-orange)" }}>rand</span> go further.
              </h1>
              <p
                className="text-lg leading-relaxed max-w-2xl mx-auto"
                style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}
              >
                Very Last Bite helps people access available bakery food at reduced prices, making it easier to stretch every rand further while helping reduce unnecessary food waste.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="flex flex-row gap-4 items-center justify-center mt-10"
            >
              <Link href={authButtonLink} className="sm:inline-block">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto px-10 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer tracking-wide inline-flex items-center justify-center whitespace-nowrap"
                  style={{
                    background: "linear-gradient(135deg, var(--accent-orange-dark), var(--accent-orange))",
                    color: "#1a0800",
                    boxShadow: "var(--glow-orange-strong)",
                  }}
                >
                  {authButtonText}
                </motion.button>
              </Link>
              <a href="#mission" onClick={(e) => handleSmoothScroll(e, "mission")} className="sm:inline-block">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto px-10 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer tracking-wide inline-flex items-center justify-center whitespace-nowrap"
                  style={{
                    background: "transparent",
                    color: "var(--text-secondary)",
                    border: "2px solid var(--border-subtle)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent-orange)";
                    e.currentTarget.style.background = "rgba(245, 158, 11, 0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-subtle)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  Learn More
                </motion.button>
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-xs font-medium tracking-wider flex items-center justify-center gap-2 mt-6"
              style={{ color: "var(--text-muted)" }}
            >
              <span className="text-base" style={{ color: "var(--accent-orange)" }}>✨</span>
              Join the movement to make food go further.
            </motion.p>
          </div>
        </section>

        {/* Quote Section */}
        <section className="px-6 mb-20 md:mb-44 relative">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(245, 158, 11, 0.03) 0%, transparent 70%)",
            }}
          />
          <div className="max-w-5xl mx-auto flex items-center justify-center gap-8 relative z-10">
            <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-transparent to-[var(--border-subtle)]" />
            <motion.div
              {...fadeUp}
              className="text-center max-w-2xl px-4"
            >
              <blockquote
                className="text-2xl sm:text-3xl md:text-4xl font-light italic leading-relaxed tracking-wide"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-secondary)" }}
              >
                &ldquo;A small amount of money should still be enough to put good food on the table.&rdquo;
              </blockquote>
            </motion.div>
            <div className="hidden sm:block h-px flex-1 bg-gradient-to-l from-transparent to-[var(--border-subtle)]" />
          </div>
        </section>

        {/* Mission Section */}
        <section id="mission" className="px-6 max-w-7xl mx-auto scroll-mt-24 mb-20 md:mb-44">
          <div className="text-center space-y-5 max-w-3xl mx-auto mb-24 md:mb-20">
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
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              Bridging Value and Dignity
            </motion.h2>
            <motion.p
              {...fadeUp}
              className="text-base leading-relaxed text-justify sm:text-center"
              style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}
            >
              Food prices continue to rise while many hardworking people struggle to keep up. Very Last Bite exists to help everyday people access more food for their money while helping bakeries reduce unnecessary waste.
            </motion.p>
            <motion.p
              {...fadeUp}
              className="text-sm leading-relaxed text-justify sm:text-center"
              style={{ color: "var(--text-muted)", lineHeight: "1.8" }}
            >
              We believe nobody should have to choose between hunger and dignity. By connecting available food with people who need it most, we can create stronger communities and a more sustainable food system.
            </motion.p>
          </div>

          {/* Completely borderless & flat mission grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
            {[
              {
                title: "More Value",
                description:
                  "Help people stretch their food budget further. Access premium baked goods at a massive discount when it matters most.",
              },
              {
                title: "Less Waste",
                description:
                  "Connect available food with people who can use it. Minimize end-of-day wastage for bakeries and protect our environment.",
              },
              {
                title: "Fair Access",
                description:
                  "Create equal opportunities for everyone to access available bundles. No queues, no hassle, just dignified, affordable food.",
              },
            ].map(({ title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-start space-y-3 cursor-default"
              >
                <h3
                  className="text-xl font-bold font-display"
                  style={{ color: "var(--text-primary)" }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)", lineHeight: "1.75" }}>
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="px-6 scroll-mt-24 relative mb-20 md:mb-44">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center space-y-5 max-w-3xl mx-auto mb-24 md:mb-20">
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
                className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
              >
                How It Works
              </motion.h2>
              <motion.p
                {...fadeUp}
                className="text-sm tracking-wide"
                style={{ color: "var(--text-muted)" }}
              >
                Simple steps connecting bakeries and consumers seamlessly.
              </motion.p>
            </div>

            {/* Completely borderless list columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {[
                {
                  num: "01",
                  title: "Bakery food becomes available",
                  desc: "Bakeries check unsold stock at the end of the day and bundle them together into available deals.",
                },
                {
                  num: "02",
                  title: "Users open Very Last Bite",
                  desc: "Consumers check the platform to see what discount bakery bundles are currently available nearby.",
                },
                {
                  num: "03",
                  title: "Users unlock food bundles",
                  desc: "Secure a bundle instantly on the platform, receiving a unique verification pickup code.",
                },
                {
                  num: "04",
                  title: "Collect more food for less",
                  desc: "Head to the bakery, show your pickup code, and collect your delicious food bundle with dignity.",
                },
              ].map(({ num, title, desc }, i) => (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative flex flex-col space-y-3"
                >
                  <div
                    className="text-3xl font-black mb-1"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--accent-orange)",
                      opacity: 0.45,
                    }}
                  >
                    {num}
                  </div>
                  <h4
                    className="font-bold text-base font-display"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {title}
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>
                    {desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="px-6 max-w-7xl mx-auto scroll-mt-24 mb-20 md:mb-44">
          <div className="text-center space-y-5 max-w-3xl mx-auto mb-24 md:mb-20">
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
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              Why It Matters
            </motion.h2>
            <motion.p
              {...fadeUp}
              className="text-sm tracking-wide"
              style={{ color: "var(--text-muted)" }}
            >
              Real difference in pocket size and ecological footprint.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Column Redesigned visual representation */}
            <motion.div
              {...fadeUp}
              className="lg:col-span-6 space-y-8"
            >
              <div className="space-y-6 pr-4">
                <h3
                  className="text-2xl md:text-3xl font-black tracking-tight leading-snug"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--text-primary)",
                  }}
                >
                  Food Rescue with Value & Dignity
                </h3>
                <p className="text-base leading-relaxed text-justify" style={{ color: "var(--text-secondary)", lineHeight: "1.75" }}>
                  Every single day, local bakeries, cafés, and restaurants have high-quality baked goods left over. We bridge the gap so you can rescue these delicious bundles at massive discounts.
                </p>
                <div className="space-y-5 pt-8 md:pt-2">
                  {[
                    { label: "Stretch Your Budget", text: "Get up to 70% off retail value to make your rand go further." },
                    { label: "Rescue Surplus Food", text: "Prevent good food from being wasted and protect our environment." },
                    { label: "Support Local Shops", text: "Help neighborhood merchants recover value while feeding communities." },
                  ].map((item) => (
                    <div key={item.label} className="space-y-1">
                      <h4 className="font-bold text-sm" style={{ color: "var(--accent-orange)" }}>{item.label}</h4>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Column: Vision + Pillars */}
            <motion.div
              {...fadeUp}
              className="lg:col-span-6 space-y-8"
            >
              <div className="space-y-4 mb-12 md:mb-8">
                <span
                  className="text-xs uppercase font-extrabold tracking-widest"
                  style={{ color: "var(--accent-orange)" }}
                >
                  The Vision
                </span>
                <h3
                  className="text-2xl font-black tracking-tight"
                  style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                >
                  A Better Future
                </h3>
                <p className="text-base font-medium leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Very Last Bite was built on a simple belief: Good food should remain accessible to everyday people.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  By helping bakeries recover value from available food while helping people stretch their budgets further, we can create a system that benefits everyone.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    title: "Better Food Access",
                    desc: "Making fresh items affordable to households daily.",
                  },
                  {
                    title: "Reduced Food Waste",
                    desc: "Rescuing kilograms of good bakery products daily.",
                  },
                  {
                    title: "Stronger Communities",
                    desc: "Connecting local bakeries directly with residents in a cooperative system.",
                  },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex flex-col items-start space-y-1">
                    <h4
                      className="font-bold text-sm"
                      style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                    >
                      {title}
                    </h4>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="px-6 scroll-mt-24 mb-20 md:mb-44">
          <div className="max-w-xl mx-auto">
            <div className="text-center space-y-5 mb-24 md:mb-16">
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
                className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
              >
                Get In Touch
              </motion.h2>
              <motion.p
                {...fadeUp}
                className="text-sm tracking-wide"
                style={{ color: "var(--text-muted)" }}
              >
                Have questions, suggestions, or want to partner? Drop us a line.
              </motion.p>
            </div>

            {/* Flat contact form inside clean container card */}
            <motion.div
              {...fadeUp}
              className="p-8 md:p-10 rounded-3xl"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)"
              }}
            >
              <form
                onSubmit={handleContactSubmit}
                className="space-y-6"
              >
                <div>
                  <label
                    className="text-xs font-bold block mb-2.5 ml-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    className="w-full px-5 py-4 rounded-xl outline-none text-sm transition-all duration-200"
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
                    className="text-xs font-bold block mb-2.5 ml-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    className="w-full px-5 py-4 rounded-xl outline-none text-sm transition-all duration-200"
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
                    className="text-xs font-bold block mb-2.5 ml-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we help you stretch your budget or partner?"
                    className="w-full px-5 py-4 rounded-xl outline-none text-sm transition-all duration-200 resize-none"
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
                  className="w-full font-bold py-4 rounded-xl transition-all cursor-pointer mt-4"
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
                    className="text-xs font-bold text-center p-4 rounded-xl mt-4"
                    style={{
                      background: "rgba(16, 185, 129, 0.1)",
                      color: "var(--accent-green)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                    }}
                  >
                    ✓ Thank you! We&apos;ll get back to you shortly.
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="py-16 px-6 mt-20 md:mt-44"
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

      </main>
    </div>
  );
}
