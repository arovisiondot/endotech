"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Globe, ArrowRight, ShieldCheck, Award } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import EndoTechLogo from "@/components/EndoTechLogo";

export default function Footer() {
  const { content } = useContent();

  const topBar = content?.topBar || {
    address: "Al Muslim Street #5 Islam Nagar Road Pacca Garah Sialkot Pakistan",
    emails: ["info@endotech.com.pk", "ghafar@endotech.com.pk"],
    phone: "+92 52 4598114-16",
    mobile: "+92 300 8615456",
  };

  const footerData = content?.footer || {
    aboutText:
      "For over 35 years, Endo Tech Group of Industries has been a premier manufacturer and exporter of precision surgical instruments, delivering uncompromising quality, reliability, and innovation to operating theaters worldwide.",
    copyright: "© 2026 Endo Tech Group of Industries. All Rights Reserved.",
  };

  const productRange = [
    { name: "Kerrison Rongeurs", href: "/products?category=kerrison-rongeurs" },
    { name: "Needle Holders (TC)", href: "/products?category=needle-holders" },
    { name: "SuperCut Scissors", href: "/products?category=scissors" },
    { name: "Bone Punches & Rongeurs", href: "/products?category=bone-punches" },
    { name: "Micro & Dressing Forceps", href: "/products?category=forceps" },
    { name: "ENT & Laryngeal Instruments", href: "/products?category=ent-instruments" },
    { name: "Orthopedic Surgery Sets", href: "/products?category=orthopedic-instruments" },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Product Catalogue", href: "/catalog" },
    { name: "Upcoming Events", href: "/events" },
    { name: "Inquiry Bag", href: "/inquiry" },
    { name: "Admin Panel", href: "/admin" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <footer className="w-full bg-[#DADEE6] text-slate-800 border-t border-slate-300 overflow-hidden">
      {/* Upper Footer */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2200px] mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Col 1: About & Logo (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block group" aria-label="Endo Tech Home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt="Endo Tech Group of Industries"
                width={300}
                height={56}
                className="h-12 w-auto object-contain block transition-transform group-hover:scale-105"
                style={{ height: "48px", width: "auto" }}
              />
            </Link>

            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed max-w-sm">
              {footerData.aboutText}
            </p>

            {/* Certifications Micro Badges */}
            <div className="pt-2 flex items-center gap-3">
              <div className="flex items-center gap-2.5 bg-white/80 px-3.5 py-2 rounded-xl border border-slate-300 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-[#1B459B] shrink-0" />
                <div className="text-[11px] text-slate-700 font-bold leading-tight">
                  <div>ISO 13485:2016</div>
                  <div className="text-[10px] text-slate-500 font-medium">CE &amp; FDA Registered</div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Surgical Range (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[#1B459B] font-bold text-sm tracking-wider uppercase border-b-2 border-[#1B459B]/30 pb-2">
              Surgical Range
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {productRange.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-700 hover:text-[#ED1C24] transition flex items-center gap-1.5 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1B459B] group-hover:bg-[#ED1C24] transition" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[#1B459B] font-bold text-sm tracking-wider uppercase border-b-2 border-[#1B459B]/30 pb-2">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-700 hover:text-[#ED1C24] transition flex items-center gap-1.5 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1B459B] group-hover:bg-[#ED1C24] transition" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Factory & Direct Contacts (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[#1B459B] font-bold text-sm tracking-wider uppercase border-b-2 border-[#1B459B]/30 pb-2">
              Headquarters
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#ED1C24] shrink-0 mt-0.5" />
                <span className="leading-snug">{topBar.address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#ED1C24] shrink-0" />
                <a
                  href={`tel:${topBar.phone}`}
                  className="hover:text-[#1B459B] font-semibold transition"
                >
                  {topBar.phone}
                </a>
              </div>

              {topBar.mobile && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#ED1C24] shrink-0" />
                  <a
                    href={`tel:${topBar.mobile}`}
                    className="hover:text-[#1B459B] font-semibold transition"
                  >
                    {topBar.mobile}
                  </a>
                </div>
              )}

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#ED1C24] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  {topBar.emails?.map((email) => (
                    <a
                      key={email}
                      href={`mailto:${email}`}
                      className="hover:text-[#1B459B] transition"
                    >
                      {email}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#ED1C24] shrink-0" />
                <span className="text-slate-600">www.endotech.com.pk</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="border-t border-slate-300/80 bg-[#cdd3de] py-4">
        <div className="max-w-[1920px] 2xl:max-w-[2200px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>{footerData.copyright}</div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-[#1B459B] transition">
              Quality Policy
            </Link>
            <Link href="/catalog" className="hover:text-[#1B459B] transition">
              ISO Compliance
            </Link>
            <Link
              href="/admin"
              className="text-[#1B459B] font-bold hover:underline transition"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
