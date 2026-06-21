"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  // High-performance direct motion values to bypass React render cycle lag
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Soft spring physics configuration for the cyberpunk holographic target ring
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
      const isInteractive = !!target.closest("a, button, [role='button'], .cursor-pointer, .cursor-none");
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
      {/* Cyberpunk Crosshair Matrix Utility Styling */}
      <style jsx global>{`
        @keyframes rotate-crosshair {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(90deg); }
        }
        .cyber-crosshair-active {
          animation: rotate-crosshair 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>

      {/* Dynamic Floating Outer Holographic Laser Ring (Delayed Trailing Interaction) */}
      <motion.div
        className="fixed top-0 left-0 border pointer-events-none z-[9999] mix-blend-screen hidden md:block"
        style={{
          x: auraX,
          y: auraY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHoveringInteractive ? 40 : 24,
          height: isHoveringInteractive ? 40 : 24,
          borderColor: isHoveringInteractive ? "#00FF9D" : "#00E5FF",
          backgroundColor: isHoveringInteractive ? "rgba(0, 255, 157, 0.05)" : "rgba(0, 229, 255, 0.02)",
          boxShadow: isHoveringInteractive ? "0 0 15px rgba(0, 255, 157, 0.4), inset 0 0 8px rgba(0, 255, 157, 0.2)" : "0 0 10px rgba(0, 229, 255, 0.2)",
          borderRadius: isHoveringInteractive ? "0%" : "50%"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Reticle crosshair fragments visible during interaction */}
        {isHoveringInteractive && (
          <>
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-1.5 bg-[#00FF9D]" />
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-1.5 bg-[#00FF9D]" />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-[1px] bg-[#00FF9D]" />
            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-[1px] bg-[#00FF9D]" />
          </>
        )}
      </motion.div>

      {/* Responsive Core Laser Target Focal Dot (Instant Hardware Position Tracker) */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 hidden md:block ${isHoveringInteractive ? "cyber-crosshair-active rounded-none" : "rounded-full"}`}
        style={{
          left: 0,
          top: 0,
          transform: `translate3d(${cursorX.get()}px, ${cursorY.get()}px, 0) translate(-50%, -50%)`,
          width: isHoveringInteractive ? 8 : 4,
          height: isHoveringInteractive ? 8 : 4,
          backgroundColor: isHoveringInteractive ? "#00FF9D" : "#00E5FF",
          boxShadow: isHoveringInteractive ? "0 0 12px #00FF9D" : "0 0 8px #00E5FF",
          transition: "transform 0.01s linear, width 0.15s, height 0.15s, background-color 0.15s, border-radius 0.15s",
          clipPath: isHoveringInteractive ? "polygon(0% 20%, 20% 20%, 20% 0%, 80% 0%, 80% 20%, 100% 20%, 100% 80%, 80% 80%, 80% 100%, 20% 100%, 20% 80%, 0% 80%)" : "none"
        }}
      />
    </>
  );
}