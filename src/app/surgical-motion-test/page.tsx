"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValue,
  useTransform,
  useSpring,
} from "motion/react";
import {
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  Sliders,
  ChevronRight,
  ShoppingBag,
  Layers,
  Search,
  ExternalLink,
  RotateCcw,
  Info,
  Maximize2,
  X,
} from "lucide-react";

// ============================================================================
// TYPES & MOCK DATA
// ============================================================================
interface Instrument {
  id: string;
  sku: string;
  name: string;
  category: string;
  biteAngle: string;
  jawOpening: string;
  coating: string;
  material: string;
  hardness: string;
  image: string;
  priceNote: string;
  stock: string;
  specs: { label: string; value: string }[];
}

const SAMPLE_INSTRUMENTS: Instrument[] = [
  {
    id: "inst-1",
    sku: "ET-KR40-02",
    name: "Kerrison Bone Rongeur 40° Up-Bite (2mm)",
    category: "Spinal & Neuro",
    biteAngle: "40° Forward Up-Bite",
    jawOpening: "2.0 mm Footplate",
    coating: "Gold TiN Handle / Non-Reflective Satin",
    material: "German AISI 420 Surgical Stainless Steel",
    hardness: "HRC 54 - 56 Precision Tempered",
    image: "/images/hero-instruments.png",
    priceNote: "Hospital Tier Pricing Available",
    stock: "In Stock - USA Fast Shipping",
    specs: [
      { label: "Shaft Length", value: "7.0 inches (180 mm)" },
      { label: "Bite Thickness", value: "2.0 mm Micro Cut" },
      { label: "Handle Type", value: "Ergonomic Spring Action" },
      { label: "Cleaning", value: "Take-Apart Cleanout Track" },
      { label: "Sterilization", value: "Autoclavable 134°C / 273°F" },
    ],
  },
  {
    id: "inst-2",
    sku: "ET-KR90-03",
    name: "Kerrison Bone Rongeur 90° Up-Bite (3mm)",
    category: "Spinal & Ortho",
    biteAngle: "90° Direct Up-Bite",
    jawOpening: "3.0 mm Heavy Duty",
    coating: "Dual Satin Finish / Ceramic E-Coat",
    material: "High-Carbon Martensitic Steel",
    hardness: "HRC 55 - 57 Laser Hardened",
    image: "/images/hero-instruments.png",
    priceNote: "GSA Contract Eligible",
    stock: "In Stock - Ships from Sialkot/USA Hub",
    specs: [
      { label: "Shaft Length", value: "8.0 inches (200 mm)" },
      { label: "Bite Thickness", value: "3.0 mm Standard Cut" },
      { label: "Handle Type", value: "Dual Bar Spring" },
      { label: "Cleaning", value: "Ejector Pin E-Clean" },
      { label: "Sterilization", value: "Steam / EtO Compatible" },
    ],
  },
  {
    id: "inst-3",
    sku: "ET-TC40-01",
    name: "Thin-Footplate Cervical Rongeur (1mm)",
    category: "Micro-Spinal",
    biteAngle: "40° Micro Slanted",
    jawOpening: "1.0 mm Ultra-Thin Footplate",
    coating: "Black Diamond DLC / Anti-Glare",
    material: "Tungsten Carbide Inlaid Tips",
    hardness: "HRC 58 Ultra-Wear Resisting",
    image: "/images/hero-instruments.png",
    priceNote: "Custom Laser Engraved Option",
    stock: "Precision Batch - In Stock",
    specs: [
      { label: "Shaft Length", value: "6.0 inches (150 mm)" },
      { label: "Bite Thickness", value: "1.0 mm Delicate Bone" },
      { label: "Handle Type", value: "Featherweight Anatomical" },
      { label: "Cleaning", value: "Rapid Flush Port" },
      { label: "Sterilization", value: "Autoclavable 200+ Cycles" },
    ],
  },
];

