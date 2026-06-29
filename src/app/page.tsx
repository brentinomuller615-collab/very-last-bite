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



  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3E2723] font-body selection:bg-[#FCD34D] selection:text-[#5D4037]">
      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-md border-b border-[#F2ECE4] py-3" : "bg-transparent py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-black font-display tracking-tight text-[#5D4037]">
            <span className="text-2xl">🍞</span>
            <span>Very Last Bite</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-semibold text-sm">
            <a href="#" className="hover:text-[#F59E0B] transition-colors">Home</a>
            <a href="#mission" onClick={(e) => handleSmoothScroll(e, "mission")} className="hover:text-[#F59E0B] transition-colors">Mission</a>
            <a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, "how-it-works")} className="hover:text-[#F59E0B] transition-colors">How It Works</a>
            <a href="#impact" onClick={(e) => handleSmoothScroll(e, "impact")} className="hover:text-[#F59E0B] transition-colors">Impact</a>
            <a href="#contact" onClick={(e) => handleSmoothScroll(e, "contact")} className="hover:text-[#F59E0B] transition-colors">Contact</a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link href={authButtonLink}>
              <button className="bg-[#F59E0B] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#D97706] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-amber-500/10 cursor-pointer">
                {authButtonText}
              </button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#5D4037] focus:outline-none"
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
              className="md:hidden bg-white border-b border-[#F2ECE4] px-6 py-4 overflow-hidden"
            >
              <div className="flex flex-col gap-4 font-semibold text-base pb-4">
                <a href="#" className="hover:text-[#F59E0B] transition-colors">Home</a>
                <a href="#mission" onClick={(e) => handleSmoothScroll(e, "mission")} className="hover:text-[#F59E0B] transition-colors">Mission</a>
                <a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, "how-it-works")} className="hover:text-[#F59E0B] transition-colors">How It Works</a>
                <a href="#impact" onClick={(e) => handleSmoothScroll(e, "impact")} className="hover:text-[#F59E0B] transition-colors">Impact</a>
                <a href="#contact" onClick={(e) => handleSmoothScroll(e, "contact")} className="hover:text-[#F59E0B] transition-colors">Contact</a>
                <Link href={authButtonLink} className="w-full">
                  <button className="w-full bg-[#F59E0B] text-white font-bold py-3 rounded-xl hover:bg-[#D97706] transition-colors mt-2">
                    {authButtonText}
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

          {/* Visual on Mobile - Stacked above text */}
          <div className="md:col-span-6 md:order-2 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full max-w-md h-80 md:h-[400px] rounded-3xl bg-gradient-to-br from-[#FFF8E7] to-[#F5EAD4] border-2 border-[#EADCC9] flex items-center justify-center p-8 overflow-hidden shadow-lg"
            >
              {/* Modern Graphic Abstract Bakery Element */}
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#8D6E63_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center gap-4 text-center z-10"
              >
                <span className="text-8xl md:text-9xl drop-shadow-md">🍞</span>
                <div className="bg-white/80 backdrop-blur-sm border border-[#EADCC9] rounded-2xl px-6 py-3 shadow-md">
                  <span className="font-display font-extrabold text-[#5D4037] text-lg">South Africa's Food Rescue</span>
                  <div className="flex gap-1 justify-center mt-1 text-yellow-500">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </motion.div>
              {/* Soft visual blobs */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#FCD34D]/25 rounded-full blur-2xl"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#F59E0B]/20 rounded-full blur-2xl"></div>
            </motion.div>
          </div>

          {/* Text Left */}
          <div className="md:col-span-6 md:order-1 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-[#3E2723] leading-[1.1]">
                Make every <br className="hidden sm:inline" />
                <span className="text-[#F59E0B]">rand</span> go further.
              </h1>
              <p className="text-lg text-[#5D4037] font-semibold leading-relaxed max-w-lg">
                Very Last Bite helps people access available bakery food at reduced prices, making it easier to stretch every rand further while helping reduce unnecessary food waste.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4 pt-2"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={authButtonLink} className="flex-1 sm:flex-none">
                  <button className="w-full sm:w-auto bg-[#F59E0B] text-white font-bold px-8 py-4 rounded-2xl hover:bg-[#D97706] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-amber-500/10 cursor-pointer text-base">
                    {authButtonText}
                  </button>
                </Link>
                <a href="#mission" onClick={(e) => handleSmoothScroll(e, "mission")} className="flex-1 sm:flex-none">
                  <button className="w-full sm:w-auto bg-white text-[#5D4037] border-2 border-[#EADCC9] font-bold px-8 py-4 rounded-2xl hover:bg-[#FFFDF9] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer text-base text-center">
                    Learn More
                  </button>
                </a>
              </div>
              <p className="text-xs text-[#8D6E63] font-semibold tracking-wide flex items-center gap-1.5 pl-1">
                <span className="text-base text-amber-500">✨</span> Join the movement to make food go further.
              </p>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Quote Block */}
      <section className="bg-[#FFFDF9] border-y border-[#F2ECE4] py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <span className="text-4xl text-[#FCD34D] block font-serif">“</span>
            <blockquote className="text-xl sm:text-2xl font-bold font-display italic text-[#4E342E] max-w-2xl mx-auto leading-relaxed">
              A small amount of money should still be enough to put good food on the table.
            </blockquote>
            <span className="text-4xl text-[#FCD34D] block font-serif leading-none">”</span>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#F59E0B] bg-[#FFF8E7] px-4 py-1.5 rounded-full border border-[#FCD34D]/40">Our Mission</span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-[#3E2723]">Bridging Value and Dignity</h2>
          <p className="text-base text-[#5D4037] leading-relaxed font-semibold">
            Food prices continue to rise while many hardworking people struggle to keep up. Very Last Bite exists to help everyday people access more food for their money while helping bakeries reduce unnecessary waste.
          </p>
          <p className="text-sm text-[#8D6E63] leading-relaxed">
            We believe nobody should have to choose between hunger and dignity. By connecting available food with people who need it most, we can create stronger communities and a more sustainable food system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <motion.div
            whileHover={{ y: -8 }}
            className="bg-white p-8 rounded-3xl border border-[#F2ECE4] shadow-sm flex flex-col items-start gap-4 transition-all"
          >
            <div className="w-12 h-12 bg-[#FFF8E7] border border-[#FCD34D] rounded-2xl flex items-center justify-center text-xl">
              🪙
            </div>
            <h3 className="text-xl font-bold font-display text-[#3E2723]">More Value</h3>
            <p className="text-sm text-[#8D6E63] leading-relaxed">
              Help people stretch their food budget further. Access premium baked goods at a massive discount when it matters most.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ y: -8 }}
            className="bg-white p-8 rounded-3xl border border-[#F2ECE4] shadow-sm flex flex-col items-start gap-4 transition-all"
          >
            <div className="w-12 h-12 bg-[#FFF8E7] border border-[#FCD34D] rounded-2xl flex items-center justify-center text-xl">
              🌍
            </div>
            <h3 className="text-xl font-bold font-display text-[#3E2723]">Less Waste</h3>
            <p className="text-sm text-[#8D6E63] leading-relaxed">
              Connect available food with people who can use it. Minimize end-of-day wastage for bakeries and protect our environment.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ y: -8 }}
            className="bg-white p-8 rounded-3xl border border-[#F2ECE4] shadow-sm flex flex-col items-start gap-4 transition-all"
          >
            <div className="w-12 h-12 bg-[#FFF8E7] border border-[#FCD34D] rounded-2xl flex items-center justify-center text-xl">
              🤝
            </div>
            <h3 className="text-xl font-bold font-display text-[#3E2723]">Fair Access</h3>
            <p className="text-sm text-[#8D6E63] leading-relaxed">
              Create equal opportunities for everyone to access available bundles. No queues, no hassle, just dignified, affordable food.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#FFFDF9] border-y border-[#F2ECE4] px-6 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#F59E0B]">The Process</span>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-[#3E2723]">How It Works</h2>
            <p className="text-sm text-[#8D6E63]">Simple steps connecting bakeries and consumers seamlessly.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-[#F2ECE4] relative overflow-hidden shadow-sm flex flex-col gap-3">
              <div className="absolute top-4 right-4 text-4xl font-black text-[#FCD34D]/25 font-display">01</div>
              <div className="text-2xl">🏪</div>
              <h4 className="font-bold text-[#3E2723] pt-2">Bakery food becomes available</h4>
              <p className="text-xs text-[#8D6E63] leading-relaxed">
                Bakeries check unsold stock at the end of the day and bundle them together into available deals.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-[#F2ECE4] relative overflow-hidden shadow-sm flex flex-col gap-3">
              <div className="absolute top-4 right-4 text-4xl font-black text-[#FCD34D]/25 font-display">02</div>
              <div className="text-2xl">📱</div>
              <h4 className="font-bold text-[#3E2723] pt-2">Users open Very Last Bite</h4>
              <p className="text-xs text-[#8D6E63] leading-relaxed">
                Consumers check the platform to see what discount bakery bundles are currently available nearby.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-[#F2ECE4] relative overflow-hidden shadow-sm flex flex-col gap-3">
              <div className="absolute top-4 right-4 text-4xl font-black text-[#FCD34D]/25 font-display">03</div>
              <div className="text-2xl">⚡</div>
              <h4 className="font-bold text-[#3E2723] pt-2">Users unlock food bundles</h4>
              <p className="text-xs text-[#8D6E63] leading-relaxed">
                Secure a bundle instantly on the platform, receiving a unique verification pickup code.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-[#F2ECE4] relative overflow-hidden shadow-sm flex flex-col gap-3">
              <div className="absolute top-4 right-4 text-4xl font-black text-[#FCD34D]/25 font-display">04</div>
              <div className="text-2xl">🛍️</div>
              <h4 className="font-bold text-[#3E2723] pt-2">Collect more food for less</h4>
              <p className="text-xs text-[#8D6E63] leading-relaxed">
                Head to the bakery, show your pickup code, and collect your delicious food bundle with dignity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#F59E0B]">The Impact</span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-[#3E2723]">Why It Matters</h2>
          <p className="text-sm text-[#8D6E63]">Real difference in pocket size and ecological footprint.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column Comparison */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-[#F2ECE4] shadow-sm space-y-6">
              <h3 className="text-xl font-bold font-display text-[#3E2723] border-b border-[#F2ECE4] pb-4">
                Budget Stretching Example
              </h3>

              <div className="space-y-4">
                <div className="bg-[#FFFDF9] border border-[#F2ECE4] p-4 rounded-2xl">
                  <span className="text-xs font-extrabold text-[#8D6E63] uppercase tracking-wider block mb-1">Traditional Purchase</span>
                  <p className="text-sm font-semibold text-[#5D4037]">
                    "R30 may only cover a basic food item."
                  </p>
                </div>

                <div className="bg-[#FFF8E7] border border-[#FCD34D] p-5 rounded-2xl">
                  <span className="text-xs font-extrabold text-[#D97706] uppercase tracking-wider block mb-1">Very Last Bite Difference</span>
                  <p className="text-base font-bold text-[#3E2723]">
                    "The same budget can stretch further through available food bundles."
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#8D6E63] italic">
                * Note: Exact items fluctuate daily based on available bakery surplus to guarantee freshness.
              </p>
            </div>
          </div>

          {/* Right Column Stats */}
          <div className="lg:col-span-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-[#F2ECE4] shadow-sm">
                <div className="text-3xl mb-2">🍞</div>
                <h4 className="font-bold text-[#3E2723] text-base mb-1">Better Food Access</h4>
                <p className="text-xs text-[#8D6E63]">Making fresh items affordable to households daily.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#F2ECE4] shadow-sm">
                <div className="text-3xl mb-2">♻️</div>
                <h4 className="font-bold text-[#3E2723] text-base mb-1">Reduced Food Waste</h4>
                <p className="text-xs text-[#8D6E63]">Rescuing kilograms of good bakery products daily.</p>
              </div>
            </div>

            <div className="bg-[#FFF8E7] border border-[#FCD34D] p-6 rounded-2xl">
              <div className="flex gap-4 items-center">
                <div className="text-4xl">🇿🇦</div>
                <div>
                  <h4 className="font-bold text-[#3E2723] text-base mb-1">Stronger Communities</h4>
                  <p className="text-xs text-[#5D4037]">
                    Connecting local neighborhood bakeries directly with residents in a cooperative, waste-free system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-[#FFFDF9] border-y border-[#F2ECE4] px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Visual Left on desktop */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm h-64 md:h-80 rounded-3xl bg-[#FFF8E7] border border-[#FCD34D]/60 flex items-center justify-center p-6 shadow-md overflow-hidden">
              <span className="text-8xl select-none filter drop-shadow">🤝</span>
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 border border-[#EADCC9] rounded-xl px-4 py-2 text-center text-xs font-bold text-[#5D4037] backdrop-blur-sm">
                Dignity • Community • Impact
              </div>
            </div>
          </div>

          {/* Text Right */}
          <div className="md:col-span-7 space-y-6">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#F59E0B]">The Vision</span>
            <h2 className="text-3xl font-black font-display text-[#3E2723]">A Better Future</h2>
            <div className="space-y-4 text-base text-[#5D4037] leading-relaxed">
              <p className="font-bold">
                Very Last Bite was built on a simple belief: Good food should remain accessible to everyday people.
              </p>
              <p className="text-sm text-[#8D6E63]">
                By helping bakeries recover value from available food while helping people stretch their budgets further, we can create a system that benefits everyone.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <span className="bg-white border border-[#EADCC9] px-4 py-1.5 rounded-full text-xs font-bold text-[#3E2723]">🌱 Less waste</span>
                <span className="bg-white border border-[#EADCC9] px-4 py-1.5 rounded-full text-xs font-bold text-[#3E2723]">✊ More dignity</span>
                <span className="bg-white border border-[#EADCC9] px-4 py-1.5 rounded-full text-xs font-bold text-[#3E2723]">🥖 Better access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}


      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[#FFFDF9] border-t border-[#F2ECE4] px-6 scroll-mt-20">
        <div className="max-w-xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#F59E0B]">Contact Us</span>
            <h2 className="text-3xl font-black font-display text-[#3E2723]">Get In Touch</h2>
            <p className="text-sm text-[#8D6E63]">Have questions, suggestions, or want to partner? Drop us a line.</p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4 bg-white p-8 rounded-3xl border border-[#F2ECE4] shadow-sm">
            <div>
              <label className="text-xs font-bold text-[#5D4037] block mb-1.5 ml-1">Name</label>
              <input
                type="text"
                required
                placeholder="Jane Doe"
                className="w-full px-4 py-3.5 rounded-xl bg-[#FDFBF7] border-2 border-[#F2ECE4] focus:border-[#F59E0B] outline-none text-sm text-[#3E2723] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#5D4037] block mb-1.5 ml-1">Email</label>
              <input
                type="email"
                required
                placeholder="jane@example.com"
                className="w-full px-4 py-3.5 rounded-xl bg-[#FDFBF7] border-2 border-[#F2ECE4] focus:border-[#F59E0B] outline-none text-sm text-[#3E2723] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#5D4037] block mb-1.5 ml-1">Message</label>
              <textarea
                rows={4}
                required
                placeholder="How can we help you stretch your budget or partner?"
                className="w-full px-4 py-3.5 rounded-xl bg-[#FDFBF7] border-2 border-[#F2ECE4] focus:border-[#F59E0B] outline-none text-sm text-[#3E2723] transition-colors resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-[#F59E0B] text-white font-bold py-4 rounded-xl hover:bg-[#D97706] transition-all cursor-pointer shadow-md shadow-amber-500/10 hover:shadow-lg"
            >
              Submit Message
            </button>

            {formSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 text-green-700 text-xs font-bold text-center p-3 rounded-xl border border-green-200"
              >
                ✓ Thank you! We'll get back to you shortly.
              </motion.div>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#F2ECE4] py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">

          {/* Logo & Statement */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-black font-display tracking-tight text-[#5D4037]">
              <span className="text-2xl">🍞</span>
              <span>Very Last Bite</span>
            </Link>
            <p className="text-sm font-semibold text-[#8D6E63]">Helping food go further.</p>
            {/* Social Icons Placeholders */}
            <div className="flex gap-3 text-lg">
              <span className="cursor-pointer opacity-70 hover:opacity-100 hover:text-amber-500 transition-colors">🌐</span>
              <span className="cursor-pointer opacity-70 hover:opacity-100 hover:text-amber-500 transition-colors">🐦</span>
              <span className="cursor-pointer opacity-70 hover:opacity-100 hover:text-amber-500 transition-colors">📸</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <div className="space-y-3">
              <h5 className="text-xs uppercase font-extrabold tracking-wider text-[#3E2723]">Platform</h5>
              <ul className="space-y-2 text-sm text-[#8D6E63]">
                <li><Link href="/" className="hover:text-[#F59E0B] transition-colors">Home</Link></li>
                <li><a href="#mission" onClick={(e) => handleSmoothScroll(e, "mission")} className="hover:text-[#F59E0B] transition-colors">Mission</a></li>
                <li><a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, "how-it-works")} className="hover:text-[#F59E0B] transition-colors">How It Works</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="text-xs uppercase font-extrabold tracking-wider text-[#3E2723]">Resources</h5>
              <ul className="space-y-2 text-sm text-[#8D6E63]">
                <li><a href="#impact" onClick={(e) => handleSmoothScroll(e, "impact")} className="hover:text-[#F59E0B] transition-colors">Impact</a></li>
                <li><a href="#contact" onClick={(e) => handleSmoothScroll(e, "contact")} className="hover:text-[#F59E0B] transition-colors">Contact</a></li>
                <li><Link href="/bakery" className="hover:text-[#F59E0B] transition-colors font-bold text-[#F59E0B]">Bakery Portal</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-[#F2ECE4] mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#8D6E63]">
          <p>© {new Date().getFullYear()} Very Last Bite. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-[#3E2723] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#3E2723] cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
