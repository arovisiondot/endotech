"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ChevronRight,
  Plus,
  Minus,
  FileText,
  Check,
  Eye,
  ShoppingBag,
  ZoomIn,
  X,
  Download,
} from "lucide-react";
import { Product, ProductVariant } from "@/types/database";
import { useInquiry } from "@/context/InquiryContext";
import { useContent } from "@/context/ContentContext";

interface ProductDetailClientProps {
  product: Product & {
    gallery?: string[];
    specs?: { label: string; value: string }[];
    sizes_table?: { article_number: string; pattern?: string; cup_size?: string; length?: string }[];
    size_options?: string[];
    material?: string;
  };
  variants: ProductVariant[];
  relatedProducts: any[];
}

/**
 * Character-by-Character falling gravity drop breadcrumb segment
 */
function FallingDropBreadcrumbSegment({
  text,
  baseDelay = 0,
  className = "",
  textColor = "#64748B",
  hoverColor = "#0F172A",
  onClick,
  isLink = false,
  href = "/",
}: {
  text: string;
  baseDelay?: number;
  className?: string;
  textColor?: string;
  hoverColor?: string;
  onClick?: () => void;
  isLink?: boolean;
  href?: string;
}) {
  const [hoverKey, setHoverKey] = useState(0);

  const words = text.split(" ");
  let globalCharIndex = 0;

  const content = (
    <span
      className={`inline-flex items-center flex-wrap cursor-pointer select-none transition-colors duration-200 ${className}`}
      onMouseEnter={() => setHoverKey((k) => k + 1)}
      onClick={onClick}
    >
      {words.map((word, wIdx) => {
        const wordChars = Array.from(word);
        const startIndex = globalCharIndex;
        globalCharIndex += wordChars.length + 1;

        return (
          <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.2em] last:mr-0">
            {wordChars.map((char, cIdx) => {
              const charIndex = startIndex + cIdx;
              const dropDelay = baseDelay + charIndex * 0.032;

              return (
                <motion.span
                  key={`${hoverKey}-${charIndex}`}
                  className="inline-block relative origin-top"
                  style={{ color: textColor }}
                  initial={{ opacity: 0, y: -35, rotate: -6 }}
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
                    y: -4,
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

  if (isLink && href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}

/**
 * Character-by-Character animated headline (Flying / Dropping Spring Animation)
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

export default function ProductDetailClient({
  product,
  variants,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addItem } = useInquiry();
  const { content } = useContent();
  const pageData = (content as any)?.productPage || {};

  // Banner details from admin content
  const bannerTitle1 = pageData.bannerTitleLine1 || "RELIABLE HEALTHCARE PRODUCTS.";
  const bannerHighlight = pageData.bannerTitleHighlight || "ADVANCED SOLUTIONS.";
  const bannerImage = pageData.bannerImage || "/images/global-standards/compliances-surgeon-hands.png";

  // Gallery images (other views)
  const allImages = React.useMemo(() => {
    const list: string[] = [];
    const mainImg = product.image_url || (product as any).image;
    if (mainImg) list.push(mainImg);
    if (product.gallery && Array.isArray(product.gallery)) {
      product.gallery.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    if (list.length === 0) list.push("/images/image 438.svg");
    return list;
  }, [product]);

  interface SizeOptionItem {
    id: string;
    label: string;
    code: string;
  }

  // Distinct size options for pills (SS 2 match: [ 2 mm ] [ 4 mm ] [ 6 mm ] or [ 11.5 cm ] [ 21 cm ])
  const availableSizes: SizeOptionItem[] = React.useMemo(() => {
    // 1. If explicit size_options are configured on the product, filter out empty and useless "Standard" if alternatives exist
    const sizeOpts = (product as any).size_options;
    if (sizeOpts && Array.isArray(sizeOpts) && sizeOpts.length > 0) {
      const distinct = Array.from(new Set(sizeOpts.map((s: any) => String(s).trim()))).filter(Boolean);
      const filtered = distinct.filter((s) => s.toLowerCase() !== "standard");
      const activeList = filtered.length > 0 ? filtered : distinct;
      if (activeList.length > 1 || (activeList.length === 1 && activeList[0].toLowerCase() !== "standard")) {
        return activeList.map((opt: string, idx: number) => {
          const matchedVariant = variants.find(
            (v) => (v.cup_size && v.cup_size.toLowerCase() === opt.toLowerCase()) ||
                   (v.length && v.length.toLowerCase() === opt.toLowerCase())
          );
          return {
            id: `size-${idx}`,
            label: opt,
            code: matchedVariant?.article_number || (idx === 0 ? product.article_code : `${product.article_code}-${idx + 1}`),
          };
        });
      }
    }

    // 2. Otherwise derive from variants / sizes_table, deduplicating labels and never repeating "Standard"
    if (variants && variants.length > 0) {
      // 2A. Cup sizes (e.g. 2 mm, 4 mm, 6 mm)
      const cupSizes = (Array.from(
        new Set(variants.map((v) => v.cup_size?.trim()).filter(Boolean))
      ) as string[]).filter((cs) => cs && cs.toLowerCase() !== "standard");

      if (cupSizes.length > 0) {
        return cupSizes.map((cs: string, idx: number) => {
          const v = variants.find((item) => item.cup_size?.trim() === cs);
          return {
            id: `cs-${idx}`,
            label: cs,
            code: v?.article_number || product.article_code,
          };
        });
      }

      // 2B. Lengths (e.g. 11.5 cm, 21 cm)
      const lengths = (Array.from(
        new Set(variants.map((v) => v.length?.trim()).filter(Boolean))
      ) as string[]).filter((len) => len && len.toLowerCase() !== "standard");

      if (lengths.length > 1) {
        return lengths.map((len: string, idx: number) => {
          const v = variants.find((item) => item.length?.trim() === len);
          return {
            id: `len-${idx}`,
            label: len,
            code: v?.article_number || product.article_code,
          };
        });
      }

      // 2C. Patterns / Styles (e.g. Fine Straight, Long Straight)
      const patterns = (Array.from(
        new Set(variants.map((v) => v.pattern?.trim()).filter(Boolean))
      ) as string[]).filter((p) => p && p.toLowerCase() !== "standard");

      if (patterns.length > 1) {
        return patterns.map((p: string, idx: number) => {
          const v = variants.find((item) => item.pattern?.trim() === p);
          return {
            id: `pat-${idx}`,
            label: p,
            code: v?.article_number || product.article_code,
          };
        });
      }
    }

    const singleLabel = product.cup_size && product.cup_size.toLowerCase() !== "standard"
      ? product.cup_size
      : (product.length && product.length.toLowerCase() !== "standard" ? product.length : "");
    if (singleLabel) {
      return [{ id: "size-0", label: singleLabel, code: product.article_code }];
    }
    return [];
  }, [product, variants]);

  const sizeSectionLabel = React.useMemo(() => {
    const isRongeur =
      (product.name + " " + (product.product_type || "")).toLowerCase().includes("rongeur") ||
      (product.name + " " + (product.product_type || "")).toLowerCase().includes("punch");
    const hasMmOrCup = availableSizes.some(
      (s) => s.label.toLowerCase().includes("mm") || s.label.toLowerCase().includes("cup")
    );
    if (isRongeur || (hasMmOrCup && !product.name.toLowerCase().includes("handle") && !product.name.toLowerCase().includes("scalpel"))) {
      return "Select cup size:";
    }
    const hasCm = availableSizes.some((s) => s.label.toLowerCase().includes("cm"));
    if (hasCm) {
      return "Select size / length:";
    }
    return "Select size:";
  }, [availableSizes, product]);

  const [activeImage, setActiveImage] = useState<string>(allImages[0] || "");
  const [selectedSize, setSelectedSize] = useState<string>(
    availableSizes[0]?.label || product.cup_size || "Standard"
  );
  const [selectedVariantCode, setSelectedVariantCode] = useState<string>(
    availableSizes[0]?.code || product.article_code
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"specs" | "sizes">("specs");
  const [addedNotice, setAddedNotice] = useState(false);
  const [showEnlargeModal, setShowEnlargeModal] = useState(false);

  // Unified deduplicated product specifications (SS 3 Single Appearance Match)
  const displaySpecs = React.useMemo(() => {
    const map = new Map<string, string>();

    // Baseline specs
    map.set("Product", product.name);
    map.set("Article Number", selectedVariantCode || product.article_code || "ETI-001");
    if (product.pattern) map.set("Pattern", product.pattern);

    if (selectedSize && selectedSize !== "Standard") {
      const isCup = selectedSize.toLowerCase().includes("mm") || selectedSize.toLowerCase().includes("cup");
      map.set(isCup ? "Cup Size" : "Size", selectedSize);
    } else if (product.cup_size && product.cup_size !== "Standard") {
      map.set("Cup Size", product.cup_size);
    }

    if (product.length) map.set("Length", product.length);
    if (product.material) map.set("Material", product.material);

    // Merge custom specs (overriding or adding new properties without duplicating)
    if (product.specs && Array.isArray(product.specs)) {
      product.specs.forEach((s) => {
        if (s && s.label && s.value) {
          const key = s.label.trim();
          if (key.toLowerCase() === "article number") {
            map.set(key, selectedVariantCode || s.value);
          } else {
            map.set(key, s.value);
          }
        }
      });
    }

    return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
  }, [product, selectedVariantCode, selectedSize]);

  const handleSizeSelect = (size: string, code?: string) => {
    setSelectedSize(size);
    if (code) {
      setSelectedVariantCode(code);
    }
  };

  const handleAddToInquiry = () => {
    addItem({
      product_id: product.id,
      product_name: product.name,
      article_code: selectedVariantCode || product.article_code,
      selected_size: selectedSize,
      quantity: quantity,
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen py-6 sm:py-8 lg:py-10 text-slate-800">
      <div className="w-full max-w-[1920px] 2xl:max-w-[2200px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-8 sm:space-y-10">
        
        {/* ================================================================= */}
        {/* 1. TOP HERO BANNER (Matches SS 4 with Background Banner & Anim)   */}
        {/* ================================================================= */}
        <motion.div
          initial={{ opacity: 0, x: -120, y: 35, scale: 0.96 }}
          whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-white rounded-3xl p-6 sm:p-10 lg:p-14 shadow-xl border border-slate-200/80 relative overflow-hidden min-h-[340px] sm:min-h-[380px] flex flex-col justify-center group"
        >
          {/* Background Banner Image spanning across the right side */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bannerImage}
              alt="Endo Tech Products Banner"
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
          <div className="relative z-10 max-w-2xl lg:max-w-3xl space-y-5 sm:space-y-6">
            
            {/* Breadcrumb: Home / General Surgery / Scalpel Handle / [Product Name] */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-[13px] font-medium flex-wrap">
              <FallingDropBreadcrumbSegment
                text="home"
                baseDelay={0.02}
                isLink={true}
                href="/"
                textColor="#64748B"
                hoverColor="#0F172A"
              />
              <span className="text-slate-400 font-normal px-0.5">/</span>
              <FallingDropBreadcrumbSegment
                text="General Surgery"
                baseDelay={0.16}
                isLink={true}
                href="/products"
                textColor="#475569"
                hoverColor="#0F172A"
              />
              <span className="text-slate-400 font-normal px-0.5">/</span>
              <FallingDropBreadcrumbSegment
                text={product.product_type || "Scalpel Handle"}
                baseDelay={0.32}
                isLink={true}
                href="/products"
                textColor="#475569"
                hoverColor="#0F172A"
              />
              <span className="text-slate-400 font-normal px-0.5">/</span>
              <FallingDropBreadcrumbSegment
                text={product.name}
                baseDelay={0.48}
                className="font-bold"
                textColor="#ED1C24"
                hoverColor="#c9141b"
              />
            </nav>

            {/* Banner Headline: RELIABLE HEALTHCARE PRODUCTS. ADVANCED SOLUTIONS. */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[46px] font-black tracking-tight leading-[1.14]">
              <CharSwipeLine
                text={bannerTitle1}
                textColor="#0F172A"
                hoverColor="#1B459B"
                baseDelay={0.04}
              />
              <br />
              <CharSwipeLine
                text={bannerHighlight}
                textColor="#ED1C24"
                hoverColor="#c9141b"
                baseDelay={0.1}
              />
            </h1>

          </div>
        </motion.div>

        {/* ================================================================= */}
        {/* 2. PRODUCT SHOWCASE (Exact Match to SS 4 & SS 5)                  */}
        {/* ================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 1.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 lg:p-12 shadow-sm space-y-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            
            {/* Left Column (5.5 Cols): Product Image Gallery with Zoom (SS 4) */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Main Big Image Box */}
              <div
                onClick={() => setShowEnlargeModal(true)}
                className="relative aspect-[4/3] sm:aspect-square rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-200/90 p-8 flex items-center justify-center cursor-zoom-in group overflow-hidden shadow-xs hover:shadow-md transition-shadow"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeImage || product.image_url}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Magnifying Glass Zoom Button in Top Right (SS 4 Match) */}
                <button
                  type="button"
                  aria-label="Enlarge Image"
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                {/* Click to Enlarge Floating Label */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 border border-slate-200 flex items-center gap-1.5 shadow-xs">
                  <Eye className="w-3.5 h-3.5 text-[#ED1C24]" />
                  <span>Click image to enlarge</span>
                </div>
              </div>

              {/* Thumbnails Row (Other Views / Gallery) */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => {
                  const isCurrent = (activeImage || product.image_url) === img;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={`w-20 h-20 rounded-xl bg-slate-50 p-2 flex items-center justify-center border-2 transition-all duration-200 shrink-0 ${
                        isCurrent
                          ? "border-[#1B459B] shadow-sm ring-2 ring-[#1B459B]/20"
                          : "border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`${product.name} View ${idx + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column (6.5 Cols): Product Details & Actions (SS 4 Match) */}
            <div className="lg:col-span-6 space-y-6">
              
              <div>
                <span className="text-xs font-black tracking-[0.16em] uppercase text-slate-700">
                  {product.product_type || "ENT INSTRUMENTS"}
                </span>

                {/* Big Product Name with Animated Characters */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mt-2 tracking-tight">
                  <CharSwipeLine
                    text={product.name}
                    textColor="#0F172A"
                    hoverColor="#ED1C24"
                    baseDelay={0.03}
                  />
                </h2>

                {/* Article Code & Specs Subtitle (SS 2 & 4 Match) */}
                <div className="mt-3 space-y-1">
                  <div className="font-bold text-sm text-slate-900">
                    Art. {selectedVariantCode || product.article_code}
                  </div>
                  <div className="text-xs sm:text-[13px] text-slate-500 font-medium">
                    {product.pattern || "Angled"} • {selectedSize || product.cup_size || "2 mm cup"} • {product.length || "28 cm"}
                  </div>
                </div>

                {/* Subtle Divider Line (SS 2 Match) */}
                <div className="border-b border-slate-200/90 pt-3" />
              </div>

              {/* Select Size / Cup Size Options (Pills matching SS 2) */}
              {availableSizes.length > 0 && !(availableSizes.length === 1 && availableSizes[0].label === "Standard") && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-slate-900 block">
                    {sizeSectionLabel}
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {availableSizes.map((opt) => {
                      const isSelected = selectedSize === opt.label;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSizeSelect(opt.label, opt.code)}
                          className={`px-5 py-2.5 rounded-lg text-xs font-bold border transition-all duration-200 cursor-pointer min-w-16 text-center ${
                            isSelected
                              ? "bg-[#0F172A] text-white border-[#0F172A] shadow-sm"
                              : "bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Length Indicator */}
              <div className="text-xs sm:text-[13px] text-slate-800">
                <span className="font-bold">Length: </span> {product.length || "28 cm"}
              </div>

              {/* Quantity Picker & Red "Add to Inquiry" Button (SS 4 Match) */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  
                  {/* Quantity Picker */}
                  <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-xs">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 text-slate-600 hover:bg-slate-100 transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-bold text-slate-900 min-w-8 text-center select-none">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 text-slate-600 hover:bg-slate-100 transition"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Red Add to Inquiry Button (Matching SS 4) */}
                  <button
                    type="button"
                    onClick={handleAddToInquiry}
                    className={`flex-1 sm:flex-initial px-8 py-3 rounded-lg text-xs sm:text-[13px] font-bold text-white transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                      addedNotice
                        ? "bg-emerald-600 hover:bg-emerald-700 scale-102"
                        : "bg-[#ED1C24] hover:bg-[#c9141b] active:scale-98"
                    }`}
                  >
                    {addedNotice ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Inquiry!</span>
                      </>
                    ) : (
                      <span>Add to Inquiry</span>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-slate-500">
                  Add your required quantity to request a quotation.
                </p>
              </div>

              {/* Download Catalogue Link (SS 4 Match) */}
              <div className="pt-2 flex items-center gap-4 text-xs">
                <Link
                  href="/catalog"
                  className="text-slate-800 hover:text-[#ED1C24] font-bold flex items-center gap-2 underline underline-offset-4 transition-colors"
                >
                  <Download className="w-4 h-4 text-slate-700" />
                  <span>Download Catalogue</span>
                </Link>
              </div>

            </div>
          </div>

          {/* =============================================================== */}
          {/* 3. TABS: SPECIFICATIONS & AVAILABLE SIZES (SS 4 & SS 5 Match)   */}
          {/* =============================================================== */}
          <div className="pt-6 border-t border-slate-200/90 space-y-6">
            
            {/* Tabs Header */}
            <div className="flex items-center gap-8 border-b border-slate-200 pb-3">
              <button
                type="button"
                onClick={() => setActiveTab("specs")}
                className={`text-sm sm:text-base font-bold pb-2 -mb-3 transition-colors border-b-2 cursor-pointer ${
                  activeTab === "specs"
                    ? "border-[#1B459B] text-[#1B459B]"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                Specifications
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sizes")}
                className={`text-sm sm:text-base font-bold pb-2 -mb-3 transition-colors border-b-2 cursor-pointer ${
                  activeTab === "sizes"
                    ? "border-[#1B459B] text-[#1B459B]"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                Available Sizes
              </button>
            </div>

            {/* TAB 1: Product Specifications Table (SS 5 Match) */}
            {activeTab === "specs" && (
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Product Specifications
                </h3>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs sm:text-[13px]">
                    <tbody className="divide-y divide-slate-200">
                      {displaySpecs.map((s, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                          <td className="py-3 px-5 font-bold text-slate-700 w-1/3 sm:w-1/4">
                            {s.label}
                          </td>
                          <td
                            className={`py-3 px-5 text-slate-900 ${
                              s.label.toLowerCase().includes("article")
                                ? "font-mono font-bold"
                                : "font-medium"
                            }`}
                          >
                            {s.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: Available Sizes Table (SS 5 Match) */}
            {activeTab === "sizes" && (
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Available Sizes
                </h3>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs sm:text-[13px]">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-100 text-slate-800 font-bold">
                        <th className="py-3.5 px-5">Article Number</th>
                        <th className="py-3.5 px-5">Pattern</th>
                        <th className="py-3.5 px-5">Cup Size</th>
                        <th className="py-3.5 px-5">Length</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {variants.map((v, idx) => {
                        const isSelected = selectedVariantCode === v.article_number;
                        return (
                          <tr
                            key={v.id || idx}
                            onClick={() => {
                              const label =
                                v.cup_size && v.cup_size.toLowerCase() !== "standard"
                                  ? v.cup_size
                                  : v.length && v.length.toLowerCase() !== "standard"
                                  ? v.length
                                  : v.pattern || v.article_number;
                              handleSizeSelect(label, v.article_number);
                            }}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-blue-50/80 font-semibold text-[#1B459B]"
                                : idx % 2 === 0
                                ? "bg-white hover:bg-slate-50"
                                : "bg-slate-50/60 hover:bg-slate-100/80"
                            }`}
                          >
                            <td className="py-3 px-5 font-mono font-bold text-slate-900">
                              {v.article_number}
                            </td>
                            <td className="py-3 px-5 text-slate-700">
                              {v.pattern || product.pattern || "Angled"}
                            </td>
                            <td className="py-3 px-5 text-slate-900 font-bold">
                              {v.cup_size || product.cup_size || "2 mm"}
                            </td>
                            <td className="py-3 px-5 text-slate-700">
                              {v.length || product.length || "28 cm"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

          {/* =============================================================== */}
          {/* 4. BLUE CALLOUT: "Need help choosing a size?" (SS 5 Match)      */}
          {/* =============================================================== */}
          <div className="bg-[#EBF3FB] rounded-2xl p-6 sm:p-7 border border-[#D5E6F6] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-base font-black text-slate-900 block tracking-tight">
                Need help choosing a size?
              </span>
              <span className="text-xs sm:text-[13px] text-slate-600">
                Contact our team with your article number and requirements.
              </span>
            </div>

            <Link
              href="/contact"
              className="px-6 py-2.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-xl text-xs sm:text-[13px] font-bold transition-all duration-200 shadow-sm shrink-0 whitespace-nowrap active:scale-95"
            >
              Contact Our Team
            </Link>
          </div>

        </motion.div>

      </div>

      {/* =================================================================== */}
      {/* 5. ENLARGED IMAGE MODAL                                             */}
      {/* =================================================================== */}
      {showEnlargeModal && (
        <div
          onClick={() => setShowEnlargeModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full relative shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{product.name}</h4>
                <span className="text-xs text-slate-500">Art. {selectedVariantCode || product.article_code}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowEnlargeModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-square sm:aspect-[4/3] rounded-2xl bg-slate-50 p-6 flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage || product.image_url}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
