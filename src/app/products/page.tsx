"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Search, ArrowRight } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import MainCategoryCards from "@/components/MainCategoryCards";

/**
 * Character-by-Character falling gravity drop breadcrumb
 * Animates every character sequentially (h-o-m-e -> / -> Category -> / -> Subcategory)
 * exactly like "WHAT WE DO" on the homepage!
 */
function FallingDropBreadcrumbs({
  homeText = "home",
  categoryText = "General Instrumentation",
  subcategoryText = "Scalpels",
  onCategoryClick,
}: {
  homeText?: string;
  categoryText?: string;
  subcategoryText?: string;
  onCategoryClick?: () => void;
}) {
  const [hoverKey, setHoverKey] = useState(0);

  const parts = useMemo(() => {
    const list: { char: string; color: string; isLink?: boolean; href?: string; onClick?: () => void; isBold?: boolean }[] = [];

    // home characters
    Array.from(homeText).forEach((c) => {
      list.push({ char: c, color: "#64748B", isLink: true, href: "/" });
    });

    // Separator 1: " / "
    list.push({ char: " ", color: "transparent" });
    list.push({ char: "/", color: "#94A3B8" });
    list.push({ char: " ", color: "transparent" });

    // Category characters
    Array.from(categoryText).forEach((c) => {
      list.push({ char: c, color: "#475569", onClick: onCategoryClick });
    });

    // Separator 2: " / " (if subcategory exists)
    if (subcategoryText && subcategoryText !== "all") {
      list.push({ char: " ", color: "transparent" });
      list.push({ char: "/", color: "#94A3B8" });
      list.push({ char: " ", color: "transparent" });

      // Subcategory characters (in vibrant red #ED1C24)
      Array.from(subcategoryText).forEach((c) => {
        list.push({ char: c, color: "#ED1C24", isBold: true });
      });
    }

    return list;
  }, [homeText, categoryText, subcategoryText, onCategoryClick]);

  return (
    <nav
      aria-label="Breadcrumb"
      className="inline-flex items-center flex-wrap text-xs sm:text-[13px] font-medium cursor-pointer select-none"
      onMouseEnter={() => setHoverKey((k) => k + 1)}
    >
      {parts.map((p, idx) => {
        if (p.char === " ") {
          return (
            <span key={idx} className="inline-block w-[0.3em]">
              &nbsp;
            </span>
          );
        }

        const dropDelay = 0.02 + idx * 0.025;

        return (
          <motion.span
            key={`${hoverKey}-${idx}`}
            onClick={p.onClick}
            className={`inline-block relative origin-top ${p.isBold ? "font-bold" : ""} ${p.isLink || p.onClick ? "hover:underline cursor-pointer" : ""
              }`}
            style={{ color: p.color }}
            initial={{ opacity: 0, y: -40, rotate: -8 }}
            whileInView={{
              opacity: 1,
              y: 0,
              rotate: 0,
              transition: {
                type: "spring",
                stiffness: 380,
                damping: 14,
                mass: 0.8,
                delay: dropDelay,
              },
            }}
            viewport={{ once: false, amount: 0.2 }}
            whileHover={{
              y: -5,
              scale: 1.18,
              color: p.color === "#ED1C24" ? "#c9141b" : "#0F172A",
              transition: { type: "spring", stiffness: 450, damping: 10 },
            }}
          >
            {p.char}
          </motion.span>
        );
      })}
    </nav>
  );
}

/**
 * Character-by-Character animated headline (Flying / Dropping Spring Animation)
 * Characters fly/drop from top with spring physics on scroll down/up,
 * and retrigger a fresh wave on mouse hover!
 * Words are wrapped in whitespace-nowrap so words NEVER break mid-word!
 */