// ============================================================================
// COMPONENT 1: CHARACTER-BY-CHARACTER HOVER ANIMATION (Heading & Button)
// ============================================================================
function CharacterWaveHeading({ text, subtitle }: { text: string; subtitle?: string }) {
  const [isHovered, setIsHovered] = useState(false);

  const letters = Array.from(text);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer select-none inline-block group"
    >
      <div className="flex flex-wrap items-center overflow-hidden py-1">
        {letters.map((char, index) => (
          <motion.span
            key={index}
            className={`inline-block font-black tracking-tight text-3xl sm:text-5xl lg:text-6xl ${
              char === " " ? "w-3 sm:w-4" : ""
            } ${index >= 8 && index <= 17 ? "text-[#ED1C24]" : "text-slate-900"}`}
            animate={
              isHovered
                ? {
                    y: [0, -8, 0],
                    rotate: [0, -2, 2, 0],
                    color: index >= 8 && index <= 17 ? "#c9141b" : "#1B459B",
                  }
                : { y: 0, rotate: 0 }
            }
            transition={{
              duration: 0.45,
              delay: index * 0.02,
              ease: [0.2, 0.65, 0.3, 0.9],
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>
      {subtitle && (
        <motion.p
          animate={{ opacity: isHovered ? 1 : 0.75, x: isHovered ? 4 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 flex items-center gap-2"
        >
          <span className="w-6 h-[2px] bg-[#ED1C24] inline-block" />
          <span>{subtitle}</span>
          <Sparkles className="w-3.5 h-3.5 text-[#ED1C24]" />
        </motion.p>
      )}
    </div>
  );
}

function CharacterHoverButton({
  text,
  onClick,
  badge = "INQUIRE",
}: {
  text: string;
  onClick?: () => void;
  badge?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const chars = Array.from(text);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileTap={{ scale: 0.97 }}
      className="relative px-7 py-3.5 rounded-xl bg-[#ED1C24] hover:bg-[#c9141b] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-500/25 overflow-hidden flex items-center gap-3 transition-colors duration-200"
    >
      <span className="flex items-center">
        {chars.map((c, i) => (
          <motion.span
            key={i}
            className={`inline-block ${c === " " ? "w-1.5" : ""}`}
            animate={
              hovered
                ? {
                    y: [-1, -4, 0],
                    opacity: [1, 0.6, 1],
                  }
                : { y: 0, opacity: 1 }
            }
            transition={{
              duration: 0.35,
              delay: i * 0.02,
              ease: "easeInOut",
            }}
          >
            {c}
          </motion.span>
        ))}
      </span>
      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
      <span className="text-[9px] font-black bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
        {badge}
      </span>
    </motion.button>
  );
}

// ============================================================================
// COMPONENT 2: 3D TILT PRODUCT CARD WITH SMOOTH ZOOM & SPEC PREVIEW
// ============================================================================
function SurgicalProductCard({
  instrument,
  onSelect,
}: {
  instrument: Instrument;
  onSelect: (inst: Instrument) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for fluid 3D tilt
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), {
    stiffness: 300,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), {
    stiffness: 300,
    damping: 25,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative rounded-2xl bg-white border border-slate-200 shadow-lg hover:shadow-2xl transition-shadow duration-500 overflow-hidden group flex flex-col justify-between"
    >
      {/* Top Spec Badges */}
      <div className="p-4 sm:p-5 pb-0 flex items-center justify-between z-10">
        <span className="text-[10px] font-extrabold tracking-wider px-2.5 py-1 rounded-md bg-blue-50 text-[#1B459B] border border-blue-200">
          {instrument.sku}
        </span>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>ISO 13485</span>
        </span>
      </div>

      {/* Main Image Stage with Smooth Zoom on Hover */}
      <div className="relative w-full h-56 sm:h-64 overflow-hidden flex items-center justify-center p-6 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/40">
        <motion.img
          src={instrument.image}
          alt={instrument.name}
          className="w-full h-full object-contain filter drop-shadow-md"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Floating Quick-Spec Pill on Hover */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 left-4 right-4 bg-slate-900/90 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-lg flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        >
          <span className="font-semibold text-slate-300">{instrument.biteAngle}</span>
          <span className="font-bold text-red-400">{instrument.jawOpening}</span>
        </motion.div>
      </div>

      {/* Details & Action Footer */}
      <div className="p-5 sm:p-6 pt-3 space-y-4 border-t border-slate-100 bg-white z-10 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {instrument.category}
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug group-hover:text-[#1B459B] transition-colors">
            {instrument.name}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {instrument.material} • {instrument.hardness}
          </p>
        </div>

        {/* Spec Highlights Grid */}
        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span className="text-[9px] text-slate-400 block font-semibold">FOOTPLATE</span>
            <span className="font-bold text-slate-800">{instrument.jawOpening}</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span className="text-[9px] text-slate-400 block font-semibold">BITE ORIENTATION</span>
            <span className="font-bold text-slate-800">{instrument.biteAngle}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => onSelect(instrument)}
            className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-[#1B459B] hover:text-white text-slate-800 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Specifications</span>
          </button>

          <button
            type="button"
            onClick={() => onSelect(instrument)}
            className="px-3.5 py-2.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center shadow-xs"
            title="Quick Inquiry"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN PAGE: SURGICAL MOTION TEST
// ============================================================================
export default function SurgicalMotionTestPage() {
  const [activeNav, setActiveNav] = useState("Kerrison Series");
  const [selectedInst, setSelectedInst] = useState<Instrument | null>(null);
  const [inquiryCount, setInquiryCount] = useState(2);

  // Scroll direction detection for Feature (2)
  const { scrollY } = useScroll();
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | "top">("top");
  const lastScrollY = useRef(0);

  useEffect(() => {
    return scrollY.on("change", (current) => {
      if (current <= 10) {
        setScrollDirection("top");
      } else if (current > lastScrollY.current + 4) {
        setScrollDirection("down");
      } else if (current < lastScrollY.current - 4) {
        setScrollDirection("up");
      }
      lastScrollY.current = current;
    });
  }, [scrollY]);

  const navItems = [
    "Overview",
    "Kerrison Series",
    "Titanium Micro",
    "Cervical Punches",
    "USA Distribution",
    "Inquiry Specs",
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#ED1C24] selection:text-white relative">
      {/* ===================================================================== */}
      {/* 1. SCROLL-DIRECTION-AWARE MOTION HEADER (Feature 2)                   */}
      {/* ===================================================================== */}
      <motion.header
        animate={{
          y: scrollDirection === "down" ? -14 : 0,
          scale: scrollDirection === "down" ? 0.985 : 1,
          boxShadow:
            scrollDirection === "down"
              ? "0 4px 20px -2px rgba(15, 23, 42, 0.08)"
              : scrollDirection === "up"
              ? "0 10px 30px -5px rgba(27, 69, 155, 0.12)"
              : "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200"
      >
        {/* Top Micro-Bar */}
        <div className="bg-[#0F172A] text-white text-[11px] font-semibold py-1.5 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>FDA 510(k) Cleared • ISO 13485:2016 Certified</span>
              </span>
              <span className="hidden md:inline text-slate-500">|</span>
              <span className="hidden md:inline text-slate-400">
                USA Direct Surgical Supply & OEM Program
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="text-slate-300 hover:text-white transition flex items-center gap-1"
              >
                <span>Admin Panel</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <Link
                href="/"
                className="bg-[#ED1C24] px-2.5 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider"
              >
                Back to Site
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navbar with Feature (1): Shared Spring Indicator */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-6">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#1B459B] flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition-transform">
              E
            </div>
            <div>
              <div className="font-black text-lg tracking-tight text-slate-900 leading-none">
                ENDO TECH <span className="text-[#ED1C24]">USA</span>
              </div>
              <div className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">
                Motion Showcase Preview
              </div>
            </div>
          </Link>

          {/* Nav Items with Shared Spring Indicator (Feature 1) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            {navItems.map((item) => {
              const isActive = activeNav === item;
              return (
                <button
                  key={item}
                  onClick={() => setActiveNav(item)}
                  className={`relative px-4 py-2 rounded-lg text-xs font-bold transition-colors select-none ${
                    isActive ? "text-[#1B459B]" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {/* Shared Spring Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 35,
                      }}
                      className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/80"
                    />
                  )}
                  <span className="relative z-10">{item}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Inquiry CTA */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Inquiry Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {inquiryCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ED1C24] text-white text-[9px] font-black flex items-center justify-center">
                  {inquiryCount}
                </span>
              )}
            </button>

            <CharacterHoverButton
              text="REQUEST QUOTE"
              onClick={() => alert("Quote request drawer triggered!")}
              badge="USA"
            />
          </div>
        </div>

        {/* Scroll Direction Indicator Banner */}
        <div className="bg-blue-50/60 border-t border-blue-100/60 py-1 px-4 text-center text-[10px] text-slate-600 font-medium">
          <span>Scroll-Aware State: </span>
          <span className="font-bold uppercase text-[#1B459B]">{scrollDirection}</span>
          <span className="text-slate-400 ml-2">
            (Header contracts smoothly on scroll-down, gently expands on scroll-up)
          </span>
        </div>
      </motion.header>

      {/* ===================================================================== */}
      {/* 2. HERO SHOWCASE: Character Wave Heading & Medical Context             */}
      {/* ===================================================================== */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 pb-12 border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-[#F1F5F9]">
        {/* Background Soft Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-[#1B459B]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#ED1C24]/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy with Feature (3) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full text-[#ED1C24] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next.js Motion Engineering • USA Standard</span>
              </div>

              {/* Character-by-character interactive heading (Feature 3) */}
              <div>
                <CharacterWaveHeading
                  text="KERRISON RONGEUR SURGICAL"
                  subtitle="Hover over letters for wave displacement & color morphing"
                />
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
                Engineered for orthopedic, spinal, and neurosurgical procedures. Features
                precision-ground cutting jaws, AISI 420 German grade stainless steel,
                and micro take-apart cleanout channels for maximum autoclave longevity.
              </p>

              {/* Badges strip */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-[#1B459B]" />
                  <span>ISO 13485:2016</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                  <Award className="w-4 h-4 text-[#ED1C24]" />
                  <span>CE Mark (EU MDR)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>FDA 510(k) Compliant</span>
                </div>
              </div>
            </div>

            {/* Right Card Visual */}
            <div className="lg:col-span-5">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-2xl bg-white border border-slate-200 p-6 shadow-xl space-y-4 overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Interactive Spec HUD
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Live Motion
                  </span>
                </div>

                <div className="w-full h-48 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-2">
                  <motion.img
                    src="/images/hero-instruments.png"
                    alt="Surgical Kerrison"
                    className="w-full h-full object-contain"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  />
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400">Tolerance</span>
                    <span className="font-bold text-slate-800">± 0.02 mm CNC Tolerance</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400">Hardness</span>
                    <span className="font-bold text-slate-800">54 - 56 HRC Rockwell</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Warranty</span>
                    <span className="font-bold text-[#1B459B]">Lifetime Workmanship Guarantee</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. PRODUCT CATALOG GRID (Feature 4: 3D Tilt + Smooth Zoom)            */}
      {/* ===================================================================== */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-black tracking-widest text-[#1B459B] uppercase">
              FEATURE 4 DEMONSTRATION
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mt-1">
              Surgical Instrument 3D Tilt & Zoom Grid
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Hover over each product card to experience the smooth physics-based 3D tilt,
              dynamic cursor perspective, and fluid optical zoom.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Filter:</span>
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#1B459B] shadow-2xs">
              All Rongeurs ({SAMPLE_INSTRUMENTS.length})
            </span>
          </div>
        </div>

        {/* 3D Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SAMPLE_INSTRUMENTS.map((inst) => (
            <SurgicalProductCard
              key={inst.id}
              instrument={inst}
              onSelect={(item) => setSelectedInst(item)}
            />
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. MODAL SPEC DRAWER: Detailed Instrument Engineering Specs           */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {selectedInst && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInst(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-10"
            >
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-[#ED1C24] uppercase">
                    SURGICAL SPECIFICATION SHEET
                  </span>
                  <h3 className="text-lg font-black">{selectedInst.name}</h3>
                  <p className="text-xs text-slate-400">{selectedInst.sku}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedInst(null)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                <div className="w-full h-44 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedInst.image}
                    alt={selectedInst.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Engineering & Material Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {selectedInst.specs.map((sp, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col"
                      >
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {sp.label}
                        </span>
                        <span className="font-extrabold text-slate-800 mt-0.5">
                          {sp.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-[#1B459B] flex items-center gap-1.5">
                    <Info className="w-4 h-4" />
                    <span>Hospital / Surgery Center Inquiry</span>
                  </div>
                  <p>
                    Bulk institution inquiries qualify for certified calibration reports,
                    lot number traceability, and custom laser etching of facility credentials.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedInst(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInquiryCount((c) => c + 1);
                    alert(`Added ${selectedInst.name} to inquiry bag!`);
                    setSelectedInst(null);
                  }}
                  className="px-5 py-2.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-xl text-xs font-bold tracking-wider uppercase transition flex items-center gap-1.5 shadow-md"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Inquiry</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* 5. FOOTER: Quick Links                                                */}
      {/* ===================================================================== */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            Endo Tech Surgical Motion Demonstration Page • Standalone Module
          </div>
          <div className="flex items-center gap-4 font-bold text-[#1B459B]">
            <Link href="/" className="hover:underline">Home Site</Link>
            <Link href="/admin" className="hover:underline">Admin Panel</Link>
            <Link href="/products" className="hover:underline">Catalog</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

