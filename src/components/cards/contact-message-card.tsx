"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  MessageSquare, 
  Calendar, 
  CheckCircle2, 
  Eye, 
  Loader2, 
  AlertTriangle,
  Clock,
  Trash2
} from "lucide-react";
import { markContactMessageSeen } from "@/actions/contact-message";

interface Props {
  id: string;
  visitorName: string;
  visitorEmail: string;
  note?: string;
  createdAt?: string;
  isSeen?: boolean;
}

export default function ContactMessageCard({
  id,
  visitorName,
  visitorEmail,
  note,
  createdAt,
  isSeen = false,
}: Props) {
  const [seen, setSeen] = useState(isSeen);
  const [loading, setLoading] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
  
  // HUD Toast transient states
  const [showNotification, setShowNotification] = useState(false);

  async function handleSeen() {
    if (loading || seen) return; // Multi-click protect lifecycle guard
    
    setLoading(true);
    setErrorFeedback(null);
    try {
      await markContactMessageSeen(id);
      setSeen(true);
      
      // Trigger premium feedback contextual overlay HUD
      setShowNotification(true);
    } catch (error) {
      setErrorFeedback("Unable to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Self-killing overlay timer setup
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  return (
    <>
      {/* MOBILE COMPACT ROW LIST VIEW */}
      <div className="block sm:hidden p-3.5 rounded-xl border border-zinc-950 bg-[#070709] hover:bg-zinc-900/10 transition-all duration-200 w-full relative overflow-hidden">
        {/* Mobile Backdrop Notification HUD Overlay */}
        {showNotification && (
          <div className="absolute inset-0 z-50 flex items-center justify-between bg-zinc-950/95 backdrop-blur-sm p-3 animate-fadeIn">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Trash2 size={13} className="text-amber-400 shrink-0 animate-pulse" />
              <p className="text-[10px] text-zinc-300 font-sans truncate leading-normal">
                Marked read. Auto-deletes in 1 day.
              </p>
            </div>
            <button 
              onClick={() => setShowNotification(false)}
              className="text-[9px] font-mono text-zinc-500 hover:text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex items-start gap-3 justify-between">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 mt-0.5">
              <User size={12} />
            </div>
            
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="text-xs font-bold text-zinc-200 truncate max-w-[140px]">
                  {visitorName}
                </h3>
                {!seen ? (
                  <span className="inline-flex h-3.5 px-1 items-center bg-blue-500/10 border border-blue-500/20 rounded text-[8px] font-bold uppercase text-blue-400 shrink-0">
                    New
                  </span>
                ) : (
                  <span className="inline-flex h-3.5 px-1 items-center bg-zinc-900 border border-zinc-800 rounded text-[8px] font-medium text-zinc-500 shrink-0">
                    Seen
                  </span>
                )}
              </div>

              {/* Display plain text metadata representation avoiding link triggers for mobile list view encapsulation */}
              <p className="text-[10px] text-zinc-500 truncate block">
                {visitorEmail}
              </p>

              {createdAt && (
                <p className="text-[9px] font-mono text-zinc-600">
                  {new Date(createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </p>
              )}
            </div>
          </div>

          {/* Mobile HUD Controls Operations Inline Drawer */}
          <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
            {!seen ? (
              <button
                type="button"
                disabled={loading}
                onClick={handleSeen}
                className="h-6 px-2.5 inline-flex items-center justify-center gap-1 rounded border border-zinc-800 bg-zinc-900 text-zinc-300 text-[10px] font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={10} className="animate-spin text-blue-400" />
                ) : (
                  <Eye size={10} className="text-zinc-500" />
                )}
                <span>View</span>
              </button>
            ) : (
              <div className="h-6 px-2 inline-flex items-center justify-center gap-1 rounded bg-emerald-500/5 text-emerald-400/90 text-[10px] border border-emerald-500/10">
                <CheckCircle2 size={10} />
              </div>
            )}
          </div>
        </div>

        {/* Core Narrative Inline Body Segment Snippet */}
        {note && (
          <div className="mt-2.5 rounded-lg border border-zinc-900/60 bg-zinc-900/10 p-2.5 text-[11px] text-zinc-400 font-sans break-words whitespace-pre-wrap line-clamp-2">
            {note}
          </div>
        )}

        {/* Server Action Feedback Architecture for Mobile Viewport Window */}
        {errorFeedback && (
          <div className="mt-2.5 flex items-center gap-1.5 rounded-md border border-red-500/10 bg-red-500/5 p-2 text-[10px] text-red-400">
            <AlertTriangle size={11} className="shrink-0" />
            <span className="font-medium truncate">{errorFeedback}</span>
          </div>
        )}
      </div>

      {/* LAPTOP & DESKTOP FULL PRESENTATION CARD RUNTIME */}
      <div className="hidden sm:flex group/msg-card relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-[#0C0C0E] p-5 shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:border-zinc-700 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.6)]">
        
        {/* Premium Backdrop Blur Transient Notification HUD */}
        {showNotification && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-md animate-fade-in duration-200 p-4 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400 mb-2.5 shadow-sm">
              <Trash2 size={18} className="animate-pulse" />
            </div>
            <p className="text-xs font-semibold text-zinc-100 tracking-tight">Status Updated Successfully</p>
            <p className="text-[11px] text-zinc-400 mt-1 max-w-[200px]">This message is marked as read and will be permanently deleted after 1 day.</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Header Block Alignment Architecture */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 transition-colors group-hover/msg-card:text-blue-400">
                <User size={14} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-zinc-200 text-sm tracking-tight truncate group-hover/msg-card:text-white transition-colors">
                  {visitorName}
                </h3>
                {/* Changed fallback structure from functional mailto anchor redirection deck parameters to standard structural label */}
                <div className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 truncate">
                  <Mail size={10} className="shrink-0" />
                  <span className="truncate">{visitorEmail}</span>
                </div>
              </div>
            </div>

            {/* Dynamic Status Badging Stack */}
            {!seen ? (
              <span className="inline-flex items-center gap-1 rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-blue-400 animate-pulse">
                <span>●</span>
                <span>New</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900/40 px-2 py-0.5 text-[10px] font-medium tracking-wide text-zinc-500">
                <span>Seen</span>
              </span>
            )}
          </div>

          {/* Core Narrative / Message Node content frame */}
          {note && (
            <div className="relative rounded-lg border border-zinc-900 bg-zinc-900/20 p-3.5">
              <div className="absolute top-3 right-3 text-zinc-700">
                <MessageSquare size={12} />
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-zinc-300 break-words whitespace-pre-wrap font-sans">
                {note}
              </p>
            </div>
          )}

          {/* Dynamic Contextual Lifecycle Notification Note */}
          <div className={`flex items-start gap-1.5 rounded-lg p-2 text-[11px] border transition-all ${
            seen 
              ? "border-amber-500/10 bg-amber-500/5 text-amber-400/90" 
              : "border-zinc-800 bg-zinc-900/30 text-zinc-500"
          }`}>
            <Clock size={12} className="shrink-0 mt-0.5" />
            <span>
              {seen 
                ? "Marked seen: This item will be automatically purged in 1 day." 
                : "Unread message: Once marked seen, it will automatically delete after 1 day."}
            </span>
          </div>

          {/* Chronological Log Parameter Metrics layout row */}
          {createdAt && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-600">
              <Calendar size={12} className="shrink-0" />
              <span>
                {new Date(createdAt).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>
            </div>
          )}
        </div>

        {/* Exception Feedback Banner Layer */}
        {errorFeedback && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/10 bg-red-500/5 p-2.5 text-xs text-red-400">
            <AlertTriangle size={13} className="shrink-0" />
            <span className="font-medium">{errorFeedback}</span>
          </div>
        )}

        {/* State Transitions Direct Action Management Dock Footer */}
        <div className="mt-4 flex border-t border-zinc-900 pt-3.5">
          {seen ? (
            <div className="w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-zinc-900 bg-zinc-900/10 px-3 py-1.5 text-xs font-medium text-emerald-500/90 select-none">
              <CheckCircle2 size={13} className="shrink-0" />
              <span>Message Processed</span>
            </div>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleSeen}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-white text-zinc-300 px-3 py-1.5 text-xs font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-700/20 disabled:opacity-50 select-none"
            >
              {loading ? (
                <Loader2 size={12} className="animate-spin text-blue-400" />
              ) : (
                <Eye size={12} className="text-zinc-500" />
              )}
              <span>{loading ? "Updating Archive..." : "Mark as Seen"}</span>
            </button>
          )}
        </div>

      </div>
    </>
  );
}