"use client";

import React, { useState, useTransition, useRef } from "react";
import { createContactMessage } from "@/actions/contact-message";
import { Turnstile } from "@marsidev/react-turnstile";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Phone, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Globe,
  Radio,
  Cpu,
  Terminal,
  Activity
} from "lucide-react";

interface ContactProps {
  portfolio: {
    id: string;
    email?: string;
    phone?: string;
    allowContactForm?: boolean;
    title?: string;
    user?: {
      name?: string;
    };
    socialLinks?: Array<{
      id: string;
      platform: string;
      url: string;
      iconUrl?: string | null;
    }>;
  };
}

export default function Contact({ portfolio }: ContactProps) {
  const email = portfolio?.email;
  const phone = portfolio?.phone;
  const socialLinks = portfolio?.socialLinks || [];
  const identityName = portfolio?.title || portfolio?.user?.name || "IDENTITY_NODE";

  const [isPending, startTransition] = useTransition();
  const [turnstileToken, setTurnstileToken] = useState("");
  const [form, setForm] = useState({ visitorName: "", visitorEmail: "", note: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const element = cardRef.current;
    const rect = element.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    setRotateX((-mouseY / height) * 12);
    setRotateY((mouseX / width) * 12);
  }

  function handleMouseLeave() {
    setRotateX(0);
    setRotateY(0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!turnstileToken) {
      setError("Security handshake required: Missing Turnstile validation key.");
      return;
    }

    startTransition(async () => {
      try {
        await createContactMessage({
          portfolioId: portfolio.id,
          visitorName: form.visitorName,
          visitorEmail: form.visitorEmail,
          note: form.note,
          turnstileToken,
        });

        setSuccess("Transmission established. Quantum data packet received at terminal node.");
        setForm({ visitorName: "", visitorEmail: "", note: "" });
        setTurnstileToken("");
      } catch (err: any) {
        setError(err?.message || "Channel link failure: Failed to bridge secure payload tunnel.");
      }
    });
  }

  if (!email && !phone && socialLinks.length === 0 && !portfolio?.allowContactForm) {
    return null;
  }

  return (
    <section 
      id="contact" 
      className="relative w-full py-20 md:py-40 overflow-hidden bg-[#050816] text-[#F8FAFC] selection:bg-[#00E5FF]/30"
    >
      {/* Background Cyber-Grid Architecture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,229,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,229,255,0.015)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(124,58,237,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute -bottom-48 left-1/4 w-[500px] h-[500px] bg-[#00E5FF]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 mb-12 md:mb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#00E5FF]/10 pb-6">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0B1120] border border-[#00E5FF]/30 text-[10px] font-mono text-[#00E5FF] tracking-[0.2em] uppercase mb-4 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
              <Radio className="w-3.5 h-3.5 animate-pulse text-[#00FF9D]" />
              COMMS_PORTAL // {identityName.toUpperCase()}_GATEWAY
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white font-mono uppercase drop-shadow-[0_0_12px_rgba(0,229,255,0.3)]">
              // ESTABLISH_CONNECTION
            </h2>
          </div>
          <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] text-neutral-500 tracking-widest uppercase">
            <Activity className="w-4 h-4 text-[#00FF9D] animate-pulse" />
            <span>CHANNEL_STATUS: FREQUENCY_STABLE</span>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
        
        {/* Left Side: Direct Channels & Responsive Social Networks */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8 w-full">
          
          {/* Direct Channels */}
          <div className="space-y-4">
            <div className="text-[10px] uppercase font-mono font-bold tracking-[0.2em] text-[#00E5FF] px-1 text-left flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full" />
              DIRECT_LINK_NODES
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {email && (
                <a 
                  href={`mailto:${email}`}
                  className="group p-5 bg-[#0B1120] border border-neutral-800 hover:border-[#00E5FF]/50 shadow-xl transition-all duration-300 flex items-center gap-4 cursor-pointer relative overflow-hidden rounded-none"
                >
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neutral-700 group-hover:border-[#00E5FF]" />
                  <div className="p-3 bg-[#050816] text-[#00E5FF] border border-neutral-800 group-hover:border-[#00E5FF]/30 group-hover:bg-[#00E5FF]/5 transition-all">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate text-left">
                    <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-neutral-500">SECURE_CORE_EMAIL</div>
                    <div className="text-sm font-bold font-mono text-neutral-200 group-hover:text-[#00E5FF] transition-colors truncate">{email}</div>
                  </div>
                </a>
              )}

              {phone && (
                <a 
                  href={`tel:${phone}`}
                  className="group p-5 bg-[#0B1120] border border-neutral-800 hover:border-[#7C3AED]/50 shadow-xl transition-all duration-300 flex items-center gap-4 cursor-pointer relative overflow-hidden rounded-none"
                >
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neutral-700 group-hover:border-[#7C3AED]" />
                  <div className="p-3 bg-[#050816] text-[#7C3AED] border border-neutral-800 group-hover:border-[#7C3AED]/30 group-hover:bg-[#7C3AED]/5 transition-all">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="truncate text-left">
                    <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-neutral-500">VOICE_COMM_UPLINK</div>
                    <div className="text-sm font-bold font-mono text-neutral-200 group-hover:text-[#7C3AED] transition-colors truncate">{phone}</div>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Optimized Social Grid Network Layout */}
          {socialLinks.length > 0 && (
            <div className="space-y-4 pt-4 lg:pt-0">
              <div className="text-[10px] uppercase font-mono font-bold tracking-[0.2em] text-[#7C3AED] px-1 text-left flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full" />
                PERIMETER_GRID_NETWORKS ({socialLinks.length})
              </div>
              
              <div className="flex flex-wrap gap-3 p-4 bg-[#0B1120] border border-neutral-800 backdrop-blur-xl justify-start rounded-none relative">
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neutral-700" />
                {socialLinks.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 px-3 py-2 bg-[#050816] border border-neutral-800 hover:border-[#00FF9D]/40 transition-all duration-300 group cursor-pointer max-w-full"
                  >
                    <div className="w-6 h-6 rounded bg-[#0B1120] border border-neutral-800 flex items-center justify-center p-1 overflow-hidden text-neutral-400 group-hover:text-[#00FF9D] group-hover:border-[#00FF9D]/20 shrink-0 mix-blend-luminosity group-hover:mix-blend-normal transition-all">
                      {s.iconUrl ? (
                        <img 
                          src={s.iconUrl} 
                          alt="" 
                          className="w-full h-full object-contain select-none"
                        />
                      ) : (
                        <Globe className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <span className="text-[11px] font-mono font-bold tracking-wider text-neutral-400 group-hover:text-white transition-colors truncate max-w-[130px]">
                      {s.platform?.toUpperCase()}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Interactive Form Pipeline Console */}
        <div className="lg:col-span-7 w-full h-full md:perspective-[1200px]">
          {portfolio?.allowContactForm && (
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full bg-[#0B1120] border border-neutral-800 rounded-none p-6 md:p-8 relative overflow-hidden shadow-2xl transition-all duration-200 ease-out group"
              style={{
                transformStyle: "preserve-3d",
                rotateX: typeof window !== "undefined" && window.innerWidth < 768 ? 0 : rotateX,
                rotateY: typeof window !== "undefined" && window.innerWidth < 768 ? 0 : rotateY,
                boxShadow: "0 30px 70px -15px rgba(0,0,0,0.6), inset 0 0 30px rgba(0,229,255,0.02)"
              }}
            >
              {/* Theme Decorative Accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00E5FF]" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#7C3AED]" />
              <div className="absolute -right-32 -top-32 w-64 h-64 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#00E5FF]/10 transition-all duration-500" />
              
              <div className="flex items-center justify-between mb-6 border-b border-neutral-800 pb-4" style={{ transform: "translateZ(30px)" }}>
                <h3 className="text-base md:text-lg font-black font-mono text-white uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#00E5FF] animate-spin duration-3000" /> // PAYLOAD_PIPELINE_CONSOLE
                </h3>
                <span className="text-[9px] md:text-[10px] font-mono font-bold text-[#00FF9D] uppercase tracking-widest bg-[#00FF9D]/10 px-2.5 py-1 border border-[#00FF9D]/20 rounded-sm">
                  SSL_SECURE
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" style={{ transform: "translateZ(20px)" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-mono font-bold tracking-widest text-neutral-400 pl-1 block text-left">// IDENTIFIED_HANDLE</label>
                    <input
                      type="text"
                      placeholder="e.g. CORE_OPERATOR"
                      required
                      value={form.visitorName}
                      onChange={(e) => setForm((prev) => ({ ...prev, visitorName: e.target.value }))}
                      className="w-full bg-[#050816] border border-neutral-800 rounded-none px-4 py-3 text-xs font-mono text-white placeholder-neutral-700 focus:outline-none focus:border-[#00E5FF]/60 focus:ring-1 focus:ring-[#00E5FF]/20 transition-all shadow-inner"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-mono font-bold tracking-widest text-neutral-400 pl-1 block text-left">// RETURN_ENDPOINT</label>
                    <input
                      type="email"
                      placeholder="operator@domain.com"
                      required
                      value={form.visitorEmail}
                      onChange={(e) => setForm((prev) => ({ ...prev, visitorEmail: e.target.value }))}
                      className="w-full bg-[#050816] border border-neutral-800 rounded-none px-4 py-3 text-xs font-mono text-white placeholder-neutral-700 focus:outline-none focus:border-[#00E5FF]/60 focus:ring-1 focus:ring-[#00E5FF]/20 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono font-bold tracking-widest text-neutral-400 pl-1 block text-left">// PAYLOAD_CONTEXT_STREAM</label>
                  <textarea
                    placeholder="Input system telemetry parameters or tactical requirements requirement specifications..."
                    rows={4}
                    required
                    value={form.note}
                    onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                    className="w-full bg-[#050816] border border-neutral-800 rounded-none px-4 py-3 text-xs font-mono text-white placeholder-neutral-700 focus:outline-none focus:border-[#00E5FF]/60 focus:ring-1 focus:ring-[#00E5FF]/20 transition-all resize-none shadow-inner"
                  />
                </div>

                <div className="py-1 flex justify-start origin-left overflow-hidden bg-[#050816] p-2 border border-neutral-800">
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken("")}
                    onError={() => setTurnstileToken("")}
                    options={{ theme: "dark" }}
                  />
                </div>

                <AnimatePresence mode="wait">
                  {success && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="p-4 bg-[#00FF9D]/5 border border-[#00FF9D]/30 flex items-start gap-3 text-left rounded-none"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#00FF9D] shrink-0 mt-0.5" />
                      <div className="font-mono text-xs text-[#00FF9D]">
                        <span className="font-bold block">[SUCCESS_METRIC]:</span>
                        {success}
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="p-4 bg-[#FF4D6D]/5 border border-[#FF4D6D]/30 flex items-start gap-3 text-left rounded-none"
                    >
                      <AlertTriangle className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
                      <div className="font-mono text-xs text-[#FF4D6D]">
                        <span className="font-bold block">[CRITICAL_ERR]:</span>
                        {error}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isPending || !turnstileToken}
                  className={`w-full py-3.5 px-6 font-mono font-bold uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-2 transition-all relative overflow-hidden group/btn rounded-none cursor-pointer ${
                    !turnstileToken || isPending
                      ? "bg-neutral-900 border border-neutral-800 text-neutral-600 cursor-not-allowed"
                      : "bg-[#00E5FF]/10 border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#050816] shadow-[0_0_20px_rgba(0,229,255,0.15)] active:scale-[0.99]"
                  }`}
                >
                  {isPending ? (
                    <>
                      <Terminal className="w-4 h-4 animate-pulse text-[#00FF9D]" />
                      <span>TUNNEL_BROADCAST_RUNNING...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                      <span>FORWARD_PAYLOAD_PIPELINE</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}