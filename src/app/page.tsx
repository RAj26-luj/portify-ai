import Link from "next/link";
import { auth } from "@/auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="min-h-screen text-white bg-[#030303] selection:bg-blue-500/30 selection:text-white antialiased overflow-x-hidden relative">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes auroraGlow {
          0% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          50% { transform: translate(40px, -60px) scale(1.15) rotate(180deg); }
          100% { transform: translate(0px, 0px) scale(1) rotate(360deg); }
        }
        @keyframes customGrid {
          0% { background-position: 0 0; }
          100% { background-position: 50px 50px; }
        }
        @keyframes orbitControl {
          0% { transform: rotateY(0deg) rotateX(15deg); }
          100% { transform: rotateY(360deg) rotateX(15deg); }
        }
        @keyframes matrixFloat {
          0%, 100% { transform: translateY(0px) rotateX(20deg) rotateY(-20deg); }
          50% { transform: translateY(-12px) rotateX(22deg) rotateY(-18deg); }
        }
        @keyframes absoluteFloat {
          0%, 100% { transform: translateY(0px) translateZ(40px); }
          50% { transform: translateY(-8px) translateZ(60px); }
        }
        @keyframes beamSweep {
          0% { top: -100%; opacity: 0; }
          50% { opacity: 0.5; }
          100% { top: 200%; opacity: 0; }
        }
        .animate-aurora-blend { animation: auroraGlow 25s infinite linear; }
        .animate-matrix-float { animation: matrixFloat 7s infinite ease-in-out; }
        .animate-abs-float { animation: absoluteFloat 5s infinite ease-in-out; }
        .3d-grid-floor {
          background-size: 50px 50px;
          background-image: linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
          animation: customGrid 15s linear infinite;
        }
        .perspective-deep { perspective: 1600px; }
        .preserve-3d-frame { transform-style: preserve-3d; }
        .group:hover .shine-beam { animation: beamSweep 1.6s ease-in-out infinite; }
        .interactive-zone:hover { cursor: crosshair; }
        .hover-glow-trigger:hover {
          filter: drop-shadow(0 0 25px rgba(59, 130, 246, 0.4));
          border-color: rgba(59, 130, 246, 0.4) !important;
        }
      `,
        }}
      />

      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#030303]" />
        <div className="absolute inset-0 3d-grid-floor opacity-80" />

        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-blue-600/10 rounded-full blur-[150px] mix-blend-screen animate-aurora-blend" />
        <div
          className="absolute bottom-[10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-600/5 rounded-full blur-[130px] mix-blend-screen animate-aurora-blend"
          style={{ animationDirection: "reverse" }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#030303_95%)]" />
      </div>

      <div className="relative z-50">
        <Navbar />
      </div>

      <section className="relative max-w-7xl mx-auto pt-32 max-lg:pt-28 pb-32 max-lg:pb-16 px-4 sm:px-6 lg:px-8 z-10 perspective-deep interactive-zone">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col items-start max-lg:items-center max-lg:text-center text-left space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 backdrop-blur-xl shadow-2xl transition-transform duration-300 hover:scale-[1.02]">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-xs font-mono tracking-widest text-zinc-300 uppercase">
                RESUME → PORTFOLIO PLATFORM
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-500 drop-shadow-md">
              Build a Professional Portfolio From Your Resume.
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed max-w-xl">
              Upload your resume, extract structured information, complete missing details,
              customize sections, choose a theme, and publish your portfolio — all from a single
              dashboard.
            </p>

            <p className="text-sm text-zinc-500 leading-relaxed max-w-lg">
              Portify AI helps students, developers, engineers, researchers, freelancers, and
              professionals create portfolio websites without writing code. Your resume becomes the
              foundation, while you stay in complete control of every detail.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-4 max-sm:px-2">
              {session?.user ? (
                <Link
                  href={`/dashboard/${(session.user as any).username}`}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium text-sm rounded-lg transition-all duration-300 shadow-[0_0_40px_rgba(59,130,246,0.3)] active:scale-[0.98] border border-blue-400/30 text-center tracking-wide touch-manipulation"
                >
                  Create Portfolio
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium text-sm rounded-lg transition-all duration-300 shadow-[0_0_40px_rgba(59,130,246,0.3)] active:scale-[0.98] border border-blue-400/30 text-center tracking-wide touch-manipulation"
                >
                  Create Portfolio
                </Link>
              )}
            </div>

            <div className="pt-8 border-t border-white/5 w-full flex flex-wrap items-center max-lg:justify-center gap-x-6 gap-y-3 text-xs font-mono text-zinc-500">
              <span className="flex items-center gap-1 text-zinc-400">
                <span className="text-blue-500">✓</span> Resume Import
              </span>
              <span className="flex items-center gap-1 text-zinc-400">
                <span className="text-blue-500">✓</span> No Coding Required
              </span>
              <span className="flex items-center gap-1 text-zinc-400">
                <span className="text-blue-500">✓</span> Multiple Themes
              </span>
              <span className="flex items-center gap-1 text-zinc-400">
                <span className="text-blue-500">✓</span> Analytics Included
              </span>
              <span className="flex items-center gap-1 text-zinc-400">
                <span className="text-blue-500">✓</span> Public Portfolio URL
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative w-full h-[500px] max-sm:h-[400px] flex items-center justify-center preserve-3d-frame mt-12 lg:mt-0 select-none max-lg:order-first">
            <div className="absolute w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="absolute w-[360px] max-sm:w-[290px] h-[420px] max-sm:h-[350px] bg-zinc-950/40 border border-white/5 rounded-2xl backdrop-blur-xl shadow-[0_50px_100px_rgba(0,0,0,0.9)] preserve-3d-frame animate-matrix-float p-6 max-sm:p-4 flex flex-col justify-between hover-glow-trigger transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500/40" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                    <div className="w-2 h-2 rounded-full bg-green-500/40" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600 tracking-widest">
                    ENGINE_MATRIX.OBJ
                  </span>
                </div>

                <div className="space-y-3 font-mono text-[11px] text-zinc-400">
                  <div className="p-2.5 rounded bg-white/[0.02] border border-white/5">
                    <span className="text-blue-400">INPUT:</span>{" "}
                    <span className="text-zinc-300">RAW_RESUME.PDF</span>
                  </div>
                  <div className="p-2.5 rounded bg-white/[0.02] border border-white/5">
                    <span className="text-purple-400">PARSING:</span>{" "}
                    <span className="text-zinc-500">EXTRACTING_DATA_NODES...</span>
                  </div>
                  <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <span className="font-bold">✓ OUTPUT:</span> live_portfolio.xml
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/5">
                <div className="h-1 bg-blue-500 rounded-full" />
                <div className="h-1 bg-emerald-500 rounded-full" />
                <div className="h-1 bg-purple-500 rounded-full" />
                <div className="h-1 bg-zinc-800 rounded-full" />
              </div>
            </div>

            <div className="absolute transform translate-x-16 max-sm:translate-x-8 -translate-y-12 translate-z-[80px] w-[260px] max-sm:w-[200px] h-[160px] max-sm:h-[130px] bg-gradient-to-br from-white/10 to-transparent border border-white/20 rounded-xl backdrop-blur-xl shadow-2xl p-5 max-sm:p-3 flex flex-col justify-between animate-abs-float">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-zinc-400">SYSTEM HEALTH</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="text-2xl max-sm:text-xl font-black text-white font-mono">99.9%</div>
                <div className="text-[10px] text-zinc-500">STRUCTURAL INTEGRITY BLOCK</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-950/40 border-y border-white/5 py-28 max-lg:py-16 px-4 sm:px-6 lg:px-8 relative z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 max-lg:mb-12">
            <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-blue-500 mb-3">
              HOW PORTIFY AI WORKS
            </h2>
            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              From Resume Upload To Live Portfolio
            </h3>
            <p className="text-base text-zinc-400 max-w-2xl mx-auto">
              A complete workflow designed to transform professional information into a polished
              portfolio website.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-sm:gap-6 relative">
            <StepCard
              number="01"
              title="Upload Resume"
              description="Upload your PDF resume and start portfolio creation instantly."
            />
            <StepCard
              number="02"
              title="Information Extraction"
              description="Portify AI extracts structured information including education, projects, experience, certifications, skills, social profiles, coding profiles, publications, and more."
            />
            <StepCard
              number="03"
              title="Missing Information Detection"
              description="The system identifies missing information and guides you through completing important portfolio fields."
            />
            <StepCard
              number="04"
              title="Portfolio Customization"
              description="Control section visibility, ordering, content, profile details, project information, and public presentation."
            />
            <StepCard
              number="05"
              title="Theme Selection"
              description="Choose the visual style that best represents your professional identity."
            />
            <StepCard
              number="06"
              title="Publish Portfolio"
              description="Receive a public portfolio URL and share it anywhere."
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-28 max-lg:py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 max-lg:mb-12">
          <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-400 mb-3">
            RESUME EXTRACTION
          </h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Every Resume Becomes Structured Data
          </h3>
          <p className="text-base text-zinc-400 max-w-2xl mx-auto">
            Instead of manually rebuilding your profile, Portify AI extracts the information already
            available inside your resume.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-sm:gap-4">
          <PremiumCard
            title="Projects"
            desc="Transform project information into portfolio-ready project cards."
          />
          <PremiumCard
            title="Experience"
            desc="Import internships, jobs, research work, and professional experience."
          />
          <PremiumCard
            title="Education"
            desc="Display degrees, colleges, schools, and academic achievements."
          />
          <PremiumCard
            title="Skills"
            desc="Showcase technical and professional skills with organized categories."
          />
          <PremiumCard title="Certifications" desc="Import certifications and credential links." />
          <PremiumCard
            title="Coding Profiles"
            desc="Connect GitHub, LeetCode, Codeforces, CodeChef, HackerRank, AtCoder, and more."
          />
          <PremiumCard
            title="Publications"
            desc="Display research papers, articles, journals, and publications."
          />
          <PremiumCard
            title="Open Source"
            desc="Highlight repositories, contributions, and community work."
          />
        </div>
      </section>

      <section className="bg-zinc-950/60 border-y border-white/5 py-28 max-lg:py-16 px-4 sm:px-6 lg:px-8 relative z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 max-lg:mb-12">
            <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-amber-500 mb-3">
              MISSING INFORMATION DETECTION
            </h2>
            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Never Miss Important Portfolio Details
            </h3>
            <p className="text-base text-zinc-400 max-w-2xl mx-auto">
              The platform automatically checks for missing information and helps complete your
              portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-sm:gap-4">
            <DetectionPanel
              title="Missing Profile Image"
              value="Add a professional profile photograph."
            />
            <DetectionPanel
              title="Missing Project Link"
              value="Attach GitHub repositories and live demos."
            />
            <DetectionPanel
              title="Missing Description"
              value="Provide additional context for projects and achievements."
            />
            <DetectionPanel
              title="Missing Social Profiles"
              value="Connect LinkedIn, GitHub, Twitter, and other networks."
            />
            <DetectionPanel
              title="Missing Coding Profiles"
              value="Showcase competitive programming and coding achievements."
            />
            <DetectionPanel
              title="Missing Skill Information"
              value="Improve technical stack visibility."
            />
          </div>

          <p className="mt-12 max-sm:mt-8 text-center text-xs font-mono text-zinc-500 tracking-wide px-2">
            Once completed, missing information is permanently stored and will not be requested
            again unless removed manually.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-28 max-lg:py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-lg:gap-8 items-center">
          <div className="max-lg:text-center max-lg:flex max-lg:flex-col max-lg:items-center">
            <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-purple-400 mb-3">
              RESUME UPDATE ENGINE
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              Upload New Resume Versions Safely
            </h3>
            <p className="text-base text-zinc-400 mb-6">
              Your portfolio evolves as your career grows.
            </p>
            <div className="p-6 rounded-xl bg-purple-500/5 border border-purple-500/20 text-left max-w-md">
              <h4 className="text-sm font-bold text-purple-400 mb-2">Engine Priority Rule</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Manual additions are never overwritten simply because they are missing from a newly
                uploaded resume.
              </p>
            </div>
          </div>

          <div className="space-y-4 p-6 max-sm:p-4 bg-zinc-950/80 border border-white/5 rounded-2xl shadow-2xl">
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="text-xs font-mono text-zinc-500 mb-2">Resume Version 1</div>
              <div className="flex flex-wrap gap-2 text-[11px] text-zinc-300 font-mono">
                <span>[Projects]</span> <span>[Education]</span> <span>[Skills]</span>
              </div>
              <div className="mt-3 pt-2 border-t border-white/5 text-[11px] text-purple-400 font-mono">
                + Manually Added: [Publication] [Research Paper] [Custom Section]
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="text-xs font-mono text-zinc-500 mb-2">Resume Version 2</div>
              <div className="flex flex-wrap gap-2 text-[11px] text-zinc-300 font-mono">
                <span>[Projects]</span> <span>[Education]</span> <span>[Skills]</span>{" "}
                <span className="text-emerald-400">[Experience]</span>
              </div>
            </div>

            <div className="p-3 bg-zinc-900 rounded-lg border border-white/10 text-xs text-zinc-400 text-center font-mono">
              Portify AI updates available information while preserving everything you manually
              added.
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-950/40 border-y border-white/5 py-28 max-lg:py-16 px-4 sm:px-6 lg:px-8 relative z-10 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 max-lg:mb-10">
            <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-cyan-400 mb-3">
              SECTION CUSTOMIZATION
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              Complete Control Over Your Portfolio
            </h3>
            <p className="text-base text-zinc-400 max-w-xl mx-auto">
              Enable, disable, reorder, and customize portfolio sections whenever you want.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto max-sm:gap-2">
            {[
              "Hero",
              "About",
              "Skills",
              "Projects",
              "Experience",
              "Education",
              "Certifications",
              "Coding Profiles",
              "Publications",
              "Open Source",
              "Testimonials",
              "Custom Sections",
              "Contact",
            ].map((sectionName) => (
              <span
                key={sectionName}
                className="px-4 py-2 max-sm:px-3 max-sm:text-xs rounded-lg bg-zinc-900 border border-white/5 text-sm text-zinc-300 font-mono transition-all duration-200 hover:border-cyan-500/30 hover:text-white"
              >
                {sectionName}
              </span>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-zinc-500 font-mono px-2">
            Note: About and Contact remain mandatory to maintain portfolio completeness.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-28 max-lg:py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 max-lg:mb-10">
          <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-pink-500 mb-3">
            THEME SYSTEM
          </h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Switch Themes Without Losing Data
          </h3>
          <p className="text-base text-zinc-400 max-w-xl mx-auto">
            Themes change appearance, not content.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-4xl mx-auto max-sm:gap-3">
          {["Default", "Modern", "Minimal", "Dark", "Developer"].map((themeName) => (
            <div
              key={themeName}
              className="p-6 max-sm:p-4 rounded-xl bg-zinc-950/80 border border-white/5 text-center transition-all duration-300 hover:border-pink-500/40 group"
            >
              <span className="text-sm max-sm:text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">
                {themeName}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs font-mono text-pink-400/80 px-4">
          Highlight: Change your portfolio design instantly while preserving every piece of
          portfolio data.
        </p>
      </section>

      <section className="bg-zinc-950/40 border-y border-white/5 py-28 max-lg:py-16 px-4 sm:px-6 lg:px-8 relative z-10 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-lg:gap-8 items-center">
            <div className="max-lg:text-center">
              <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-orange-400 mb-3">
                ICON MANAGEMENT SYSTEM
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
                Smart Icon Management System
              </h3>
              <p className="text-base text-zinc-400 leading-relaxed mb-6">
                Portify AI includes a large icon library covering technologies, social networks,
                coding platforms, and developer tools.
              </p>

              <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-zinc-400 text-left max-w-xl mx-auto">
                <p className="font-bold text-zinc-300 font-mono">Missing Icon Workflow:</p>
                <p>If an icon does not exist: Upload Custom Icon or Use Default Platform Icon</p>
                <p className="text-orange-400 font-mono">
                  No portfolio section ever breaks because of missing assets.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 p-6 max-sm:p-4 bg-zinc-950 rounded-2xl border border-white/5 max-lg:justify-center">
              {[
                "GitHub",
                "LeetCode",
                "Codeforces",
                "CodeChef",
                "HackerRank",
                "AtCoder",
                "LinkedIn",
                "React",
                "Next.js",
                "Node.js",
                "MongoDB",
                "Docker",
                "Kubernetes",
                "Python",
                "Java",
                "TypeScript",
              ].map((icon) => (
                <span
                  key={icon}
                  className="px-3 py-1.5 rounded bg-zinc-900 border border-white/5 text-xs font-mono text-zinc-400"
                >
                  {icon}
                </span>
              ))}
              <span className="px-3 py-1.5 rounded bg-zinc-900 border border-white/5 text-xs font-mono text-zinc-500">
                and many more...
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-28 max-lg:py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-sm:gap-6">
          <div className="p-8 max-sm:p-6 rounded-2xl bg-zinc-950/80 border border-white/5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400">
                Telemetry Suite
              </span>
              <h4 className="text-xl font-bold text-white mt-2 mb-3">
                Understand Portfolio Performance
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                Track engagement without invasive tracking.
              </p>
              <div className="space-y-2 text-xs font-mono text-zinc-300">
                {[
                  "Portfolio Views",
                  "Unique Visitors",
                  "Resume Downloads",
                  "Contact Requests",
                  "Project Clicks",
                ].map((metric) => (
                  <div
                    key={metric}
                    className="flex justify-between p-2 rounded bg-white/[0.02] border border-white/5"
                  >
                    <span>{metric}</span>{" "}
                    <span className="text-blue-400 text-[10px]">METRIC_LOGGED</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-6 pt-3 border-t border-white/5 text-[11px] font-mono text-zinc-500">
              Simple analytics focused on meaningful professional insights.
            </p>
          </div>

          <div className="p-8 max-sm:p-6 rounded-2xl bg-zinc-950/80 border border-white/5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                App Ingress
              </span>
              <h4 className="text-xl font-bold text-white mt-2 mb-3">
                Receive Professional Opportunities
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                Visitors can request contact directly through your portfolio.
              </p>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 mb-4">
                <p className="text-xs font-bold text-zinc-300">Visitor Submits:</p>
                <p className="text-xs text-zinc-400 font-mono">Name, Email, Optional Note</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <p className="text-xs font-bold text-zinc-300">You Receive:</p>
                <p className="text-xs text-zinc-400 font-mono">
                  Dashboard Notification, Email Notification, Contact Information, Request History
                </p>
              </div>
            </div>
            <p className="mt-6 pt-3 border-t border-white/5 text-[11px] font-mono text-emerald-400">
              Your personal information remains protected while opportunities remain accessible.
            </p>
          </div>

          <div className="p-8 max-sm:p-6 rounded-2xl bg-zinc-950/80 border border-white/5 flex flex-col justify-between md:col-span-2 lg:col-span-1">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400">
                Security Gate
              </span>
              <h4 className="text-xl font-bold text-white mt-2 mb-3">Verified Platform Access</h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                Every account passes through a verification workflow before receiving dashboard
                access.
              </p>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-zinc-400">
                {[
                  "Register",
                  "Email Verification",
                  "Pending Approval",
                  "Admin Review",
                  "Approved",
                  "Dashboard Access",
                ].map((step, idx) => (
                  <span key={step} className="px-2 py-1 bg-zinc-900 border border-white/5 rounded">
                    {idx + 1}. {step}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-6 pt-3 border-t border-white/5 text-[11px] font-mono text-zinc-500">
              Benefit: Maintains platform quality and reduces spam accounts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 max-sm:gap-6">
          <div className="p-8 max-sm:p-6 rounded-2xl bg-zinc-950/80 border border-white/5 flex flex-col justify-between">
            <div>
              <h4 className="text-lg font-bold text-white mb-2">
                Your Professional Identity On The Web
              </h4>
              <p className="text-xs text-zinc-400 mb-4">
                Every user receives a public portfolio URL.
              </p>
              <div className="p-3 bg-zinc-900 rounded-lg border border-white/5 font-mono text-xs text-blue-400 mb-4 break-all">
                portify.ai/username
              </div>
              <div className="text-xs text-zinc-400 space-y-1">
                <p className="font-bold text-zinc-300 mb-1">Visitors Can:</p>
                <p>
                  ✓ View Portfolio / Browse Projects / Open Social Profiles / Visit Coding Profiles
                  / Download Resume / Request Contact
                </p>
              </div>
            </div>
            <p className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-zinc-500">
              One link for your complete professional presence.
            </p>
          </div>

          <div className="p-8 max-sm:p-6 rounded-2xl bg-zinc-950/80 border border-white/5 flex flex-col justify-between">
            <div>
              <h4 className="text-lg font-bold text-white mb-2">
                Manage Everything From One Place
              </h4>
              <p className="text-xs text-zinc-400 mb-4">
                Every portfolio management tool is accessible through a single centralized
                dashboard.
              </p>
              <div className="flex flex-wrap gap-2 font-mono text-xs text-zinc-300">
                {[
                  "Profile",
                  "Portfolio",
                  "Resume",
                  "Themes",
                  "Analytics",
                  "Messages",
                  "Settings",
                ].map((mod) => (
                  <span
                    key={mod}
                    className="px-3 py-1 bg-zinc-900 border border-white/10 rounded-md"
                  >
                    {mod}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-zinc-500">
              Centralized workspace control modules.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto py-24 pb-36 max-lg:py-12 max-lg:pb-20 px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative p-8 sm:p-16 max-sm:p-6 rounded-3xl bg-zinc-950/60 border border-white/5 backdrop-blur-xl shadow-2xl overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Launch Your Portfolio In Minutes.
          </h2>
          <p className="text-base text-zinc-400 max-w-2xl mx-auto mb-10 max-sm:mb-8">
            Transform your resume into a professional portfolio, customize every section, publish
            your public profile, and manage your online presence from a single platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto max-sm:px-2">
            {session?.user ? (
              <Link
                href={`/dashboard/${(session.user as any).username}`}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg transition-all duration-300 shadow-xl text-center tracking-wide touch-manipulation"
              >
                Create Portfolio
              </Link>
            ) : (
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg transition-all duration-300 shadow-xl text-center tracking-wide touch-manipulation"
              >
                Create Portfolio
              </Link>
            )}

            <Link
              href="/portfolio/demo"
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium text-sm rounded-lg border border-white/10 transition-all duration-300 text-center tracking-wide touch-manipulation"
            >
              Explore Demo
            </Link>
          </div>

          <div className="mt-12 pt-6 border-t border-white/5 flex flex-wrap justify-center gap-x-6 gap-y-3 text-[11px] font-mono text-zinc-500">
            <span>Resume-Based Portfolio Builder</span>
            <span>No Coding Required</span>
            <span>Multiple Themes</span>
            <span>Professional Analytics</span>
            <span>Public Portfolio Hosting</span>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative group p-6 rounded-xl bg-zinc-900/30 border border-white/[0.04] hover:border-white/10 transition-all duration-300 shadow-xl backdrop-blur-sm">
      <div className="text-xs font-mono font-bold text-zinc-500 bg-zinc-950 border border-white/10 w-9 h-9 rounded-lg flex items-center justify-center mb-4 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all duration-300">
        {number}
      </div>
      <h4 className="font-bold text-base text-white mb-2 transition-colors group-hover:text-zinc-100">
        {title}
      </h4>
      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
        {description}
      </p>
    </div>
  );
}

function PremiumCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="group relative rounded-xl bg-zinc-950/40 border border-white/5 p-6 transition-all duration-300 shadow-lg hover:-translate-y-1 hover:bg-zinc-900/40 hover:border-white/15 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/30 transition-all duration-500" />
      <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 pointer-events-none shine-beam" />
      <h3 className="font-bold text-sm sm:text-base text-zinc-200 mb-2 relative z-10 group-hover:text-emerald-400 transition-colors duration-200">
        {title}
      </h3>
      <p className="text-xs text-zinc-400 leading-relaxed relative z-10 group-hover:text-zinc-300 transition-colors duration-200">
        {desc}
      </p>
    </div>
  );
}

function DetectionPanel({ title, value }: { title: string; value: string }) {
  return (
    <div className="group border border-white/5 rounded-xl p-5 bg-zinc-950/30 hover:border-white/10 transition-all duration-200 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-transparent group-hover:bg-amber-500/50 transition-all duration-200" />
      <h4 className="font-bold text-xs sm:text-sm text-amber-400/90 mb-1.5 tracking-tight">
        {title}
      </h4>
      <p className="text-xs text-zinc-400 leading-relaxed">{value}</p>
    </div>
  );
}