function CharSwipeLine({
  text,
  textColor,
  hoverColor,
  baseDelay = 0,
  fontSizeClass = "",
}: {
  text: string;
  textColor: string;
  hoverColor?: string;
  baseDelay?: number;
  fontSizeClass?: string;
}) {
  const [hoverKey, setHoverKey] = useState(0);

  const words = text.split(" ");
  let globalCharIndex = 0;

  return (
    <span
      className={`inline-block cursor-pointer select-none ${fontSizeClass}`}
      onMouseEnter={() => setHoverKey((prev) => prev + 1)}
    >
      {words.map((word, wIdx) => {
        const wordChars = Array.from(word);
        const startIndex = globalCharIndex;
        globalCharIndex += wordChars.length + 1;

        return (
          <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.24em] last:mr-0">
            {wordChars.map((char, cIdx) => {
              const charIndex = startIndex + cIdx;
              const dropDelay = baseDelay + charIndex * 0.035;

              return (
                <motion.span
                  key={`${hoverKey}-${charIndex}`}
                  className="inline-block relative origin-top"
                  style={{ color: textColor }}
                  initial={{ opacity: 0, y: -45, rotate: -8 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    rotate: 0,
                    transition: {
                      type: "spring",
                      stiffness: 380,
                      damping: 14,
                      mass: 0.8,
                      delay: dropDelay,
                    },
                  }}
                  viewport={{ once: false, amount: 0.2 }}
                  whileHover={{
                    y: -6,
                    scale: 1.15,
                    color: hoverColor || textColor,
                    transition: { type: "spring", stiffness: 450, damping: 10 },
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}

/**
 * Navbar Button Style Animated Heading for "Browse sub-categories"
 * - Soft blur-to-sharp spring drop per character (matching AnimatedNavLink in Header)
 * - On mouse hover: cascade in vibrant red (#ED1C24) with bounce and scale!
 * - Red underline pill slides in on hover like navbar buttons
 */
function NavStyleAnimatedHeading({
  text = "Browse sub-categories",
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverKey, setHoverKey] = useState(0);

  const words = text.split(" ");
  let globalCharIndex = 0;

  return (
    <div
      className="relative inline-flex flex-col cursor-pointer select-none group"
      onMouseEnter={() => {
        setIsHovered(true);
        setHoverKey((prev) => prev + 1);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`text-lg sm:text-xl font-black tracking-tight flex items-center flex-wrap ${className}`}>
        {words.map((word, wIdx) => {
          const wordChars = Array.from(word);
          const startIndex = globalCharIndex;
          globalCharIndex += wordChars.length + 1;

          return (
            <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.28em] last:mr-0">
              {wordChars.map((char, cIdx) => {
                const charIndex = startIndex + cIdx;
                const charDelay = charIndex * 0.04;

                return (
                  <motion.span
                    key={`${hoverKey}-${charIndex}`}
                    className="inline-block relative origin-top"
                    initial={{ opacity: 0.15, y: -22, filter: "blur(1.5px)" }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: {
                        type: "spring",
                        stiffness: 110,
                        damping: 15,
                        mass: 0.95,
                        delay: charDelay,
                      },
                    }}
                    viewport={{ once: false, amount: 0.2 }}
                    animate={{
                      color: isHovered ? "#ED1C24" : "#0F172A",
                    }}
                    whileHover={{
                      y: -4,
                      scale: 1.14,
                      color: "#ED1C24",
                      transition: { duration: 0.2 },
                    }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
          );
        })}
      </div>

      {/* Navbar Style Red Underline Pill on hover */}
      <span
        className={`h-[2.5px] rounded-full transition-all duration-300 mt-1 ${isHovered
            ? "bg-[#ED1C24] opacity-100 w-full"
            : "bg-transparent opacity-0 w-0"
          }`}
      />
    </div>
  );
}

/**
 * Character-by-Character falling/dropping gravity animation (same as "WHAT WE DO")
 * Characters drop from top one by one:
 * e.g. '3' drops -> '3' drops -> ' ' -> 'c' drops -> 'a' drops -> ...
 * Triggers on scroll into view and bounces on mouse hover!
 */
function FallingDropText({
  text,
  className = "",
  baseDelay = 0,
  staggerDelay = 0.035,
}: {
  text: string;
  className?: string;
  baseDelay?: number;
  staggerDelay?: number;
}) {
  const [hoverKey, setHoverKey] = useState(0);

  const words = text.split(" ");
  let globalCharIndex = 0;

  return (
    <span
      className={`inline-block cursor-pointer select-none ${className}`}
      onMouseEnter={() => setHoverKey((prev) => prev + 1)}
    >
      {words.map((word, wIdx) => {
        const wordChars = Array.from(word);
        const startIndex = globalCharIndex;
        globalCharIndex += wordChars.length + 1;

        return (
          <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.24em] last:mr-0">
            {wordChars.map((char, cIdx) => {
              const charIndex = startIndex + cIdx;
              const dropDelay = baseDelay + charIndex * staggerDelay;

              return (
                <motion.span
                  key={`${hoverKey}-${charIndex}`}
                  className="inline-block relative origin-top"
                  initial={{ opacity: 0, y: -35, rotate: -8 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    rotate: 0,
                    transition: {
                      type: "spring",
                      stiffness: 380,
                      damping: 14,
                      mass: 0.8,
                      delay: dropDelay,
                    },
                  }}
                  viewport={{ once: false, amount: 0.2 }}
                  whileHover={{
                    y: -5,
                    scale: 1.15,
                    color: "#ED1C24",
                    transition: { type: "spring", stiffness: 450, damping: 10 },
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCatParam = searchParams.get("category") || "general-instrumentation";
  const initialSubParam = searchParams.get("subcategory") || "Scalpels";

  const { content } = useContent();
  const pageData = (content as any)?.productPage || {};

  // Banner details from admin content
  const bannerTitle1 = pageData.bannerTitleLine1 || "RELIABLE HEALTHCARE PRODUCTS.";
  const bannerHighlight = pageData.bannerTitleHighlight || "ADVANCED SOLUTIONS.";
  const bannerImage = pageData.bannerImage || "/images/global-standards/compliances-surgeon-hands.png";

  // Categories list from admin content
  const categoriesList = useMemo(() => {
    if (pageData.categories && Array.isArray(pageData.categories) && pageData.categories.length > 0) {
      return pageData.categories;
    }
    return [
      {
        id: "cat-gen",
        name: "General Instrumentation",
        slug: "general-instrumentation",
        subcategories: [
          "Scalpels",
          "Artery Forceps",
          "Probes, Applicators, Spatulas",
          "Anaesthesia",
          "Bone Surgery",
          "Tracheotomy",
          "Urology",
          "Calipers",
          "Tonsillectomy, Laryngo-Bronchoscopy",
          "Cranio-Maxillo-Facial Surgery",
          "Extracting Forceps",
          "Scissors",
          "Cotton Swab Forceps",
          "Diagnostics",
          "Suture",
          "Cardiovascular / Neuro",
          "Dermatology",
          "Gynaecology",
          "Otology",
          "Hygiene, Storage",
          "Asepsis",
          "Dental Elevators",
          "Forceps",
          "Retractors",
          "Trocars, Suction Tubes, Cannulas",
          "Dressings",
          "Neurosurgery",
          "Stomach, Intestines, Rectum",
          "Obstetrics",
          "Rhinology",
          "Oral Maxillo-Facial Surgery",
          "Needle Holders",
          "Dental And Oral Surgery",
        ],
      },
      {
        id: "cat-dental",
        name: "Dental Instruments",
        slug: "dental-instruments",
        subcategories: [
          "Dental Elevators",
          "Extracting Forceps",
          "Scaling Instruments",
          "Filling Instruments",
          "Orthodontic Pliers",
          "Mouth Mirrors & Handles",
          "Periodontal Probes",
          "Root Tip Picks",
        ],
      },
      {
        id: "cat-ent",
        name: "ENT Instruments",
        slug: "ent-instruments",
        subcategories: [
          "Laryngeal Cup Forceps",
          "Nose Speculums",
          "Ear Curettes",
          "Otology Forceps",
          "Tuning Forks",
          "Nasal Snares",
        ],
      },
      {
        id: "cat-ortho",
        name: "Orthopedic Instruments",
        slug: "orthopedic-instruments",
        subcategories: [
          "Kerrison Rongeurs",
          "Bone Punches",
          "Bone Holding Forceps",
          "Bone Chisels & Gouges",
          "Wire Cutters & Pliers",
          "Mallets & Tampers",
          "Plate Benders",
        ],
      },
    ];
  }, [pageData.categories]);

  const [selectedCategorySlug, setSelectedCategorySlug] = useState(initialCatParam);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubParam);
  const [subSearchQuery, setSubSearchQuery] = useState("");

  // Active category object
  const activeCategory = useMemo(() => {
    return (
      categoriesList.find((c: any) => c.slug === selectedCategorySlug) ||
      categoriesList[0] || {
        name: "General Instrumentation",
        slug: "general-instrumentation",
        subcategories: [],
      }
    );
  }, [categoriesList, selectedCategorySlug]);

  // Subcategories of active category
  const activeSubcategories: string[] = useMemo(() => {
    return activeCategory.subcategories || [];
  }, [activeCategory]);

  // Filtered subcategories based on subSearchQuery
  const filteredSubcategories = useMemo(() => {
    if (!subSearchQuery.trim()) return activeSubcategories;
    const q = subSearchQuery.toLowerCase();
    return activeSubcategories.filter((sub: string) => sub.toLowerCase().includes(q));
  }, [activeSubcategories, subSearchQuery]);

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen py-6 sm:py-8 lg:py-10 text-slate-800">
      <div className="w-full max-w-[1920px] 2xl:max-w-[2200px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-8 sm:space-y-10">

        {/* ================================================================= */}
        {/* 1. TOP BANNER / HERO SECTION (Banner in Background + Animations)  */}
        {/* ================================================================= */}
        <motion.div
          initial={{ opacity: 0, x: -120, y: 35, scale: 0.96 }}
          whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-white rounded-3xl p-6 sm:p-10 lg:p-14 shadow-xl border border-slate-200/80 relative overflow-hidden min-h-[340px] sm:min-h-[380px] lg:min-h-[420px] flex flex-col justify-center group"
        >
          {/* Background Banner Image spanning across the right side */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bannerImage}
              alt="Endo Tech Reliable Healthcare Products - Surgical Instruments"
              className="w-full h-full object-cover object-right sm:object-right transition-transform duration-700 ease-out group-hover:scale-103"
            />
            {/* Smooth Left Gradient Mask for 100% Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent sm:w-[72%] lg:w-[62%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-transparent to-transparent sm:hidden" />

            {/* Red Geometric Angle Accent in Bottom Right (Matching SS 1) */}
            <div
              className="absolute bottom-0 right-0 w-28 sm:w-40 h-24 sm:h-32 bg-[#ED1C24] pointer-events-none transition-transform duration-500 group-hover:scale-110 origin-bottom-right"
              style={{
                clipPath: "polygon(35% 0, 100% 0, 100% 100%, 0 100%)",
              }}
              aria-hidden="true"
            />
          </div>

          {/* Foreground Content (Left Column with Breadcrumb & Headline) */}
          <div className="relative z-10 max-w-2xl lg:max-w-3xl space-y-5 sm:space-y-6">

            {/* Breadcrumb: Character-by-Character falling gravity drop (What We Do style) */}
            <div>
              <FallingDropBreadcrumbs
                homeText="home"
                categoryText={activeCategory.name}
                subcategoryText={selectedSubcategory}
                onCategoryClick={() => setSelectedSubcategory("all")}
              />
            </div>

            {/* Banner Headline: RELIABLE HEALTHCARE PRODUCTS. ADVANCED SOLUTIONS. */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[46px] font-black tracking-tight leading-[1.14]">
              <CharSwipeLine
                text={bannerTitle1}
                textColor="#0F172A"
                hoverColor="#1B459B"
                baseDelay={0.04}
              />
              <br />
              <CharSwipeLine
                text={bannerHighlight}
                textColor="#ED1C24"
                hoverColor="#c9141b"
                baseDelay={0.1}
              />
            </h1>

          </div>
        </motion.div>

        {/* ================================================================= */}
        {/* 2. MAIN CATEGORIES CARDS (Continuous Running Light Animation)     */}
        {/* ================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80"
        >
          <MainCategoryCards
            categories={categoriesList}
            activeSlug={selectedCategorySlug}
            onSelectCategory={(slug) => {
              setSelectedCategorySlug(slug);
              const found = categoriesList.find((c: any) => c.slug === slug);
              if (found && found.subcategories?.length > 0) {
                setSelectedSubcategory(found.subcategories[0]);
              } else {
                setSelectedSubcategory("all");
              }
              document.getElementById("subcategories-section")?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        </motion.div>

        {/* ================================================================= */}
        {/* 3. FILTER & SEARCH CONTROLS ROW                                  */}
        {/* ================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
        >
          {/* Left: Product category dropdown select */}
          <div className="flex items-center gap-3">
            <label htmlFor="product-category-select" className="text-xs sm:text-sm font-bold text-slate-800 whitespace-nowrap">
              Product category
            </label>
            <div className="relative">
              <select
                id="product-category-select"
                value={selectedCategorySlug}
                onChange={(e) => {
                  setSelectedCategorySlug(e.target.value);
                  const found = categoriesList.find((c: any) => c.slug === e.target.value);
                  if (found && found.subcategories?.length > 0) {
                    setSelectedSubcategory(found.subcategories[0]);
                  } else {
                    setSelectedSubcategory("all");
                  }
                }}
                className="appearance-none bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs sm:text-sm font-semibold rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20 shadow-xs cursor-pointer min-w-[200px] sm:min-w-[240px]"
              >
                {categoriesList.map((cat: any) => (
                  <option key={cat.id || cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right: Search sub-categories input with magnifying glass */}
          <div className="relative w-full sm:w-80 md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search sub-categories"
              value={subSearchQuery}
              onChange={(e) => setSubSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20 shadow-xs"
            />
          </div>
        </motion.div>

        {/* ================================================================= */}
        {/* 4. BROWSE SUB-CATEGORIES (3-Column Grid with Left/Right Corners)  */}
        {/* ================================================================= */}
        <motion.div
          id="subcategories-section"
          initial={{ opacity: 0, x: -80, y: 35, scale: 0.98 }}
          whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 scroll-mt-6"
        >
          {/* Header Row: Navbar-Style Animated Title on Left, Falling Drop Anim on Count */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <NavStyleAnimatedHeading text="Browse sub-categories" />

            {/* "33 categories" with "What We Do" Character Falling Gravity Drop Animation */}
            <div>
              <FallingDropText
                text={`${filteredSubcategories.length} categories`}
                className="text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                staggerDelay={0.04}
              />
            </div>
          </div>

          {/* 3-Column Grid of Sub-categories with Left/Right Corner Swipe Animations */}
          {filteredSubcategories.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs sm:text-sm">
              No sub-categories matched &ldquo;{subSearchQuery}&rdquo; in {activeCategory.name}.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2.5">
              {filteredSubcategories.map((subName: string, idx: number) => {
                const isSelected = selectedSubcategory === subName;

                // Left corner for col 0 (idx % 3 === 0), Right corner for col 2 (idx % 3 === 2), Bottom center for col 1 (idx % 3 === 1)
                const colIndex = idx % 3;
                const initialX = colIndex === 0 ? -70 : colIndex === 2 ? 70 : 0;
                const initialY = 32;
                const delay = Math.min((idx % 9) * 0.045, 0.36);

                return (
                  <motion.div
                    key={`${subName}-${idx}`}
                    initial={{ opacity: 0, x: initialX, y: initialY, scale: 0.95 }}
                    whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    viewport={{ once: false, amount: 0.08 }}
                    transition={{
                      duration: 1.2,
                      ease: [0.25, 0.1, 0.25, 1],
                      delay,
                    }}
                    whileHover={{ y: -3, scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={`/products/collection?category=${encodeURIComponent(activeCategory.slug)}&subcategory=${encodeURIComponent(subName)}`}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border text-left text-xs sm:text-[13px] font-semibold transition-all duration-200 group cursor-pointer ${isSelected
                          ? "bg-rose-50/90 text-[#ED1C24] border-rose-200/90 shadow-sm ring-1 ring-[#ED1C24]/15"
                          : "bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200/70 hover:border-slate-300 shadow-xs hover:shadow-md"
                        }`}
                    >
                      <span className="truncate pr-2">{subName}</span>
                      <ArrowRight
                        className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isSelected
                            ? "text-[#ED1C24] translate-x-1"
                            : "text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1.5"
                          }`}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* ================================================================= */}
        {/* 4. "CAN'T FIND WHAT YOU NEED?" BANNER BOX                         */}
        {/* ================================================================= */}
        <motion.div
          initial={{ opacity: 0, x: 80, y: 35, scale: 0.98 }}
          whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Can&apos;t find what you need?
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-medium">
              Our team is here to help.
            </span>
          </div>

          <Link
            href="/contact"
            className="px-7 py-3 rounded-xl border-2 border-[#ED1C24] text-[#ED1C24] hover:bg-[#ED1C24] hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-md hover:scale-103 active:scale-95 whitespace-nowrap"
          >
            Contact Us
          </Link>
        </motion.div>

      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 font-semibold">Loading products catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
