"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Phone, Mail, Globe, Send, CheckCircle2, Clock } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import PageHeroBanner from "@/components/PageHeroBanner";

export default function ContactPage() {
  const { content } = useContent();
  const contactData = (content as any)?.contactPage || {};

  const bannerHeadline = contactData.bannerHeadline || "DIRECT FACTORY COMMUNICATION & EXPORT INQUIRIES";
  const bannerTitle1 = contactData.bannerTitleLine1 || "CONNECT WITH FACTORY EXPORT TEAM.";
  const bannerHighlight = contactData.bannerTitleHighlight || "FAST GLOBAL RESPONSE.";
  const bannerImage = contactData.bannerImage || "/images/global-standards/compliances-surgeon-hands.png";

  const address = contactData.address || "Al Muslim Street #5 Islam Nagar Road, Pacca Garah, Sialkot, Punjab 51310 Pakistan";
  const phone = contactData.phone || "+92 52 4598114-16 (Ext 102/104)";
  const mobile = contactData.mobile || "+92 300 8614441";
  const primaryEmail = contactData.primaryEmail || "info@endotech.com.pk";
  const directEmail = contactData.directEmail || "ghafar@endotech.com.pk";
  const workingHours = contactData.workingHours || "Monday – Saturday: 08:30 AM – 06:00 PM (PKT / GMT+5)";
  const inquiryNote = contactData.inquiryNote || "Our commercial managers respond to all wholesale and OEM requests within 12 business hours.";

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
          breadcrumbCurrent="Contact Us"
        />

        {/* 2. CONTACT INFORMATION & DIRECT INQUIRY FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Factory Credentials */}
          <motion.div
            className="lg:col-span-5 space-y-6"
            initial={{ opacity: 0, x: -60, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-9 shadow-sm space-y-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              {/* Red Corner Diagonal Wedge Accent */}
              <div
                className="absolute bottom-0 right-0 w-10 sm:w-12 h-10 sm:h-12 bg-[#ED1C24] pointer-events-none transition-transform duration-500 group-hover:scale-125 origin-bottom-right"
                style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
                aria-hidden="true"
              />
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[11px] font-black text-[#ED1C24] uppercase tracking-wider block">
                  EXPORT HEADQUARTERS
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  Endo Tech Group of Industries
                </h3>
              </div>

              <div className="space-y-5 text-xs text-slate-600">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-[#ED1C24] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-sm font-bold">Physical Address:</strong>
                    <span className="text-slate-600 leading-relaxed block mt-0.5">{address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1B459B] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-sm font-bold">Telephone &amp; Mobile:</strong>
                    <span className="text-slate-700 block mt-0.5 font-mono">{phone}</span>
                    {mobile && <span className="text-slate-500 block font-mono">Mobile / WhatsApp: {mobile}</span>}
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-[#ED1C24] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-sm font-bold">Official Inquiries:</strong>
                    <a href={`mailto:${primaryEmail}`} className="text-[#ED1C24] hover:underline font-semibold block mt-0.5">
                      {primaryEmail}
                    </a>
                    {directEmail && (
                      <a href={`mailto:${directEmail}`} className="text-slate-500 hover:underline block text-[11px]">
                        Commercial: {directEmail}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-sm font-bold">Export Operations:</strong>
                    <span className="text-slate-600 block mt-0.5">{workingHours}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
                {inquiryNote}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Direct Message Form */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: 60, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
          >
            <div className="bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-9 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              {/* Red Corner Diagonal Wedge Accent */}
              <div
                className="absolute bottom-0 right-0 w-10 sm:w-12 h-10 sm:h-12 bg-[#ED1C24] pointer-events-none transition-transform duration-500 group-hover:scale-125 origin-bottom-right"
                style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
                aria-hidden="true"
              />
              <div className="mb-6">
                <span className="text-[11px] font-black text-[#ED1C24] uppercase tracking-wider block">
                  ONLINE QUOTATION &amp; INQUIRY
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  Send a Direct Message to Commercial Department
                </h3>
              </div>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-black text-lg text-slate-900">Inquiry Delivered Successfully!</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Thank you for contacting Endo Tech Group of Industries. A commercial sales representative has been assigned to your quotation request.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-5 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold transition hover:bg-emerald-800"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Dr. Alexander Smith"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Official Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. alexander@hospitalgroup.com"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Country / Region *</label>
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="e.g. United Kingdom, Germany, UAE"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Subject / Category</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. OEM Production / Bulk Quotation"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Detailed Message &amp; Required Article Codes *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please specify product types, required sizes, estimated order quantities, or OEM customization requirements..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20 text-xs leading-relaxed"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-7 py-3 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Official Inquiry</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
