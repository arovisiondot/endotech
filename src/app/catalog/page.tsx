"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { FileText, Download, CheckCircle2, ArrowRight, BookOpen, Layers, Eye, X, ExternalLink } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import PageHeroBanner from "@/components/PageHeroBanner";

export default function CatalogPage() {
  const { content } = useContent();
  const resData = (content as any)?.resourcesPage || {};

  const bannerHeadline = resData.bannerHeadline || "TECHNICAL DOCUMENTATION & LITERATURE";
  const bannerTitle1 = resData.bannerTitleLine1 || "OFFICIAL PRODUCT CATALOGUES.";
  const bannerHighlight = resData.bannerTitleHighlight || "DOWNLOAD SPECIFICATIONS.";
  const bannerImage = resData.bannerImage || "/images/global-standards/compliances-surgeon-hands.png";
  const subtitle = resData.subtitle || "Access our official high-resolution PDF catalogues featuring over 10,000 surgical, dental, ENT, and orthopedic instruments with full technical dimensions and article codes.";

  const catalogs = resData.catalogs || [
    {
      id: "cat-1",
      title: "General Surgery Complete Catalogue",
      category_name: "General Surgery",
      description: "Comprehensive guide to scalpels, forceps, scissors, retractors, needle holders, and general surgical instruments.",
      file_url: "/catalogs/general-surgery.pdf",
      file_size: "18.4 MB",
      downloads_count: 3420,
    },
    {
      id: "cat-2",
      title: "Dental & Oral Surgery Catalogue",
      category_name: "Dental Instruments",
      description: "Extracting forceps, dental elevators, scaling instruments, filling tools, and orthodontic pliers.",
      file_url: "/catalogs/dental-instruments.pdf",
      file_size: "14.2 MB",
      downloads_count: 2180,
    },
    {
      id: "cat-3",
      title: "ENT & Laryngeal Instruments Catalogue",
      category_name: "ENT Instruments",
      description: "Micro-laryngeal cup forceps, ear curettes, nasal speculums, and otology instruments.",
      file_url: "/catalogs/ent-instruments.pdf",
      file_size: "11.6 MB",
      downloads_count: 1890,
    },
    {
      id: "cat-4",
      title: "Orthopedics & Spine Catalogue",
      category_name: "Orthopedic Instruments",
      description: "Kerrison rongeurs, bone punches, bone holding forceps, chisels, mallets, and plate benders.",
      file_url: "/catalogs/orthopedics.pdf",
      file_size: "22.1 MB",
      downloads_count: 2740,
    },
  ];

  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [viewPdfUrl, setViewPdfUrl] = useState<string | null>(null);
  const [viewPdfTitle, setViewPdfTitle] = useState<string>("");

  const handleDownload = (title: string) => {
    setDownloadSuccess(title);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handleViewPdf = (url: string, title: string) => {
    if (url) {
      setViewPdfUrl(url);
      setViewPdfTitle(title);
    } else {
      alert("PDF document is being prepared. Please check back shortly.");
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen py-6 sm:py-8 lg:py-10 text-slate-800">
      <div className="w-full max-w-[1920px] 2xl:max-w-[2200px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-8 sm:space-y-12">
        {/* 1. HERO BANNER WITH CHARACTER ANIMATIONS & ROTATING BADGE */}
        <PageHeroBanner
          badgeHeadline={bannerHeadline}
          titleLine1={bannerTitle1}
          titleHighlight={bannerHighlight}
          bannerImage={bannerImage}
          breadcrumbCurrent="Resources & Catalogues"
        />

        {/* 2. CATALOGUES DIRECTORY SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm border border-slate-200/80 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-1 max-w-2xl">
              <span className="text-xs font-black text-[#ED1C24] uppercase tracking-wider block">
                DOWNLOAD DIGITAL EDITIONS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Official Technical Catalogues ({catalogs.length})
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {subtitle}
              </p>
            </div>

            <Link
              href="/contact"
              className="px-5 py-2.5 bg-[#1B459B] hover:bg-[#13326f] text-white rounded-xl text-xs font-bold transition self-start md:self-auto shrink-0 shadow-sm"
            >
              Request Printed Catalogues
            </Link>
          </div>

          {downloadSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center justify-between animate-fade-in shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>PDF Download initiated: <strong>{downloadSuccess}</strong></span>
              </div>
              <span className="text-[11px] text-emerald-600">Free Download</span>
            </div>
          )}

          {/* Catalogues Cards Grid with Corner Slide Animation & Red Corner Accent */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {catalogs.map((cat: any, idx: number) => {
              const initX = idx % 2 === 0 ? -50 : 50;

              return (
                <motion.div
                  key={cat.id || idx}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-[#1B459B]/40 hover:-translate-y-1.5 relative"
                  initial={{ opacity: 0, x: initX, y: 30, scale: 0.96 }}
                  whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1], delay: idx * 0.08 }}
                >
                  {/* Red Corner Diagonal Wedge Accent */}
                  <div
                    className="absolute bottom-0 right-0 w-8 h-8 bg-[#ED1C24] pointer-events-none transition-transform duration-500 group-hover:scale-125 origin-bottom-right"
                    style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
                    aria-hidden="true"
                  />

                  <div>
                    {/* Card Cover Art (Clickable to View PDF) */}
                    <div
                      onClick={() => handleViewPdf(cat.file_url, cat.title)}
                      className="aspect-[4/3] bg-gradient-to-tr from-slate-900 via-slate-800 to-[#1B459B] p-5 flex flex-col justify-between text-white relative overflow-hidden cursor-pointer group/art"
                      title="Click to View / Read Catalogue Online"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold bg-[#ED1C24] px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {cat.category_name || "Catalogue"}
                        </span>
                        <span className="font-mono text-slate-300">{cat.file_size || "PDF"}</span>
                      </div>

                      <div className="my-auto text-center space-y-1.5 py-2">
                        <FileText className="w-10 h-10 text-red-400 mx-auto stroke-1 transition-transform group-hover/art:scale-110" />
                        <div className="text-sm font-black tracking-tight line-clamp-2 px-1 text-white">
                          {cat.title}
                        </div>
                      </div>

                      <div className="text-[9px] text-slate-300 flex items-center justify-between border-t border-slate-700/60 pt-1.5 font-mono">
                        <span>Endo Tech • 2026</span>
                        <span className="flex items-center gap-1 text-emerald-400 font-bold group-hover/art:underline">
                          <Eye className="w-3 h-3" />
                          <span>View PDF</span>
                        </span>
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="p-5 space-y-2">
                      <h3
                        onClick={() => handleViewPdf(cat.file_url, cat.title)}
                        className="font-black text-sm text-slate-900 group-hover:text-[#1B459B] transition-colors line-clamp-1 cursor-pointer"
                        title="Click to view catalogue"
                      >
                        {cat.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 text-xs mt-3 relative z-10">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {cat.downloads_count ? `${cat.downloads_count.toLocaleString()} dl` : "Latest"}
                    </span>

                    <div className="flex items-center gap-2">
                      {/* 1. View / Preview Catalogue Button */}
                      <button
                        type="button"
                        onClick={() => handleViewPdf(cat.file_url, cat.title)}
                        className="px-3 py-2 bg-slate-100 hover:bg-[#1B459B] text-slate-700 hover:text-white rounded-lg font-bold text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer border border-slate-200 hover:border-[#1B459B]"
                        title="View / Read Catalogue Online"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      {/* 2. Download PDF Button */}
                      <a
                        href={cat.file_url || "#"}
                        download
                        onClick={() => handleDownload(cat.title)}
                        className="px-3.5 py-2 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg font-bold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Full Screen Interactive PDF Preview Modal */}
          {viewPdfUrl && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
                {/* Modal Header */}
                <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2.5 min-w-0 pr-4">
                    <FileText className="w-5 h-5 text-[#ED1C24] shrink-0" />
                    <h3 className="font-bold text-sm truncate">{viewPdfTitle || "Catalogue Viewer"}</h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={viewPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#1B459B] hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Open in New Tab</span>
                    </a>
                    <a
                      href={viewPdfUrl}
                      download
                      onClick={() => handleDownload(viewPdfTitle)}
                      className="px-3 py-1.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setViewPdfUrl(null)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                      title="Close Viewer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Modal PDF Iframe Embed */}
                <div className="flex-1 w-full bg-slate-100 relative">
                  <iframe
                    src={viewPdfUrl}
                    className="w-full h-full border-0"
                    title={viewPdfTitle || "Catalogue PDF"}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bottom Banner */}
          <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-base font-black text-slate-900">
                Need a Custom OEM Instrument or Specialized Catalogue?
              </h4>
              <p className="text-xs text-slate-500">
                We manufacture bespoke surgical tools conforming to ASTM &amp; ISO standards for distributor private labels.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-6 py-2.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm whitespace-nowrap shrink-0"
            >
              Contact OEM Department
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
