"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  ArrowRight,
  ZoomIn,
  Plus,
  Check,
  ChevronRight,
  X,
} from "lucide-react";
import { useContent, ProductItem } from "@/context/ContentContext";
import { useInquiry } from "@/context/InquiryContext";
import MainCategoryCards from "@/components/MainCategoryCards";

/**
 * Character Swipe Animation (0.3 speed, smooth ease)
 */
function CharSwipeLine({
  text,
  textColor = "#0F172A",
  hoverColor = "#ED1C24",
  baseDelay = 0.03,
  fontSizeClass = "",
}: {
  text: string;
  textColor?: string;
  hoverColor?: string;
  baseDelay?: number;
  fontSizeClass?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverKey, setHoverKey] = useState(0);

  const words = text.split(" ");
  let globalCharIndex = 0;

  return (
    <span
      className={`inline-block select-none cursor-pointer group ${fontSizeClass}`}
      onMouseEnter={() => {
        setIsHovered(true);
        setHoverKey((prev) => prev + 1);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {words.map((word, wIdx) => {
        const wordChars = Array.from(word);
        const startIndex = globalCharIndex;
        globalCharIndex += wordChars.length + 1;

        return (
          <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.24em] last:mr-0">
            {wordChars.map((char, cIdx) => {
              const charIndex = startIndex + cIdx;
              const dropDelay = baseDelay + charIndex * 0.025;

              return (
                <motion.span
                  key={`${hoverKey}-${charIndex}`}
                  className="inline-block relative origin-top"
                  style={{ color: textColor }}
                  initial={{ opacity: 0, y: -25, rotate: -6 }}
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
 * Character-by-Character falling/dropping gravity animation (same as "WHAT WE DO")
 * Characters drop from top one by one: P -> R -> O -> D -> U -> C -> T ...
 * Triggers on scroll into view and bounces on mouse hover!
 */
function FallingDropText({
  text = "PRODUCT COLLECTION",
  className = "",
  baseDelay = 0.02,
  staggerDelay = 0.035,
  textColor = "#475569",
  hoverColor = "#ED1C24",
}: {
  text?: string;
  className?: string;
  baseDelay?: number;
  staggerDelay?: number;
  textColor?: string;
  hoverColor?: string;
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
          <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.28em] last:mr-0">
            {wordChars.map((char, cIdx) => {
              const charIndex = startIndex + cIdx;
              const dropDelay = baseDelay + charIndex * staggerDelay;

              return (
                <motion.span
                  key={`${hoverKey}-${charIndex}`}
                  className="inline-block relative origin-top"
                  style={{ color: textColor }}
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
                    color: hoverColor,
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
 * Falling Drop Breadcrumbs (Home / [Category] / [Subcategory])
 */
function FallingDropBreadcrumbs({
  homeText = "home",
  categoryText = "General Surgery",
  subcategoryText = "Scalpel Handle",
}: {
  homeText?: string;
  categoryText?: string;
  subcategoryText?: string;
}) {
  return (
    <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm font-semibold text-slate-500">
      <Link href="/" className="hover:text-[#1B459B] transition-colors lowercase">
        {homeText}
      </Link>
      <span className="text-slate-300">/</span>
      <Link href="/products" className="hover:text-[#1B459B] transition-colors">
        {categoryText}
      </Link>
      <span className="text-slate-300">/</span>
      <span className="text-[#ED1C24] font-bold">
        {subcategoryText}
      </span>
    </div>
  );
}

export default function SubcategoryCollectionClient({
  categorySlug = "general-instrumentation",
  categoryName = "General Instrumentation",
  subcategoryName = "Scalpels",
}: {
  categorySlug?: string;
  categoryName?: string;
  subcategoryName?: string;
}) {
  const { content, products } = useContent();
  const { addItem } = useInquiry();

  const pageData = (content as any)?.productPage || {};
  const bannerTitle1 = pageData.bannerTitleLine1 || "RELIABLE HEALTHCARE PRODUCTS.";
  const bannerHighlight = pageData.bannerTitleHighlight || "ADVANCED SOLUTIONS.";
  const bannerImage = pageData.bannerImage || "/uploads/1795423436544-Rectangle_854.jpg";

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

  // Filter states
  const [productTypeFilter, setProductTypeFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [zoomModalImage, setZoomModalImage] = useState<string | null>(null);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Find products belonging to this subcategory or category
  const matchingProducts = useMemo(() => {
    const normSub = subcategoryName.toLowerCase().replace(/[^a-z0-9]/g, "");
    const normCat = categorySlug.toLowerCase().replace(/[^a-z0-9]/g, "");

    let found = products.filter((p) => {
      const pSub = (p.subcategory || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const pCat = (p.category || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const pName = (p.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");

      // 1. Direct subcategory match
      if (pSub && normSub && (pSub === normSub || pSub.includes(normSub) || normSub.includes(pSub))) {
        return true;
      }

      // 2. Or category match with matching product name or subcategory
      if (pCat && normCat && (pCat === normCat || pCat.includes(normCat) || normCat.includes(pCat))) {
        if (pSub && normSub && (pSub === normSub || normSub.includes(pSub))) return true;
        if (pName && normSub && pName.includes(normSub)) return true;
      }

      return false;
    });

    // DO NOT synthesize fake products! Only show real products added in admin panel/database.

    // Apply Filters
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      found = found.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (sortBy === "code-asc") {
      found.sort((a, b) => a.code.localeCompare(b.code));
    } else if (sortBy === "code-desc") {
      found.sort((a, b) => b.code.localeCompare(a.code));
    }

    return found;
  }, [products, subcategoryName, categorySlug, searchQuery, sortBy]);

  const handleAddInquiry = (prod: ProductItem) => {
    addItem({
      product_id: prod.id,
      product_name: prod.name,
      article_code: prod.code,
      selected_size: prod.cup_size || prod.length || "Standard",
      quantity: 1,
    });
    setAddedNotice(prod.name);
    setTimeout(() => setAddedNotice(null), 2500);
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen py-6 sm:py-8 lg:py-10 text-slate-800">
      <div className="w-full max-w-[1920px] 2xl:max-w-[2200px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-8 sm:space-y-10">

        {/* ================================================================= */}
        {/* 1. TOP HERO BANNER (Matches Screenshot 4 & 5)                     */}
        {/* ================================================================= */}
        <motion.div
          initial={{ opacity: 0, x: -120, y: 35, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-white rounded-3xl p-6 sm:p-10 lg:p-14 shadow-xl border border-slate-200/80 relative overflow-hidden min-h-[320px] sm:min-h-[360px] lg:min-h-[390px] flex flex-col justify-center group"
        >
          {/* Background Banner Image */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bannerImage}
              alt="Endo Tech Reliable Healthcare Products - Surgical Instruments"
              className="w-full h-full object-cover object-right sm:object-right transition-transform duration-700 ease-out group-hover:scale-103"
            />
            {/* Left White Gradient Mask for 100% Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent sm:w-[72%] lg:w-[62%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-transparent to-transparent sm:hidden" />

            {/* Red Geometric Angle Accent in Bottom Right */}
            <div
              className="absolute bottom-0 right-0 w-28 sm:w-40 h-24 sm:h-32 bg-[#ED1C24] pointer-events-none transition-transform duration-500 group-hover:scale-110 origin-bottom-right"
              style={{
                clipPath: "polygon(35% 0, 100% 0, 100% 100%, 0 100%)",
              }}
              aria-hidden="true"
            />
          </div>

          {/* Foreground Content */}
          <div className="relative z-10 max-w-2xl lg:max-w-3xl space-y-5 sm:space-y-6">
            <FallingDropBreadcrumbs
              homeText="home"
              categoryText={categoryName}
              subcategoryText={subcategoryName}
            />

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-black tracking-tight leading-[1.14]">
              <CharSwipeLine
                text={bannerTitle1}
                textColor="#0F172A"
                hoverColor="#1B459B"
                baseDelay={0.03}
              />
              <br />
              <CharSwipeLine
                text={bannerHighlight}
                textColor="#ED1C24"
                hoverColor="#c9141b"
                baseDelay={0.08}
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
            activeSlug={categorySlug}
            isLinkMode={true}
          />
        </motion.div>

        {/* ================================================================= */}
        {/* 3. PRODUCT COLLECTION SHOWCASE SECTION (Exact Match to SS 4 & 5)   */}
        {/* ================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-white rounded-3xl p-6 sm:p-8 lg:p-12 shadow-sm border border-slate-200/80 space-y-8"
        >
          {/* Header Row: Title & Subtitle */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-6">
            <div className="space-y-2">
              <div className="text-xs font-black tracking-[0.16em] uppercase">
                <FallingDropText
                  text="PRODUCT COLLECTION"
                  textColor="#475569"
                  hoverColor="#ED1C24"
                />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-tight">
                <CharSwipeLine
                  text={subcategoryName}
                  textColor="#0F172A"
                  hoverColor="#ED1C24"
                  baseDelay={0.03}
                />
              </h2>
              <div className="w-12 h-1 bg-[#ED1C24] rounded-full" />
            </div>

            <div className="lg:max-w-md text-xs sm:text-sm text-slate-600 leading-relaxed border-l-2 border-slate-200 pl-4">
              Explore the collection. Select an instrument to view details or add it to your inquiry.
            </div>
          </div>

          {/* Controls Bar: Product Type, Handle Size, Search by Name/Code, Sort By (SS 4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Product Type */}
            <div className="relative">
              <select
                value={productTypeFilter}
                onChange={(e) => setProductTypeFilter(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-800 text-xs sm:text-sm font-semibold rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20 cursor-pointer"
              >
                <option value="all">Product Type (All)</option>
                <option value="reusable">Reusable</option>
                <option value="single-use">Single-Use</option>
                <option value="sterile">Sterile Kitted</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Handle Size / Pattern */}
            <div className="relative">
              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-800 text-xs sm:text-sm font-semibold rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20 cursor-pointer"
              >
                <option value="all">Handle Size / All</option>
                <option value="standard">Standard</option>
                <option value="11.5cm">11.5 cm</option>
                <option value="13.5cm">13.5 cm</option>
                <option value="16cm">16 cm</option>
                <option value="21cm">21 cm</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Search by name or code */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name or code"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20"
              />
            </div>

            {/* Sort by */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-800 text-xs sm:text-sm font-semibold rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20 cursor-pointer"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="code-asc">Code (A - Z)</option>
                <option value="code-desc">Code (Z - A)</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Products Count Indicator */}
          <div className="text-xs sm:text-sm font-semibold text-slate-500">
            {matchingProducts.length} {matchingProducts.length === 1 ? "product" : "products"}
          </div>

          {/* Notification Toast when added to inquiry */}
          <AnimatePresence>
            {addedNotice && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-between"
              >
                <span>&ldquo;{addedNotice}&rdquo; added to your inquiry list!</span>
                <span className="text-[11px] font-semibold text-emerald-700">Ready to submit</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Cards Grid or Empty State */}
          {matchingProducts.length === 0 ? (
            <div className="py-16 px-6 text-center bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-800">
                  No products in &ldquo;{subcategoryName}&rdquo; yet
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  No instruments have been uploaded for this subcategory yet. Products added from the Admin Panel will appear here.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Link
                  href="/products"
                  className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition shadow-xs"
                >
                  Browse All Categories
                </Link>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  Inquire for Custom Manufacturing
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {matchingProducts.map((prod: ProductItem, pIdx: number) => {
                const detailSlug = prod.slug || prod.id;

                return (
                  <motion.div
                    key={prod.id || pIdx}
                    initial={{ opacity: 0, y: 25, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: pIdx * 0.08 }}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-[#1B459B]/50 transition-all duration-300 shadow-xs hover:shadow-xl flex flex-col justify-between overflow-hidden group"
                  >
                    {/* Top Product Image Container with Zoom Button */}
                    <div className="relative aspect-[4/3] w-full bg-white p-6 flex items-center justify-center border-b border-slate-100 overflow-hidden">
                      {/* Zoom Icon Button in Top Right */}
                      <button
                        type="button"
                        onClick={() => setZoomModalImage(prod.image)}
                        className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-[#1B459B] border border-slate-200 flex items-center justify-center shadow-xs transition-transform duration-200 hover:scale-110"
                        title="Enlarge Product Image"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>

                      <Link href={`/products/${detailSlug}`} className="w-full h-full flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="max-h-full max-w-full object-contain filter contrast-[1.03] transition-transform duration-500 group-hover:scale-106"
                        />
                      </Link>
                    </div>

                    {/* Card Body & Details */}
                    <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-black tracking-wider uppercase text-slate-500">
                          {prod.product_type || subcategoryName.toUpperCase()}
                        </div>

                        <Link href={`/products/${detailSlug}`} className="block group/title">
                          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug group-hover/title:text-[#1B459B] transition-colors">
                            <CharSwipeLine
                              text={prod.name}
                              textColor="#0F172A"
                              hoverColor="#1B459B"
                              baseDelay={0.02}
                            />
                          </h3>
                        </Link>

                        <div className="text-xs font-mono font-bold text-slate-500">
                          Code: <span className="text-slate-800 font-extrabold">{prod.code}</span>
                        </div>
                      </div>

                      {/* Card Actions: View Details -> | + Add to Inquiry (SS 4 & 5 Match) */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs font-bold">
                        <Link
                          href={`/products/${detailSlug}`}
                          className="text-slate-700 hover:text-[#ED1C24] transition-colors flex items-center gap-1 group/link"
                        >
                          <span>View details</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleAddInquiry(prod)}
                          className="text-[#ED1C24] hover:text-[#c9141b] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to inquiry</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls Row - ONLY show when products exist */}
          {matchingProducts.length > 0 && (
            <div className="pt-6 flex flex-col items-center justify-center gap-3 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <button
                  type="button"
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition"
                  disabled
                >
                  &lsaquo;
                </button>
                <button
                  type="button"
                  className="w-8 h-8 rounded-lg bg-[#ED1C24] text-white flex items-center justify-center shadow-xs"
                >
                  1
                </button>
                <button
                  type="button"
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition"
                  disabled
                >
                  &rsaquo;
                </button>
              </div>
            </div>
          )}

          {/* Bottom Callout Banner (Find the right instrument... [Contact our team ->]) */}
          <div className="bg-[#F1F5F9] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200/80">
            <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight text-center sm:text-left">
              Find the right instrument for your requirements.
            </span>
            <Link
              href="/contact"
              className="px-6 py-3 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-xl text-xs sm:text-[13px] font-bold transition-all duration-300 shadow-md hover:scale-103 active:scale-95 whitespace-nowrap"
            >
              Contact our team &rarr;
            </Link>
          </div>

        </motion.div>

        {/* Back to Products Overview Link */}
        <div className="text-center pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:border-[#1B459B] hover:text-[#1B459B] transition-colors"
          >
            &larr; Back to all 33 categories
          </Link>
        </div>

      </div>

      {/* Image Zoom Modal */}
      {zoomModalImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setZoomModalImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] bg-white rounded-2xl p-4 overflow-hidden">
            <button
              onClick={() => setZoomModalImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={zoomModalImage}
              alt="Enlarged view"
              className="w-full h-full max-h-[78vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
