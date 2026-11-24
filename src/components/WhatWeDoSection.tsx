"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useContent } from "@/context/ContentContext";

interface WhatWeDoSectionProps {
  previewData?: any;
}

/**
 * Custom Vector Icons matching Figma SS 2
 */
function FactoryChimneyIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 40H42" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M10 40V20L22 28V20L34 28V14L40 18V40H10Z" stroke="#1E293B" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M16 14C16 11 18 9 21 9C24 9 25 11 25 14" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
      <path d="M22 7C22 4.5 24.5 3 27 3C29.5 3 31 4.5 31 7" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
      <rect x="16" y="32" width="4" height="4" fill="#1E293B" />
      <rect x="24" y="32" width="4" height="4" fill="#1E293B" />
      <rect x="32" y="32" width="4" height="4" fill="#1E293B" />
    </svg>
  );
}

function SurgicalRackIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="10" width="32" height="30" rx="4" stroke="#1E293B" strokeWidth="2.4" />
      <line x1="8" y1="28" x2="40" y2="28" stroke="#1E293B" strokeWidth="2.4" />
      {/* 3 instrument loops / tips */}
      <circle cx="16" cy="19" r="3" stroke="#1E293B" strokeWidth="2" />
      <line x1="16" y1="22" x2="16" y2="28" stroke="#1E293B" strokeWidth="2" />
      <circle cx="24" cy="19" r="3" stroke="#1E293B" strokeWidth="2" />
      <line x1="24" y1="22" x2="24" y2="28" stroke="#1E293B" strokeWidth="2" />
      <circle cx="32" cy="19" r="3" stroke="#1E293B" strokeWidth="2" />
      <line x1="32" y1="22" x2="32" y2="28" stroke="#1E293B" strokeWidth="2" />
      {/* 4 dots at bottom base */}
      <circle cx="14" cy="34" r="1.5" fill="#1E293B" />
      <circle cx="20" cy="34" r="1.5" fill="#1E293B" />
      <circle cx="28" cy="34" r="1.5" fill="#1E293B" />
      <circle cx="34" cy="34" r="1.5" fill="#1E293B" />
    </svg>
  );
}

function CleanroomDoorShieldIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Door frame */}
      <path d="M10 40V8C10 6.89543 10.8954 6 12 6H34C35.1046 6 36 6.89543 36 8V22" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="6" y1="40" x2="38" y2="40" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="20" y1="12" x2="20" y2="34" stroke="#1E293B" strokeWidth="2" strokeDasharray="3 3" />
      <circle cx="16" cy="24" r="1.5" fill="#1E293B" />
      {/* Shield badge on right */}
      <path d="M28 24L37 20L46 24V32C46 38 37 43 37 43C37 43 28 38 28 32V24Z" fill="white" stroke="#1E293B" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M33 31.5L36 34.5L42 28.5" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PackagingSterileIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cleanroom Door / Sterilization Chamber */}
      <path d="M10 40V8C10 6.89543 10.8954 6 12 6H34C35.1046 6 36 6.89543 36 8V22" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="6" y1="40" x2="38" y2="40" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="16" cy="24" r="1.5" fill="#1E293B" />
      {/* Sterile Shield Symbol */}
      <path d="M28 24L37 20L46 24V32C46 38 37 43 37 43C37 43 28 38 28 32V24Z" fill="white" stroke="#1E293B" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M33 31.5L36 34.5L42 28.5" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Character-by-Character falling/dropping gravity animation (same as "WHAT WE DO")
 * Characters drop from top one by one:
 * e.g. 'P' drops -> 'r' drops -> 'e' drops -> 'c' drops -> ...
 * Triggers on scroll into view (down/up) and on mouse hover!
 */
