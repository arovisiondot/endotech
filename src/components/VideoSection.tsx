"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, X } from "lucide-react";
import { useContent } from "@/context/ContentContext";

interface VideoSectionProps {
  previewData?: any;
}

export default function VideoSection({ previewData }: VideoSectionProps) {
  const { content } = useContent();
  const videoData = previewData || (content as any)?.videoSection;
  const [isOpen, setIsOpen] = useState(false);

  if (!videoData || videoData.enabled === false) {
    return null;
  }

  const {
    bannerImage = "/images/video/factory-video-banner.png",
    videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ",
    title = "Take a Look Inside Our Production Facility",
    badge = "FACILITY TOUR",
  } = videoData;

  const isDirectVideo =
    videoUrl &&
    (videoUrl.endsWith(".mp4") ||
      videoUrl.endsWith(".webm") ||
      videoUrl.endsWith(".ogg") ||
      videoUrl.startsWith("/uploads/"));

  return (
    <>
      <section className="w-full py-8 sm:py-12 lg:py-16 bg-white overflow-hidden relative">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2200px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          
          {/* Video Showcase Card matching Figma SS 1 */}
          <motion.div
            className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden aspect-[16/7.5] sm:aspect-[16/7] lg:aspect-[21/8.5] min-h-[300px] sm:min-h-[420px] lg:min-h-[500px] flex items-center justify-center group cursor-pointer shadow-xl border border-slate-200/80 bg-slate-900"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setIsOpen(true)}
          >
            {/* Background Factory / Visual Banner */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bannerImage || "/images/video/factory-video-banner.png"}
              alt="Endo Tech Production Facility Video Tour"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
              loading="lazy"
            />

            {/* Subtle overlay for depth & contrast */}
            <div className="absolute inset-0 bg-[#0F224A]/25 group-hover:bg-[#0F224A]/10 transition-colors duration-500 pointer-events-none" />

            {/* Pulsating Sonar Play Button in Center (Matching SS 1) */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-3">
              <div className="relative flex items-center justify-center">
                {/* Sonar Pulse Ring 1 */}
                <span className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/20 animate-ping pointer-events-none opacity-75" />
                
                {/* Sonar Pulse Ring 2 */}
                <span className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-white/40 pointer-events-none group-hover:scale-115 transition-transform duration-500" />

                {/* Main Play Circle */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/25 backdrop-blur-md border-2 border-white flex items-center justify-center text-white shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-[#1B459B] active:scale-95">
                  <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-current ml-1" />
                </div>
              </div>
            </div>

            {/* Red Geometric Accent Corner (Matching SS 1) */}
            <div
              className="absolute top-0 right-0 w-20 sm:w-28 h-20 sm:h-28 bg-[#ED1C24] pointer-events-none opacity-90 transition-transform duration-500 group-hover:scale-105 origin-top-right"
              style={{
                clipPath: "polygon(100% 0, 0 0, 100% 100%)",
              }}
              aria-hidden="true"
            />
          </motion.div>

        </div>
      </section>

      {/* Video Modal Player */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
            {/* Backdrop click to close */}
            <div
              className="absolute inset-0"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="relative max-w-5xl w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/20 z-10"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-[#ED1C24] text-white flex items-center justify-center transition shadow-lg backdrop-blur-xs"
                title="Close Video"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Video Content */}
              {isDirectVideo ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <iframe
                  src={
                    videoUrl?.includes("autoplay")
                      ? videoUrl
                      : `${videoUrl}${videoUrl?.includes("?") ? "&" : "?"}autoplay=1`
                  }
                  title={title || "Endo Tech Video Tour"}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

