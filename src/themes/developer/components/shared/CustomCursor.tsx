"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  // High-performance direct motion values to bypass React render cycle lag
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Terminal/GitHub style snappier spring configuration
  const springConfig = { stiffness: 400, damping: 28, mass: 0.5 };
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
      {/* Developer Theme Terminal Aura Box Frame */}
      <motion.div
        className="fixed top-0 left-0 border border-[#58A6FF]/40 pointer-events-none z-[9999] hidden md:block"
        style={{
          x: auraX,
          y: auraY,
          translateX: "-50%",
          translateY: "-50%",
          borderRadius: isHoveringInteractive ? "4px" : "2px",
          width: isHoveringInteractive ? 36 : 20,
          height: isHoveringInteractive ? 36 : 20,
          backgroundColor: isHoveringInteractive ? "rgba(88, 166, 255, 0.05)" : "transparent",
          boxShadow: isHoveringInteractive ? "0 0 12px rgba(88, 166, 255, 0.15)" : "none",
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.15 }}
      />

      {/* Terminal Block Prompt Focal Dot */}
      <div
        className="fixed top-0 left-0 bg-[#7EE787] pointer-events-none z-[99999] hidden md:block"
        style={{
          left: 0,
          top: 0,
          transform: `translate3d(${cursorX.get()}px, ${cursorY.get()}px, 0) translate(-50%, -50%)`,
          borderRadius: isHoveringInteractive ? "1px" : "0px",
          width: isHoveringInteractive ? 2 : 5,
          height: isHoveringInteractive ? 12 : 10,
          backgroundColor: isHoveringInteractive ? "#58A6FF" : "#7EE787",
          boxShadow: "0 0 4px rgba(126, 231, 135, 0.5)",
          transition: "transform 0.01s linear, width 0.15s, height 0.15s, background-color 0.15s, border-radius 0.15s",
        }}
      />
    </>
  );
}