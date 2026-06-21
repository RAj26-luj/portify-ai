"use client";

import { useState } from "react";
import { 
  Award, ShieldCheck, Box, Fingerprint, ArrowUpRight, 
  X, ExternalLink, FileText, Terminal, Cpu, Calendar 
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

interface CertificationItem {
  name: string;
  issuer: string;
  id: string;
  date: string;
  accentClass: string;
  glowClass: string;
  bgGradient: string;
  certImage: string;
  verificationLink: string;
}

export default function Certifications() {
  const [activeCert, setActiveCert] = useState<CertificationItem | null>(null);

  const certs: CertificationItem[] = [
    {
      name: "AWS Cloud Practitioner",
      issuer: "Amazon Web Services",
      id: "AWS-CP-8839X",
      date: "VAL_2027",
      accentClass: "text-amber-400 border-amber-500/20 bg-amber-500/5",
      glowClass: "group-hover:shadow-[0_25px_60px_rgba(245,158,11,0.15)] group-hover:border-amber-500/30",
      bgGradient: "from-amber-500/10 via-transparent to-transparent",
      certImage: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop",
      verificationLink: "https://aws.amazon.com/verification"
    },
    {
      name: "Professional UX Architect",
      issuer: "UX Global Institute",
      id: "UXA-9912M",
      date: "VAL_2028",
      accentClass: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
      glowClass: "group-hover:shadow-[0_25px_60px_rgba(6,182,212,0.15)] group-hover:border-cyan-500/30",
      bgGradient: "from-cyan-500/10 via-transparent to-transparent",
      certImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop",
      verificationLink: "https://google.com"
    },
    {
      name: "Frontend Advanced Spec",
      issuer: "W3 Tech Guild",
      id: "FE-ADV-4401Z",
      date: "VAL_PERM",
      accentClass: "text-purple-400 border-purple-500/20 bg-purple-500/5",
      glowClass: "group-hover:shadow-[0_25px_60px_rgba(168,85,247,0.15)] group-hover:border-purple-500/30",
      bgGradient: "from-purple-500/10 via-transparent to-transparent",
      certImage: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=800&auto=format&fit=crop",
      verificationLink: "https://w3.org"
    },
  ];

  return (
    <section className="relative py-24 bg-[#030306] overflow-x-hidden" id="certifications">
      {/* Background Grid Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        
        {/* Header Block */}
        <div className="mb-16 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
            <Box size={12} className="text-purple-500 animate-pulse" />
            Secured Credentials Ledger
          </div>
          <h2 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-300 to-zinc-600">
            Verified Expertise
          </h2>
        </div>

        {/* 3D Perspective Grid Matrix */}
        <div className="grid md:grid-cols-3 gap-8">
          {certs.map((cert) => (
            /* --- FIXED STABLE ANCHOR: Hover updates native CSS vars safely --- */
            <div 
              key={cert.id} 
              className="group [perspective:1200px] w-full [--rx:0deg] [--ry:0deg] [--tz:0px] hover:[--rx:10deg] hover:[--ry:-5deg] hover:[--tz:20px]"
            >
              
              {/* --- INNER 3D CARD CHASSIS --- */}
              <div
                onClick={() => setActiveCert(cert)}
                className={`relative h-full bg-[#08080d]/90 border border-white/10 rounded-2xl p-6 transition-all duration-500 ease-out [transform-style:preserve-3d] [backface-visibility:hidden] cursor-pointer ${cert.glowClass}`}
                style={{
                  transform: "rotateX(var(--rx)) rotateY(var(--ry)) translateZ(var(--tz))"
                }}
              >
                {/* Internal Holographic Underlay */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${cert.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                {/* Decorative Cyber Brackets */}
                <span className="absolute top-3 left-3 w-2 h-2 border-t border-l border-white/5 group-hover:border-white/20 transition-colors pointer-events-none" />
                <span className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-white/5 group-hover:border-white/20 transition-colors pointer-events-none" />

                {/* Card Header Structure */}
                <div className="flex items-center justify-between mb-8 [transform:translateZ(15px)] pointer-events-none">
                  <div className={`p-2.5 border rounded-xl transition-all duration-300 ${cert.accentClass}`}>
                    <Award size={18} />
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-wider text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-2 py-1 rounded-md">
                    <ShieldCheck size={10} />
                    SECURE_VERIFIED
                  </div>
                </div>

                {/* Central Title Cluster - High Z-Depth Layer */}
                <div className="space-y-2 [transform:translateZ(40px)] pointer-events-none min-h-[100px]">
                  <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                    {cert.issuer}
                  </p>
                  <h3 className="text-xl font-bold text-zinc-100 tracking-tight leading-snug group-hover:text-white transition-colors">
                    {cert.name}
                  </h3>
                </div>

                {/* Cryptographic Footer Operational Bar */}
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-zinc-600 [transform:translateZ(15px)] pointer-events-none">
                  <div className="flex items-center gap-1.5">
                    <Fingerprint size={12} className="opacity-40" />
                    <span>{cert.id}</span>
                  </div>
                  <span className="text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded text-[9px]">
                    {cert.date}
                  </span>
                </div>

                {/* Action Link Arrow Hover Indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 pointer-events-none">
                  <ArrowUpRight size={14} className="text-zinc-500" />
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* --- SECURE CREDENTIAL INSPECTION DRAWER MODAL --- */}
        {activeCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
            <div className={`absolute w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none ${activeCert.accentClass.split(' ')[2]}`} />

            <div className="relative w-full max-w-3xl bg-[#06060a]/95 border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.95)] my-auto max-h-[90vh] flex flex-col animate-in zoom-in-98 duration-200">
              
              {/* Drawer Top Terminal Header */}
              <div className="p-4 bg-white/[0.02] border-b border-white/10 flex items-center justify-between shrink-0 select-none">
                <div className="flex items-center gap-3">
                  <Terminal size={14} className="text-zinc-500" />
                  <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    Credential Ledger Inspection // <span className="text-white font-bold">{activeCert.id}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveCert(null)}
                  className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Main Content Workspace Layout */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                
                {/* LEFT COLUMN: Certificate Viewer */}
                <div className="md:col-span-5 space-y-2">
                  <h4 className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-2 select-none">
                    <FileText size={12} />
                    Document Secure Frame
                  </h4>
                  
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-white/10 bg-black/80 group">
                    <img 
                      src={activeCert.certImage} 
                      alt={`${activeCert.name} document capture`}
                      className="w-full h-full object-cover select-none brightness-95 group-hover:brightness-100 transition-all duration-300"
                    />
                    {/* Laser Scanner Alignment Mesh Component */}
                    <div className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-40 shadow-[0_0_8px_#34d399] top-0 animate-[bounce_4s_infinite]" />
                  </div>
                </div>

                {/* RIGHT COLUMN: Secure Credentials Data */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-6">
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase block">Certification Authority</span>
                      <h4 className="text-lg font-mono font-bold text-zinc-300">{activeCert.issuer}</h4>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase block">Verified Program Name</span>
                      <h3 className="text-2xl font-black text-white tracking-tight leading-tight">{activeCert.name}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl font-mono">
                        <span className="text-[8px] text-zinc-500 uppercase tracking-wider block">Security Index ID</span>
                        <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5 mt-1">
                          <Fingerprint size={12} className="text-zinc-600" />
                          {activeCert.id}
                        </span>
                      </div>

                      <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl font-mono">
                        <span className="text-[8px] text-zinc-500 uppercase tracking-wider block">Validation Epoch</span>
                        <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5 mt-1">
                          <Calendar size={12} className="text-zinc-600" />
                          {activeCert.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Link Payload Anchor */}
                  <a
                    href={activeCert.verificationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_4px_20px_rgba(16,185,129,0.2)] transition-all duration-300"
                  >
                    <ExternalLink size={14} />
                    <span>Launch Verification Node</span>
                  </a>

                </div>

              </div>

              {/* Status Footer */}
              <div className="px-6 py-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between font-mono text-[9px] text-zinc-600 shrink-0 select-none">
                <span>SECURITY_TRANSMIT_MODE: STABLE_SYNCED</span>
                <span className="text-emerald-500 animate-pulse">● CRYPTO_KEY_VERIFIED</span>
              </div>

            </div>

            {/* Click backdrop target close register */}
            <div className="absolute inset-0 -z-10 cursor-pointer" onClick={() => setActiveCert(null)} />
          </div>
        )}

        {/* Technical Baseline Diagnostics Footer */}
        <div className="mt-16 pt-4 border-t border-white/[0.03] flex items-center justify-between font-mono text-[9px] text-zinc-700 select-none pointer-events-none">
          <div className="flex items-center gap-1.5">
            <Terminal size={10} />
            <span>CREDENTIAL_STREAM_LOADED // DEEP_HITBOX_FIX_OK</span>
          </div>
          <div className="flex items-center gap-1">
            <Cpu size={10} />
            <span>SYS_CERT_v1.1.3</span>
          </div>
        </div>

      </div>
    </section>
  );
}