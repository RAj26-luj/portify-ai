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
  Globe
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
    
    setRotateX((-mouseY / height) * 8);
    setRotateY((mouseX / width) * 8);
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
      setError("Please complete security validation check.");
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

        setSuccess("Transmission established. Message received successfully.");
        setForm({ visitorName: "", visitorEmail: "", note: "" });
        setTurnstileToken("");
      } catch (err: any) {
        setError(err?.message || "Channel error: Failed to forward data stream.");
      }
    });
  }

  if (!email && !phone && socialLinks.length === 0 && !portfolio?.allowContactForm) {
    return null;
  }

  return (
    <section 
      id="contact" 
      className="relative w-full py-20 md:py-40 overflow-hidden bg-[#0A0A0B] text-white selection:bg-[#6366F1]/30"
    >
      {/* Premium SaaS Micro-Grid & Gradient Mesh Background Architecture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181B_1px,transparent_1px),linear-gradient(to_bottom,#18181B_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-t from-[#6366F1]/10 via-[#8B5CF6]/5 to-transparent blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 mb-16 md:mb-24">
        <div className="max-w-2xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#18181B] bg-[#111113]/60 text-[11px] font-semibold text-[#6366F1] tracking-wider uppercase mb-4 backdrop-blur-md font-mono shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
            <Mail className="w-3.5 h-3.5 text-[#6366F1]" />
            {identityName.toUpperCase()}_GATEWAY
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-b from-white via-[#D4D4D8] to-[#71717A] bg-clip-text text-transparent font-sans">
            Initiate Connection<span className="text-[#06B6D4]">.</span>
          </h2>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Side: Premium Direct Core Channels & Social Layout Networks */}
        <div className="lg:col-span-5 space-y-8 w-full text-left">
          
          {/* Direct Core Communication Nodes */}
          <div className="space-y-4">
            <div className="text-xs uppercase font-mono tracking-wider text-[#71717A] px-1 font-semibold">Direct Nodes</div>
            <div className="grid grid-cols-1 gap-3.5">
              {email && (
                <a 
                  href={`mailto:${email}`}
                  className="group p-5 rounded-2xl border border-[#18181B] bg-[#111113]/50 hover:bg-[#111113] hover:border-[#6366F1]/30 backdrop-blur-xl transition-all duration-300 flex items-center gap-4 cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                >
                  <div className="p-3 rounded-xl bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 group-hover:bg-[#6366F1]/20 group-hover:border-[#6366F1]/30 transition-all shadow-inner">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] font-semibold">Secure E-Mail</div>
                    <div className="text-sm font-bold text-[#D4D4D8] group-hover:text-white transition-colors truncate font-sans mt-0.5">{email}</div>
                  </div>
                </a>
              )}

              {phone && (
                <a 
                  href={`tel:${phone}`}
                  className="group p-5 rounded-2xl border border-[#18181B] bg-[#111113]/50 hover:bg-[#111113] hover:border-[#6366F1]/30 backdrop-blur-xl transition-all duration-300 flex items-center gap-4 cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                >
                  <div className="p-3 rounded-xl bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 group-hover:bg-[#6366F1]/20 group-hover:border-[#6366F1]/30 transition-all shadow-inner">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] font-semibold">Voice Link</div>
                    <div className="text-sm font-bold text-[#D4D4D8] group-hover:text-white transition-colors truncate font-sans mt-0.5">{phone}</div>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Premium Perimeter Grid Networks Ecosystem Component */}
          {socialLinks.length > 0 && (
            <div className="space-y-4">
              <div className="text-xs uppercase font-mono tracking-wider text-[#71717A] px-1 font-semibold">
                Perimeter Grid Networks ({socialLinks.length})
              </div>
              
              <div className="flex flex-wrap gap-2.5 p-4 rounded-2xl border border-[#18181B] bg-[#111113]/40 backdrop-blur-xl shadow-inner">
                {socialLinks.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#18181B]/40 border border-[#18181B] hover:border-[#71717A]/40 hover:bg-[#18181B] transition-all duration-300 group cursor-pointer max-w-full"
                  >
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-[#111113] border border-[#18181B] p-1 overflow-hidden text-[#71717A] group-hover:text-[#6366F1] shrink-0 shadow-sm transition-colors">
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

                    <span className="text-xs font-sans font-bold tracking-wide text-[#71717A] group-hover:text-white transition-colors duration-200 truncate max-w-[140px]">
                      {s.platform}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Reconstructed SaaS Application Form Hub Dashboard */}
        <div className="lg:col-span-7 w-full h-full md:perspective-[2000px]">
          {portfolio?.allowContactForm && (
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full bg-[#111113]/80 border border-[#18181B] rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.02)] backdrop-blur-xl transition-all duration-300 ease-out group"
              style={{
                transformStyle: "preserve-3d",
                rotateX: typeof window !== "undefined" && window.innerWidth < 768 ? 0 : rotateX,
                rotateY: typeof window !== "undefined" && window.innerWidth < 768 ? 0 : rotateY,
              }}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#6366F1]/5 to-transparent rounded-bl-full blur-2xl pointer-events-none group-hover:from-[#6366F1]/10 transition-all duration-500" />
              
              <div className="flex items-center justify-between mb-6 border-b border-[#18181B] pb-4 text-left" style={{ transform: "translateZ(30px)" }}>
                <h3 className="text-base md:text-xl font-bold text-white tracking-tight flex items-center gap-2 font-sans">
                  <Sparkles className="w-4 h-4 text-[#6366F1]" /> Data Stream Uplink
                </h3>
                <span className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider bg-[#18181B] px-2.5 py-1 rounded-lg border border-[#18181B] shadow-sm">
                  TLS Encrypted
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 text-left" style={{ transform: "translateZ(20px)" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] uppercase font-mono tracking-wider text-[#71717A] pl-1 block font-semibold">Identified Handle</label>
                    <input
                      type="text"
                      placeholder="Ada Lovelace"
                      required
                      value={form.visitorName}
                      onChange={(e) => setForm((prev) => ({ ...prev, visitorName: e.target.value }))}
                      className="w-full bg-[#0A0A0B]/60 border border-[#18181B] rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-[#6366F1]/60 focus:ring-1 focus:ring-[#6366F1]/30 transition-all backdrop-blur-md font-sans shadow-inner"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] uppercase font-mono tracking-wider text-[#71717A] pl-1 block font-semibold">Return Endpoint</label>
                    <input
                      type="email"
                      placeholder="name@domain.com"
                      required
                      value={form.visitorEmail}
                      onChange={(e) => setForm((prev) => ({ ...prev, visitorEmail: e.target.value }))}
                      className="w-full bg-[#0A0A0B]/60 border border-[#18181B] rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-[#6366F1]/60 focus:ring-1 focus:ring-[#6366F1]/30 transition-all backdrop-blur-md font-sans shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] uppercase font-mono tracking-wider text-[#71717A] pl-1 block font-semibold">Payload Note Context</label>
                  <textarea
                    placeholder="Describe your engineering requirement parameters..."
                    rows={4}
                    required
                    value={form.note}
                    onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                    className="w-full bg-[#0A0A0B]/60 border border-[#18181B] rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-[#6366F1]/60 focus:ring-1 focus:ring-[#6366F1]/30 transition-all resize-none backdrop-blur-md font-sans shadow-inner"
                  />
                </div>

                <div className="py-1 flex justify-start origin-left overflow-hidden rounded-xl border border-transparent shadow-sm">
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
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-emerald-400 font-semibold font-sans leading-relaxed">{success}</p>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-rose-400 font-semibold font-sans leading-relaxed">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isPending || !turnstileToken}
                  className={`w-full py-3 px-5 rounded-xl font-bold tracking-wide text-xs md:text-sm flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group/btn cursor-pointer font-sans border ${
                    !turnstileToken || isPending
                      ? "bg-[#18181B] border-[#18181B] text-[#71717A] cursor-not-allowed shadow-inner"
                      : "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-[0_4px_15px_rgba(99,102,241,0.2)] border-white/10 active:scale-[0.99] hover:opacity-95"
                  }`}
                >
                  {isPending ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Syncing Transmission Ledger...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 text-white/90" />
                      <span>Forward Payload Pipeline</span>
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