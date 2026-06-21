"use client";

import React, { useState, useTransition, useRef } from "react";
import { createContactMessage } from "@/actions/contact-message";
import { Turnstile } from "@marsidev/react-turnstile";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Phone, 
  Send, 
  CheckCircle2, 
  AlertTriangle,
  Globe,
  Terminal,
  Cpu,
  GitBranch,
  ShieldCheck
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
    
    setRotateX((-mouseY / height) * 6);
    setRotateY((mouseX / width) * 6);
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
      setError("Security handshake required: complete Turnstile token verification.");
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

        setSuccess("Transmission established. Remote payload acknowledged in local buffer.");
        setForm({ visitorName: "", visitorEmail: "", note: "" });
        setTurnstileToken("");
      } catch (err: any) {
        setError(err?.message || "Channel error: Failed to forward data stream connection socket.");
      }
    });
  }

  if (!email && !phone && socialLinks.length === 0 && !portfolio?.allowContactForm) {
    return null;
  }

  return (
    <section 
      id="contact" 
      className="relative w-full py-12 md:py-24 overflow-hidden bg-[#0D1117] text-[#C9D1D9] font-mono border-b border-[#30363D] select-none"
    >
      {/* Visual Terminal background Grid mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d10_1px,transparent_1px),linear-gradient(to_bottom,#30363d10_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

      {/* IDE Header Navigation Context */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8">
        <div className="flex items-center justify-between w-full bg-[#161B22] border border-[#30363D] rounded-t-lg px-4 py-2.5 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-[#58A6FF]" />
            <span className="font-bold text-[#C9D1D9]">Open Channel</span>
            <span className="text-neutral-600">/</span>
            <span className="text-[11px] text-[#F78166]">establish_uplink.sh</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7EE787] animate-pulse" />
            <span className="text-[10px] text-neutral-500 hidden sm:inline">SOCKET_READY</span>
          </div>
        </div>
        <div className="p-3.5 bg-[#161B22]/30 border-x border-b border-[#30363D] rounded-b-lg text-left">
          <p className="text-[11px] text-neutral-400">
            <span className="text-[#58A6FF]">ssh</span> connection-request@{identityName.toLowerCase().replace(/\s+/g, "-") || "node"}
          </p>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Direct Channels & Social Cluster Networks */}
        <div className="lg:col-span-5 space-y-4 w-full">
          
          {/* Direct Channels */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-1 text-left flex items-center gap-1.5">
              <Cpu size={12} className="text-[#F78166]" /> // CORE_NODES
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {email && (
                <a 
                  href={`mailto:${email}`}
                  className="group p-3.5 rounded-lg border border-[#30363D] bg-[#161B22] hover:bg-[#1C2128] hover:border-[#58A6FF] transition-all duration-200 flex items-center gap-3.5 cursor-pointer"
                >
                  <div className="p-2 rounded bg-[#0D1117] text-[#58A6FF] border border-[#30363D]">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate text-left">
                    <div className="text-[9px] font-bold text-neutral-500 uppercase tracking-wide">mail_endpoint</div>
                    <div className="text-xs font-bold text-white transition-colors truncate">{email}</div>
                  </div>
                </a>
              )}

              {phone && (
                <a 
                  href={`tel:${phone}`}
                  className="group p-3.5 rounded-lg border border-[#30363D] bg-[#161B22] hover:bg-[#1C2128] hover:border-[#58A6FF] transition-all duration-200 flex items-center gap-3.5 cursor-pointer"
                >
                  <div className="p-2 rounded bg-[#0D1117] text-[#7EE787] border border-[#30363D]">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate text-left">
                    <div className="text-[9px] font-bold text-neutral-500 uppercase tracking-wide">voice_pipe</div>
                    <div className="text-xs font-bold text-white transition-colors truncate">{phone}</div>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Social Cluster Networks */}
          {socialLinks.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-1 text-left flex items-center gap-1.5">
                <GitBranch size={12} className="text-[#7EE787]" /> // PERIMETER_REMOTES ({socialLinks.length})
              </div>
              
              <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-[#30363D] bg-[#161B22]/40 justify-start">
                {socialLinks.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded bg-[#161B22] border border-[#30363D] hover:border-[#58A6FF] hover:bg-[#1C2128] transition-all duration-150 group cursor-pointer max-w-full"
                  >
                    <div className="w-5 h-5 rounded flex items-center justify-center bg-[#0D1117] border border-[#30363D] p-0.5 overflow-hidden text-neutral-400 group-hover:text-[#58A6FF] shrink-0">
                      {s.iconUrl ? (
                        <img 
                          src={s.iconUrl} 
                          alt="" 
                          className="w-full h-full object-contain filter brightness-90"
                        />
                      ) : (
                        <Globe className="w-3 h-3" />
                      )}
                    </div>

                    <span className="text-[11px] text-neutral-400 group-hover:text-white transition-colors truncate max-w-[110px]">
                      {s.platform.toLowerCase()}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Interactive Form Command Console */}
        <div className="lg:col-span-7 w-full h-full md:perspective-[1000px]">
          {portfolio?.allowContactForm && (
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full bg-[#161B22] border border-[#30363D] rounded-lg p-5 md:p-6 relative overflow-hidden shadow-xl transition-all duration-200 ease-out group"
              style={{
                transformStyle: "preserve-3d",
                rotateX: typeof window !== "undefined" && window.innerWidth < 768 ? 0 : rotateX,
                rotateY: typeof window !== "undefined" && window.innerWidth < 768 ? 0 : rotateY,
              }}
            >
              <div className="flex items-center justify-between mb-4 border-b border-[#30363D] pb-3" style={{ transform: "translateZ(20px)" }}>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#7EE787]" /> payload_stream_input
                </h3>
                <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider bg-[#0D1117] px-1.5 py-0.5 rounded border border-[#30363D]">
                  AES_256_GCM
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5" style={{ transform: "translateZ(10px)" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-neutral-500 pl-0.5 block text-left">identified_handle</label>
                    <input
                      type="text"
                      placeholder="e.g. anonymous-developer"
                      required
                      value={form.visitorName}
                      onChange={(e) => setForm((prev) => ({ ...prev, visitorName: e.target.value }))}
                      className="w-full bg-[#0D1117] border border-[#30363D] rounded px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#58A6FF] transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-neutral-500 pl-0.5 block text-left">return_endpoint</label>
                    <input
                      type="email"
                      placeholder="name@domain.com"
                      required
                      value={form.visitorEmail}
                      onChange={(e) => setForm((prev) => ({ ...prev, visitorEmail: e.target.value }))}
                      className="w-full bg-[#0D1117] border border-[#30363D] rounded px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#58A6FF] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-neutral-500 pl-0.5 block text-left">payload_buffer_note</label>
                  <textarea
                    placeholder="Enter explicit string parameters or collaboration metrics context..."
                    rows={4}
                    required
                    value={form.note}
                    onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#58A6FF] transition-colors resize-none"
                  />
                </div>

                <div className="py-0.5 flex justify-start rounded">
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
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="p-3 rounded bg-[#161B22] border border-[#3FB950]/30 flex items-start gap-2 text-left"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#3FB950] shrink-0 mt-0.5" />
                      <p className="text-xs text-[#3FB950] font-bold leading-normal">{success}</p>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="p-3 rounded bg-[#161B22] border border-[#F78166]/30 flex items-start gap-2 text-left"
                    >
                      <AlertTriangle className="w-4 h-4 text-[#F78166] shrink-0 mt-0.5" />
                      <p className="text-xs text-[#F78166] font-bold leading-normal">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isPending || !turnstileToken}
                  className={`w-full py-2 px-3 rounded font-bold text-xs flex items-center justify-center gap-1.5 transition-all relative overflow-hidden group/btn cursor-pointer ${
                    !turnstileToken || isPending
                      ? "bg-[#21262D] border border-[#30363D] text-neutral-500 cursor-not-allowed"
                      : "bg-[#238636] text-white hover:bg-[#2ea043] border border-[#2ea043]/30 active:scale-[0.99]"
                  }`}
                >
                  {isPending ? (
                    <>
                      <div className="w-3 h-3 border-2 border-neutral-400 border-t-white rounded-full animate-spin" />
                      <span>committing_to_ledger...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                      <span>git push origin main</span>
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