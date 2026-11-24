"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export interface HeroData {
  enabled?: boolean;
  bannerMode?: string;
  tagline?: string;
  titleLine1?: string;
  titleHighlight?: string;
  titleLine3?: string;
  subtitleLine1?: string;
  subtitleLine2?: string;
  bannerImage?: string;
  videoUrl?: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  badges?: Array<{ icon?: string; title: string; desc: string }>;
}

interface InteractiveHeroCardProps {
  hero?: HeroData;
  bannerImage?: string;
  primaryBtnLink?: string;
  primaryBtnText?: string;
  isPreview?: boolean;
}

export default function InteractiveHeroCard({
  hero,
  bannerImage,
  primaryBtnLink = "/products",
  primaryBtnText = "View Collection",
  isPreview = false,
}: InteractiveHeroCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState("");
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const rawBannerImage =
    hero?.bannerImage || bannerImage || "/uploads/1795348699558-Rectangle_1090.png";
  const btnLink = hero?.primaryBtnLink || primaryBtnLink || "/products";
  const btnText = hero?.primaryBtnText || primaryBtnText || "View Collection";
  const videoUrl = hero?.videoUrl;

  // Smooth 3D tilt tracking cursor
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPreview || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = (x / rect.width) * 2 - 1;
    const yPercent = (y / rect.height) * 2 - 1;

    const rotateX = -yPercent * 3.8;
    const rotateY = xPercent * 3.8;

    setTransformStyle(
      `perspective(1600px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.006, 1.006, 1.006)`
    );

    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.16,
    });
  };

  const handleMouseLeave = () => {
    if (isPreview) return;
    setIsHovered(false);
    setTransformStyle("perspective(1600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleMouseEnter = () => {
    if (isPreview) return;
    setIsHovered(true);
  };

  return (
    <div className={`relative w-full ${isPreview ? "py-0" : "py-2"}`}>
      {/* Background Luxury Ambient Glow Orbs behind the card (front site only) */}
      {!isPreview && (
        <>
          <div
            className="absolute -top-12 -left-12 w-80 h-80 rounded-full bg-[#1B459B]/20 blur-3xl pointer-events-none animate-aura-drift"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-16 -right-12 w-96 h-96 rounded-full bg-[#EE1C25]/15 blur-3xl pointer-events-none animate-aura-drift-alt"
            aria-hidden="true"
          />
        </>
      )}

      {/* Main 3D Tilted Card Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isPreview ? undefined : transformStyle,
          transition: isHovered
            ? "transform 0.12s ease-out"
            : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform",
        }}
        className="relative w-full rounded-[16px] sm:rounded-[22px] lg:rounded-[28px] overflow-hidden bg-white shadow-2xl border border-slate-200/90 group select-none transition-shadow duration-500 hover:shadow-[0_25px_60px_-15px_rgba(27,69,155,0.22)]"
      >
        {/* Banner Graphic or Video */}
        {videoUrl ? (
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto block select-none pointer-events-none"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={rawBannerImage}
            alt="Endo Tech - Surgical Instruments Master Banner"
            className="w-full h-auto block select-none pointer-events-none"
          />
        )}

        {/* Dynamic Specular Mouse Glare Light Spot (front site only) */}
        {!isPreview && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 500px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, ${glarePos.opacity}), transparent 70%)`,
            }}
            aria-hidden="true"
          />
        )}

        {/* Periodic Specular Diagonal Metallic Light Sweep (front site only) */}
        {!isPreview && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="absolute -inset-full w-[250%] h-[250%] bg-gradient-to-r from-transparent via-white/35 to-transparent animate-shine-sweep pointer-events-none" />
          </div>
        )}

        {/* Interactive Clickable Hotspot over the red button */}
        <Link
          href={btnLink}
          className="absolute left-[4.5%] top-[63.5%] w-[13.5%] h-[8%] rounded-lg cursor-pointer group/btn focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label={btnText}
        >
          {/* Pulsing Sonar Ring Beacon over button */}
          <span className="absolute -inset-1 rounded-lg border-2 border-red-500/60 opacity-0 group-hover/btn:opacity-100 animate-ping transition-opacity duration-300" />

          {/* Button glossy sweep */}
          <span className="absolute inset-0 rounded-lg overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
          </span>

          {/* Floating Tooltip Indicator on Hover */}
          {!isPreview && (
            <span className="hidden sm:flex absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover/btn:opacity-100 transition-all duration-200 translate-y-1 group-hover/btn:translate-y-0 items-center gap-1.5 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-semibold rounded-full shadow-lg whitespace-nowrap pointer-events-none z-30">
              <Sparkles className="w-3 h-3 text-red-400" />
              <span>{btnText}</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}
