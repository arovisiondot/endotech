"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import {
  ShieldCheck,
  Award,
  Clock,
  ArrowRight,
  FileText,
  Play,
  CheckCircle2,
  Globe2,
  Users,
  Compass,
  Sparkles,
  PhoneCall,
  Download,
  Eye,
  Plus,
  X,
  Crosshair,
  Infinity,
} from "lucide-react";
import { useContent, ProductItem } from "@/context/ContentContext";
import { useInquiry } from "@/context/InquiryContext";
import InteractiveHeroCard from "@/components/InteractiveHeroCard";
import AboutSection from "@/components/AboutSection";
import ProductCategoriesSection from "@/components/ProductCategoriesSection";
import WhatWeDoSection from "@/components/WhatWeDoSection";
import VideoSection from "@/components/VideoSection";
import AdvancedSolutionsSection from "@/components/AdvancedSolutionsSection";
import GlobalStandardsSection from "@/components/GlobalStandardsSection";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";

export default function HomePage() {
  const { content, products } = useContent();
  const { addItem, setIsDrawerOpen } = useInquiry();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Filter products by selected category
  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const hero = content.hero;
  const about = content.aboutSection;
  const categoriesSec = (content as any)?.categoriesSection;
  const whatWeDoSec = (content as any)?.whatWeDoSection;
  const prodSec = content.productsSection;
  const precision = content.precisionSection;
  const video = content.videoSection;
  const certs = content.certificationsSection;
  const cta = content.ctaSection;
  const globalReach = content.globalReachSection;

  return (
    <div className="w-full overflow-x-clip bg-[#DADEE6]">
      {/* ============================================================== */}
      {/* 1. HERO SECTION (Natural Flow, Scrolls Cleanly With Page)      */}
      {/* ============================================================== */}
      {hero?.enabled && (
        <section className="relative z-0 w-full bg-[#DADEE6] pt-1 sm:pt-2 pb-8 sm:pb-10">
          <div className="w-full max-w-[1920px] 2xl:max-w-[2200px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
            <InteractiveHeroCard hero={hero} />
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* MAIN SITE CONTENT                                              */}
      {/* ============================================================== */}
      <div className="relative z-10 bg-white rounded-t-[28px] sm:rounded-t-[38px] lg:rounded-t-[48px] shadow-[0_-15px_40px_rgba(0,0,0,0.06)] border-t border-slate-200/80">
        {/* ============================================================== */}
        {/* 2. SECTION 2: "BUILT TO SUPPORT SURGERY" (Exact Figma & UI)    */}
        {/* ============================================================== */}
        {about?.enabled && (
          <AboutSection />
        )}

        {/* ============================================================== */}
        {/* 3. PRODUCT CATEGORIES: "Your Global Partner in Medical..."     */}
        {/* ============================================================== */}
        {categoriesSec?.enabled !== false && (
          <ProductCategoriesSection />
        )}

        {/* ============================================================== */}
        {/* 4. WHAT WE DO: "Reliable Surgical Solutions for Every Need"    */}
        {/* ============================================================== */}
        {whatWeDoSec?.enabled !== false && (
          <WhatWeDoSection />
        )}

        {/* ============================================================== */}
        {/* 5. FACILITY VIDEO SHOWCASE (SS 1 - Right Below What We Do)     */}
        {/* ============================================================== */}
        {video?.enabled !== false && (
          <VideoSection />
        )}

        {/* ============================================================== */}
        {/* 6. ADVANCED MEDICAL PRODUCT SOLUTIONS (SS 2 - Below Video)      */}
        {/* ============================================================== */}
        {((content as any)?.advancedSolutionsSection?.enabled !== false) && (
          <AdvancedSolutionsSection />
        )}

        {/* ============================================================== */}
        {/* 7. GLOBAL STANDARDS & EXPORTS (SS 2 - Below Advanced Solutions)*/}
        {/* ============================================================== */}
        {((content as any)?.globalStandardsSection?.enabled !== false) && (
          <GlobalStandardsSection />
        )}
      </div>

      {/* ============================================================== */}
      {/* PRODUCT QUICK VIEW MODAL                                       */}
      {/* ============================================================== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="aspect-square bg-slate-100 rounded-xl p-6 flex items-center justify-center border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-[#ED1C24] bg-red-50 px-2 py-0.5 rounded">
                    {selectedProduct.code}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    Category: {selectedProduct.category}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {selectedProduct.specs && selectedProduct.specs.length > 0 && (
                  <div className="space-y-1.5 border-t border-slate-200 pt-3">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Technical Specs:
                    </h5>
                    {selectedProduct.specs.map((s, i) => (
                      <div key={i} className="flex justify-between text-xs text-slate-600">
                        <span className="font-semibold text-slate-700">{s.label}:</span>
                        <span>{s.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      addItem({
                        product_name: selectedProduct.name,
                        article_code: selectedProduct.code,
                        quantity: 1,
                        image_url: selectedProduct.image,
                      });
                      setSelectedProduct(null);
                      setIsDrawerOpen(true);
                    }}
                    className="flex-1 py-3 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Inquiry</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIDEO MODAL                                                    */}
      {/* ============================================================== */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative max-w-4xl w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-[#ED1C24] text-white flex items-center justify-center transition"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              src={video?.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
              title="Endo Tech Factory Tour"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
