"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import * as THREE from "three";

export default function HomeClient({ session }: { session: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !sectionRef.current) return;

    const container = containerRef.current;
    const interactiveSection = sectionRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, width < 640 ? 9.5 : 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scaleFactor = width < 640 ? 1.0 : 1.4;

    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    const segments = 64;
    const coreGeometry = new THREE.SphereGeometry(1.5 * scaleFactor, segments, segments);

    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
        vec3 atmosphereColor = vec3(0.23, 0.51, 0.96); 
        
        float oceanAndLand = sin(vUv.x * 20.0 + vUv.y * 10.0) * cos(vUv.y * 15.0);
        vec3 baseColor = vec3(0.02, 0.04, 0.12); 
        if (oceanAndLand > 0.2) {
          baseColor = vec3(0.08, 0.14, 0.28); 
        }
        
        float clouds = smoothstep(0.1, 0.6, sin(vUv.x * 35.0 - vUv.y * 5.0) * cos(vUv.y * 25.0 + vUv.x * 10.0));
        vec3 finalMap = mix(baseColor, vec3(0.9, 0.95, 1.0), clouds * 0.4);
        
        gl_FragColor = vec4(finalMap + atmosphereColor * intensity * 1.5, 1.0);
      }
    `;

    const coreMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      blending: THREE.NormalBlending,
      side: THREE.FrontSide,
    });

    const coreSphere = new THREE.Mesh(coreGeometry, coreMaterial);
    planetGroup.add(coreSphere);

    const atmosphereGeometry = new THREE.SphereGeometry(1.53 * scaleFactor, segments, segments);
    const atmosphereVertexShader = `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const atmosphereFragmentShader = `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
        gl_FragColor = vec4(0.38, 0.65, 0.98, 1.0) * intensity * 1.8;
      }
    `;

    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });

    const atmosphereSphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    planetGroup.add(atmosphereSphere);

    const particleCount = width < 640 ? 800 : 1800;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const baseColor1 = new THREE.Color("#ffffff");
    const baseColor2 = new THREE.Color("#3B82F6");
    const baseColor3 = new THREE.Color("#A855F7");

    for (let i = 0; i < particleCount; i++) {
      const stride = i * 3;

      const radius = THREE.MathUtils.randFloat(1.9 * scaleFactor, 4.5 * scaleFactor);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = Math.acos(THREE.MathUtils.randFloat(-1, 1));

      positions[stride] = radius * Math.sin(phi) * Math.cos(theta);
      positions[stride + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[stride + 2] = radius * Math.cos(phi);

      const mixSelector = Math.random();
      let finalColor = baseColor1;
      if (mixSelector > 0.4 && mixSelector <= 0.75) {
        finalColor = baseColor2;
      } else if (mixSelector > 0.75) {
        finalColor = baseColor3;
      }

      colors[stride] = finalColor.r;
      colors[stride + 1] = finalColor.g;
      colors[stride + 2] = finalColor.b;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const pointTexture = new THREE.TextureLoader().load(
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="4" fill="white" filter="blur(0.4px)"/></svg>'
    );

    const particleMaterial = new THREE.PointsMaterial({
      size: width < 640 ? 0.025 : 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: pointTexture,
    });

    const spaceBackground = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(spaceBackground);

    // Premium Physics Parameters
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const springEaser = 0.06;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = interactiveSection.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      mouse.targetX = (x / rect.width) * 2 - 1;
      mouse.targetY = -(y / rect.height) * 2 + 1;
    };

    const handleMouseLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
    };

    interactiveSection.addEventListener("mousemove", handleMouseMove);
    interactiveSection.addEventListener("mouseleave", handleMouseLeave);

    const startTime = performance.now();

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) / 1000;

      mouse.x += (mouse.targetX - mouse.x) * springEaser;
      mouse.y += (mouse.targetY - mouse.y) * springEaser;

      planetGroup.rotation.y = elapsedTime * 0.05 + mouse.x * 0.4;
      planetGroup.rotation.x = elapsedTime * 0.015 - mouse.y * 0.3;

      spaceBackground.rotation.y = elapsedTime * 0.01 + mouse.x * 0.15;
      spaceBackground.rotation.x = mouse.y * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.position.set(0, 0, w < 640 ? 10.5 : 8);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      interactiveSection.removeEventListener("mousemove", handleMouseMove);
      interactiveSection.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      coreGeometry.dispose();
      coreMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

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
        .animate-aurora-blend { animation: auroraGlow 25s infinite linear; }
        .3d-grid-floor {
          background-size: 50px 50px;
          background-image: linear-gradient(to right, rgba(255,255,255,0.012) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.012) 1px, transparent 1px);
          animation: customGrid 15s linear infinite;
        }
        .perspective-deep { perspective: 1600px; }
        .interactive-zone:hover { cursor: crosshair; }
      `,
        }}
      />

      {/* Global Background Visual Layer */}
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

      {/* Full-Width Full-Screen Interactive Hero Section Container */}
      <section
        ref={sectionRef}
        className="relative w-full min-h-[90vh] flex items-center justify-center pt-32 pb-24 px-4 sm:px-6 lg:px-8 z-10 perspective-deep interactive-zone overflow-hidden"
      >
        {/* Full-screen Canvas Wrapper decoupling from the text layouts */}
        <div
          ref={containerRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-85"
        />

        {/* Centered Hero Content directly overlayed over the 3D element */}
        <div className="relative max-w-4xl mx-auto flex flex-col items-center text-center space-y-6 z-20 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 backdrop-blur-xl shadow-2xl transition-transform duration-300 hover:scale-[1.02]">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-xs font-mono tracking-widest text-zinc-300 uppercase">
              RESUME → PORTFOLIO PLATFORM
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-500 drop-shadow-md max-w-3xl">
            Build a Professional Portfolio From Your Resume
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed max-w-2xl drop-shadow">
            Upload your resume, organize your experience, projects, skills, achievements, and
            certifications, customize your portfolio, choose a theme, and publish your personal
            website from a single dashboard.
          </p>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl font-light">
            Completely free to use. No watermarks. No third-party branding. No promotional badges.
            Your portfolio, your content, your identity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto pt-4 max-sm:px-2">
            {session?.user ? (
              <Link
                href={`/dashboard/${(session.user as any).username}`}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium text-sm rounded-lg transition-all duration-300 shadow-[0_0_40px_rgba(59,130,246,0.3)] active:scale-[0.98] border border-blue-400/30 text-center tracking-wide touch-manipulation"
              >
                Go to Dashboard
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

          <div className="pt-8 border-t border-white/5 w-full flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1">
              <span className="text-blue-500">✓</span> Resume Import
            </span>
            <span className="flex items-center gap-1">
              <span className="text-blue-500">✓</span> No Coding Required
            </span>
            <span className="flex items-center gap-1">
              <span className="text-blue-500">✓</span> Multiple Themes
            </span>
            <span className="flex items-center gap-1">
              <span className="text-blue-500">✓</span> Analytics Included
            </span>
            <span className="flex items-center gap-1">
              <span className="text-blue-500">✓</span> Public Portfolio URL
            </span>
          </div>
        </div>

        {/* Floating Core Engine Metrics Dashboard overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#09090B]/60 backdrop-blur-md border border-white/[0.04] rounded-xl p-3 flex justify-between items-center z-20 shadow-2xl pointer-events-none w-[calc(100%-2rem)] max-w-xs">
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider truncate">
              Core Engine Status
            </span>
            <span className="text-[10px] font-mono text-blue-400 font-medium truncate">
              CORE_MODEL_ACTIVE
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[9px] text-zinc-300 bg-zinc-900/80 border border-white/5 px-2 py-0.5 rounded">
            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
            99.9%
          </div>
        </div>
      </section>

      {/* How It Works */}
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

      {/* Resume Extraction */}
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

      {/* Missing Information Detection */}
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

      {/* Resume Update Engine */}
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

      {/* Section Customization */}
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

      {/* Theme System */}
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

      {/* Quality Review Section */}
      <section className="bg-zinc-950/40 border-y border-white/5 py-28 max-lg:py-16 px-4 sm:px-6 lg:px-8 relative z-10 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 max-lg:mb-10">
            <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-green-400 mb-3">
              QUALITY REVIEW
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              Every Portfolio Is Reviewed Before Publishing
            </h3>
            <p className="text-base text-zinc-400 max-w-2xl mx-auto">
              To maintain quality and reduce spam, every newly created portfolio goes through a
              review process before becoming publicly accessible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-zinc-950/80 border border-white/5">
              <div className="text-green-400 font-mono text-xs mb-2">STEP 01</div>
              <h4 className="text-white font-bold mb-2">Create Portfolio</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Upload your resume and build your portfolio using the dashboard.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-zinc-950/80 border border-white/5">
              <div className="text-green-400 font-mono text-xs mb-2">STEP 02</div>
              <h4 className="text-white font-bold mb-2">Submit For Review</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Once satisfied with your content, submit your portfolio for review.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-zinc-950/80 border border-white/5">
              <div className="text-green-400 font-mono text-xs mb-2">STEP 03</div>
              <h4 className="text-white font-bold mb-2">Quality Check</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We review portfolios to ensure content quality, completeness, and a better
                experience for visitors.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-zinc-950/80 border border-white/5">
              <div className="text-green-400 font-mono text-xs mb-2">STEP 04</div>
              <h4 className="text-white font-bold mb-2">Go Live</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                After approval, your portfolio receives a public URL and becomes accessible to
                everyone.
              </p>
            </div>
          </div>

          <div className="mt-10 p-5 rounded-xl bg-green-500/5 border border-green-500/20 text-center">
            <p className="text-sm text-zinc-300 leading-relaxed">
              This review process helps maintain platform quality, prevents spam, and ensures
              visitors see complete and professional portfolios.
            </p>
          </div>
        </div>
      </section>

      {/* Icon Management System */}
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

      {/* Telemetry, Ingress & Security Gate */}
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
              <h4 className="text-xl font-bold text-white mt-2 mb-3">
                Account Verification & Portfolio Review
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                Every account passes through a verification workflow before receiving dashboard
                access.
              </p>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-zinc-400">
                {[
                  "Register",
                  "Email Verification",
                  "Pending Approval",
                  "Portfolio Review",
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

      {/* CTA Section */}
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
                Go to Dashboard
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
