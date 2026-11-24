"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck, Award, Users, Globe2, Sparkles } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import PageHeroBanner from "@/components/PageHeroBanner";
import AnimatedCounter from "@/components/AnimatedCounter";

export default function AboutPage() {
  const { content } = useContent();
  const aboutData = (content as any)?.aboutPage || {};

  const bannerHeadline = aboutData.bannerHeadline || "OVER 35 YEARS OF MANUFACTURING EXCELLENCE";
  const bannerTitle1 = aboutData.bannerTitleLine1 || "CARE WITH TRUST IN SURGERY.";
  const bannerHighlight = aboutData.bannerTitleHighlight || "EVERY INSTRUMENT, EVERY CUT.";
  const bannerImage = aboutData.bannerImage || "/images/global-standards/compliances-surgeon-hands.png";

  const missionSubtitle = aboutData.missionSubtitle || "OUR MISSION & GLOBAL HERITAGE";
  const missionTitle = aboutData.missionTitle || "Care with Trust... Dedicated to Surgical Precision.";
  const missionText1 = aboutData.missionText1 || "Founded in Sialkot, Pakistan – the world's historic hub for surgical instrument manufacturing – Endo Tech Group of Industries has grown into an international powerhouse supplying hospital networks, healthcare authorities, and premium distributor brands across 65+ nations.";
  const missionText2 = aboutData.missionText2 || "We operate under comprehensive Quality Management Systems conforming to ISO 9001:2015, ISO 13485:2016, European CE Medical Device Regulations (MDR), and US FDA Good Manufacturing Practices (cGMP).";

  const stats = aboutData.stats || [
    { value: 250, suffix: "+", label: "Skilled Toolmakers", description: "Master metallurgical craftsmen" },
    { value: 10000, suffix: "+", label: "Instruments Portfolio", description: "From standard scalpel to micro-neuro" },
    { value: 65, suffix: "+", label: "Export Destinations", description: "Supplying premier hospitals worldwide" },
    { value: 35, suffix: "+", label: "Years Experience", description: "Continuous surgical innovation" },
  ];

  const accreditations = aboutData.accreditations || [
    {
      title: "ISO 13485:2016 Certified",
      desc: "Medical Devices Quality Management System certification for international export.",
    },
    {
      title: "CE Marking (EU MDR)",
      desc: "Class I and Class IIa surgical conformity marking for the European Union.",
    },
    {
      title: "US FDA Registered (cGMP)",
      desc: "Listed medical device establishment compliance with US FDA regulations.",
    },
    {
      title: "Sialkot Chamber of Commerce",
      desc: "Member in good standing with the Surgical Instruments Manufacturers Association of Pakistan (SIMAP).",
    },
  ];

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen py-6 sm:py-8 lg:py-10 text-slate-800">
      <div className="w-full max-w-[1920px] 2xl:max-w-[2200px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-8 sm:space-y-12">
        {/* 1. HERO BANNER WITH CHARACTER ANIMATIONS & ROTATING BADGE */}
        <PageHeroBanner
          badgeHeadline={bannerHeadline}
          titleLine1={bannerTitle1}
          titleHighlight={bannerHighlight}
          bannerImage={bannerImage}
          breadcrumbCurrent="About Us"
        />

        {/* 2. MISSION & VALUES SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-14 shadow-sm border border-slate-200/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-black text-[#ED1C24] uppercase tracking-widest block">
                  {missionSubtitle}
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {missionTitle}
                </h2>
                <div className="w-12 h-1 bg-[#ED1C24] rounded-full" />
              </div>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {missionText1}
              </p>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {missionText2}
              </p>

              {/* Dynamic Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                {stats.map((st: any, sIdx: number) => (
                  <div key={sIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#1B459B]/40 transition">
                    <div className="text-2xl sm:text-3xl font-black text-[#1B459B]">
                      {typeof st.value === "number" ? (
                        <AnimatedCounter value={`${st.value}${st.suffix || "+"}`} />
                      ) : (
                        <span>{st.value}</span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-800 mt-1">{st.label}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{st.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Accreditations Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-[#1B459B] text-white rounded-3xl p-7 sm:p-9 shadow-xl space-y-6 relative overflow-hidden">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <h3 className="text-lg font-black text-white tracking-wide uppercase">
                  Corporate Accreditations
                </h3>
                <ShieldCheck className="w-5 h-5 text-[#ED1C24]" />
              </div>

              <ul className="space-y-4 text-xs">
                {accreditations.map((acc: any, aIdx: number) => (
                  <li key={aIdx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#ED1C24] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white text-xs font-bold">{acc.title}</strong>
                      <span className="text-slate-300 text-[11px] leading-relaxed">{acc.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md"
                >
                  <span>Explore Product Range</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
