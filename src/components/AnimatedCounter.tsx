"use client";

import React, { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

export default function AnimatedCounter({
  value,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState("0");
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Parse target number and suffix (e.g. "1,500+" -> 1500, "+")
    const match = value.match(/([\d,]+)(.*)/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const rawNum = parseInt(match[1].replace(/,/g, ""), 10);
    const suffix = match[2] || "";

    if (isNaN(rawNum)) {
      setDisplayValue(value);
      return;
    }

    let isVisible = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          isVisible = true;

          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }

          const duration = 1400; // ms
          const start = performance.now();

          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic for soft, fluid deceleration
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(rawNum * ease);

            setDisplayValue(
              current.toLocaleString("en-US") + suffix
            );

            if (progress < 1) {
              animationFrameRef.current = requestAnimationFrame(step);
            } else {
              setDisplayValue(value);
            }
          };

          animationFrameRef.current = requestAnimationFrame(step);
        } else if (!entry.isIntersecting) {
          // Reset when leaving view so it counts dynamically every time the user scrolls/swipes back!
          isVisible = false;
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          setDisplayValue("0" + suffix);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      observer.disconnect();
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}

