"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  // High-performance direct motion values to bypass React render cycle lag
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Soft spring physics configuration for the elegant trailing outer aura ring
  const springConfig = { stiffness: 250, damping: 22, mass: 0.6 };
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
      {/* Dynamic Floating Outer Aura Ring (Delayed Trailing Interaction) */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-purple-500/40 pointer-events-none z-[9999] mix-blend-screen hidden md:block"
        style={{
          x: auraX,
          y: auraY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHoveringInteractive ? 48 : 28,
          height: isHoveringInteractive ? 48 : 28,
          backgroundColor: isHoveringInteractive ? "rgba(139, 92, 246, 0.05)" : "transparent",
          boxShadow: isHoveringInteractive ? "0 0 20px rgba(139, 92, 246, 0.15)" : "none",
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.2 }}
      />

      {/* Responsive Core Target Focal Dot (Instant Hardware Position Tracker) */}
      <div
        className="fixed top-0 left-0 rounded-full bg-white pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(139,92,246,0.8)] hidden md:block"
        style={{
          left: 0,
          top: 0,
          transform: `translate3d(${cursorX.get()}px, ${cursorY.get()}px, 0) translate(-50%, -50%)`,
          width: isHoveringInteractive ? 4 : 6,
          height: isHoveringInteractive ? 4 : 6,
          backgroundColor: isHoveringInteractive ? "#a855f7" : "#ffffff",
          transition: "transform 0.02s linear, width 0.2s, height 0.2s, background-color 0.2s",
        }}
      />
    </>
  );
}