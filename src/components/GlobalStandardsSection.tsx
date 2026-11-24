"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Bell,
  Users,
  ShieldCheck,
  Globe2,
  CheckCircle2,
  Scissors,
  Check,
} from "lucide-react";
import { useContent } from "@/context/ContentContext";
import AnimatedCounter from "@/components/AnimatedCounter";

interface GlobalStandardsSectionProps {
  previewData?: any;
}

/**
 * Character-by-Character falling gravity drop animation
 * Triggers on scroll down/up (inView) and on mouse hover!
 */
function FallingDropTag({
  text = "OUR COMPLIANCES",
  className = "",
  showDash = true,
}: {
  text?: string;
  className?: string;
  showDash?: boolean;
}) {
  const [hoverKey, setHoverKey] = useState(0);

  const handleMouseEnter = () => {
    setHoverKey((prev) => prev + 1);
  };

  const characters = Array.from(text);

  return (
    <div
      className={`inline-flex items-center gap-3 cursor-pointer select-none group ${className}`}
      onMouseEnter={handleMouseEnter}
    >
      {showDash && (
        <span className="w-8 sm:w-10 h-[2px] bg-[#ED1C24] inline-block shrink-0 transition-transform duration-300 group-hover:scale-x-125 origin-left" />
      )}
      <span className="text-slate-800 text-xs sm:text-[13px] font-black tracking-[0.18em] uppercase flex items-center flex-wrap">
        {characters.map((char, index) => {
          if (char === " ") {
            return (
              <span key={index} className="inline-block w-[0.35em]">
                &nbsp;
              </span>
            );
          }

          const dropDelay = index * 0.04;

          return (
            <motion.span
              key={`${hoverKey}-${index}`}
              className="inline-block relative origin-top"
              initial={{ opacity: 0, y: -45, rotate: -8 }}
              whileInView={{
                opacity: 1,
                y: 0,
                rotate: 0,
                transition: {
                  type: "spring",
                  stiffness: 420,
                  damping: 14,
                  mass: 0.7,
                  delay: dropDelay,
                },
              }}
              viewport={{ once: false, amount: 0.05 }}
              whileHover={{
                y: -6,
                scale: 1.15,
                transition: { type: "spring", stiffness: 450, damping: 10 },
              }}
            >
              {char}
            </motion.span>
          );
        })}
      </span>
    </div>
  );
}

/**
 * Character-by-Character animated headline (Flying / Dropping Spring Animation)
 * Characters fly/drop from the top with spring physics on scroll down/up,
 * and retrigger a fresh wave on mouse hover!
 * Words are wrapped in whitespace-nowrap wrappers so words NEVER break mid-word!
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

  const handleMouseEnter = () => {
    setHoverKey((prev) => prev + 1);
  };

  const words = text.split(" ");
  let globalCharIndex = 0;

  return (
    <span
      className={`inline-block cursor-pointer select-none ${fontSizeClass}`}
      onMouseEnter={handleMouseEnter}
    >
      {words.map((word, wIdx) => {
        const wordChars = Array.from(word);
        const startIndex = globalCharIndex;
        globalCharIndex += wordChars.length + 1;

        return (
          <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.26em] last:mr-0">
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
                      stiffness: 420,
                      damping: 14,
                      mass: 0.7,
                      delay: dropDelay,
                    },
                  }}
                  viewport={{ once: false, amount: 0.05 }}
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
 * "Heavy Qism Ki" Full Premium Animated Paragraph
 * Word-by-word floating reveal with blur-to-sharp focus on scroll down/up (`viewport: { once: false }`)
 * Interactive physics: hovering over words gives tactile spring lift and glowing radiant accent!
 */
