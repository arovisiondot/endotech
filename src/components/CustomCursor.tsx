"use client";

import React, { useEffect, useState, useRef } from "react";

/**
 * Premium, sleek, cute custom cursor:
 * - 30% reduced compact size (38px diameter rotating text ring)
 * - Precision center point (dot) restored and sized down 30% (cute 6px red dot with hover pulse)
 * - Arrow pointer deleted from the center per user request
 * - Smooth lerp tracking and non-intrusive pointer-events-none
 */
export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest("a") ||
          target.closest("button") ||
          target.closest("input") ||
          target.closest("select") ||
          target.closest("textarea") ||
          target.closest("[role='button']") ||
          target.closest(".cursor-pointer"))
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    let animationFrameId: number;
    const animate = () => {
      const ease = 0.25;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * ease;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * ease;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 select-none will-change-transform"
      style={{
        transform: `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`,
      }}
      aria-hidden="true"
    >
      <div
        className={`relative flex items-center justify-center transition-transform duration-200 ease-out ${
          isClicking ? "scale-90" : isHovering ? "scale-110" : "scale-100"
        }`}
      >
        {/* 20% Increased Balanced Rotating Circular Text Ring (58px Diameter) */}
        <div
          style={{
            width: "58px",
            height: "58px",
            minWidth: "58px",
            minHeight: "58px",
            maxWidth: "58px",
            maxHeight: "58px",
          }}
          className="relative flex items-center justify-center shrink-0"
        >
          <svg
            style={{
              width: "58px",
              height: "58px",
              animation: isHovering
                ? "customCursorSpin 4s linear infinite"
                : "customCursorSpin 8s linear infinite",
            }}
            className={`transition-colors duration-300 ${
              isHovering ? "text-[#ED1C24]" : "text-[#1B459B]"
            }`}
            viewBox="0 0 100 100"
          >
            <path
              id="cursorCirclePath"
              d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
              fill="none"
            />
            <text className="text-[9.5px] font-black uppercase fill-current opacity-90">
              <textPath
                href="#cursorCirclePath"
                startOffset="0%"
                textLength="215"
                lengthAdjust="spacing"
              >
                • VIEW • EXPLORE • ENDO TECH 
              </textPath>
            </text>
          </svg>

          {/* Restored Precision Center Point (Dot) - Scaled 20% */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              style={{
                width: isHovering ? "11px" : isClicking ? "5px" : "8px",
                height: isHovering ? "11px" : isClicking ? "5px" : "8px",
              }}
              className={`rounded-full transition-all duration-200 block ${
                isClicking
                  ? "bg-[#1B459B]"
                  : isHovering
                  ? "bg-[#ED1C24] shadow-[0_0_8px_rgba(237,28,36,0.9)]"
                  : "bg-[#ED1C24]"
              }`}
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes customCursorSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
