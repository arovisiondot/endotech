"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useContent } from "@/context/ContentContext";

interface ProductCategoriesSectionProps {
  previewData?: any;
}

/**
 * Exact Vector Icons Extracted 100% from Figma (public/images/Endo Tech.svg)
 * Sits bare on the clean white background with NO circular backdrop, exactly matching SS 1.
 */
function FigmaPremiumQualityIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="960 2125 68 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M963.412 2160.14C966.413 2176.24 976.072 2187.42 990.552 2194.11C993.693 2192.61 996.407 2191.03 999.293 2189.1C999.482 2189.02 1000.45 2189.04 1000.42 2189.31L1000.27 2190.47C997.022 2192.52 993.996 2194.31 990.544 2195.93C985.608 2193.63 981.197 2191.01 977.08 2187.48C969.365 2180.86 964.314 2172.13 962.174 2162.12C960.452 2154.17 960.493 2146.17 961.624 2138.09L990.528 2126.54L1019.43 2138.11C1020.02 2142.34 1020.24 2146.41 1020.23 2150.67C1020.04 2155.97 1019.35 2160.92 1017.91 2166.01C1017.72 2166.29 1016.97 2166.7 1016.71 2166.56C1016.45 2166.41 1016.34 2165.88 1016.35 2165.4C1018.89 2156.9 1019.06 2148.1 1017.96 2139.26L990.528 2128.3L963.1 2139.26C962.182 2146.24 962.133 2153.04 963.412 2160.15V2160.14Z" fill="#375289"/>
      <path d="M982.054 2183.25C984.867 2185.48 987.515 2187.11 990.5 2188.79C992.992 2187.41 995.116 2186.11 997.461 2184.46L998.421 2184.51C998.699 2184.53 998.65 2185.28 998.576 2185.68C995.961 2187.5 993.42 2189.6 990.5 2191.13C986.541 2189.04 983.332 2186.51 980.207 2183.18C979.799 2182.74 979.824 2182.04 980.453 2181.76C981.082 2181.47 981.654 2181.93 982.054 2183.25Z" fill="#375289"/>
      <path d="M994.503 2171.77C991.781 2171.88 989.403 2171.87 986.574 2171.81L986.525 2163.05L977.719 2162.96V2155.11L986.501 2155.06L986.574 2146.29C989.387 2146.2 991.748 2146.2 994.479 2146.31L994.503 2155.08L1003.36 2155.13V2162.98L994.552 2163.03L994.503 2171.77ZM991.808 2148.97C990.379 2148.96 989.848 2148.97 989.268 2148.97L989.219 2157.73H980.413V2160.33H989.243L989.268 2169.1C990.419 2169.1 990.876 2169.12 991.808 2169.09L991.832 2160.31L1000.64 2160.36V2157.76L991.832 2157.73L991.808 2148.97Z" fill="#375289"/>
      <path d="M1026.87 2181.61C1026.87 2188.96 1020.93 2194.92 1013.62 2194.92C1006.3 2194.92 1000.37 2188.96 1000.37 2181.61C1000.37 2174.26 1006.3 2168.29 1013.62 2168.29C1020.93 2168.29 1026.87 2174.26 1026.87 2181.61ZM1024.18 2181.61C1024.18 2175.76 1019.46 2171.01 1013.62 2171.01C1007.78 2171.01 1003.06 2175.76 1003.06 2181.61C1003.06 2187.46 1007.78 2192.2 1013.62 2192.2C1019.46 2192.2 1024.18 2187.46 1024.18 2181.61Z" fill="#375289"/>
      <path d="M1007.1 2183.11C1006.84 2182.88 1006.71 2182.23 1006.84 2181.98C1006.97 2181.72 1007.86 2181.57 1008.1 2181.78L1011.71 2185.08L1019.57 2176.49C1019.81 2176.23 1020.57 2176.14 1020.77 2176.33C1020.97 2176.51 1020.95 2177.34 1020.72 2177.61L1012.33 2186.78C1012.06 2187.08 1011.23 2187.16 1010.98 2186.91L1007.1 2183.11Z" fill="#375289"/>
    </svg>
  );
}

function FigmaPrecisionEngineeringIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="1257 2133 62 62" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1289.22 2192.49C1289.22 2193.12 1288.66 2193.71 1288.15 2193.74C1287.52 2193.78 1286.87 2193.24 1286.87 2192.57L1286.86 2188.3C1274.14 2187.65 1264 2177.5 1263.36 2164.79H1259.07C1258.4 2164.79 1257.86 2164.1 1257.92 2163.49C1257.98 2162.85 1258.61 2162.43 1259.3 2162.43H1263.36C1264 2149.68 1274.13 2139.57 1286.86 2138.94L1286.87 2134.61C1286.87 2134.09 1287.47 2133.52 1287.94 2133.48C1288.55 2133.44 1289.22 2133.97 1289.22 2134.62L1289.23 2138.93C1301.95 2139.58 1312.09 2149.67 1312.72 2162.43L1317.03 2162.43C1317.56 2162.43 1318.15 2163.03 1318.18 2163.49C1318.22 2164.12 1317.68 2164.78 1317.03 2164.79H1312.73C1312.09 2177.5 1301.95 2187.66 1289.24 2188.3V2192.49H1289.22ZM1286.87 2149.52V2141.28C1275.43 2141.94 1266.36 2150.97 1265.72 2162.43H1273.97C1274.61 2155.48 1279.94 2150.2 1286.87 2149.51V2149.52ZM1302.14 2162.44L1310.37 2162.43C1309.72 2150.97 1300.66 2141.93 1289.21 2141.28L1289.22 2149.53C1296.15 2150.18 1301.45 2155.49 1302.14 2162.44ZM1299.75 2164.82L1297.41 2164.78C1296.77 2164.77 1296.23 2164.13 1296.27 2163.48C1296.3 2163.03 1296.9 2162.44 1297.39 2162.43L1299.76 2162.41C1299.14 2156.8 1294.83 2152.51 1289.23 2151.9L1289.22 2154.22C1289.22 2154.87 1288.56 2155.43 1287.93 2155.38C1287.46 2155.35 1286.87 2154.74 1286.87 2154.24V2151.9C1281.26 2152.51 1276.95 2156.81 1276.33 2162.41L1278.67 2162.44C1279.32 2162.45 1279.87 2163.09 1279.82 2163.71C1279.79 2164.18 1279.19 2164.79 1278.7 2164.79H1276.34C1276.95 2170.38 1281.29 2174.7 1286.87 2175.34L1286.88 2172.97C1286.88 2172.34 1287.55 2171.79 1288.16 2171.84C1288.62 2171.87 1289.23 2172.47 1289.23 2172.94V2175.34C1294.81 2174.71 1299.14 2170.38 1299.76 2164.82H1299.75ZM1286.84 2177.69C1279.78 2176.97 1274.64 2171.59 1273.96 2164.79H1265.72C1266.37 2176.21 1275.44 2185.28 1286.88 2185.95L1286.85 2177.69H1286.84ZM1289.25 2185.96C1300.87 2185.19 1309.69 2176.1 1310.38 2164.78H1302.12C1301.46 2171.68 1296.15 2177.03 1289.21 2177.69L1289.25 2185.96Z" fill="#375289"/>
    </svg>
  );
}

function FigmaGlobalStandardsIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="1547 2133 67 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1610.27 2158.51C1612.03 2159.06 1613.1 2160.46 1613.12 2162.17C1613.14 2163.89 1611.97 2165.38 1610.27 2165.9C1611.03 2167.28 1611.02 2168.81 1610.16 2170.03C1609.39 2171.13 1608.1 2171.87 1606.52 2171.72C1606.82 2172.8 1606.86 2173.8 1606.18 2174.77C1605.72 2175.42 1604.82 2176.19 1603.74 2176.19L1590.13 2176.22C1585.68 2185.73 1575.25 2190.77 1565.09 2188.47C1555.15 2186.23 1547.8 2177.38 1547.79 2167.02L1547.78 2147.97C1547.78 2147.06 1548.42 2146.27 1549.35 2146.28C1555.56 2146.4 1560.54 2141.27 1560.14 2135.07C1560.07 2133.98 1560.75 2133.12 1561.86 2133.12H1578.14C1579.24 2133.12 1579.9 2134 1579.82 2135.07C1579.37 2141.09 1583.79 2146.26 1589.93 2146.58C1590.23 2145.86 1590.41 2145.05 1590.4 2144.24L1590.38 2141.58C1590.35 2139.05 1592.33 2136.98 1594.79 2136.95C1597.38 2136.91 1599.36 2138.98 1599.36 2141.6L1599.34 2152.68L1607.1 2152.7C1608.45 2152.7 1609.65 2153.58 1610.24 2154.52C1611.01 2155.76 1611.03 2157.11 1610.27 2158.52L1610.27 2158.51ZM1568.99 2147.11V2138.79L1565.62 2138.8C1565.31 2145.4 1560.18 2150.67 1553.53 2151.2L1553.59 2167.65C1553.83 2176.08 1560.65 2182.77 1568.97 2183.28L1568.99 2173.89L1564.62 2173.9C1563.16 2173.9 1561.95 2172.92 1561.96 2171.38L1561.98 2154.79C1561.98 2153.48 1563.27 2152.57 1564.45 2152.57H1569.11C1569.57 2151.54 1570.51 2150.66 1571.68 2150.66H1577.24C1578.5 2150.64 1579.49 2151.46 1579.93 2152.62C1580.68 2152.69 1581.71 2152.82 1582.35 2152.41L1588.65 2148.39C1581.96 2147.33 1577.48 2141.67 1577.91 2135.04H1562.07C1562.43 2142.18 1556.88 2148.11 1549.69 2148.18L1549.71 2167.17C1549.72 2176.43 1556.31 2184.33 1565.07 2186.5C1573.83 2188.67 1583.65 2184.53 1588 2176.22H1584.58C1582.71 2176.22 1581.01 2175.71 1579.49 2174.64C1578.93 2175.38 1578.16 2175.81 1577.25 2175.8L1570.86 2175.78V2184.26C1570.86 2184.78 1570.45 2185.2 1569.94 2185.2C1560.01 2185.21 1551.66 2177.27 1551.65 2167.33L1551.62 2150.29C1551.62 2149.71 1552.07 2149.31 1552.62 2149.31C1558.89 2149.28 1563.9 2144.1 1563.71 2137.87C1563.69 2137.38 1564.13 2136.88 1564.61 2136.88H1569.95C1570.46 2136.88 1570.87 2137.37 1570.87 2137.86V2147.17C1570.87 2147.76 1570.36 2148.13 1569.86 2148.1C1569.42 2148.08 1568.98 2147.7 1568.98 2147.1L1568.99 2147.11ZM1583.79 2174.28H1603.69C1604.43 2174.28 1604.89 2173.44 1604.83 2172.89C1604.78 2172.34 1604.25 2171.74 1603.62 2171.74H1601.88C1601.3 2171.74 1600.85 2171.4 1600.8 2170.85C1600.77 2170.36 1601.16 2169.85 1601.74 2169.85L1607.16 2169.8C1608.25 2169.79 1608.97 2168.68 1608.9 2167.76C1608.83 2166.85 1608.05 2166.02 1607.01 2166.02L1601.73 2166.01C1601.16 2166.01 1600.75 2165.46 1600.8 2164.96C1600.85 2164.57 1601.24 2164.1 1601.74 2164.1L1609.38 2164.09C1610.45 2164.09 1611.25 2163.06 1611.21 2162.16C1611.16 2161.1 1610.3 2160.3 1609.23 2160.3H1601.63C1601.12 2160.3 1600.74 2159.61 1600.8 2159.22C1600.87 2158.83 1601.28 2158.4 1601.75 2158.4L1607.21 2158.37C1608.25 2158.37 1608.94 2157.32 1608.9 2156.42C1608.85 2155.51 1608.08 2154.6 1607.04 2154.6L1599.09 2154.59C1598.21 2154.59 1597.43 2153.95 1597.43 2153.03L1597.41 2141.42C1597.41 2139.92 1596.23 2138.78 1594.81 2138.83C1593.38 2138.87 1592.32 2139.97 1592.32 2141.41V2144.36C1592.32 2147.19 1590.75 2149.41 1588.44 2150.86L1583.46 2153.97C1582.46 2154.59 1581.25 2154.64 1580.07 2154.58L1580.05 2166.38C1580.05 2166.88 1579.27 2167.22 1578.92 2167.13C1578.5 2167.03 1578.16 2166.63 1578.16 2166.1V2153.41C1578.16 2152.85 1577.57 2152.55 1577.11 2152.55H1571.93C1571.36 2152.55 1570.86 2152.89 1570.86 2153.56V2173.08C1570.86 2173.54 1571.19 2173.88 1571.62 2173.88H1577.25C1577.74 2173.88 1578.16 2173.41 1578.16 2172.95V2170.59C1578.16 2170.03 1578.68 2169.62 1579.18 2169.67C1579.59 2169.71 1580.05 2170.12 1580.05 2170.58V2172.78C1581.24 2173.37 1582.3 2174.27 1583.78 2174.27L1583.79 2174.28ZM1569 2154.47H1563.85V2172.01H1569V2154.47Z" fill="#375289"/>
    </svg>
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

