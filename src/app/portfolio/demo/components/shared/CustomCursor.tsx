"use client";

interface Props {
  mousePos: {
    x: number;
    y: number;
  };
  isCursorHovered: boolean;
}

export default function CustomCursor({
  mousePos,
  isCursorHovered,
}: Props) {
  // Leverage CSS translate3d to leverage GPU hardware acceleration paths
  const transformStyle = {
    transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0) translate(-50%, -50%)`,
  };

  return (
    <>
      {/* Central Core Dot Asset Pin */}
      <div
        id="custom-cursor-dot"
        style={transformStyle}
        className="hidden lg:block fixed top-0 left-0 pointer-events-none rounded-full w-2 h-2 bg-[#10b981] shadow-[0_0_12px_4px_rgba(16,185,129,0.4)] z-50 will-change-transform"
      />

      {/* Outer Holographic Targeting Ring */}
      <div
        id="custom-cursor-outline"
        style={transformStyle}
        className={`hidden lg:block fixed top-0 left-0 pointer-events-none rounded-full border z-50 will-change-transform transition-[width,height,background-color,border-color] duration-300 ease-out ${
          isCursorHovered
            ? "w-14 h-14 bg-[#10b981]/10 border-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.15)]"
            : "w-10 h-10 bg-transparent border-[#10b981]/30"
        }`}
      />
    </>
  );
}