function LuminousHeavyParagraph({
  text,
  className = "",
  glowColor = "cyan",
}: {
  text: string;
  className?: string;
  glowColor?: "cyan" | "red" | "blue";
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const words = text.split(" ");

  return (
    <p
      className={`relative inline-block leading-relaxed select-none ${className}`}
      onMouseLeave={() => setHoveredIdx(null)}
    >
      {words.map((word, idx) => {
        const isHovered = hoveredIdx === idx;
        const isNeighbor =
          hoveredIdx !== null && Math.abs(hoveredIdx - idx) === 1;

        return (
          <motion.span
            key={idx}
            className="inline-block whitespace-nowrap mr-[0.3em] cursor-pointer origin-center transition-colors duration-300"
            onMouseEnter={() => setHoveredIdx(idx)}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: {
                duration: 0.5,
                delay: 0.05 + idx * 0.02,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            viewport={{ once: false, amount: 0.05 }}
            animate={{
              y: isHovered ? -4 : isNeighbor ? -1.5 : 0,
              scale: isHovered ? 1.07 : isNeighbor ? 1.02 : 1,
              color: isHovered
                ? glowColor === "red"
                  ? "#ED1C24"
                  : "#1B459B"
                : isNeighbor
                ? "#334155"
                : undefined,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            {word}
          </motion.span>
        );
      })}
    </p>
  );
}

/**
 * ISO / FDA Compliance Badges Strip
 */
function ComplianceBadgeItem({
  type,
  label,
  sublabel,
}: {
  type: "iso" | "fda";
  label: string;
  sublabel: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-[#1B459B]/40 hover:bg-white hover:shadow-md transition-all duration-300 group">
      {type === "iso" ? (
        <div className="w-12 h-12 rounded-full border-2 border-slate-700 group-hover:border-[#1B459B] flex items-center justify-center font-black text-xs text-slate-800 group-hover:text-[#1B459B] transition-colors">
          ISO
        </div>
      ) : (
        <div className="w-12 h-12 rounded-full border-2 border-slate-700 group-hover:border-[#ED1C24] flex items-center justify-center font-black text-xs text-slate-800 group-hover:text-[#ED1C24] transition-colors">
          FDA
        </div>
      )}
      <span className="text-[11px] font-bold text-slate-700 mt-2 text-center group-hover:text-slate-900">
        {label}
      </span>
      {sublabel && (
        <span className="text-[9px] font-medium text-slate-500 text-center">
          {sublabel}
        </span>
      )}
    </div>
  );
}

export default function GlobalStandardsSection({
  previewData,
}: GlobalStandardsSectionProps) {
  const { content } = useContent();
  const rawData =
    previewData || (content as any)?.globalStandardsSection;

  if (rawData?.enabled === false) {
    return null;
  }

  // Part 1: Compliances defaults
  const compTag = rawData?.compTag || "OUR COMPLIANCES";
  const compTitleLine1 = rawData?.compTitleLine1 || "Global Standards.";
  const compTitleHighlight = rawData?.compTitleHighlight || "Trusted Quality.";
  const compParagraph =
    rawData?.compParagraph ||
    "We follow internationally recognized standards to ensure safety, quality and reliability in every product we deliver.";
  const compImage =
    rawData?.compImage ||
    "/images/global-standards/compliances-surgeon-hands.png";

  // Part 2A: Customized Tools defaults
  const toolsTag = rawData?.toolsTag || "OUR HEALTH CARE";
  const toolsTitleLine1 = rawData?.toolsTitleLine1 || "Are you ready to get";
  const toolsTitleHighlight = rawData?.toolsTitleHighlight || "customized tools?";
  const toolsParagraph =
    rawData?.toolsParagraph ||
    "We offer tailored surgical instruments to meet your specific needs and requirements.";
  const toolsBtnText = rawData?.toolsBtnText || "Contact Now";
  const toolsBtnLink = rawData?.toolsBtnLink || "/contact";
  const toolsImage =
    rawData?.toolsImage ||
    "/images/global-standards/customized-tools-tray.png";

  // Part 2B: Upcoming Activities defaults
  const eventsTitleLine1 = rawData?.eventsTitleLine1 || "Stay Updated with Our";
  const eventsTitleHighlight =
    rawData?.eventsTitleHighlight || "Upcoming Activities";
  const eventsParagraph =
    rawData?.eventsParagraph ||
    "Be the first to know about new launches, exhibitions, and latest updates.";
  const eventsBtnText = rawData?.eventsBtnText || "View Events";
  const eventsBtnLink = rawData?.eventsBtnLink || "/events";

  // Part 3: Export Destinations defaults
  const exportTag = rawData?.exportTag || "EXPORT DESTINATIONS";
  const exportTitleLine1 = rawData?.exportTitleLine1 || "Trusted Worldwide";
  const exportTitleLine2 = rawData?.exportTitleLine2 || "From Our Factory";
  const exportTitleHighlight = rawData?.exportTitleHighlight || "to Your Market";
  const exportParagraph =
    rawData?.exportParagraph ||
    "We export high-quality surgical instruments to countries across the globe, ensuring reliable supply and lasting partnerships.";
  const exportGlobeImage =
    rawData?.exportGlobeImage ||
    "/images/global-standards/worldwide-globe-network.png";
  const exportStat1Number = rawData?.exportStat1Number || "250+";
  const exportStat1Label = rawData?.exportStat1Label || "Qualified Staff";
  const exportStat2Number = rawData?.exportStat2Number || "10000+";
  const exportStat2Label = rawData?.exportStat2Label || "Instruments";
  const exportSlogan =
    rawData?.exportSlogan || "PROUDLY SERVING HEALTHCARE GLOBALLY";

  return (
    <section className="w-full bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 overflow-hidden relative">
      <div className="w-full max-w-[1920px] 2xl:max-w-[2200px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-12 sm:space-y-16">
        
        {/* ============================================================== */}
        {/* 1. TOP CARD: OUR COMPLIANCES (Global Standards. Trusted Quality) */}
        {/* ============================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-200/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column (7 Cols) - Glides in from Left Corner */}
            <motion.div
              initial={{ opacity: 0, x: -110, y: -45, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.05 }}
              transition={{
                duration: 0.65,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="lg:col-span-7 space-y-6 sm:space-y-7"
            >
              <div>
                <FallingDropTag text={compTag} showDash={true} />
              </div>

              <div className="space-y-1">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12]">
                  <CharSwipeLine
                    text={compTitleLine1}
                    textColor="#0F172A"
                    hoverColor="#1B459B"
                    baseDelay={0.04}
                  />
                  <br />
                  <CharSwipeLine
                    text={compTitleHighlight}
                    textColor="#ED1C24"
                    hoverColor="#c9141b"
                    baseDelay={0.1}
                  />
                </h2>
              </div>

              {/* Side Paragraph with Premium Heavy Animation */}
              <div className="max-w-2xl text-slate-600 text-sm sm:text-base leading-relaxed">
                <LuminousHeavyParagraph
                  text={compParagraph}
                  className="text-slate-600 font-normal"
                />
              </div>

              {/* 5 Regulatory Badges Strip (ISO & FDA) */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 max-w-2xl">
                <ComplianceBadgeItem
                  type="iso"
                  label="ISO 13485:2016"
                  sublabel="Medical Devices"
                />
                <ComplianceBadgeItem
                  type="iso"
                  label="ISO 9001:2015"
                  sublabel="Quality Systems"
                />
                <ComplianceBadgeItem
                  type="iso"
                  label="ISO 7153-1:2016"
                  sublabel="Surgical Steels"
                />
                <ComplianceBadgeItem
                  type="fda"
                  label="FDA Approved"
                  sublabel="Class I & II"
                />
                <ComplianceBadgeItem
                  type="fda"
                  label="FDA Compliant"
                  sublabel="US Standards"
                />
              </div>
            </motion.div>

            {/* Right Column: Surgeon Hands Image - Glides in from Right Corner (5 Cols) */}
            <motion.div
              initial={{ opacity: 0, x: 110, y: -45, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.05 }}
              transition={{
                duration: 0.65,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.05,
              }}
              className="lg:col-span-5"
            >
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] bg-slate-100 shadow-xl border border-slate-200 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={compImage}
                  alt="Surgeon holding forceps over sterile surgical tray"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Red Geometric Angle Accent in Bottom Right (Matching Figma SS 2) */}
                <div
                  className="absolute bottom-0 right-0 w-24 sm:w-32 h-20 sm:h-24 bg-[#ED1C24] pointer-events-none transition-transform duration-500 group-hover:scale-110 origin-bottom-right"
                  style={{
                    clipPath: "polygon(35% 0, 100% 0, 100% 100%, 0 100%)",
                  }}
                  aria-hidden="true"
                />
              </div>
            </motion.div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. MIDDLE ROW: CUSTOM TOOLS (Card A) + UPCOMING ACTIVITIES (B) */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-8 items-stretch">
          
          {/* Card A (Left 8 Cols): "Are you ready to get customized tools?" - Glides in from Left Corner */}
          <motion.div
            initial={{ opacity: 0, x: -120, y: 45, scale: 0.94 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.05 }}
            transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-9 lg:p-12 shadow-xl border border-slate-200/80 flex flex-col justify-between overflow-hidden relative min-h-[380px] group"
          >
            
            {/* Background Banner Image spanning across the right side */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={toolsImage}
                alt="Customized surgical instruments banner background"
                className="w-full h-full object-cover object-right-top md:object-right transition-transform duration-700 ease-out group-hover:scale-103"
                loading="lazy"
              />
              {/* Gradient mask for 100% crystal clear text contrast on left */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent sm:w-[72%] lg:w-[64%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-transparent to-transparent sm:hidden" />
            </div>

            {/* Foreground Text Content */}
            <div className="relative z-10 max-w-xl space-y-5">
              <div>
                <FallingDropTag text={toolsTag} showDash={true} />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight leading-[1.18]">
                  <CharSwipeLine
                    text={toolsTitleLine1}
                    textColor="#0F172A"
                    hoverColor="#1B459B"
                    baseDelay={0.03}
                  />
                  <br />
                  <CharSwipeLine
                    text={toolsTitleHighlight}
                    textColor="#ED1C24"
                    hoverColor="#c9141b"
                    baseDelay={0.08}
                  />
                </h3>
              </div>

              {/* Animated Paragraph */}
              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md">
                <LuminousHeavyParagraph
                  text={toolsParagraph}
                  className="text-slate-600 font-normal"
                />
              </div>

              {/* Contact Now Red Pill Button */}
              <div className="pt-2">
                <Link
                  href={toolsBtnLink}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#ED1C24] hover:bg-[#d61820] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-600/30 hover:shadow-red-600/45 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-104 active:scale-95 group/btn"
                >
                  <span>{toolsBtnText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>

          </motion.div>

          {/* Card B (Right 4 Cols): "Stay Updated with Our Upcoming Activities" - Glides in from Right Corner */}
          <motion.div
            initial={{ opacity: 0, x: 120, y: 45, scale: 0.94 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.05 }}
            transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1], delay: 0.05 }}
            className="lg:col-span-4 bg-gradient-to-br from-white via-rose-50/25 to-rose-50/50 rounded-3xl p-6 sm:p-9 shadow-xl border border-slate-200/80 flex flex-col justify-between overflow-hidden relative group"
          >
            
            <div className="space-y-5">
              {/* Bell Announcement Icon with ping ring */}
              <div className="relative inline-flex items-center">
                <span className="w-12 h-12 rounded-2xl bg-rose-100/90 border border-rose-200 flex items-center justify-center text-[#ED1C24] shadow-xs group-hover:scale-110 transition-transform duration-300">
                  <Bell className="w-6 h-6 stroke-[2.2]" />
                </span>
                <span className="ml-3 w-8 h-[2px] bg-[#ED1C24] inline-block" />
              </div>

              {/* Heading with Character Swipe */}
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-[1.2]">
                  <CharSwipeLine
                    text={eventsTitleLine1}
                    textColor="#0F172A"
                    hoverColor="#1B459B"
                    baseDelay={0.03}
                    fontSizeClass="text-xl sm:text-2xl font-black"
                  />
                  <br />
                  <CharSwipeLine
                    text={eventsTitleHighlight}
                    textColor="#ED1C24"
                    hoverColor="#c9141b"
                    baseDelay={0.08}
                    fontSizeClass="text-xl sm:text-2xl font-black"
                  />
                </h3>
              </div>

              {/* Animated Paragraph */}
              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                <LuminousHeavyParagraph
                  text={eventsParagraph}
                  className="text-slate-600 font-normal"
                />
              </div>
            </div>

            {/* View Events Outline Pill Button */}
            <div className="pt-6">
              <Link
                href={eventsBtnLink}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-400/90 text-slate-800 hover:bg-slate-900 hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-104 active:scale-95 group/btn shadow-xs"
              >
                <span>{eventsBtnText}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>
            </div>

          </motion.div>

        </div>

        {/* ============================================================== */}
        {/* 3. BOTTOM CARD: EXPORT DESTINATIONS (Trusted Worldwide)        */}
        {/* ============================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-200/80 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Text & Stats Column (6 Cols) */}
            <motion.div
              initial={{ opacity: 0, x: -110, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.05 }}
              transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
              className="lg:col-span-6 space-y-6 sm:space-y-8"
            >
              <div>
                <FallingDropTag text={exportTag} showDash={true} />
              </div>

              <div className="space-y-1">
                <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-[1.14]">
                  <CharSwipeLine
                    text={exportTitleLine1}
                    textColor="#0F172A"
                    hoverColor="#1B459B"
                    baseDelay={0.03}
                  />
                  <br />
                  <CharSwipeLine
                    text={exportTitleLine2}
                    textColor="#0F172A"
                    hoverColor="#1B459B"
                    baseDelay={0.08}
                  />
                  <br />
                  <CharSwipeLine
                    text={exportTitleHighlight}
                    textColor="#ED1C24"
                    hoverColor="#c9141b"
                    baseDelay={0.13}
                  />
                </h2>
              </div>

              {/* Animated Side Paragraph */}
              <div className="max-w-xl text-slate-600 text-sm sm:text-base leading-relaxed">
                <LuminousHeavyParagraph
                  text={exportParagraph}
                  className="text-slate-600 font-normal"
                />
              </div>

              {/* 2 Big Highlight Metrics / Stats (Users 250+ & Instruments 10,000+) */}
              <div className="pt-2 flex flex-wrap items-center gap-8 sm:gap-12 border-t border-slate-100 pt-6">
                
                {/* Metric 1 */}
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 group-hover:bg-[#1B459B] group-hover:text-white transition-all duration-300">
                    <Users className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-[#ED1C24] transition-colors">
                      <AnimatedCounter value={exportStat1Number} />
                    </div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {exportStat1Label}
                    </div>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden sm:block w-[1px] h-10 bg-slate-200" />

                {/* Metric 2 */}
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-[#ED1C24] group-hover:bg-[#ED1C24] group-hover:text-white transition-all duration-300">
                    <Scissors className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-[#ED1C24] transition-colors">
                      <AnimatedCounter value={exportStat2Number} />
                    </div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {exportStat2Label}
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* Right Column: 3D Globe Network & Flight Paths (6 Cols) */}
            <motion.div
              initial={{ opacity: 0, x: 110, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.05 }}
              transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1], delay: 0.05 }}
              className="lg:col-span-6 flex flex-col items-end"
            >
              <div className="relative w-full aspect-square max-w-[540px] mx-auto flex items-center justify-center group">
                {/* 3D Globe with Country Pins & Flight Routes */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={exportGlobeImage}
                  alt="Endo Tech Worldwide Export Network across USA, Germany, UK, UAE, Saudi Arabia, Canada, Australia"
                  className="w-full h-full object-contain group-hover:scale-104 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>

              {/* Slogan Accent Tag in Bottom Right (Matching Figma SS 2) */}
              <div className="mt-2 inline-flex items-center gap-2.5 text-[11px] font-black tracking-widest uppercase text-slate-500">
                <span className="w-6 h-[2px] bg-[#ED1C24]" />
                <span className="text-slate-700">{exportSlogan}</span>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}