export default function ProductCategoriesSection({
  previewData,
}: ProductCategoriesSectionProps) {
  const { content } = useContent();
  const section = previewData || content?.categoriesSection;

  if (!section || section.enabled === false) {
    return null;
  }

  const {
    tag = "OUR PRODUCT CATEGORIES",
    titleLine1 = "Your Global Partner In Medical",
    titleHighlight = "Instrument Manufacturing",
    description = "High-Quality Instruments Designed For Precision, Performance And Patient Safety. Explore Our Complete Range Of Surgical And Medical Solutions.",
    trustBadges = [],
    categories = [],
  } = section;

  // Helper to render trust badge icon bare without circular background, matching SS 1
  const renderFigmaBadgeIcon = (index: number, iconName?: string) => {
    if (index === 0 || iconName === "shield") {
      return <FigmaPremiumQualityIcon className="w-10 h-10 sm:w-11 sm:h-11 shrink-0" />;
    }
    if (index === 1 || iconName === "crosshair") {
      return <FigmaPrecisionEngineeringIcon className="w-10 h-10 sm:w-11 sm:h-11 shrink-0" />;
    }
    return <FigmaGlobalStandardsIcon className="w-10 h-10 sm:w-11 sm:h-11 shrink-0" />;
  };

  return (
    <section className="w-full pt-10 sm:pt-14 pb-16 sm:pb-20 lg:pb-24 bg-white border-b border-slate-100 overflow-hidden relative">
      <div className="w-full max-w-[1920px] 2xl:max-w-[2200px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        
        {/* ============================================================== */}
        {/* TOP HEADER: EXACT MATCH TO USER SS 1 (Figma Reference)         */}
        {/* ============================================================== */}
        <div className="flex flex-col 2xl:flex-row 2xl:items-start justify-between gap-8 xl:gap-10 mb-12 sm:mb-14">
          
          {/* Left Column: Tag + Proportionate Heading (1 line per sentence) + Description */}
          <div className="space-y-3.5 max-w-2xl 2xl:max-w-[700px] shrink-0">
            
            {/* Tag / Category Badge with Red Accent Line */}
            <div className="inline-flex items-center gap-3">
              <span className="w-12 sm:w-14 h-[2px] bg-[#ED1C24] inline-block shrink-0" />
              <span className="text-slate-900 text-xs sm:text-[13px] font-extrabold tracking-[0.16em] uppercase">
                {tag}
              </span>
            </div>

            {/* Main Heading: Proportionate Font Size, Single Line each on wide screens, Character-by-Character Wave */}
            <h2 className="text-[24px] sm:text-[30px] md:text-[34px] lg:text-[36px] xl:text-[38px] 2xl:text-[40px] font-black tracking-tight leading-[1.16]">
              {/* Line 1: Navy Text */}
              <div className="block 2xl:whitespace-nowrap">
                <CharSwipeLine
                  text={titleLine1}
                  textColor="#1B459B"
                  hoverColor="#002D80"
                  baseDelay={0}
                />
              </div>

              {/* Line 2: Vibrant Red Text */}
              <div className="block 2xl:whitespace-nowrap mt-0.5 sm:mt-1">
                <CharSwipeLine
                  text={titleHighlight}
                  textColor="#ED1C24"
                  hoverColor="#B80008"
                  baseDelay={titleLine1.length * 0.012}
                />
              </div>
            </h2>

            {/* Description Lead Paragraph (Max-W-XL, 3 Clean Lines matching SS 1) */}
            <p className="text-slate-600 text-xs sm:text-[13.5px] leading-relaxed max-w-xl font-normal pt-1">
              {description}
            </p>
          </div>

          {/* Right Column: 3 Trust Badges with Exact Vertical Dividers and Bare Icons (Matches SS 1) */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 pt-2 xl:pt-4 self-start shrink-0 max-w-full">
            {trustBadges.map((badge: any, idx: number) => (
              <React.Fragment key={badge.id || idx}>
                {/* Vertical Divider Line before each badge on md screens and up */}
                <div className="hidden md:block w-[1.5px] h-10 bg-slate-200/90 shrink-0" />

                <motion.div
                  className="flex items-center gap-2.5 sm:gap-3 group cursor-default shrink-0"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: 0.08 * idx }}
                >
                  {/* Bare Figma SVG Icon (NO background circle, matches SS 1) */}
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 shrink-0 transition-transform duration-300 group-hover:scale-108">
                    {renderFigmaBadgeIcon(idx, badge.icon)}
                  </div>

                  {/* Badge Text */}
                  <div className="space-y-0.5">
                    <div className="text-slate-900 font-extrabold text-xs sm:text-[13.5px] lg:text-[14.5px] leading-tight whitespace-nowrap">
                      {badge.title}
                    </div>
                    <div className="text-slate-400 text-[10px] sm:text-[11.5px] font-normal leading-tight whitespace-nowrap">
                      {badge.subtitle}
                    </div>
                  </div>
                </motion.div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* PRODUCT CATEGORIES CARDS GRID (3 Cards Row 1, 2 Cards Row 2)   */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat: any, index: number) => {
            const colIndex = index % 3;
            const initX = colIndex === 0 ? -70 : colIndex === 2 ? 70 : 0;
            const initY = 32;

            return (
              <motion.div
                key={cat.id || index}
                className="group bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5"
                initial={{ opacity: 0, x: initX, y: initY, scale: 0.96 }}
                whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.08 }}
              >
                {/* 1. Category Image Container with Light Grey Rounded Backdrop */}
                <div className="relative aspect-[410/370] w-full rounded-2xl sm:rounded-3xl bg-[#F4F5F8] overflow-hidden flex items-center justify-center p-4 sm:p-6 shadow-[inset_0_1px_3px_rgba(0,0,0,0.03)] border border-slate-100/80">
                  {/* Category Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image || "/images/categories/general-surgery.png"}
                    alt={cat.title || "Category"}
                    className="w-full h-full object-contain filter contrast-[1.03] group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                </div>

                {/* 2. Card Content & Meta below Image */}
                <div className="pt-5 pb-2 px-1 flex flex-col flex-1">
                  {/* Number & Category Title */}
                  <div className="flex items-baseline gap-2.5 overflow-hidden">
                    <span className="text-[#ED1C24] font-black text-xl sm:text-2xl tracking-tight leading-none inline-block transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-1">
                      {cat.number}
                    </span>
                    <h3 className="text-slate-900 font-black text-base sm:text-lg lg:text-xl tracking-tight uppercase leading-none transition-transform duration-300 group-hover:translate-x-1.5">
                      <CharSwipeLine
                        text={cat.title}
                        textColor="#0F172A"
                        hoverColor="#ED1C24"
                        baseDelay={0.02}
                      />
                    </h3>
                  </div>

                  {/* Subtitle / Description */}
                  <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed font-normal">
                    {cat.subtitle || "Precision Instruments For All Surgical Discipline"}
                  </p>

                  {/* Button Action: Strictly Outline by default for ALL cards, turns solid RED ONLY on mouse hover */}
                  <div className="mt-5">
                    <Link
                      href={cat.buttonLink || "/products"}
                      className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[#1B459B] text-[#1B459B] bg-transparent hover:bg-[#ED1C24] hover:border-[#ED1C24] hover:text-white hover:shadow-md hover:shadow-red-500/25 hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      <span>{cat.buttonText || "VIEW PRODUCT RANGE"}</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
