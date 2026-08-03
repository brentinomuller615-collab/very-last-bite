"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION HOOK
// ─────────────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ─────────────────────────────────────────────────────────────────────────────
// FADE-IN WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION LABEL
// ─────────────────────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "#B45309",
        background: "rgba(180,83,9,0.07)",
        borderRadius: "999px",
        padding: "4px 14px",
      }}
    >
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────────────────────────────────────
function Nav({
  authButtonText,
  authButtonLink,
  onWatchDemo,
}: {
  authButtonText: string;
  authButtonLink: string;
  onWatchDemo: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "How It Works", id: "how-it-works" },
    { label: "Mission", id: "mission" },
    { label: "Founding Club", id: "founding-club" },
    { label: "FAQ", id: "faq" },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };

  return (
    <header
      id="nav"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "background 0.4s, box-shadow 0.4s, border-color 0.4s",
        background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0)",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid #F3F0EB" : "1px solid transparent",
        boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.05)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 28px",
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            textDecoration: "none",
          }}
        >
          <span style={{ fontSize: 20 }}>🍞</span>
          <span
            style={{
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#1C1917",
              fontFamily: "Outfit, sans-serif",
            }}
          >
            Very Last Bite
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 36,
          }}
          className="lp-desktop-nav"
        >
          {navLinks.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                background: "none",
                border: "none",
                padding: "4px 0",
                fontSize: 14,
                fontWeight: 500,
                color: "#57534E",
                cursor: "pointer",
                letterSpacing: "-0.01em",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1C1917")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#57534E")}
            >
              {label}
            </button>
          ))}
          <button
            onClick={onWatchDemo}
            style={{
              background: "none",
              border: "none",
              padding: "4px 0",
              fontSize: 14,
              fontWeight: 600,
              color: "#B45309",
              cursor: "pointer",
              letterSpacing: "-0.01em",
              display: "flex",
              alignItems: "center",
              gap: 5,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#92400E")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#B45309")}
          >
            <span style={{ fontSize: 10 }}>▶</span> Watch Demo
          </button>
        </nav>

        {/* Desktop CTA */}
        <div className="lp-desktop-nav">
          <Link href={authButtonLink} style={{ textDecoration: "none" }}>
            <button
              id="nav-cta-btn"
              style={{
                background: "#1C1917",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "11px 28px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "-0.01em",
                lineHeight: 1,
                display: "inline-flex",
                alignItems: "center",
                minHeight: 40,
                transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#292524";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#1C1917";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.12)";
              }}
            >
              {authButtonText}
            </button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          className="lp-mobile-nav"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: 5,
            padding: 6,
          }}
        >
          <span
            style={{
              display: "block",
              width: 22,
              height: 1.5,
              background: "#1C1917",
              borderRadius: 2,
              transition: "transform 0.2s, opacity 0.2s",
              transform: mobileOpen ? "translateY(6.5px) rotate(45deg)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: 22,
              height: 1.5,
              background: "#1C1917",
              borderRadius: 2,
              transition: "opacity 0.2s",
              opacity: mobileOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: "block",
              width: 22,
              height: 1.5,
              background: "#1C1917",
              borderRadius: 2,
              transition: "transform 0.2s, opacity 0.2s",
              transform: mobileOpen ? "translateY(-6.5px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: mobileOpen ? 370 : 0,
          transition: "max-height 0.35s ease",
          background: "rgba(255,255,255,0.98)",
          borderBottom: mobileOpen ? "1px solid #F3F0EB" : "none",
        }}
      >
        <div style={{ padding: "16px 28px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navLinks.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                background: "none",
                border: "none",
                textAlign: "left",
                padding: "12px 0",
                fontSize: 16,
                fontWeight: 500,
                color: "#1C1917",
                cursor: "pointer",
                borderBottom: "1px solid #F5F5F4",
              }}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => {
              setMobileOpen(false);
              onWatchDemo();
            }}
            style={{
              background: "none",
              border: "none",
              textAlign: "left",
              padding: "12px 0",
              fontSize: 16,
              fontWeight: 600,
              color: "#B45309",
              cursor: "pointer",
              borderBottom: "1px solid #F5F5F4",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 11 }}>▶</span> Watch Demo Video
          </button>
          <Link href={authButtonLink} style={{ textDecoration: "none", marginTop: 12 }}>
            <button
              style={{
                width: "100%",
                background: "#1C1917",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "14px 22px",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {authButtonText}
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection({
  authButtonLink,
  onWatchDemo,
}: {
  authButtonLink: string;
  onWatchDemo: () => void;
}) {
  const [heroMounted, setHeroMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: "var(--lp-hero-min-height)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "var(--lp-hero-padding)",
        background: "#FEFCFA",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle warm tint blob */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -120,
          right: -180,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -100,
          left: -100,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(180,83,9,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--lp-grid-gap)",
          alignItems: "center",
        }}
        className="lp-hero-grid"
      >
        {/* Left: Copy */}
        <div>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(180,83,9,0.07)",
              borderRadius: 999,
              padding: "6px 14px 6px 10px",
              marginBottom: 36,
              opacity: heroMounted ? 1 : 0,
              transform: heroMounted ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#B45309",
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#B45309",
                letterSpacing: "0.02em",
              }}
            >
              Founding Club — Limited Spots
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 72px)",
              fontWeight: 900,
              lineHeight: 1.06,
              letterSpacing: "-0.04em",
              color: "#1C1917",
              fontFamily: "Outfit, sans-serif",
              margin: 0,
              marginBottom: "var(--lp-hero-mb-headline)",
              opacity: heroMounted ? 1 : 0,
              transform: heroMounted ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.6s ease 0.18s, transform 0.6s ease 0.18s",
            }}
          >
            Good food
            <br />
            <span style={{ color: "#B45309" }}>within reach.</span>
            <br />
            Every day.
          </h1>

          {/* Sub */}
          <p
            style={{
              fontSize: "clamp(15px, 2vw, 18px)",
              lineHeight: 1.7,
              color: "#78716C",
              maxWidth: 460,
              margin: 0,
              marginBottom: "var(--lp-hero-mb-sub)",
              fontWeight: 400,
              opacity: heroMounted ? 1 : 0,
              transform: heroMounted ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.6s ease 0.26s, transform 0.6s ease 0.26s",
            }}
          >
            Very Last Bite connects people with bakery food at the end of the day — so nothing good goes to waste, and no one goes without.
          </p>

          {/* Primary CTA and Watch Demo */}
          <div
            style={{
              marginBottom: "var(--lp-hero-mb-sub)",
              opacity: heroMounted ? 1 : 0,
              transform: heroMounted ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.6s ease 0.34s, transform 0.6s ease 0.34s",
              display: "flex",
              flexDirection: "var(--lp-hero-btn-flex-dir)" as any,
              alignItems: "center",
              gap: 16,
            }}
          >
            <Link href={authButtonLink} style={{ textDecoration: "none", display: "var(--lp-hero-btn-width) === '100%' ? 'block' : 'inline-block'", width: "var(--lp-hero-btn-width)" }}>
              <button
                id="hero-primary-cta"
                style={{
                  background: "#1C1917",
                  color: "#fff",
                  border: "none",
                  borderRadius: 14,
                  padding: "17px 52px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                  minHeight: 52,
                  width: "100%",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.14)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#292524";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#1C1917";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.14)";
                }}
              >
                Join the Founding Club
              </button>
            </Link>
            <button
              onClick={onWatchDemo}
              style={{
                background: "transparent",
                color: "#B45309",
                border: "none",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 52,
                gap: 8,
                width: "var(--lp-hero-btn-width)",
                transition: "color 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#92400E";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#B45309";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "rgba(180,83,9,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  paddingLeft: 2,
                }}
              >
                ▶
              </div>
              Watch Demo Video
            </button>
          </div>
        </div>

        {/* Hero Image (Stacked on Mobile) */}
        <div
          className="lp-hero-image-col"
          style={{
            opacity: heroMounted ? 1 : 0,
            transform: heroMounted ? "translateY(0) scale(1)" : "translateY(20px) scale(0.98)",
            transition: "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
          }}
        >
          <div
            style={{
              borderRadius: 24,
              overflow: "hidden",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)",
              aspectRatio: "4/5",
              position: "relative",
              background: "#F5F0EA",
              width: "100%",
            }}
          >
            <Image
              src="/hero-bakery.png"
              alt="Freshly baked artisan bread and pastries on a wooden bakery counter"
              fill
              style={{ objectFit: "cover" }}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Floating badge */}
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: 24,
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: 14,
                padding: "12px 18px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
              }}
            >
              <div style={{ fontSize: 11, color: "#A8A29E", fontWeight: 600, marginBottom: 2 }}>
                Today&apos;s rescue
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#1C1917", letterSpacing: "-0.02em" }}>
                Up to <span style={{ color: "#B45309" }}>70% off</span>
              </div>
              <div style={{ fontSize: 11, color: "#A8A29E", marginTop: 2 }}>
                on surplus bakery bundles
              </div>
            </div>
          </div>

          {/* Social proof micro under hero image on mobile */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginTop: 24,
              opacity: heroMounted ? 1 : 0,
              transition: "opacity 0.6s ease 0.44s",
            }}
          >
            {/* Avatar stack */}
            <div style={{ display: "flex" }}>
              {["#D97706", "#92400E", "#B45309", "#78350F"].map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: c,
                    border: "2px solid #FEFCFA",
                    marginLeft: i > 0 ? -10 : 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  {["A", "B", "C", "D"][i]}
                </div>
              ))}
            </div>
            <span style={{ fontSize: 13, color: "#A8A29E", fontWeight: 500 }}>
              Join <strong style={{ color: "#57534E" }}>240+ people</strong> already on the waitlist
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TRUST BAND
// ─────────────────────────────────────────────────────────────────────────────
function TrustBand() {
  return (
    <section
      id="trust"
      style={{
        background: "#F5F0EA",
        borderTop: "1px solid #EDE9E3",
        borderBottom: "1px solid #EDE9E3",
        padding: "var(--lp-trust-padding)",
      }}
    >
      <div
        style={{ maxWidth: 1200, margin: "0 auto" }}
        className="lp-trust-wrapper"
      >
        {[
          { stat: "Zero", label: "food wasted" },
          { stat: "R0", label: "sign-up cost" },
          { stat: "70%", label: "avg. savings" },
          { stat: "Local", label: "bakeries only" },
        ].map(({ stat, label }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "#1C1917",
                fontFamily: "Outfit, sans-serif",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              {stat}
            </div>
            <div style={{ fontSize: 12, color: "#A8A29E", fontWeight: 500, marginTop: 4 }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Bakeries list surplus",
      desc: "At the end of each day, local bakeries bundle their remaining bread, pastries, and baked goods into discounted rescue packs.",
    },
    {
      num: "02",
      title: "You browse & claim",
      desc: "Open the app, see what's available nearby, and secure a bundle in seconds. No queue, no guesswork.",
    },
    {
      num: "03",
      title: "Collect with dignity",
      desc: "Show your unique pickup code at the bakery and walk out with a bag full of quality food at a fraction of the price.",
    },
    {
      num: "04",
      title: "Good food, less waste",
      desc: "You save money. The bakery recovers value. And perfectly good food doesn't end up in a bin.",
    },
  ];

  return (
    <section
      id="how-it-works"
      style={{
        background: "#FEFCFA",
        padding: "var(--lp-section-py) var(--lp-section-px)",
        scrollMarginTop: 80,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: "var(--lp-title-mb)" }}>
            <SectionLabel>The process</SectionLabel>
            <h2
              style={{
                fontSize: "clamp(32px, 4.5vw, 52px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: "#1C1917",
                fontFamily: "Outfit, sans-serif",
                margin: "20px 0 16px",
              }}
            >
              Simple as it should be
            </h2>
            <p style={{ fontSize: 17, color: "#78716C", lineHeight: 1.65, maxWidth: 480, margin: "0 auto" }}>
              From surplus bakery shelf to your table. No complexity, no compromise.
            </p>
          </div>
        </FadeIn>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "var(--lp-grid-gap)",
          }}
          className="lp-steps-grid"
        >
          {steps.map(({ num, title, desc }, i) => (
            <FadeIn key={num} delay={i * 80}>
              <div
                style={{
                  padding: "var(--lp-card-padding)",
                  borderRadius: 20,
                  background: "#fff",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  border: "1px solid #F3F0EB",
                  height: "100%",
                  transition: "box-shadow 0.25s, transform 0.25s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#B45309",
                    letterSpacing: "0.06em",
                    marginBottom: 20,
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  {num}
                </div>
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#1C1917",
                    letterSpacing: "-0.02em",
                    marginBottom: 12,
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  {title}
                </h3>
                <p style={{ fontSize: 14, color: "#78716C", lineHeight: 1.7 }}>
                  {desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MISSION
// ─────────────────────────────────────────────────────────────────────────────
function MissionSection() {
  return (
    <section
      id="mission"
      style={{
        background: "#1C1917",
        padding: "var(--lp-section-py) var(--lp-section-px)",
        scrollMarginTop: 80,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--lp-mission-gap)",
          alignItems: "center",
        }}
        className="lp-mission-grid"
      >
        {/* Copy */}
        <FadeIn delay={100}>
          <div>
            <SectionLabel
              children={
                <span style={{ color: "#F59E0B" }}>Our mission</span>
              }
            />
            <h2
              style={{
                fontSize: "clamp(30px, 4vw, 48px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: "#FAFAF9",
                fontFamily: "Outfit, sans-serif",
                margin: "24px 0 20px",
                lineHeight: 1.1,
              }}
            >
              Dignity.
              <br />
              Not discount.
            </h2>
            <p
              style={{
                fontSize: 17,
                color: "#A8A29E",
                lineHeight: 1.75,
                marginBottom: 24,
              }}
            >
              Food prices rise. Wages don&apos;t always keep up. And at the end of every bakery day, good food that should have fed someone gets discarded.
            </p>
            <p style={{ fontSize: 16, color: "#78716C", lineHeight: 1.75, marginBottom: 48 }}>
              Very Last Bite isn&apos;t about finding scraps. It&apos;s about creating a system where quality food stays accessible — where people can feed their families with pride, and local bakeries can recover real value instead of throwing it away.
            </p>

            {/* Pillars */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                { title: "Access", body: "Everyone deserves quality food, regardless of budget." },
                { title: "Sustainability", body: "Good food should reach mouths, not bins." },
                { title: "Community", body: "When bakeries and people connect, everyone wins." },
              ].map(({ title, body }) => (
                <div
                  key={title}
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 4,
                      height: 44,
                      borderRadius: 2,
                      background: "#B45309",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#E7E5E4",
                        marginBottom: 4,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {title}
                    </div>
                    <div style={{ fontSize: 14, color: "#78716C", lineHeight: 1.65 }}>
                      {body}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Image (below copy on mobile, desktop ordering preserved by CSS order / desktop layout) */}
        <FadeIn className="lp-mission-img-col">
          <div
            style={{
              borderRadius: 24,
              overflow: "hidden",
              aspectRatio: "4/5",
              position: "relative",
              background: "#292524",
              width: "100%",
            }}
          >
            <Image
              src="/community-warmth.png"
              alt="A bakery worker handing a paper bag of food to a customer, representing community and dignity"
              fill
              style={{ objectFit: "cover", opacity: 0.9 }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOUNDING CLUB
// ─────────────────────────────────────────────────────────────────────────────
function FoundingClub({ authButtonLink }: { authButtonLink: string }) {
  const benefits = [
    {
      icon: "🎯",
      title: "First access",
      desc: "Be among the first to use the platform when we go live in your area.",
    },
    {
      icon: "🔒",
      title: "Locked-in pricing",
      desc: "Founding members get exclusive rates that stay with you permanently.",
    },
    {
      icon: "🤝",
      title: "Shape the product",
      desc: "Your feedback directly influences what we build next. You have a seat at the table.",
    },
    {
      icon: "📍",
      title: "Local expansion vote",
      desc: "Help decide which neighbourhood gets access first.",
    },
    {
      icon: "🏷️",
      title: "Founding member badge",
      desc: "A permanent marker of being part of building something meaningful from the start.",
    },
    {
      icon: "💬",
      title: "Direct access",
      desc: "Communicate directly with the founders. No support tickets. Real humans.",
    },
  ];

  return (
    <section
      id="founding-club"
      style={{
        background: "#FEFCFA",
        padding: "var(--lp-section-py) var(--lp-section-px)",
        scrollMarginTop: 80,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: "var(--lp-title-mb)" }}>
            <SectionLabel>Why join now</SectionLabel>
            <h2
              style={{
                fontSize: "clamp(32px, 4.5vw, 52px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: "#1C1917",
                fontFamily: "Outfit, sans-serif",
                margin: "20px 0 16px",
              }}
            >
              The Founding Club
            </h2>
            <p
              style={{
                fontSize: 17,
                color: "#78716C",
                lineHeight: 1.65,
                maxWidth: 480,
                margin: "0 auto",
              }}
            >
              We&apos;re not open yet. But the people who join now get something the rest won&apos;t: permanence.
            </p>
          </div>
        </FadeIn>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "var(--lp-benefits-gap)",
            marginBottom: 64,
          }}
          className="lp-benefits-grid"
        >
          {benefits.map(({ icon, title, desc }, i) => (
            <FadeIn key={title} delay={i * 60}>
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #F3F0EB",
                  borderRadius: 20,
                  padding: "var(--lp-card-padding)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  transition: "box-shadow 0.25s, transform 0.25s, border-color 0.25s",
                  height: "100%",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.09)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                  (e.currentTarget as HTMLElement).style.borderColor = "#E8D5B7";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.borderColor = "#F3F0EB";
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "#FEF3C7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    marginBottom: 20,
                  }}
                >
                  {icon}
                </div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#1C1917",
                    letterSpacing: "-0.02em",
                    marginBottom: 10,
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  {title}
                </h3>
                <p style={{ fontSize: 14, color: "#78716C", lineHeight: 1.7 }}>
                  {desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* CTA Box */}
        <FadeIn>
          <div
            style={{
              background: "linear-gradient(135deg, #1C1917 0%, #292524 100%)",
              borderRadius: 28,
              padding: "var(--lp-cta-box-padding)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 32,
              flexWrap: "wrap",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            }}
            className="lp-cta-box"
          >
            <div style={{ maxWidth: 520 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#F59E0B", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
                Limited availability
              </div>
              <h3
                style={{
                  fontSize: "clamp(24px, 3.5vw, 38px)",
                  fontWeight: 900,
                  color: "#FAFAF9",
                  fontFamily: "Outfit, sans-serif",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.1,
                  margin: "0 0 16px",
                }}
              >
                Claim your founding spot before we launch
              </h3>
              <p style={{ fontSize: 15, color: "#A8A29E", lineHeight: 1.65 }}>
                Spots are finite. Once we hit capacity, the Founding Club closes. Join the waitlist today.
              </p>
            </div>
            <Link href={authButtonLink} style={{ textDecoration: "none", flexShrink: 0 }}>
              <button
                id="founding-club-cta"
                style={{
                  background: "#F59E0B",
                  color: "#1C1917",
                  border: "none",
                  borderRadius: 14,
                  padding: "17px 56px",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                  minHeight: 52,
                  display: "inline-flex",
                  alignItems: "center",
                  transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FCD34D";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(245,158,11,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#F59E0B";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Join the Founding Club →
              </button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────────────────────
function FAQ() {
  const faqs = [
    {
      q: "Is Very Last Bite free to join?",
      a: "Yes. Joining the Founding Club and creating an account is completely free. You only pay when you claim a food bundle.",
    },
    {
      q: "What kind of food will be available?",
      a: "Surplus baked goods from local bakeries — bread, rolls, pastries, cakes, and more. Everything is freshly made that day and available at end-of-day prices.",
    },
    {
      q: "When will you launch?",
      a: "We&apos;re in the final stages of onboarding bakeries. Founding Club members will be the first to know and the first to get access when we go live.",
    },
    {
      q: "How is this different from a discount food app?",
      a: "We&apos;re not about deals or discounts as a marketing gimmick. This is a food rescue mission. Every bundle claimed prevents waste and helps someone eat well.",
    },
    {
      q: "Can bakeries join as partners?",
      a: "Absolutely. If you run a bakery and want to turn surplus into income while reducing waste, visit our bakery portal or reach out directly.",
    },
    {
      q: "What happens to my founding status?",
      a: "It&apos;s permanent. Your founding member pricing, badge, and benefits stay with you for as long as you use the platform.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      style={{
        background: "#F5F0EA",
        padding: "var(--lp-section-py) var(--lp-section-px)",
        scrollMarginTop: 80,
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: "var(--lp-title-mb)" }}>
            <SectionLabel>FAQ</SectionLabel>
            <h2
              style={{
                fontSize: "clamp(30px, 4vw, 48px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: "#1C1917",
                fontFamily: "Outfit, sans-serif",
                margin: "20px 0 12px",
              }}
            >
              Questions answered
            </h2>
          </div>
        </FadeIn>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {faqs.map(({ q, a }, i) => (
            <FadeIn key={q} delay={i * 40}>
              <button
                id={`faq-item-${i}`}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  width: "100%",
                  background: openIndex === i ? "#fff" : "#FEFCFA",
                  border: `1px solid ${openIndex === i ? "#E8D5B7" : "#EDE9E3"}`,
                  borderRadius: 16,
                  padding: "var(--lp-faq-padding)",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
                  boxShadow: openIndex === i ? "0 4px 20px rgba(0,0,0,0.07)" : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#1C1917",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {q}
                  </span>
                  <span
                    style={{
                      fontSize: 16,
                      color: "#A8A29E",
                      flexShrink: 0,
                      transition: "transform 0.2s",
                      transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)",
                      display: "inline-block",
                    }}
                  >
                    +
                  </span>
                </div>
                <div
                  style={{
                    overflow: "hidden",
                    maxHeight: openIndex === i ? 300 : 0,
                    transition: "max-height 0.35s ease",
                  }}
                >
                  <p
                    style={{
                      marginTop: 14,
                      fontSize: 14,
                      color: "#78716C",
                      lineHeight: 1.75,
                    }}
                    dangerouslySetInnerHTML={{ __html: a }}
                  />
                </div>
              </button>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FINAL CTA
// ─────────────────────────────────────────────────────────────────────────────
function FinalCTA({ authButtonLink }: { authButtonLink: string }) {
  return (
    <section
      id="final-cta"
      style={{
        background: "#FEFCFA",
        padding: "var(--lp-final-cta-padding)",
      }}
    >
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <FadeIn>
          <div
            style={{
              display: "inline-block",
              fontSize: 40,
              marginBottom: 32,
            }}
          >
            🍞
          </div>
          <h2
            style={{
              fontSize: "clamp(36px, 5.5vw, 64px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: "#1C1917",
              fontFamily: "Outfit, sans-serif",
              lineHeight: 1.06,
              marginBottom: 24,
            }}
          >
            You found us early.
            <br />
            <span style={{ color: "#B45309" }}>Don&apos;t wait.</span>
          </h2>
          <p
            style={{
              fontSize: 18,
              color: "#78716C",
              lineHeight: 1.7,
              marginBottom: 48,
              maxWidth: 480,
              margin: "0 auto 48px",
            }}
          >
            The Founding Club closes when we hit capacity. Secure your spot, lock in your benefits, and be there when it matters.
          </p>
          <div style={{ display: "flex", flexDirection: "var(--lp-final-btn-flex-dir)" as any, alignItems: "center", justifyContent: "center", gap: 16 }}>
            <Link href={authButtonLink} style={{ textDecoration: "none" }}>
              <button
                id="final-cta-btn"
                style={{
                  background: "#1C1917",
                  color: "#fff",
                  border: "none",
                  borderRadius: 14,
                  padding: "17px 64px",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                  minHeight: 52,
                  width: "var(--lp-final-btn-width)",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#292524";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.20)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#1C1917";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
                }}
              >
                Join the Founding Club
              </button>
            </Link>
            <Link href="/bakery" style={{ textDecoration: "none" }}>
              <button
                id="final-bakery-link"
                style={{
                  background: "transparent",
                  color: "#57534E",
                  border: "1.5px solid #D6D3D1",
                  borderRadius: 14,
                  padding: "17px 52px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                  minHeight: 52,
                  width: "var(--lp-final-btn-width)",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "border-color 0.2s, color 0.2s, transform 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#A8A29E";
                  e.currentTarget.style.color = "#1C1917";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#D6D3D1";
                  e.currentTarget.style.color = "#57534E";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                I own a bakery →
              </button>
            </Link>
          </div>
          <p style={{ fontSize: 13, color: "#A8A29E", marginTop: 28 }}>
            Free to join. No commitment. Cancel anytime.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────
function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      style={{
        background: "#1C1917",
        padding: "var(--lp-footer-padding)",
        borderTop: "1px solid #292524",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 48,
            flexWrap: "wrap",
            paddingBottom: 48,
            borderBottom: "1px solid #292524",
            marginBottom: 32,
          }}
          className="lp-footer-grid"
        >
          {/* Brand */}
          <div style={{ maxWidth: 300 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 22 }}>🍞</span>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#FAFAF9",
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                Very Last Bite
              </span>
            </div>
            <p style={{ fontSize: 14, color: "#57534E", lineHeight: 1.65 }}>
              Connecting surplus bakery food with people who need it. No waste. No compromise. Just good food.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: 64, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#57534E", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
                Platform
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "How It Works", id: "how-it-works" },
                  { label: "Mission", id: "mission" },
                  { label: "Founding Club", id: "founding-club" },
                  { label: "FAQ", id: "faq" },
                ].map(({ label, id }) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    style={{
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      fontSize: 14,
                      color: "#78716C",
                      cursor: "pointer",
                      padding: 0,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#A8A29E")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#78716C")}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#57534E", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
                Join
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/signup" style={{ fontSize: 14, color: "#78716C", textDecoration: "none", transition: "color 0.2s" }}>
                  Create account
                </Link>
                <Link href="/login" style={{ fontSize: 14, color: "#78716C", textDecoration: "none", transition: "color 0.2s" }}>
                  Sign in
                </Link>
                <Link href="/bakery" style={{ fontSize: 14, color: "#F59E0B", textDecoration: "none", fontWeight: 600 }}>
                  Bakery portal
                </Link>
                <Link href="/privacy" style={{ fontSize: 14, color: "#78716C", textDecoration: "none", transition: "color 0.2s" }}>
                  Privacy
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <p style={{ fontSize: 13, color: "#44403C" }}>
            © {new Date().getFullYear()} Very Last Bite. All rights reserved.
          </p>
          <p style={{ fontSize: 13, color: "#44403C" }}>
            Made with purpose. Built with care.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  const { user, isAdminUser } = useAuth();
  const authButtonText = user ? "Open App" : "Join the Founding Club";
  const authButtonLink = user ? (isAdminUser ? "/admin" : "/spin") : "/signup";
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#FEFCFA",
        color: "#1C1917",
        fontFamily: "Inter, sans-serif",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        overflowX: "hidden",
      }}
    >
      <Nav authButtonText={authButtonText} authButtonLink={authButtonLink} onWatchDemo={() => setShowDemoModal(true)} />
      <HeroSection authButtonLink={authButtonLink} onWatchDemo={() => setShowDemoModal(true)} />
      <TrustBand />
      <HowItWorks />
      <MissionSection />
      <FoundingClub authButtonLink={authButtonLink} />
      <FAQ />
      <FinalCTA authButtonLink={authButtonLink} />
      <Footer />

      {/* Video Demo Modal Overlay */}
      {showDemoModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(28,25,23,0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
          onClick={() => setShowDemoModal(false)}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 960,
              background: "#1C1917",
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowDemoModal(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "#FAFAF9",
                fontSize: 18,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s, transform 0.2s",
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              ✕
            </button>

            {/* Video Player */}
            <div style={{ position: "relative", paddingTop: "56.25%", background: "#000" }}>
              <video
                src="/very_last_bite_demo.mp4"
                controls
                autoPlay
                playsInline
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
