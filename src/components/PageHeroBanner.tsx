"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";

/**
 * Character-by-character falling drop gravity animation for breadcrumbs
 */
function BreadcrumbDropText({
  text,
  textColor = "#64748B",
  hoverColor = "#0F172A",
  isBold = false,
  baseDelay = 0.02,
}: {
  text: string;
  textColor?: string;
  hoverColor?: string;
  isBold?: boolean;
  baseDelay?: number;
}) {
  const [hoverKey, setHoverKey] = useState(0);
  const chars = Array.from(text);

  return (
    <span
      className={`inline-flex items-center select-none cursor-pointer ${isBold ? "font-bold" : ""}`}
      onMouseEnter={() => setHoverKey((k) => k + 1)}
    >
      {chars.map((char, cIdx) => (
        <motion.span
          key={`${hoverKey}-${cIdx}`}
          className="inline-block relative origin-top"
          style={{ color: textColor }}
          initial={{ opacity: 0, y: -30, rotate: -6 }}
          whileInView={{
            opacity: 1,
            y: 0,
            rotate: 0,
            transition: {
              type: "spring",
              stiffness: 380,
              damping: 14,
              mass: 0.8,
              delay: baseDelay + cIdx * 0.025,
            },
          }}
          viewport={{ once: false, amount: 0.2 }}
          whileHover={{
            y: -4,
            scale: 1.15,
            color: hoverColor,
            transition: { type: "spring", stiffness: 450, damping: 10 },
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

/**
 * Character-by-character headline swipe animation (same spring physics across all pages)
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
              const charDelay = baseDelay + charIndex * 0.025;

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
                      delay: charDelay,
                    },
                  }}
                  viewport={{ once: false, amount: 0.15 }}
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

export interface PageHeroBannerProps {
  badgeHeadline?: string;
  titleLine1: string;
  titleHighlight: string;
  bannerImage?: string;
  breadcrumbCurrent: string;
  breadcrumbParent?: { label: string; href: string };
  badgeText?: string;
}

export default function PageHeroBanner({
  badgeHeadline,
  titleLine1,
  titleHighlight,
  bannerImage = "/images/global-standards/compliances-surgeon-hands.png",
  breadcrumbCurrent,
  breadcrumbParent,
  badgeText = "• VIEW • ENDO TECH • VIEW • EXPLORE",
}: PageHeroBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -100, y: 35, scale: 0.97 }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-white rounded-3xl p-6 sm:p-10 lg:p-14 shadow-xl border border-slate-200/80 relative overflow-hidden min-h-[320px] sm:min-h-[360px] lg:min-h-[400px] flex flex-col justify-center group"
    >
      {/* Background Banner Image spanning across the right side */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bannerImage}
          alt={titleLine1}
          className="w-full h-full object-cover object-right sm:object-right transition-transform duration-700 ease-out group-hover:scale-103"
        />
        {/* Smooth Left Gradient Mask for 100% Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent sm:w-[72%] lg:w-[62%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-transparent to-transparent sm:hidden" />

        {/* Red Geometric Angle Accent in Bottom Right */}
        <div
          className="absolute bottom-0 right-0 w-28 sm:w-40 h-24 sm:h-32 bg-[#ED1C24] pointer-events-none transition-transform duration-500 group-hover:scale-110 origin-bottom-right"
          style={{ clipPath: "polygon(35% 0, 100% 0, 100% 100%, 0 100%)" }}
          aria-hidden="true"
        />
      </div>

      {/* Foreground Content (Left Column with Breadcrumb & Headline) */}
      <div className="relative z-10 max-w-2xl lg:max-w-3xl space-y-4 sm:space-y-5">
        {/* Breadcrumb with Character Falling Drop Animation */}
        <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-2 text-xs sm:text-[13px] font-medium">
          <Link href="/" className="hover:text-[#1B459B] transition-colors">
            <BreadcrumbDropText text="home" textColor="#64748B" hoverColor="#1B459B" />
          </Link>
          <span className="text-slate-300">/</span>
          {breadcrumbParent && (
            <>
              <Link href={breadcrumbParent.href} className="hover:text-[#1B459B] transition-colors">
                <BreadcrumbDropText text={breadcrumbParent.label} textColor="#475569" hoverColor="#1B459B" />
              </Link>
              <span className="text-slate-300">/</span>
            </>
          )}
          <span className="text-[#ED1C24] font-bold">
            <BreadcrumbDropText text={breadcrumbCurrent} textColor="#ED1C24" hoverColor="#c9141b" isBold />
          </span>
        </nav>

        {/* Optional Upper Badge Headline */}
        {badgeHeadline && (
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1B459B]">
            {badgeHeadline}
          </div>
        )}

        {/* Headline with Spring Character Animations */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-black tracking-tight leading-[1.15]">
          <CharSwipeLine
            text={titleLine1}
            textColor="#0F172A"
            hoverColor="#1B459B"
            baseDelay={0.03}
          />
          <br />
          <CharSwipeLine
            text={titleHighlight}
            textColor="#ED1C24"
            hoverColor="#c9141b"
            baseDelay={0.08}
          />
        </h1>
      </div>
    </motion.div>
  );
}

