import { useEffect, useState, useRef } from "react";
import * as THREE from "three";

export default function IntroLoader() {
  const [percent, setPercent] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const statusStates = [
    "Initializing Platform",
    "Processing Resume Structure",
    "Organizing Portfolio Data",
    "Loading Themes",
    "Preparing Dashboard",
    "Launch Ready",
  ];

  useEffect(() => {
    const duration = 10000;
    const intervalTime = 30;
    const totalSteps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextPercent = Math.min(Math.floor((currentStep / totalSteps) * 100), 100);
      setPercent(nextPercent);

      const nextStatusIndex = Math.min(
        Math.floor((nextPercent / 100) * statusStates.length),
        statusStates.length - 1
      );
      setStatusIndex(nextStatusIndex);

      if (currentStep >= totalSteps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scaleFactor = width < 640 ? 1.1 : 1.6;

    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    const segments = 64;
    const coreGeometry = new THREE.SphereGeometry(1.8 * scaleFactor, segments, segments);

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
        vec3 atmosphereColor = vec3(0.23, 0.51, 0.96); // Electric Blue #3B82F6
        
        float oceanAndLand = sin(vUv.x * 20.0 + vUv.y * 10.0) * cos(vUv.y * 15.0);
        vec3 baseColor = vec3(0.02, 0.04, 0.12); // Deep Ocean Dark Palette
        if (oceanAndLand > 0.2) {
          baseColor = vec3(0.08, 0.14, 0.28); // Structural continents
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

    const atmosphereGeometry = new THREE.SphereGeometry(1.83 * scaleFactor, segments, segments);
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

    const particleCount = width < 640 ? 1000 : 2000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const baseColor1 = new THREE.Color("#ffffff");
    const baseColor2 = new THREE.Color("#3B82F6");
    const baseColor3 = new THREE.Color("#A855F7");

    for (let i = 0; i < particleCount; i++) {
      const stride = i * 3;

      const radius = THREE.MathUtils.randFloat(2.2 * scaleFactor, 5.0 * scaleFactor);
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

    if (width < 640) {
      planetGroup.position.set(0, -0.6, 0);
    } else {
      planetGroup.position.set(2.4, -0.4, 0);
    }
    const animate = (time: number) => {
      requestAnimationFrame(animate);

      const elapsedTime = time * 0.001; // milliseconds → seconds

      planetGroup.rotation.y = elapsedTime * 0.06;
      planetGroup.rotation.x = elapsedTime * 0.02;

      spaceBackground.rotation.y = elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    requestAnimationFrame(animate);

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.position.set(0, 0, w < 640 ? 10.5 : 8);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      if (w < 640) {
        planetGroup.position.set(0, -0.6, 0);
      } else {
        planetGroup.position.set(2.4, -0.4, 0);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
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
    <div className="fixed inset-0 z-[9999] w-screen h-screen bg-[#030303] text-[#F4F4F5] select-none overflow-hidden flex flex-col justify-between p-4 sm:p-8 lg:p-12 antialiased">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes subtleGridMove {
              0% { background-position: 0 0; }
              100% { background-position: 40px 40px; }
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(8px); filter: blur(4px); }
              to { opacity: 1; transform: translateY(0); filter: blur(0); }
            }
            .animate-grid-clean {
              background-size: 40px 40px;
              background-image: linear-gradient(to right, rgba(255,255,255,0.012) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255,255,255,0.012) 1px, transparent 1px);
              animation: subtleGridMove 15s linear infinite;
            }
            .font-branding-title {
              letter-spacing: 0.35em;
              text-shadow: 0 0 40px rgba(59, 130, 246, 0.3);
            }
            @media (min-width: 640px) {
              .font-branding-title {
                letter-spacing: 0.6em;
                text-shadow: 0 0 60px rgba(59, 130, 246, 0.4);
              }
            }
          `,
        }}
      />

      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#030303]" />
        <div className="absolute inset-0 animate-grid-clean" />

        <div
          className="absolute top-[-15%] left-[-15%] w-[90vw] sm:w-[65vw] h-[90vw] sm:h-[65vw] bg-[#2563EB]/[0.06] rounded-full blur-[100px] sm:blur-[140px] mix-blend-screen pointer-events-none animate-pulse"
          style={{ animationDuration: "6s" }}
        />
        <div
          className="absolute bottom-[-15%] right-[-15%] w-[90vw] sm:w-[65vw] h-[90vw] sm:h-[65vw] bg-[#9333EA]/[0.06] rounded-full blur-[100px] sm:blur-[140px] mix-blend-screen pointer-events-none animate-pulse"
          style={{ animationDuration: "9s" }}
        />

        <div
          ref={containerRef}
          className="absolute inset-0 w-full h-full opacity-85 sm:opacity-90"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#030303_95%)]" />
      </div>

      <div className="relative z-10 flex justify-between items-center w-full max-w-7xl mx-auto opacity-0 animate-[fadeIn_0.8s_ease-out_forwards_0.1s]">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B82F6] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-[#FFFFFF]"></span>
          </span>
          <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] sm:tracking-[0.3em] text-[#A1A1AA] uppercase">
            PORTIFY_AI_LAUNCH
          </span>
        </div>
        <div className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#71717A]">
          SYS_INIT // 2026
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-center text-center lg:text-left my-auto space-y-6 sm:space-y-10 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8 items-center px-2">
        <div className="lg:col-span-7 space-y-6 sm:space-y-8 flex flex-col justify-center items-center lg:items-start w-full">
          <div className="space-y-3 sm:space-y-4 opacity-0 animate-[fadeIn_1s_ease-out_forwards_0.2s] w-full">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-branding-title text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#E4E4E7] to-[#A1A1AA] pr-[-0.35em] sm:pr-[-0.6em] text-center lg:text-left">
              PORTIFY
            </h1>
            <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-r from-transparent via-[#3B82F6]/40 to-transparent mx-auto lg:mx-0" />
          </div>

          <div className="space-y-3 sm:space-y-4 w-full">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold sm:font-light tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#F4F4F5] to-[#E4E4E7] opacity-0 animate-[fadeIn_1s_ease-out_forwards_0.4s] text-center lg:text-left">
              Build a Professional Portfolio From Your Resume
            </h2>
            <p className="text-[11px] sm:text-xs md:text-sm text-[#A1A1AA] font-normal leading-relaxed max-w-md sm:max-w-lg mx-auto lg:mx-0 opacity-0 animate-[fadeIn_1s_ease-out_forwards_0.5s] text-center lg:text-left px-1 lg:px-0">
              Upload your resume, organize your information, customize your portfolio, and publish
              your professional website.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center lg:justify-start gap-x-5 sm:gap-x-6 gap-y-3 max-w-[290px] sm:max-w-2xl mx-auto lg:mx-0 text-[10px] sm:text-[11px] font-mono text-[#A1A1AA] text-left opacity-0 animate-[fadeIn_1s_ease-out_forwards_0.6s]">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-[#3B82F6] font-sans text-sm leading-none">•</span> Resume Import
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-[#3B82F6] font-sans text-sm leading-none">•</span> AI Extraction
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-[#3B82F6] font-sans text-sm leading-none">•</span> Customization
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-[#A855F7] font-sans text-sm leading-none">•</span> Multiple
              Themes
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-[#A855F7] font-sans text-sm leading-none">•</span> Analytics
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-[#A855F7] font-sans text-sm leading-none">•</span> Public
              Hosting
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 w-full flex justify-center lg:justify-end items-center opacity-0 animate-[fadeIn_1s_ease-out_forwards_0.7s]">
          <div className="w-full max-w-[270px] sm:max-w-sm bg-[#09090B]/60 backdrop-blur-md border border-white/[0.04] rounded-xl p-3.5 sm:p-5 space-y-3.5 shadow-2xl">
            <div className="flex justify-between items-center font-mono text-[9px] sm:text-[10px] tracking-wider">
              <span className="text-[#A1A1AA] transition-all duration-300 min-w-0 truncate pr-2">
                {statusStates[statusIndex]}
              </span>
              <span className="font-semibold text-[#60A5FA] tabular-nums">{percent}%</span>
            </div>

            <div className="h-[2px] w-full bg-[#18181B] rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#60A5FA] rounded-full transition-all duration-300 ease-out relative shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/[0.04] pt-4 sm:pt-6 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-y-4 gap-x-8 text-[9px] sm:text-[10px] font-mono text-[#71717A] opacity-0 animate-[fadeIn_1s_ease-out_forwards_0.8s]">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-center sm:text-left w-full lg:w-auto px-2">
          <span className="flex items-center justify-center sm:justify-start gap-1.5 text-[#D4D4D8]">
            <span className="text-[#10B981] font-sans text-xs">✓</span> Completely Free
          </span>
          <span className="flex items-center justify-center sm:justify-start gap-1.5 text-[#D4D4D8]">
            <span className="text-[#10B981] font-sans text-xs">✓</span> No Watermarks
          </span>
          <span className="text-[#27272A] hidden sm:inline">|</span>
          <span className="flex items-center justify-center sm:justify-start gap-1.5 text-[#D4D4D8]">
            <span className="text-[#10B981] font-sans text-xs">✓</span> No 3rd-Party Branding
          </span>
          <span className="flex items-center justify-center sm:justify-start gap-1.5 text-[#D4D4D8]">
            <span className="text-[#10B981] font-sans text-xs">✓</span> No Promo Badges
          </span>
        </div>
        <div className="tracking-widest text-[#52525B] text-[8px] sm:text-[10px] font-medium">
          WORKSPACE_SECURE_STABLE
        </div>
      </div>
    </div>
  );
}
