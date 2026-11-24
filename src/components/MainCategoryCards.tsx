"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Layers, Sparkles, CheckCircle2 } from "lucide-react";

export interface CategoryInfo {
  id?: string;
  name: string;
  slug: string;
  subcategories?: string[];
  image?: string;
}

interface MainCategoryCardsProps {
  categories: CategoryInfo[];
  activeSlug?: string;
  onSelectCategory?: (slug: string) => void;
  // If true, clicking links to /products?category=... instead of local state
  isLinkMode?: boolean;
}

/**
 * Main Categories Cards with Continuous Running Light Animation Around Perimeter
 * "un ki sirrounding py round animation lga dyna chlti rhy chlrhy rhy card k arond ta k promint ho animation asi ho k jasy light chl rhi card k according"
 */
export default function MainCategoryCards({
  categories,
  activeSlug,
  onSelectCategory,
  isLinkMode = false,
}: MainCategoryCardsProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ED1C24] animate-pulse" />
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.16em] text-slate-800">
            Main Categories
          </h3>
        </div>
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Select category to view sub-categories
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {categories.map((cat, idx) => {
          const isActive = activeSlug === cat.slug;
          const subCount = cat.subcategories?.length || 0;
          const firstSub = cat.subcategories?.[0] || "all";
          const targetUrl = `/products?category=${encodeURIComponent(cat.slug)}&subcategory=${encodeURIComponent(firstSub)}`;

          const cardContent = (
            <div
              className={`relative p-[2.5px] rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl cursor-pointer select-none group h-full ${
                isActive ? "shadow-lg scale-[1.02]" : "shadow-sm hover:scale-[1.01]"
              }`}
            >
              {/* Continuous Running Light Beam Animation around Card Perimeter */}
              <div
                className={`absolute -inset-[150%] pointer-events-none transition-opacity duration-300 ${
                  isActive
                    ? "opacity-100 animate-[spin_3.5s_linear_infinite]"
                    : "opacity-60 group-hover:opacity-100 animate-[spin_5s_linear_infinite]"
                }`}
                style={{
                  background: isActive
                    ? "conic-gradient(from 0deg, transparent 0deg, transparent 260deg, #1B459B 300deg, #38BDF8 330deg, #ED1C24 360deg)"
                    : "conic-gradient(from 0deg, transparent 0deg, transparent 270deg, #CBD5E1 310deg, #1B459B 340deg, #ED1C24 360deg)",
                }}
              />

              {/* Inner Card Background & Content */}
              <div
                className={`relative h-full w-full rounded-[14px] p-5 flex flex-col justify-between transition-colors duration-200 ${
                  isActive
                    ? "bg-white border border-[#ED1C24]/20"
                    : "bg-white/95 group-hover:bg-white border border-slate-200/80"
                }`}
              >
                {/* Top Row: Icon/Category Badge & Subcategory Count */}
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? "bg-[#ED1C24] text-white shadow-md shadow-red-500/30 scale-105"
                        : "bg-slate-100 text-slate-700 group-hover:bg-[#1B459B] group-hover:text-white"
                    }`}
                  >
                    <Layers className="w-4 h-4 stroke-[2.2]" />
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
                      isActive
                        ? "bg-red-50 text-[#ED1C24] border-red-200 font-extrabold"
                        : "bg-slate-50 text-slate-600 border-slate-200 group-hover:border-slate-300"
                    }`}
                  >
                    {subCount} {subCount === 1 ? "sub-category" : "sub-categories"}
                  </span>
                </div>

                {/* Middle: Category Title */}
                <div className="py-4">
                  <h4
                    className={`text-base sm:text-lg font-black tracking-tight leading-snug transition-colors ${
                      isActive
                        ? "text-[#ED1C24]"
                        : "text-slate-900 group-hover:text-[#1B459B]"
                    }`}
                  >
                    {cat.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {subCount > 0
                      ? cat.subcategories?.slice(0, 3).join(", ") + "..."
                      : "Explore instruments"}
                  </p>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {isActive ? (
                      <span className="inline-flex items-center gap-1 text-xs font-black text-[#ED1C24]">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Selected</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors">
                        View Sub-categories
                      </span>
                    )}
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-1 ${
                      isActive
                        ? "bg-[#ED1C24] text-white"
                        : "bg-slate-100 text-slate-500 group-hover:bg-[#1B459B] group-hover:text-white"
                    }`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          );

          if (isLinkMode) {
            return (
              <Link key={cat.id || cat.slug || idx} href={targetUrl} className="block h-full">
                {cardContent}
              </Link>
            );
          }

          return (
            <div
              key={cat.id || cat.slug || idx}
              onClick={() => {
                if (onSelectCategory) {
                  onSelectCategory(cat.slug);
                }
              }}
              className="h-full"
            >
              {cardContent}
            </div>
          );
        })}
      </div>
    </div>
  );
}
