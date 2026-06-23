export default function Footer() {
  return (
    <footer className="relative w-full bg-[#0A0A0A] border-t border-white/[0.04] select-none shrink-0 z-20 transition-colors duration-300">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent shadow-[0_1px_3px_rgba(59,130,246,0.1)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left text-[9px] sm:text-xs font-mono font-medium text-zinc-500 tracking-widest uppercase">
          <div className="leading-normal transition-colors hover:text-zinc-400 duration-200">
            © {new Date().getFullYear()} Portify AI.{" "}
            <span className="hidden sm:inline text-zinc-600 font-normal">|</span>{" "}
            <span className="hidden sm:inline">All rights infrastructure reserved.</span>
            <span className="inline sm:hidden">All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-zinc-600 mt-0.5 sm:mt-0">
            <span className="relative group/tag hover:text-zinc-400 transition-colors duration-200 cursor-pointer text-[9px] sm:text-xs tracking-wider">
              // production_ready
              <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-blue-500/40 transition-all duration-300 group-hover/tag:w-full" />
            </span>
            <span className="relative group/tag hover:text-zinc-400 transition-colors duration-200 cursor-pointer text-[9px] sm:text-xs tracking-wider">
              schema_secure
              <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-emerald-500/40 transition-all duration-300 group-hover/tag:w-full" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