function FallingDropText({
  text,
  className = "",
  baseDelay = 0,
  staggerDelay = 0.04,
  externalHoverKey = 0,
}: {
  text: string;
  className?: string;
  baseDelay?: number;
  staggerDelay?: number;
  externalHoverKey?: number;
}) {
  const [internalHoverKey, setInternalHoverKey] = useState(0);

  const handleMouseEnter = () => {
    setInternalHoverKey((prev) => prev + 1);
  };

  const words = text.split(" ");
  let globalCharIndex = 0;
  const combinedKey = `${internalHoverKey}-${externalHoverKey}`;

  return (
    <span
      className={`inline-block cursor-pointer select-none ${className}`}
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
              const dropDelay = baseDelay + charIndex * staggerDelay;

              return (
                <motion.span
                  key={`${combinedKey}-${charIndex}`}
                  className="inline-block relative origin-top"
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
 * Tag / Badge with falling letters animation
 */
function FallingDropTag({ text = "WHAT WE DO" }: { text?: string }) {
  const [hoverKey, setHoverKey] = useState(0);

  const handleMouseEnter = () => {
    setHoverKey((prev) => prev + 1);
  };

  const characters = Array.from(text);

  return (
    <div
      className="inline-flex items-center gap-3 cursor-pointer select-none group"
      onMouseEnter={handleMouseEnter}
    >
      <span className="w-8 sm:w-10 h-[2px] bg-slate-800 inline-block shrink-0 transition-transform duration-300 group-hover:scale-x-125 origin-left" />
      <span className="text-slate-800 text-xs sm:text-[13px] font-black tracking-[0.18em] uppercase flex items-center">
        {characters.map((char, index) => {
          if (char === " ") {
            return (
              <span key={index} className="inline-block w-[0.35em]">
                &nbsp;
              </span>
            );
          }

          // Sequential falling delay (pehle W, phir H, phir A, one by one)
          const dropDelay = index * 0.055;

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
 * Words are grouped in whitespace-nowrap wrappers so words NEVER break in the middle!
 * Characters animate individually on hover (swipe wave) and on scroll (inView).
 */
function CharSwipeLine({
  text,
  textColor,
  hoverColor,
  baseDelay = 0,
}: {
  text: string;
  textColor: string;
  hoverColor?: string;
  baseDelay?: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [waveKey, setWaveKey] = useState(0);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setWaveKey((prev) => prev + 1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const words = text.split(" ");
  let globalCharIndex = 0;

  return (
    <span
      className="inline-block cursor-pointer select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {words.map((word, wIdx) => {
        const wordChars = Array.from(word);
        const startIndex = globalCharIndex;
        globalCharIndex += wordChars.length + 1;

        return (
          <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.25em] last:mr-0">
            {wordChars.map((char, cIdx) => {
              const charIndex = startIndex + cIdx;
              const waveDelay = isHovered ? charIndex * 0.02 : 0;
              const scrollDelay = baseDelay + charIndex * 0.016;

              return (
                <motion.span
                  key={`${waveKey}-${charIndex}`}
                  className="inline-block relative"
                  style={{ color: textColor }}
                  initial={{ opacity: 0, y: 16, filter: "blur(3px)" }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: {
                      type: "spring",
                      stiffness: 260,
                      damping: 18,
                      delay: scrollDelay,
                    },
                  }}
                  viewport={{ once: false, amount: 0.2 }}
                  animate={
                    isHovered
                      ? {
                          y: [0, -7, 0],
                          scale: [1, 1.14, 1],
                          color: hoverColor
                            ? [textColor, hoverColor, textColor]
                            : textColor,
                          transition: {
                            duration: 0.42,
                            delay: waveDelay,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        }
                      : { y: 0, scale: 1, color: textColor }
                  }
                  whileHover={{
                    y: -9,
                    scale: 1.22,
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

export default function WhatWeDoSection({ previewData }: WhatWeDoSectionProps) {
  const { content } = useContent();
  const section = previewData || (content as any)?.whatWeDoSection;
  const [cardHoverKey, setCardHoverKey] = useState(0);

  if (!section || section.enabled === false) {
    return null;
  }

  const {
    tag = "WHAT WE DO",
    titleLine1 = "Reliable Surgical Solutions",
    titleLine2Prefix = "for ",
    titleHighlight = "Every Need",
    subtitleLine1 = "Precision manufacturing. Global standards.",
    subtitleLine2 = "Your trusted partner in surgical excellence.",
    leftVisual = {
      image: "/images/what-we-do/machining-sparks.png",
      overlayText: "Precision at every stage.",
    },
    cards = [
      {
        id: "card-1",
        number: "01",
        icon: "factory",
        title: "OEM & Private Label",
        description:
          "Manufactured to your brand specifications, with confidentiality and compliance support.",
      },
      {
        id: "card-2",
        number: "02",
        icon: "rack",
        title: "Reusable & Single-Use Instruments",
        description:
          "A versatile range built around your surgical requirements.",
      },
      {
        id: "card-3",
        number: "03",
        icon: "door-shield",
        title: "Regulatory Compliance Expertise",
        description:
          "Support for product documentation and applicable regulatory requirements.",
      },
      {
        id: "card-4",
        number: "04",
        icon: "packaging",
        title: "Clean Room Packaging",
        description:
          "Controlled packaging processes designed to protect instrument integrity.",
      },
    ],
    buttonText = "Explore Our Range",
    buttonLink = "/products",
  } = section;

  const renderCardIcon = (iconName?: string, customImg?: string) => {
    if (customImg) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={customImg} alt="Icon" className="w-10 h-10 object-contain" />
      );
    }
    switch (iconName?.toLowerCase()) {
      case "factory":
        return <FactoryChimneyIcon className="w-10 h-10 shrink-0" />;
      case "rack":
      case "instruments":
        return <SurgicalRackIcon className="w-10 h-10 shrink-0" />;
      case "door-shield":
      case "compliance":
        return <CleanroomDoorShieldIcon className="w-10 h-10 shrink-0" />;
      case "packaging":
      case "cleanroom":
      default:
        return <PackagingSterileIcon className="w-10 h-10 shrink-0" />;
    }
  };

  return (
    <section className="w-full pt-12 sm:pt-16 pb-16 sm:pb-20 lg:pb-24 bg-white border-b border-slate-100 overflow-hidden relative">
      <div className="w-full max-w-[1920px] 2xl:max-w-[2200px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        
        {/* ============================================================== */}
        {/* SECTION HEADER: Tag + Dynamic Title + Subtitle on Right        */}
        {/* ============================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-12">
          
          {/* Left Column: Falling Letters Tag + Main Headline */}
          <div className="space-y-3 max-w-3xl">
            {/* Tag with Falling Character Animation */}
            <FallingDropTag text={tag} />

            {/* Main Heading: Proportionate font, 2-line layout, Character-by-Character wave */}
            <h2 className="text-[28px] sm:text-[34px] md:text-[40px] lg:text-[44px] xl:text-[46px] font-black tracking-tight leading-[1.14]">
              {/* Line 1: Black / Dark Slate Text */}
              <div className="block">
                <CharSwipeLine
                  text={titleLine1}
                  textColor="#0F172A"
                  hoverColor="#1B459B"
                  baseDelay={0}
                />
              </div>

              {/* Line 2: Dark prefix ("for ") + Muted Grey Highlight ("Every Need") */}
              <div className="block mt-0.5 sm:mt-1">
                <CharSwipeLine
                  text={titleLine2Prefix || "for "}
                  textColor="#0F172A"
                  hoverColor="#1B459B"
                  baseDelay={titleLine1.length * 0.012}
                />
                <CharSwipeLine
                  text={titleHighlight || "Every Need"}
                  textColor="#64748B"
                  hoverColor="#0F172A"
                  baseDelay={(titleLine1.length + (titleLine2Prefix?.length || 4)) * 0.012}
                />
              </div>
            </h2>
          </div>

          {/* Right Column: 2-Line Elegance Subheading (matching Figma SS 2) */}
          <div className="lg:text-right space-y-1 text-slate-500 font-medium text-xs sm:text-sm lg:text-[15px] leading-relaxed max-w-md shrink-0 lg:pb-1">
            <p>{subtitleLine1}</p>
            <p>{subtitleLine2}</p>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MAIN CONTENT GRID: Left Sparks Visual + Right 2x2 Feature Grid */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-stretch">
          
          {/* LEFT COLUMN (5 Cols): Machining Sparks Card with Overlay */}
          <motion.div
            onMouseEnter={() => setCardHoverKey((prev) => prev + 1)}
            className="lg:col-span-5 relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[460px] lg:min-h-full flex flex-col justify-end group shadow-sm border border-slate-200/70 cursor-pointer"
            initial={{ opacity: 0, x: -120, y: 40, scale: 0.94 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 1.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Background Machining Sparks Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={leftVisual.image || "/images/what-we-do/machining-sparks.png"}
              alt="Precision Surgical Instrument Machining"
              className="absolute inset-0 w-full h-full object-cover object-center filter contrast-[1.05] brightness-[0.96] group-hover:scale-104 transition-transform duration-700 ease-out"
              loading="lazy"
            />

            {/* Subtle bottom gradient to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

            {/* Bottom Overlay Text: Falling Letters Gravity Drop (Same as "WHAT WE DO") */}
            <div className="relative z-10 p-6 sm:p-8">
              <h3 className="text-white font-bold text-lg sm:text-xl md:text-2xl tracking-tight leading-snug drop-shadow-md">
                <FallingDropText
                  text={leftVisual.overlayText || "Precision at every stage."}
                  staggerDelay={0.038}
                  externalHoverKey={cardHoverKey}
                />
              </h3>
            </div>
          </motion.div>

          {/* RIGHT COLUMN (7 Cols): 2x2 Feature Cards Grid + Bottom Action Button */}
          <motion.div
            initial={{ opacity: 0, x: 120, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.06 }}
            className="lg:col-span-7 flex flex-col justify-between space-y-5"
          >
            {/* 2x2 Capability Cards with Premium Scroll Up & Down Animation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 flex-1">
              {cards.map((card: any, idx: number) => (
                <motion.div
                  key={card.id || idx}
                  className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 hover:border-[#1B459B]/50 transition-all duration-400 shadow-xs hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-between group cursor-pointer"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 20,
                    delay: idx * 0.07,
                  }}
                >
                  {/* Top Row: Number with dash underline + Icon */}
                  <div className="flex items-start justify-between mb-5">
                    <motion.div
                      className="space-y-1"
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.35, delay: idx * 0.07 + 0.05 }}
                    >
                      <span className="text-slate-800 font-bold text-sm tracking-wider">
                        {card.number || `0${idx + 1}`}
                      </span>
                      <div className="w-4 h-[1.5px] bg-[#ED1C24] transition-all duration-300 group-hover:w-8" />
                    </motion.div>

                    <motion.div
                      className="w-11 h-11 flex items-center justify-center text-slate-800 transition-all duration-300 group-hover:scale-115 group-hover:rotate-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.35, delay: idx * 0.07 + 0.1 }}
                    >
                      {renderCardIcon(card.icon, card.customIcon)}
                    </motion.div>
                  </div>

                  {/* Bottom: Title & Description with Scroll Up/Down Motion */}
                  <div className="space-y-2 mt-auto">
                    <h4 className="text-slate-900 font-black text-sm sm:text-[15px] leading-snug tracking-tight">
                      <CharSwipeLine
                        text={card.title || ""}
                        textColor="#0F172A"
                        hoverColor="#1B459B"
                        baseDelay={idx * 0.06}
                      />
                    </h4>
                    <motion.p
                      className="text-slate-500 text-xs sm:text-[12.5px] leading-relaxed font-normal"
                      initial={{ opacity: 0, y: 12, filter: "blur(2px)" }}
                      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{
                        duration: 0.45,
                        delay: idx * 0.07 + 0.14,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {card.description}
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Row on Right: Action Button "Explore Our Range →" */}
            <div className="flex justify-end pt-2">
              <Link
                href={buttonLink || "/products"}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs sm:text-[13px] font-bold text-white bg-[#555E68] hover:bg-slate-900 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <span>{buttonText || "Explore Our Range"}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}

