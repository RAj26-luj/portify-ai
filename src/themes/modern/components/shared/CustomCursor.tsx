"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  // High-performance direct motion values to bypass React render cycle lag
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Re-engineered modern SaaS spring physics configuration for clean premium trailing
  const springConfig = { stiffness: 350, damping: 28, mass: 0.4 };
  const auraX = useSpring(cursorX, springConfig);
  const auraY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);

      // Dynamically calculate if cursor is intersecting interactive target elements
      const target = e.target as HTMLElement;
      const isInteractive = !!target.closest("a, button, [role='button'], .cursor-pointer");
      setIsHoveringInteractive(isInteractive);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [visible, cursorX, cursorY]);

  if (!visible) return null;

  return (
    <>
      {/* Visual Redesign: Premium SaaS Minimalist Floating Outer Aura Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-[#6366F1]/30 pointer-events-none z-[9999] hidden md:block"
        style={{
          x: auraX,
          y: auraY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHoveringInteractive ? 54 : 32,
          height: isHoveringInteractive ? 54 : 32,
          backgroundColor: isHoveringInteractive ? "rgba(99, 102, 241, 0.03)" : "transparent",
          boxShadow: isHoveringInteractive ? "0 0 25px rgba(99, 102, 241, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.02)" : "none",
          borderColor: isHoveringInteractive ? "rgba(63, 102, 241, 0.5)" : "rgba(99, 102, 241, 0.25)",
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.2 }}
      />

      {/* Visual Redesign: Precision Core Focal Point Dot */}
      <div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          left: 0,
          top: 0,
          transform: `translate3d(${cursorX.get()}px, ${cursorY.get()}px, 0) translate(-50%, -50%)`,
          width: isHoveringInteractive ? 5 : 7,
          height: isHoveringInteractive ? 5 : 7,
          backgroundColor: isHoveringInteractive ? "#06B6D4" : "#FFFFFF",
          boxShadow: isHoveringInteractive ? "0 0 12px rgba(6, 182, 212, 0.8)" : "0 0 8px rgba(255, 255, 255, 0.5)",
          transition: "transform 0.01s linear, width 0.2s, height 0.2s, background-color 0.2s, box-shadow 0.2s",
        }}
      />
    </>
  );
}