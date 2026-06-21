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
    
    setRotateX((-mouseY / height) * 2);
    setRotateY((mouseX / width) * 2);
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
      className="relative w-full py-16 md:py-24 bg-white text-[#111827] selection:bg-gray-200"
    >
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 mb-12 md:mb-16">
        <div className="max-w-2xl border-b border-gray-100 pb-6 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-gray-400 tracking-widest uppercase mb-2">
            <Mail className="w-3.5 h-3.5" />
            09 / Communication
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#111827] font-sans uppercase">
            Initiate Connection.
          </h2>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        
        {/* Left Side: Direct Channels & Responsive Social Networks */}
        <div className="lg:col-span-4 space-y-8 w-full">
          
          {/* Direct Channels */}
          <div className="space-y-4">
            <div className="text-[10px] uppercase font-mono tracking-widest text-gray-400 font-bold text-left">Direct Nodes</div>
            <div className="flex flex-col gap-3">
              {email && (
                <a 
                  href={`mailto:${email}`}
                  className="group p-4 bg-[#FAFAFA] border border-gray-200 rounded-none transition-colors hover:bg-gray-50 flex items-center gap-4 cursor-pointer"
                >
                  <div className="p-2 bg-white text-[#111827] border border-gray-200 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate text-left">
                    <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400">Secure E-Mail</div>
                    <div className="text-sm font-bold text-[#111827] truncate">{email}</div>
                  </div>
                </a>
              )}

              {phone && (
                <a 
                  href={`tel:${phone}`}
                  className="group p-4 bg-[#FAFAFA] border border-gray-200 rounded-none transition-colors hover:bg-gray-50 flex items-center gap-4 cursor-pointer"
                >
                  <div className="p-2 bg-white text-[#111827] border border-gray-200 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="truncate text-left">
                    <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400">Voice Link</div>
                    <div className="text-sm font-bold text-[#111827] truncate">{phone}</div>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Optimized Social Grid Network Layout */}
          {socialLinks.length > 0 && (
            <div className="space-y-4">
              <div className="text-[10px] uppercase font-mono tracking-widest text-gray-400 font-bold text-left">
                Perimeter Networks ({socialLinks.length})
              </div>
              
              <div className="flex flex-wrap gap-2.5 p-4 bg-[#FAFAFA] border border-gray-200 rounded-none justify-start">
                {socialLinks.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 hover:border-gray-400 transition-colors group cursor-pointer max-w-full rounded-none"
                  >
                    <div className="w-5 h-5 flex items-center justify-center bg-white p-0.5 overflow-hidden text-gray-400 group-hover:text-[#111827] shrink-0">
                      {s.iconUrl ? (
                        <img 
                          src={s.iconUrl} 
                          alt="" 
                          className="w-full h-full object-contain select-none grayscale"
                        />
                      ) : (
                        <Globe className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <span className="text-[11px] font-mono font-bold tracking-wide text-gray-500 group-hover:text-[#111827] transition-colors truncate uppercase max-w-[120px]">
                      {s.platform}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Interactive Form Pipeline Console */}
        <div className="lg:col-span-8 w-full h-full">
          {portfolio?.allowContactForm && (
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full bg-[#FAFAFA] border border-gray-200 rounded-none p-6 md:p-8 relative overflow-hidden text-left"
            >
              <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                <h3 className="text-base md:text-lg font-extrabold text-[#111827] tracking-tight uppercase flex items-center gap-2 font-sans">
                  Data Uplink Pipeline
                </h3>
                <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest bg-white px-2 py-1 border border-gray-200">
                  TLS SECURE
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-gray-400 font-bold block text-left">Identified Handle</label>
                    <input
                      type="text"
                      placeholder="Ada Lovelace"
                      required
                      value={form.visitorName}
                      onChange={(e) => setForm((prev) => ({ ...prev, visitorName: e.target.value }))}
                      className="w-full bg-white border border-gray-200 rounded-none px-3.5 py-2.5 text-xs md:text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-gray-400 font-bold block text-left">Return Endpoint</label>
                    <input
                      type="email"
                      placeholder="name@domain.com"
                      required
                      value={form.visitorEmail}
                      onChange={(e) => setForm((prev) => ({ ...prev, visitorEmail: e.target.value }))}
                      className="w-full bg-white border border-gray-200 rounded-none px-3.5 py-2.5 text-xs md:text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-gray-400 font-bold block text-left">Payload Note Context</label>
                  <textarea
                    placeholder="Describe your engineering requirement parameters..."
                    rows={4}
                    required
                    value={form.note}
                    onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                    className="w-full bg-white border border-gray-200 rounded-none px-3.5 py-2.5 text-xs md:text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors resize-none font-sans"
                  />
                </div>

                <div className="py-1 flex justify-start origin-left overflow-hidden rounded-none">
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken("")}
                    onError={() => setTurnstileToken("")}
                    options={{ theme: "light" }}
                  />
                </div>

                <AnimatePresence mode="wait">
                  {success && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-3.5 rounded-none bg-gray-50 border border-gray-300 flex items-start gap-2.5 text-left"
                    >
                      <CheckCircle2 className="w-4 h-4 text-gray-800 shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-800 font-bold leading-relaxed">{success}</p>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-3.5 rounded-none bg-gray-50 border border-red-200 flex items-start gap-2.5 text-left"
                    >
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-600 font-bold leading-relaxed">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isPending || !turnstileToken}
                  className={`w-full py-2.5 px-4 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors duration-200 rounded-none border group/btn cursor-pointer ${
                    !turnstileToken || isPending
                      ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#111827] text-white border-transparent hover:bg-black"
                  }`}
                >
                  {isPending ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                      <span>Syncing Transmission Ledger...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Forward Pipeline</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}