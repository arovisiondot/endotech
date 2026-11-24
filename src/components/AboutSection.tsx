"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Factory,
  Cog,
  Truck,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Award,
  CheckCircle2,
  Globe2,
  Building2,
  Sparkles,
} from "lucide-react";
import { useContent } from "@/context/ContentContext";

interface AboutSectionProps {
  previewData?: any;
}

/**
 * Falling Letters gravity drop animation for "ABOUT US"
 * Characters drop from above sequentially on scroll (down/up) and on mouse hover!
 */
function FallingDropTag({ text = "ABOUT US" }: { text?: string }) {
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
      <span className="w-8 sm:w-10 h-[2.5px] bg-[#ED1C24] rounded-full inline-block shrink-0 transition-transform duration-300 group-hover:scale-x-125 origin-left" />
      <span className="text-slate-800 text-xs sm:text-[13px] font-black tracking-[0.18em] uppercase flex items-center">
        {characters.map((char, index) => {
          if (char === " ") {
            return (
              <span key={index} className="inline-block w-[0.35em]">
                &nbsp;
              </span>
            );
          }

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
 * Character-by-Character animated headline for "Built To Support Surgery"
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

export default function AboutSection({ previewData }: AboutSectionProps) {
  const { content } = useContent();
  const about = previewData || content?.aboutSection;

  if (!about || about.enabled === false) {
    return null;
  }

  // Helper to render icon by name or uploaded image
  const renderFeatureIcon = (feat: any) => {
    const iconSrc =
      feat?.image ||
      feat?.customIcon ||
      (typeof feat?.icon === "string" &&
      (feat.icon.startsWith("/") || feat.icon.startsWith("http"))
        ? feat.icon
        : null);

    if (iconSrc) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={iconSrc}
          alt={feat?.title || "Feature Icon"}
          className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
        />
      );
    }

    switch (feat?.icon?.toLowerCase()) {
      case "factory":
      case "building":
        return <Factory className="w-7 h-7 sm:w-8 sm:h-8 text-slate-700" strokeWidth={1.8} />;
      case "cog":
      case "gear":
      case "automation":
        return <Cog className="w-7 h-7 sm:w-8 sm:h-8 text-[#ED1C24]" strokeWidth={1.8} />;
      case "truck":
      case "delivery":
        return <Truck className="w-7 h-7 sm:w-8 sm:h-8 text-[#ED1C24]" strokeWidth={1.8} />;
      case "shield":
        return <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-[#1B459B]" strokeWidth={1.8} />;
      case "award":
        return <Award className="w-7 h-7 sm:w-8 sm:h-8 text-[#1B459B]" strokeWidth={1.8} />;
      case "globe":
        return <Globe2 className="w-7 h-7 sm:w-8 sm:h-8 text-[#1B459B]" strokeWidth={1.8} />;
      default:
        return <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-[#ED1C24]" strokeWidth={1.8} />;
    }
  };

  const renderCertIcon = (cert: any) => {
    const iconSrc =
      cert?.image ||
      cert?.customIcon ||
      (typeof cert?.icon === "string" &&
      (cert.icon.startsWith("/") || cert.icon.startsWith("http"))
        ? cert.icon
        : null);

    if (iconSrc) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={iconSrc}
          alt={cert?.name || "Cert Icon"}
          className="w-5.5 h-5.5 sm:w-6 sm:h-6 object-contain"
        />
      );
    }

    switch (cert?.icon?.toLowerCase()) {
      case "shield":
      case "shieldcheck":
        return <ShieldCheck className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-[#1B459B]" strokeWidth={2} />;
      case "award":
      case "ribbon":
        return <Award className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-[#1B459B]" strokeWidth={2} />;
      case "check":
      case "ce":
        return <CheckCircle2 className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-[#1B459B]" strokeWidth={2} />;
      case "badge":
      case "fda":
        return <Building2 className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-[#1B459B]" strokeWidth={2} />;
      case "globe":
      case "cpra":
        return <Globe2 className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-[#1B459B]" strokeWidth={2} />;
      default:
        return <CheckCircle2 className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-[#1B459B]" strokeWidth={2} />;
    }
  };

  const features = about.features || [
    { id: "feat-1", icon: "factory", title: "Sustainable Manufacturing" },
    { id: "feat-2", icon: "cog", title: "Advanced Automation" },
    { id: "feat-3", icon: "truck", title: "Reliable Delivery Services" },
  ];

  const certifications = about.certifications || [
    { id: "cert-1", icon: "shield", name: "ISO 9001" },
    { id: "cert-2", icon: "award", name: "ISO 13485" },
    { id: "cert-3", icon: "check", name: "CE MARK" },
    { id: "cert-4", icon: "badge", name: "FDA" },
    { id: "cert-5", icon: "globe", name: "CPRA/EU-MDR" },
  ];

  return (
    <section className="w-full bg-white text-slate-900 pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-16 border-b border-slate-200 overflow-hidden relative">
      <div className="w-full max-w-[1920px] 2xl:max-w-[2200px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Main Grid: Left Details + Right Visual Graphic matching Screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: About Content & Story (6.5 cols)            */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, x: -120, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{
              duration: 1.5,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="lg:col-span-7 space-y-6"
          >
            
            {/* 1. Header Tag with Falling Character Animation (Same as WHAT WE DO) */}
            <FallingDropTag text={about.badge || "ABOUT US"} />

            {/* 2. Bold Two-Tone Title with Character-by-Character Wave on Hover & Scroll */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] font-black tracking-tight leading-[1.1] text-slate-900">
              <div className="block">
                <CharSwipeLine
                  text={about.titleLine1 || "Built To Support"}
                  textColor="#0F172A"
                  hoverColor="#1B459B"
                  baseDelay={0}
                />
              </div>
              <div className="block mt-1 sm:mt-1.5">
                <CharSwipeLine
                  text={about.titleHighlight || "Surgery"}
                  textColor="#ED1C24"
                  hoverColor="#B80008"
                  baseDelay={(about.titleLine1 || "Built To Support").length * 0.014}
                />
              </div>
            </h2>

            {/* 3. Lead Introduction Text */}
            <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-medium">
              {about.intro ||
                about.description ||
                "Established in 1990, Endo Tech Group of Indutries. is a trusted manufacturer and exporter of high-quality surgical instruments, offering a comprehensive portfolio of 3,000+ precision-engineered products."}
            </p>

            {/* 4. 3 Feature Highlights (Sustainable, Automation, Delivery) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
              {features.map((feat: any, idx: number) => (
                <div
                  key={feat.id || idx}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 hover:border-slate-300 transition-all hover:bg-slate-100/90 group"
                >
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white shadow-xs border border-slate-200/90 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-108 group-hover:shadow-md">
                    {renderFeatureIcon(feat)}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                    {feat.title}
                  </span>
                </div>
              ))}
            </div>

            {/* 5. Two Detailed Paragraphs */}
            <div className="space-y-3 text-slate-600 text-xs sm:text-sm leading-relaxed">
              <p>
                {about.paragraph1 ||
                  "With decades of expertise, we combine advanced technology, skilled craftsmanship, and strict quality control to deliver reliable surgical instruments. Our custom manufacturing capabilities provide tailored solutions to meet diverse medical requirements."}
              </p>
              <p>
                {about.paragraph2 ||
                  "Our commitment to quality is backed by ISO 9001, ISO 13485, CE Mark, FDA, and CPRA/EU-MDR registrations. We ensure precision, reliability, and customer satisfaction through every stage of manufacturing and global delivery."}
              </p>
            </div>

            {/* 6. Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-6">
              <Link
                href={about.primaryBtnLink || "/products"}
                className="px-7 py-3.5 border-2 border-[#1B459B] text-[#1B459B] bg-transparent hover:bg-[#ED1C24] hover:border-[#ED1C24] hover:text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-red-500/30 hover:scale-105 active:scale-95 flex items-center gap-2 group"
              >
                <span>{about.primaryBtnText || "EXPLORE OUR PRODUCTS"}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>

              <Link
                href={about.secondaryBtnLink || "/about"}
                className="text-slate-800 hover:text-[#ED1C24] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 py-2 px-1"
              >
                <span>{about.secondaryBtnText || "LEARN MORE"}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Cleanroom Master Visual (5.5 cols)          */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, x: 120, y: 40, scale: 0.94 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{
              duration: 1.6,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.08,
            }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-[24px] sm:rounded-[30px] overflow-hidden bg-slate-100 shadow-2xl border border-slate-200/90 group">
              
              {/* Main Cleanroom Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={about.image || "/images/about-cleanroom.png"}
                alt="Endo Tech Surgical Manufacturing Facility"
                className="w-full h-auto object-cover block transition-transform duration-700 group-hover:scale-102"
              />

              {/* Top-Right Badge: 35+ YEARS OF EXPERIENCE */}
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-white/95 backdrop-blur-md px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-slate-200 shadow-xl flex flex-col items-center justify-center text-center">
                <span className="text-2xl sm:text-3xl font-black text-[#ED1C24] leading-none">
                  {about.experienceBadge?.number || "35+"}
                </span>
                <span className="w-6 h-[2px] bg-[#ED1C24] my-1" />
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-700 uppercase tracking-wider leading-tight">
                  {about.experienceBadge?.label || "YEARS OF EXPERIENCE"}
                </span>
              </div>

              {/* Red Corner Diagonal Wedge (Matching Figma) */}
              <div
                className="absolute -bottom-1 -right-1 w-14 h-14 bg-[#ED1C24] pointer-events-none"
                style={{
                  clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
                }}
                aria-hidden="true"
              />
            </div>
          </motion.div>
        </div>

        {/* ============================================================= */}
        {/* SECTION FOOTER: Certifications Strip (ISO, CE, FDA, etc.)     */}
        {/* ============================================================= */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-slate-200/80">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 sm:gap-10 lg:gap-14 text-slate-700">
            {certifications.map((cert: any, idx: number) => (
              <div
                key={cert.id || idx}
                className="flex items-center gap-3 text-xs sm:text-[13.5px] font-extrabold text-slate-800 hover:text-[#1B459B] transition-colors group cursor-default"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200 group-hover:border-[#1B459B] group-hover:bg-blue-50/50 group-hover:scale-108 transition-all duration-300 shadow-xs">
                  {renderCertIcon(cert)}
                </div>
                <span className="tracking-wide uppercase whitespace-nowrap">{cert.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

