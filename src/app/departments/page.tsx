"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Layers, ShieldCheck, Microscope, PackageCheck, Wrench, Sparkles, Factory } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import PageHeroBanner from "@/components/PageHeroBanner";

export default function DepartmentsPage() {
  const { content } = useContent();
  const deptData = (content as any)?.departmentsPage || {};

  const bannerHeadline = deptData.bannerHeadline || "FACILITIES, SPECIALTIES & MANUFACTURING EXCELLENCE";
  const bannerTitle1 = deptData.bannerTitleLine1 || "CLINICAL SPECIALTIES &";
  const bannerHighlight = deptData.bannerTitleHighlight || "MANUFACTURING DEPARTMENTS.";
  const bannerImage = deptData.bannerImage || "/images/global-standards/compliances-surgeon-hands.png";
  const subtitle = deptData.subtitle || "From specialized surgical disciplines to advanced metallurgy and cleanroom passivation, explore how Endo Tech delivers surgical excellence.";

  const clinicalSpecialties = deptData.clinicalSpecialties || [
    {
      id: "spec-1",
      code: "01",
      name: "General Surgery",
      slug: "general-instrumentation",
      description: "High-precision scalpel handles, surgical scissors, tissue forceps, hemostatic clamps, and wound retractors engineered for all surgical disciplines.",
    },
    {
      id: "spec-2",
      code: "02",
      name: "Dental & Oral Maxillofacial",
      slug: "dental-instruments",
      description: "Ergonomic extracting forceps, dental elevators, periosteal instruments, scalers, and micro-pliers conforming to international dental standards.",
    },
    {
      id: "spec-3",
      code: "03",
      name: "ENT (Otolaryngology)",
      slug: "ent-instruments",
      description: "Specialized micro-laryngeal cup forceps, nasal speculums, ear curettes, and sinus endoscopy instruments for delicate head and neck surgery.",
    },
    {
      id: "spec-4",
      code: "04",
      name: "Orthopedics & Spine Surgery",
      slug: "orthopedics",
      description: "High-torque Kerrison rongeurs, bone holding forceps, bone chisels, osteotomes, and plate benders made from high-strength German stainless steel.",
    },
    {
      id: "spec-5",
      code: "05",
      name: "Gynecology & Obstetrics",
      slug: "gynecology",
      description: "Vaginal speculums, uterine dilators, biopsy punches, ovum forceps, and caesarean instruments designed for patient safety and procedural efficiency.",
    },
    {
      id: "spec-6",
      code: "06",
      name: "Cardiovascular & Micro-Surgery",
      slug: "general-instrumentation",
      description: "Micro-needle holders with tungsten carbide inserts, atraumatic vascular clamps, and micro-scissors for high-magnification surgical procedures.",
    },
  ];

  const manufacturingDivisions = deptData.manufacturingDivisions || [
    {
      id: "mfg-1",
      title: "Hot Drop-Forging & Precision Tooling",
      desc: "High-tonnage forging presses creating closed-die blanks from certified medical-grade AISI 420 and German stainless steel.",
      badge: "DIVISION 01",
    },
    {
      id: "mfg-2",
      title: "CNC 5-Axis Milling & Micro-Machining",
      desc: "German computer numerical control machining centers ensuring micron-level accuracy for bone punches, rongeurs, and micro-scissors.",
      badge: "DIVISION 02",
    },
    {
      id: "mfg-3",
      title: "Master Toolmaker Hand-Finishing & Assembly",
      desc: "Generations of master metallurgical craftsmen hand-aligning tips, adjusting spring tensions, and balancing instruments for surgical feel.",
      badge: "DIVISION 03",
    },
    {
      id: "mfg-4",
      title: "Class 10,000 Cleanroom & Ultrasonic Passivation",
      desc: "Multi-stage automated ultrasonic cleaning baths, nitric acid chemical passivation, and sterile barrier packaging conforming to ISO 13485.",
      badge: "DIVISION 04",
    },
  ];

  const getDivisionIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return Wrench;
      case 1:
        return Layers;
      case 2:
        return Microscope;
      default:
        return PackageCheck;
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen py-6 sm:py-8 lg:py-10 text-slate-800">
      <div className="w-full max-w-[1920px] 2xl:max-w-[2200px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-10 sm:space-y-14">
        {/* 1. HERO BANNER WITH CHARACTER ANIMATIONS & ROTATING BADGE */}
        <PageHeroBanner
          badgeHeadline={bannerHeadline}
          titleLine1={bannerTitle1}
          titleHighlight={bannerHighlight}
          bannerImage={bannerImage}
          breadcrumbCurrent="Departments"
        />

        {/* 2. CLINICAL SPECIALTIES SECTION */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div>
              <span className="text-xs font-black text-[#ED1C24] uppercase tracking-widest block">
                CLINICAL DIVISIONS ({clinicalSpecialties.length})
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Surgical Instrument Specialties
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              {subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {clinicalSpecialties.map((cat: any, index: number) => {
              const colIndex = index % 3;
              const initX = colIndex === 0 ? -60 : colIndex === 2 ? 60 : 0;

              return (
                <motion.div
                  key={cat.id || index}
                  className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/85 p-7 sm:p-8 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between relative overflow-hidden"
                  initial={{ opacity: 0, x: initX, y: 35, scale: 0.96 }}
                  whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.08 }}
                >
                  {/* Red Corner Diagonal Wedge Accent */}
                  <div
                    className="absolute bottom-0 right-0 w-10 sm:w-12 h-10 sm:h-12 bg-[#ED1C24] pointer-events-none transition-transform duration-500 group-hover:scale-125 origin-bottom-right"
                    style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
                    aria-hidden="true"
                  />

                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-[#ED1C24] transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-1 block">
                      {cat.code}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-2 tracking-tight group-hover:text-[#1B459B] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-500 mt-3 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/products?category=${cat.slug || "general-surgery"}`}
                      className="text-xs font-bold text-[#1B459B] group-hover:text-[#ED1C24] flex items-center gap-2 transition"
                    >
                      <span>Explore Department Instruments</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 3. MANUFACTURING & QUALITY DIVISIONS */}
        <div className="space-y-6 pt-4">
          <div className="border-b border-slate-200/80 pb-4">
            <span className="text-xs font-black text-[#1B459B] uppercase tracking-widest block">
              PRODUCTION INFRASTRUCTURE ({manufacturingDivisions.length} DIVISIONS)
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Manufacturing & Quality Departments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {manufacturingDivisions.map((d: any, dIdx: number) => {
              const Icon = getDivisionIcon(dIdx);
              const initX = dIdx % 2 === 0 ? -60 : 60;

              return (
                <motion.div
                  key={d.id || dIdx}
                  className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/85 p-6 sm:p-8 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex items-start gap-5 relative overflow-hidden"
                  initial={{ opacity: 0, x: initX, y: 35, scale: 0.96 }}
                  whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay: dIdx * 0.1 }}
                >
                  {/* Red Corner Diagonal Wedge Accent */}
                  <div
                    className="absolute bottom-0 right-0 w-10 sm:w-12 h-10 sm:h-12 bg-[#ED1C24] pointer-events-none transition-transform duration-500 group-hover:scale-125 origin-bottom-right"
                    style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
                    aria-hidden="true"
                  />

                  <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-md group-hover:bg-[#1B459B] transition-colors duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="space-y-1.5 flex-1 pr-4">
                    <span className="text-[10px] font-black text-[#ED1C24] uppercase tracking-wider block">
                      {d.badge || `DIVISION 0${dIdx + 1}`}
                    </span>
                    <h4 className="font-black text-base sm:text-lg text-slate-900 group-hover:text-[#1B459B] transition-colors">
                      {d.title}
                    </h4>
                    <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed pt-0.5">
                      {d.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
