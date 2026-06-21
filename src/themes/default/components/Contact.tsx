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
    
    setRotateX((-mouseY / height) * 10);
    setRotateY((mouseX / width) * 10);
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
      className="relative w-full py-16 md:py-36 overflow-hidden bg-black text-white selection:bg-purple-500/30"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_90%,rgba(139,92,246,0.06),transparent_60%)] pointer-events-none" />
      <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 mb-10 md:mb-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs text-purple-400 tracking-wider uppercase mb-3 md:mb-4 backdrop-blur-md">
            <Mail className="w-3.5 h-3.5" />
            // {identityName.toUpperCase()}_GATEWAY
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold tracking-tight bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            Initiate Connection.
          </h2>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Side: Direct Channels & Responsive Social Networks */}
        <div className="lg:col-span-5 space-y-6 md:space-y-8 w-full">
          
          {/* Direct Channels */}
          <div className="space-y-3">
            <div className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 px-1 text-left">Direct Nodes</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {email && (
                <a 
                  href={`mailto:${email}`}
                  className="group p-4 rounded-xl border border-white/5 bg-[#07070b] md:bg-white/[0.01] hover:bg-white/[0.03] hover:border-purple-500/30 backdrop-blur-xl transition-all duration-300 flex items-center gap-4 cursor-pointer"
                >
                  <div className="p-2.5 rounded-xl bg-purple-500/5 text-purple-400 border border-purple-500/10 group-hover:bg-purple-500/10 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate text-left">
                    <div className="text-[9px] font-mono uppercase tracking-wider text-neutral-500">Secure E-Mail</div>
                    <div className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors truncate">{email}</div>
                  </div>
                </a>
              )}

              {phone && (
                <a 
                  href={`tel:${phone}`}
                  className="group p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-purple-500/30 backdrop-blur-xl transition-all duration-300 flex items-center gap-4 cursor-pointer"
                >
                  <div className="p-2.5 rounded-xl bg-purple-500/5 text-purple-400 border border-purple-500/10 group-hover:bg-purple-500/10 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="truncate text-left">
                    <div className="text-[9px] font-mono uppercase tracking-wider text-neutral-500">Voice Link</div>
                    <div className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors truncate">{phone}</div>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Optimized Social Grid Network Layout */}
          {socialLinks.length > 0 && (
            <div className="space-y-3">
              <div className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 px-1 text-left">
                Perimeter Grid Networks ({socialLinks.length})
              </div>
              
              {/* Using flex wrap with auto-sizing blocks instead of jagged grids */}
              <div className="flex flex-wrap gap-2.5 p-3.5 rounded-2xl border border-white/5 bg-[#07070b] md:bg-white/[0.01] backdrop-blur-xl justify-start">
                {socialLinks.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all duration-300 group cursor-pointer max-w-full"
                  >
                    {/* Compact layout alignment matching the navbar and skill structures */}
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-neutral-900 border border-white/5 p-1 overflow-hidden text-neutral-400 group-hover:text-purple-400 shrink-0">
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

                    <span className="text-[11px] font-mono font-medium tracking-wide text-neutral-400 group-hover:text-white transition-colors duration-200 truncate max-w-[120px]">
                      {s.platform}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Interactive Form Pipeline Console */}
        <div className="lg:col-span-7 w-full h-full md:perspective-[1000px]">
          {portfolio?.allowContactForm && (
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full bg-[#050508] md:bg-gradient-to-b md:from-neutral-950 md:to-neutral-900/50 border border-neutral-900 md:border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-8 relative overflow-hidden shadow-2xl backdrop-blur-3xl transition-all duration-200 ease-out group"
              style={{
                transformStyle: "preserve-3d",
                rotateX: typeof window !== "undefined" && window.innerWidth < 768 ? 0 : rotateX,
                rotateY: typeof window !== "undefined" && window.innerWidth < 768 ? 0 : rotateY,
              }}
            >
              <div className="absolute -left-32 -top-32 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/10 transition-all duration-500" />
              
              <div className="flex items-center justify-between mb-5 md:mb-6 border-b border-white/5 pb-3 md:pb-4" style={{ transform: "translateZ(30px)" }}>
                <h3 className="text-base md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" /> Data Stream Uplink
                </h3>
                <span className="text-[9px] md:text-[10px] font-mono text-neutral-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 md:py-1 rounded-md border border-white/5">
                  TLS Encrypted
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" style={{ transform: "translateZ(20px)" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 pl-1 block text-left">Identified Handle</label>
                    <input
                      type="text"
                      placeholder="Ada Lovelace"
                      required
                      value={form.visitorName}
                      onChange={(e) => setForm((prev) => ({ ...prev, visitorName: e.target.value }))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 md:py-3 text-xs md:text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all backdrop-blur-md"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 pl-1 block text-left">Return Endpoint</label>
                    <input
                      type="email"
                      placeholder="name@domain.com"
                      required
                      value={form.visitorEmail}
                      onChange={(e) => setForm((prev) => ({ ...prev, visitorEmail: e.target.value }))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 md:py-3 text-xs md:text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all backdrop-blur-md"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 pl-1 block text-left">Payload Note Context</label>
                  <textarea
                    placeholder="Describe your engineering requirement parameters..."
                    rows={4}
                    required
                    value={form.note}
                    onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 md:py-3 text-xs md:text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all resize-none backdrop-blur-md"
                  />
                </div>

                <div className="py-1 flex justify-start origin-left overflow-hidden rounded-xl">
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
                      className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 text-left"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-emerald-400 font-medium leading-relaxed">{success}</p>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-left"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-rose-400 font-medium leading-relaxed">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isPending || !turnstileToken}
                  className={`w-full py-2.5 md:py-3 px-4 rounded-xl font-medium tracking-wide text-xs md:text-sm flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group/btn cursor-pointer ${
                    !turnstileToken || isPending
                      ? "bg-neutral-900 border border-white/5 text-neutral-500 cursor-not-allowed"
                      : "bg-white text-black hover:bg-neutral-200 shadow-xl shadow-white/5 active:scale-[0.99]"
                  }`}
                >
                  {isPending ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-neutral-400 border-t-black rounded-full animate-spin" />
                      <span>Syncing Transmission Ledger...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
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