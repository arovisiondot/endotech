"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Building2,
  Layers,
  Mail,
  Download,
  FileText,
  Factory,
  Boxes,
} from "lucide-react";
import { useContent } from "@/context/ContentContext";

interface AdvancedSolutionsSectionProps {
  previewData?: any;
}

/**
 * Character-by-Character falling gravity animation
 * Triggers on scroll (down/up) and on mouse hover!
 */
function FallingDropTag({
  text = "PRECISION. QUALITY. TRUST",
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
              viewport={{ once: false, amount: 0.3 }}
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
 * Character-by-Character animated headline
 * Words are grouped in whitespace-nowrap wrappers so words NEVER break mid-word!
 * Characters animate individually on hover (swipe wave) and on scroll (inView).
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
  const [isHovered, setIsHovered] = useState(false);
  const words = text.split(" ");
  let globalCharIndex = 0;

  return (
    <span
      className={`inline-block cursor-pointer select-none ${fontSizeClass}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {words.map((word, wIdx) => {
        const wordChars = Array.from(word);
        const startIndex = globalCharIndex;
        globalCharIndex += wordChars.length + 1;

        return (
          <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.26em] last:mr-0">
            {wordChars.map((char, cIdx) => {
              const charIndex = startIndex + cIdx;
              const charDelay = baseDelay + charIndex * 0.022;
              const waveDelay = charIndex * 0.028;

              return (
                <motion.span
                  key={cIdx}
                  className="inline-block relative origin-bottom transition-colors duration-200"
                  style={{
                    color: isHovered && hoverColor ? hoverColor : textColor,
                  }}
                  initial={{ opacity: 0, y: 35, rotateX: -60 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    transition: {
                      type: "spring",
                      stiffness: 320,
                      damping: 18,
                      delay: charDelay,
                    },
                  }}
                  viewport={{ once: false, amount: 0.3 }}
                  animate={
                    isHovered
                      ? {
                          y: [-3, -12, 0],
                          scale: [1, 1.14, 1],
                          transition: {
                            duration: 0.45,
                            delay: waveDelay,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        }
                      : { y: 0, scale: 1 }
                  }
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
 * "Full Premium Heavy-Duty Animation" for Talk Banner Paragraph
 * Word-by-word luminous floating reveal with blur-to-sharp focus on scroll (down/up)
 * Interactive physics: hovering over words creates a glowing luminous ripple wave!
 */
function LuminousHeavyParagraph({
  text,
  className = "",
}: {
  text: string;
  className?: string;
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
            className="inline-block whitespace-nowrap mr-[0.32em] cursor-pointer origin-center transition-colors duration-300"
            onMouseEnter={() => setHoveredIdx(idx)}
            initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
            whileInView={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: {
                duration: 0.55,
                delay: 0.08 + idx * 0.025,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            viewport={{ once: false, amount: 0.25 }}
            animate={{
              y: isHovered ? -5 : isNeighbor ? -2 : 0,
              scale: isHovered ? 1.08 : isNeighbor ? 1.03 : 1,
              color: isHovered
                ? "#FFFFFF"
                : isNeighbor
                ? "#E2E8F0"
                : "#CBD5E1",
              textShadow: isHovered
                ? "0 0 16px rgba(56, 189, 248, 0.85), 0 0 30px rgba(255, 255, 255, 0.6)"
                : isNeighbor
                ? "0 0 10px rgba(56, 189, 248, 0.4)"
                : "none",
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
 * Capability Card Icon Renderer
 */
function CapabilityIcon({
  iconName,
  className = "w-6 h-6",
}: {
  iconName: string;
  className?: string;
}) {
  const norm = (iconName || "").toLowerCase();
  if (norm.includes("book") || norm.includes("catalog")) {
    return <BookOpen className={className} strokeWidth={1.8} />;
  }
  if (norm.includes("shield") || norm.includes("quality")) {
    return <ShieldCheck className={className} strokeWidth={1.8} />;
  }
  if (norm.includes("build") || norm.includes("oem") || norm.includes("factory")) {
    return <Building2 className={className} strokeWidth={1.8} />;
  }
  if (norm.includes("layer") || norm.includes("material") || norm.includes("steril")) {
    return <Layers className={className} strokeWidth={1.8} />;
  }
  return <Boxes className={className} strokeWidth={1.8} />;
}

export default function AdvancedSolutionsSection({
  previewData,
}: AdvancedSolutionsSectionProps) {
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);
  const { content } = useContent();
  const rawData =
    previewData || (content as any)?.advancedSolutionsSection;

  if (rawData?.enabled === false) {
    return null;
  }

  // Default values matching SS 2 exactly
  const tag = rawData?.tag || "PRECISION. QUALITY. TRUST";
  const titleLine1 = rawData?.titleLine1 || "ADVANCED MEDICAL";
  const titleHighlight = rawData?.titleHighlight || "PRODUCT SOLUTIONS.";
  const paragraph1 =
    rawData?.paragraph1 ||
    "We Manufacture Premium Surgical & Dental Instruments For OEM, Private Label, And Sterile Kitting, Using High-Grade German & Japanese Stainless Steel To Meet DIN And ISO/ASTM Standards.";
  const paragraph2 =
    rawData?.paragraph2 ||
    "Available In Reusable, Single-Use, And EO-Sterilized Options.";
  const buttonText = rawData?.buttonText || "EXPLORE OUR PRODUCTS";
  const buttonLink = rawData?.buttonLink || "/products";
  const bannerImage =
    rawData?.bannerImage ||
    "/images/products-showcase/surgeon-gloves-instruments.png";

  const capabilitiesTag = rawData?.capabilitiesTag || "BUILT TO PERFORM";
  const capabilitiesTitle = rawData?.capabilitiesTitle || "MADE TO LAST.";
  const capabilitiesCards = rawData?.capabilitiesCards || [
    {
      id: "cap-1",
      icon: "book",
      title: "Product Catalogs",
      description:
        "Explore Our Comprehensive Range Of Surgical Instruments Designed For Precision And Professional Use.",
      linkText: "View Catalogs",
      linkUrl: "/catalog",
    },
    {
      id: "cap-2",
      icon: "shield",
      title: "Quality Standards",
      description:
        "Manufactured To DIN And ISO/ASTM Standards With Strict Quality Control To Ensure Reliability And Safety.",
      linkText: "View Catalogs",
      linkUrl: "/about#standards",
    },
    {
      id: "cap-3",
      icon: "building",
      title: "OEM / Private Label",
      description:
        "Custom Manufacturing, Private Label Branding And Sterile Kitting Solutions Tailored To Your Business Needs.",
      linkText: "View Catalogs",
      linkUrl: "/contact?service=oem",
    },
    {
      id: "cap-4",
      icon: "layers",
      title: "Materials & Sterilization",
      description:
        "Premium German & Japanese Stainless Steel With Options For Reusable, Single-Use And EO Sterilized Configurations.",
      linkText: "View Catalogs",
      linkUrl: "/about#materials",
    },
  ];

  const talkTitleLine1 = rawData?.talkTitleLine1 || "Let's Talk About";
  const talkTitleLine2 = rawData?.talkTitleLine2 || "Your Instrument.";
  const talkParagraph =
    rawData?.talkParagraph ||
    "Whether Product Advice, Partnership Or A Visit To Our Production, We Look Forward To Hearing From You And Will Get Back To You Promptly.";
  const primaryBtnText = rawData?.primaryBtnText || "GET IN TOUCH";
  const primaryBtnLink = rawData?.primaryBtnLink || "/contact";
  const secondaryBtnText = rawData?.secondaryBtnText || "DOWNLOAD CATALOGUE";
  const secondaryBtnLink = rawData?.secondaryBtnLink || "/catalog";

  return (
    <section className="w-full bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 overflow-hidden relative">
      <div className="w-full max-w-[1920px] 2xl:max-w-[2200px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-16 sm:space-y-20 lg:space-y-24">
        
        {/* ============================================================== */}
        {/* PART A: TOP HERO SHOWCASE BANNER (Advanced Medical Product Solutions) */}
        {/* ============================================================== */}
        <div className="relative bg-white rounded-3xl p-6 sm:p-10 lg:p-14 shadow-xl border border-slate-200/80 overflow-hidden min-h-[460px] lg:min-h-[500px] flex items-center">
          {/* Background Banner Image spanning across seamlessly */}
          <motion.div
            initial={{ opacity: 0, x: 120, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 1.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.08 }}
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bannerImage}
              alt="Advanced Medical Product Solutions Banner"
              className="w-full h-full object-cover object-right-top lg:object-right"
              loading="lazy"
            />
            {/* Smooth gradient overlay so left text is 100% readable while right visual shines through */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent lg:w-[68%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent sm:hidden" />
          </motion.div>

          {/* Foreground Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -120, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10 max-w-2xl lg:max-w-[58%] space-y-6 sm:space-y-7"
          >
            {/* Tag with sequential falling gravity animation */}
            <div>
              <FallingDropTag text={tag} showDash={true} />
            </div>

            {/* Character Swipe Animated Heading */}
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[50px] font-black tracking-tight leading-[1.12]">
                <CharSwipeLine
                  text={titleLine1}
                  textColor="#0F172A"
                  hoverColor="#1B459B"
                  baseDelay={0.05}
                />
                <br />
                <CharSwipeLine
                  text={titleHighlight}
                  textColor="#ED1C24"
                  hoverColor="#c9141b"
                  baseDelay={0.12}
                />
              </h2>
            </div>

            {/* Lead Descriptions */}
            <div className="space-y-4 max-w-2xl text-slate-600 text-sm sm:text-base leading-relaxed">
              <p className="font-normal">{paragraph1}</p>
              <p className="font-medium text-slate-800">{paragraph2}</p>
            </div>

            {/* CTA Button: Dark Navy Pill */}
            <div className="pt-2">
              <Link
                href={buttonLink}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#182333] hover:bg-[#ED1C24] text-white text-xs sm:text-sm font-black tracking-wider uppercase shadow-lg shadow-slate-900/15 hover:shadow-red-600/25 transition-all duration-300 transform hover:-translate-y-1 hover:scale-102 group active:scale-95"
              >
                <span>{buttonText}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ============================================================== */}
        {/* PART B: MIDDLE 4 CARDS (Built To Perform / Made To Last)       */}
        {/* ============================================================== */}
        <div className="space-y-10 sm:space-y-12">
          
          {/* Centered Heading with Falling Letters & Swipe */}
          <div className="text-center space-y-2">
            <div>
              <FallingDropTag
                text={capabilitiesTag}
                showDash={false}
                className="justify-center"
              />
            </div>
            <div className="pt-1">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug">
                <CharSwipeLine
                  text={capabilitiesTitle}
                  textColor="#0F172A"
                  hoverColor="#ED1C24"
                  baseDelay={0.06}
                />
              </h3>
            </div>
          </div>

          {/* 4 Elevated White Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {capabilitiesCards.map((card: any, idx: number) => {
              const isSelected = selectedCardIdx === idx;

              return (
                <motion.div
                  key={card.id || idx}
                  onClick={() => setSelectedCardIdx(isSelected ? null : idx)}
                  className={`bg-white rounded-2xl p-7 sm:p-8 border shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden cursor-pointer select-none ${
                    isSelected
                      ? "border-[#ED1C24] ring-2 ring-red-500/20 shadow-xl"
                      : "border-slate-200/90 hover:border-slate-300"
                  }`}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -6 }}
                >
                  {/* Subtle top light sheen on hover */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 transition-colors duration-300 ${
                      isSelected ? "bg-[#ED1C24]" : "bg-transparent group-hover:bg-[#ED1C24]"
                    }`}
                  />

                  <div className="space-y-5">
                    {/* Icon Container: Red background and pure white icon on hover or click */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                        isSelected
                          ? "bg-[#ED1C24] text-white border-transparent shadow-md shadow-red-500/30 scale-110"
                          : "bg-slate-100/90 border border-slate-200/80 text-slate-800 group-hover:bg-[#ED1C24] group-hover:text-white group-hover:border-[#ED1C24] group-hover:shadow-md group-hover:shadow-red-500/25"
                      }`}
                    >
                      <CapabilityIcon
                        iconName={card.icon || card.title}
                        className={`w-6 h-6 transition-colors duration-200 ${
                          isSelected ? "text-white" : "text-slate-800 group-hover:text-white"
                        }`}
                      />
                    </div>

                  {/* Title & Red Accent Dash */}
                  <div className="space-y-2">
                    <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                      <CharSwipeLine
                        text={card.title}
                        textColor="#0F172A"
                        hoverColor="#ED1C24"
                        baseDelay={0.04}
                        fontSizeClass="text-lg sm:text-xl font-black"
                      />
                    </h4>
                    <span className="block w-6 h-[2.5px] bg-[#ED1C24] transition-all duration-300 group-hover:w-14" />
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Footer Link */}
                <div className="pt-6">
                  {card.linkUrl && (card.linkUrl.endsWith(".pdf") || card.linkUrl.startsWith("/uploads/")) ? (
                    <a
                      href={card.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 group-hover:text-[#ED1C24] transition-colors duration-200"
                    >
                      <span>{card.linkText || "View Catalogs"}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  ) : (
                    <Link
                      href={card.linkUrl || "/catalog"}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 group-hover:text-[#ED1C24] transition-colors duration-200"
                    >
                      <span>{card.linkText || "View Catalogs"}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        </div>

        {/* ============================================================== */}
        {/* PART C: BOTTOM DARK BANNER (Let's Talk About Your Instrument)  */}
        {/* ============================================================== */}
        <div className="bg-[#182333] rounded-3xl p-8 sm:p-12 lg:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 right-10 w-64 h-64 bg-red-600/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-6 sm:space-y-8">
            
            {/* Heading with Character Swipe Wave */}
            <div className="space-y-1">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
                <CharSwipeLine
                  text={talkTitleLine1}
                  textColor="#FFFFFF"
                  hoverColor="#38BDF8"
                  baseDelay={0.04}
                />
                <br />
                <CharSwipeLine
                  text={talkTitleLine2}
                  textColor="#FFFFFF"
                  hoverColor="#ED1C24"
                  baseDelay={0.1}
                />
              </h3>
            </div>

            {/* "Heavy Qism Ki" Luminous Animated Paragraph */}
            <div className="max-w-2xl mx-auto">
              <LuminousHeavyParagraph
                text={talkParagraph}
                className="text-slate-300 text-sm sm:text-base sm:leading-relaxed"
              />
            </div>

            {/* Action Buttons: Red Pill + Dark Red Outline */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
              
              {/* Primary: Solid Red Pill Button */}
              <Link
                href={primaryBtnLink}
                className="inline-flex items-center gap-2.5 px-8 sm:px-10 py-4 rounded-full bg-[#ED1C24] hover:bg-[#d61820] text-white text-xs sm:text-sm font-black tracking-wider uppercase shadow-xl shadow-red-600/35 hover:shadow-red-600/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 group"
              >
                <Mail className="w-4 h-4 fill-white shrink-0" />
                <span>{primaryBtnText}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              {/* Secondary: Outline Button with Red Border */}
              <Link
                href={secondaryBtnLink}
                className="inline-flex items-center gap-2.5 px-8 sm:px-10 py-4 rounded-full border border-[#ED1C24] text-[#ED1C24] hover:bg-[#ED1C24] hover:text-white text-xs sm:text-sm font-black tracking-wider uppercase transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 group"
              >
                <Download className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5" />
                <span>{secondaryBtnText}</span>
              </Link>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

