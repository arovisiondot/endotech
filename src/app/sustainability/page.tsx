"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Leaf, Sun, Recycle, Droplets, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import PageHeroBanner from "@/components/PageHeroBanner";
import AnimatedCounter from "@/components/AnimatedCounter";

export default function SustainabilityPage() {
  const { content } = useContent();
  const susData = (content as any)?.sustainabilityPage || {};

  const bannerHeadline = susData.bannerHeadline || "ENVIRONMENTAL RESPONSIBILITY & GREEN MANUFACTURING";
  const bannerTitle1 = susData.bannerTitleLine1 || "SUSTAINABLE SURGICAL SOLUTIONS.";
  const bannerHighlight = susData.bannerTitleHighlight || "PROTECTING OUR PLANET.";
  const bannerImage = susData.bannerImage || "/images/global-standards/compliances-surgeon-hands.png";

  const introText = susData.introText || "At Endo Tech Group of Industries, we believe that advancing healthcare must not come at the expense of our planet. Our green manufacturing initiatives in Sialkot integrate renewable energy, zero chemical discharge, and circular metallurgical recycling.";

  const initiatives = susData.initiatives || [
    {
      title: "100% Recyclable Medical-Grade Steel",
      desc: "All AISI 420 and German stainless steel offcuts and swarf are 100% segregated and recycled into secondary industrial processes, achieving near-zero metallurgical scrap.",
      icon: "recycle",
    },
    {
      title: "Solar Powered Clean Facility",
      desc: "Our manufacturing campus operates a 250 kW on-site rooftop solar photovoltaic system, reducing carbon emissions by 180 metric tons annually.",
      icon: "sun",
    },
    {
      title: "Zero Liquid Discharge (ZLD) Effluent Plant",
      desc: "All electropolishing, ultrasonic washing, and passivating wastewater undergoes multi-stage chemical and biological treatment, recycling clean water back into processing.",
      icon: "droplets",
    },
    {
      title: "Eco-Friendly Biodegradable Packaging",
      desc: "Non-sterile bulk packaging uses 100% recycled unbleached cardboard and water-soluble protective coatings, eliminating single-use plastics.",
      icon: "leaf",
    },
  ];

  const stats = susData.stats || [
    { value: 100, suffix: "%", label: "Recyclable Steel", desc: "Zero metallurgical landfill waste" },
    { value: 45, suffix: "%", label: "Solar Energy Powered", desc: "Clean energy CNC machining" },
    { value: "Zero", suffix: "", label: "Liquid Discharge", desc: "Full closed-loop water treatment" },
    { value: "ISO 14001", suffix: "", label: "Environmental Audit", desc: "Ecological compliance" },
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
          breadcrumbCurrent="Sustainability"
        />

        {/* 2. SUSTAINABILITY INITIATIVES SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-14 shadow-sm border border-slate-200/80 space-y-10">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-black text-[#ED1C24] uppercase tracking-widest block">
              OUR ECOLOGICAL PLEDGE
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Pioneering Clean, Sustainable Surgical Manufacturing
            </h2>
            <div className="w-12 h-1 bg-[#ED1C24] rounded-full" />
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pt-2">
              {introText}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((st: any, sIdx: number) => (
              <div key={sIdx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-2xl sm:text-3xl font-black text-[#1B459B]">
                  {typeof st.value === "number" ? (
                    <AnimatedCounter value={`${st.value}${st.suffix || "%"}`} />
                  ) : (
                    <span>{st.value}</span>
                  )}
                </div>
                <p className="text-xs font-bold text-slate-900 mt-1">{st.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{st.desc}</p>
              </div>
            ))}
          </div>

          {/* 4 Pillars Grid with Corner Glide Animations & Red Corner Accents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-4">
            {initiatives.map((ini: any, iIdx: number) => {
              const initX = iIdx % 2 === 0 ? -60 : 60;

              return (
                <motion.div
                  key={iIdx}
                  className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/85 bg-slate-50/50 hover:bg-white hover:border-[#1B459B]/40 hover:shadow-xl transition-all duration-300 space-y-3 group hover:-translate-y-1.5 relative overflow-hidden"
                  initial={{ opacity: 0, x: initX, y: 35, scale: 0.96 }}
                  whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay: iIdx * 0.1 }}
                >
                  {/* Red Corner Diagonal Wedge Accent */}
                  <div
                    className="absolute bottom-0 right-0 w-10 sm:w-12 h-10 sm:h-12 bg-[#ED1C24] pointer-events-none transition-transform duration-500 group-hover:scale-125 origin-bottom-right"
                    style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
                    aria-hidden="true"
                  />

                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                    {ini.icon === "sun" ? (
                      <Sun className="w-6 h-6 text-amber-500" />
                    ) : ini.icon === "droplets" ? (
                      <Droplets className="w-6 h-6 text-blue-500" />
                    ) : ini.icon === "leaf" ? (
                      <Leaf className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Recycle className="w-6 h-6 text-emerald-600" />
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#1B459B] transition-colors">
                    {ini.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed pr-2">
                    {ini.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Call to action */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#1B459B] text-white rounded-2xl p-7 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-lg font-black text-white">
                Learn More About Our Green Factory Standards
              </h4>
              <p className="text-xs text-slate-300">
                Contact our compliance officers for our ISO 14001 ecological audit documentation and material safety datasheets.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-6 py-3 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md whitespace-nowrap shrink-0"
            >
              Contact Compliance Team &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
