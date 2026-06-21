import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-[#050505] text-zinc-300 antialiased selection:bg-blue-500/30 selection:text-white relative overflow-hidden">
      
      {/* GLOBAL BACKGROUND SATELLITE ENGINE LIGHTING MATRIX */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] sm:bg-[size:4rem_4rem] pointer-events-none z-0" />
      
      {/* Deep Space Ambient Core Vector Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[600px] h-[200px] sm:h-[600px] bg-gradient-to-tr from-blue-600/5 via-purple-500/0 to-transparent blur-[60px] sm:blur-[120px] rounded-full pointer-events-none z-0" />

      {/* EXPANDED CHILDREN MOUNT HUB */}
      {/* Container utilizes w-full to ensure cards inside 
        (e.g., Auth forms) stretch to cover phone width 
        with small padding.
      */}
      <div className="w-full h-full flex flex-col items-center justify-center relative z-10 px-3 xs:px-4 py-4 sm:px-6 md:px-8">
        {children}
      </div>

    </div>
  );
}