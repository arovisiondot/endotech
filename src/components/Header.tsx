"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll } from "motion/react";
import { Search, Menu, X, ArrowRight, ShieldAlert } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import EndoTechLogo from "@/components/EndoTechLogo";

/**
 * Interactive Character-by-Character falling drop navigation link
 * - On scroll up / down: characters slightly and very slowly drop from above into place ("slighlty upr sy nichy giry boht slow")
 * - On mouse hover: characters cascade in vibrant red (#ED1C24) with bounce and scale!
 */
function AnimatedNavLink({
  label,
  href,
  isActive = false,
  scrollKey = 0,
  activeColor = "#1B459B",
  hoverColor = "#ED1C24",
  fontWeight = "font-bold",
}: {
  label: string;
  href: string;
  isActive?: boolean;
  scrollKey?: number;
  activeColor?: string;
  hoverColor?: string;
  fontWeight?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverKey, setHoverKey] = useState(0);

  const characters = Array.from(label);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setHoverKey((prev) => prev + 1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center pt-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={href}
        className={`text-[13px] xl:text-sm ${fontWeight} tracking-wider select-none px-1 relative inline-flex items-center cursor-pointer`}
      >
        <span className="inline-flex items-center">
          {characters.map((char, idx) => {
            if (char === " ") {
              return (
                <span key={idx} className="inline-block w-[0.3em]">
                  &nbsp;
                </span>
              );
            }

            // Sequential stagger delay for slow, graceful character-by-character cascade
            const charDelay = idx * 0.045;

            return (
              <motion.span
                key={`${scrollKey}-${hoverKey}-${idx}`}
                className="inline-block relative origin-top"
                initial={{ opacity: 0.15, y: -22, filter: "blur(1.5px)" }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  color: isHovered
                    ? hoverColor
                    : isActive
                    ? activeColor
                    : "#334155",
                  transition: {
                    type: "spring",
                    stiffness: 110, // Very slow, soft, graceful drop
                    damping: 15,
                    mass: 0.95,
                    delay: charDelay,
                  },
                }}
                whileHover={{
                  y: -4,
                  scale: 1.14,
                  color: hoverColor,
                  transition: { duration: 0.2 },
                }}
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      </Link>

      {/* Active Underline Pill */}
      {isActive ? (
        <span className="absolute -bottom-2.5 left-0 right-0 h-[3px] bg-[#1B459B] rounded-full shadow-sm" />
      ) : (
        <span
          className={`absolute -bottom-2.5 left-0 right-0 h-[2px] rounded-full transition-all duration-300 ${
            isHovered
              ? "bg-[#ED1C24] opacity-100 scale-x-100"
              : "bg-transparent opacity-0 scale-x-0"
          }`}
        />
      )}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { content } = useContent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Scroll detection to trigger character drop animation on scroll up / down
  const { scrollY } = useScroll();
  const [scrollKey, setScrollKey] = useState(0);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      const diff = Math.abs(latest - lastScrollY.current);
      if (diff > 18) {
        lastScrollY.current = latest;
        if (!scrollTimeout.current) {
          setScrollKey((prev) => prev + 1);
          scrollTimeout.current = setTimeout(() => {
            scrollTimeout.current = null;
          }, 550);
        }
      }
    });
  }, [scrollY]);

  const topBar = content?.topBar || {
    address: "Al Muslim Street #5 Islam Nagar Road Pacca Garah Sialkot Pakistan",
    emails: ["info@endotech.com.pk", "ghafar@endotech.com.pk"],
  };

  const leftNavLinks = [
    { label: "HOME", href: "/" },
    { label: "ABOUT US", href: "/about" },
    { label: "PRODUCTS", href: "/products" },
    { label: "DEPARTMENTS", href: "/departments" },
  ];

  const rightNavLinks = [
    { label: "Sustainability", href: "/sustainability" },
    { label: "Resources", href: "/catalog" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="w-full bg-[#DADEE6] text-slate-800 relative">
      {/* 1. Top Utility Row matching Screenshot 3 */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2200px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pt-3 pb-2 flex items-center justify-between text-xs sm:text-[13px] text-slate-700">
        {/* Left: Address with Red Pin Marker */}
        <div className="flex items-center gap-2 min-w-0 group">
          <div className="text-[#EE1C25] shrink-0 relative">
            <svg
              className="w-4 h-4 transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-beacon" />
          </div>
          <span className="font-normal text-slate-700 tracking-tight truncate max-w-[240px] sm:max-w-md lg:max-w-none group-hover:text-slate-900 transition-colors">
            {topBar.address}
          </span>
        </div>

        {/* Right: Email with Red Envelope */}
        <div className="hidden sm:flex items-center gap-2 text-slate-700 shrink-0">
          <div className="text-[#EE1C25] shrink-0">
            <svg
              className="w-4 h-4 transition-transform hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 font-normal">
            <a
              href="mailto:info@endotech.com.pk"
              className="hover:text-[#1B459B] transition-colors"
            >
              info@endotech.com.pk
            </a>
            <span className="text-slate-400">/</span>
            <a
              href="mailto:ghafar@endotech.com.pk"
              className="hover:text-[#1B459B] transition-colors"
            >
              ghafar@endotech.com.pk
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar with Center Logo matching Screenshot 3 */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2200px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left Navigation Links with character-by-character falling drop animation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-10 shrink-0">
            {leftNavLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <AnimatedNavLink
                  key={link.label}
                  label={link.label}
                  href={link.href}
                  isActive={isActive}
                  scrollKey={scrollKey}
                  activeColor="#1B459B"
                  hoverColor="#ED1C24"
                  fontWeight="font-bold"
                />
              );
            })}
          </nav>

          {/* Center Official Logo: Layer 3.svg / logo.png between DEPARMENT and Sustainability */}
          <div className="flex-1 lg:flex-none flex justify-center items-center px-4 sm:px-8 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center justify-center group py-1 relative"
              aria-label="Endo Tech Home"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt="Endo Tech Group of Industries"
                width={340}
                height={64}
                className="h-12 sm:h-14 lg:h-16 xl:h-[68px] w-auto object-contain block transition-all duration-300 group-hover:scale-105 group-hover:brightness-105"
                style={{ height: "62px", width: "auto", minWidth: "180px", maxWidth: "340px" }}
              />
            </Link>
          </div>

          {/* Right Navigation Links & Search matching Screenshot 3 */}
          <div className="flex items-center space-x-5 xl:space-x-8 shrink-0">
            <nav className="hidden lg:flex items-center space-x-5 xl:space-x-8">
              {rightNavLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <AnimatedNavLink
                    key={link.label}
                    label={link.label}
                    href={link.href}
                    isActive={isActive}
                    scrollKey={scrollKey}
                    activeColor="#1B459B"
                    hoverColor="#ED1C24"
                    fontWeight="font-semibold"
                  />
                );
              })}
            </nav>

            {/* Circular Search Icon matching Screenshot 3 */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 border border-slate-400 shadow-md animate-in fade-in zoom-in-95 duration-200">
                  <Search className="w-4 h-4 text-slate-600 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchQuery.trim()) {
                        window.location.href = `/products?search=${encodeURIComponent(
                          searchQuery.trim()
                        )}`;
                      }
                    }}
                    autoFocus
                    className="bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-28 sm:w-40"
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="text-slate-400 hover:text-slate-600 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-9 h-9 rounded-full border border-slate-600/70 hover:border-[#1B459B] text-slate-700 hover:text-[#1B459B] flex items-center justify-center transition-all duration-300 hover:scale-108 hover:ring-4 hover:ring-[#1B459B]/15 hover:bg-white/60"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Menu Button for phones/tablets */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-lg bg-white/70 border border-slate-400 text-slate-800 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-300 p-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3">
            {[...leftNavLinks, ...rightNavLinks].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold text-slate-800 hover:text-[#EE1C25] py-2 px-3 rounded-lg hover:bg-slate-100 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 opacity-40" />
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-slate-200">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 bg-[#1B459B] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-red-300" />
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
