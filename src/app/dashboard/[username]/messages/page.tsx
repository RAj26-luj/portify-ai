"use client";

import { useEffect, useState } from "react";
import { 
  Mail, 
  Loader2, 
  AlertTriangle, 
  LayoutGrid, 
  List, 
  Search, 
  X, 
  ArrowUpDown, 
  Inbox,
  Calendar,
  User,
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import {
  getContactMessages,
  markContactMessageSeen,
} from "@/actions/contact-message";
import ContactMessageCard from "@/components/cards/contact-message-card";

type Message = {
  id: string;
  visitorName: string;
  visitorEmail: string;
  note?: string | null;
  isSeen: boolean;
  seenAt?: Date | null;
  createdAt: Date;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modern UI/UX View Layout, Filter, & Multi-click Protection States
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [processingId, setProcessingId] = useState<string | null>(null);

  async function loadMessages() {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Fetch action envelope payload
      const result = await getContactMessages("");

      // 🛡️ Discriminated Union Guard: Asserts operation success before reading arrays
      if (!result || !result.success || !("data" in result) || !Array.isArray(result.data)) {
        throw new Error("error" in result && typeof result.error === "string" ? result.error : "Failed compiling your inbox logs.");
      }

      // ✅ Safe Unwrapping: TypeScript knows result.data is strictly Message[]
      setMessages(
        result.data.map((msg: any) => ({
          id: msg.id,
          visitorName: msg.visitorName,
          visitorEmail: msg.visitorEmail,
          note: msg.note ?? null,
          isSeen: !!msg.isSeen,
          seenAt: msg.seenAt ? new Date(msg.seenAt) : null,
          createdAt: new Date(msg.createdAt),
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sync inbound message collections.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSeen(id: string) {
    if (processingId) return;
    try {
      setProcessingId(id);
      
      const result = await markContactMessageSeen(id);

      if (!result || !result.success) {
        throw new Error("error" in result && typeof result.error === "string" ? result.error : "Failed updating visibility markers.");
      }

      await loadMessages();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to mark message as seen. Please try again.");
    } finally {
      setProcessingId(null);
    }
  }

  // Forces browser to launch a clean webmail compose target instance directly
  const executeBrowserCompose = (email: string) => {
    const targetUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    loadMessages();
  }, []);

  // Filter and Sorting execution arrays logic pipelines
  const filteredMessages = messages
    .filter((msg) => {
      const criteria = `${msg.visitorName} ${msg.visitorEmail} ${msg.note || ""}`.toLowerCase();
      const matchesSearch = criteria.includes(searchQuery.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "ALL" || 
        (statusFilter === "UNREAD" && !msg.isSeen) || 
        (statusFilter === "READ" && msg.isSeen);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[45vh] sm:min-h-[55vh] gap-4 bg-[#050505] text-zinc-500 border border-zinc-900 rounded-xl select-none font-mono p-4 text-center">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-7 w-7 sm:h-8 sm:w-8 animate-spin text-blue-500 z-10" />
          <div className="absolute h-7 w-7 sm:h-8 sm:w-8 border border-zinc-800 rounded-full animate-ping opacity-20" />
        </div>
        <p className="text-[10px] sm:text-xs uppercase tracking-widest">// Synchronizing dashboard message desk...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl my-6 sm:my-12 rounded-xl border border-red-500/10 bg-gradient-to-b from-red-500/5 to-transparent p-4 sm:p-5 shadow-2xl flex gap-3 items-start text-white font-sans w-full">
        <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">Sync Pipeline Interrupted</h4>
          <p className="text-[11px] sm:text-xs text-red-400/90 leading-relaxed break-words">{error}</p>
          <button 
            onClick={loadMessages}
            className="w-full inline-flex h-8 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 px-3 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            Retry Verification Stream
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 text-white max-w-[1440px] mx-auto font-sans antialiased px-3 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-x-hidden">
      
      {/* PREMIUM ACTIONS CONTROL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-4 sm:pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 shadow-sm">
              <Mail size={15} />
            </div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-zinc-100">Message Center</h1>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-500 font-medium leading-relaxed">
            Monitor, track, and parse direct contact requests submitted contextually by public portfolio audience members.
          </p>
        </div>

        {messages.length > 0 && (
          <div className="flex items-center rounded-lg border border-zinc-900 bg-zinc-950 p-0.5 text-zinc-500 self-start sm:self-auto shrink-0 hidden sm:flex">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "hover:text-zinc-300"}`}
              title="Grid Layout Matrix"
            >
              <LayoutGrid size={13} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "hover:text-zinc-300"}`}
              title="Tabular Inbound Feed"
            >
              <List size={13} />
            </button>
          </div>
        )}
      </div>

      {/* EXTERNAL COMMUNICATION SAFETY PROTOCOL HINT */}
      <div className="text-[9px] sm:text-[11px] text-amber-400 font-mono bg-amber-500/5 border border-amber-500/10 rounded-lg p-3 sm:p-4 leading-relaxed flex items-start gap-2 sm:gap-2.5 animate-fadeIn">
        <ShieldAlert size={14} className="shrink-0 mt-0.5 text-amber-400 animate-pulse" />
        <span className="space-y-0.5">
          <strong className="text-zinc-200 uppercase tracking-wide block text-[10px] sm:text-xs mb-0.5">System Protocol // External Communication Routing</strong>
          All responses happen completely outside of Portify AI. Click <span className="text-zinc-100 font-bold underline">Mail Them</span> to trigger a safe window redirect route that automatically spawns a browser-based compose tab populated with the selected lead credentials.
        </span>
      </div>

      {/* FILTER CONTROL HUBS TOOLBAR */}
      {messages.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-3 sm:items-center sm:justify-between border-b border-zinc-900/50 pb-4 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 w-full lg:min-w-0">
            <div className="relative w-full sm:max-w-xs md:max-w-sm shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 h-3.5 w-3.5" />
              <input 
                type="text"
                placeholder="Search visitor details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 h-8.5 bg-[#09090b] border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400">
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="flex items-center bg-zinc-950 p-0.5 rounded-lg border border-zinc-900 w-full sm:w-auto justify-center">
              {(["ALL", "UNREAD", "READ"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`flex-1 sm:flex-none px-3 py-1 text-[9px] sm:text-[10px] font-mono font-bold tracking-tight rounded-md uppercase transition-all ${statusFilter === status ? 'bg-zinc-900 border border-zinc-800 text-zinc-200 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end shrink-0 w-full lg:w-auto mt-2 lg:mt-0">
            <div className="flex items-center gap-0.5 bg-zinc-950 border border-zinc-900 p-0.5 rounded-lg text-[11px] font-mono w-full lg:w-auto justify-center">
              <button
                type="button"
                onClick={() => setSortBy("newest")}
                className={`flex-1 lg:flex-none inline-flex h-6 items-center justify-center gap-1 px-2.5 rounded-md font-bold uppercase tracking-all ${sortBy === "newest" ? "bg-zinc-900 text-zinc-200 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <ArrowUpDown size={9} />
                <span>Newest</span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy("oldest")}
                className={`flex-1 lg:flex-none inline-flex h-6 items-center justify-center gap-1 px-2.5 rounded-md font-bold uppercase tracking-all ${sortBy === "oldest" ? "bg-zinc-900 text-zinc-200 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <ArrowUpDown size={9} />
                <span>Oldest</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECIPIENT LOGS CONTROLLERS */}
      {filteredMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/10 p-6 sm:p-12 text-center max-w-xl mx-auto my-4 animate-fadeIn w-full">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900 text-zinc-500 mb-3 shadow-inner">
            <Inbox size={18} />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">
            {messages.length === 0 ? "Message Desk Quiet" : "No tracking logs found"}
          </h3>
          
          <div className="text-[11px] sm:text-xs text-zinc-500 max-w-xs sm:max-w-sm mt-1.5 leading-relaxed font-sans space-y-2 w-full">
            <p>
              {messages.length === 0 
                ? "Your inbound portal mail system has returned blank initialization scopes. When external recruiters request connection tracking signatures via your site forms, records generate on this line."
                : "No matching registered communication paths found. Adjust your filters to clear indexing array slots."
              }
            </p>
          </div>

          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
              }}
              className="mt-4 inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white px-4 text-xs font-semibold transition-colors shadow-sm"
            >
              Reset Structural Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* MOBILE STREAM */}
          <div className="block sm:hidden space-y-2.5 animate-fadeIn">
            {filteredMessages.map((message) => (
              <div 
                key={message.id} 
                onClick={() => !message.isSeen && handleSeen(message.id)}
                className={`p-3.5 rounded-xl border border-zinc-800 bg-[#0C0C0E] space-y-3 shadow-sm relative overflow-hidden transition-colors ${!message.isSeen ? "border-blue-500/30 bg-blue-500/[0.01]" : ""}`}
              >
                {!message.isSeen && (
                  <div className="absolute top-0 right-0 border-b border-l border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[8px] font-mono font-bold tracking-wider text-blue-400 rounded-bl">
                    NEW
                  </div>
                )}
                
                <div className="space-y-1 pr-10">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-100">
                    <User size={11} className={!message.isSeen ? "text-blue-400" : "text-zinc-600"} />
                    <span className="truncate max-w-[180px]">{message.visitorName}</span>
                  </div>
                  <p className="text-[10px] font-mono text-zinc-500 truncate select-all">{message.visitorEmail}</p>
                  
                  {message.note && (
                    <p className="text-[11px] text-zinc-400 font-sans line-clamp-3 pt-1.5 leading-relaxed italic break-words">
                      “{message.note}”
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-zinc-900" onClick={(e) => e.stopPropagation()}>
                  <span className="text-[9px] font-mono text-zinc-600">
                    {new Date(message.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => executeBrowserCompose(message.visitorEmail)}
                      className="inline-flex h-6 items-center justify-center px-2.5 rounded border border-zinc-800 bg-zinc-900 text-[10px] font-bold text-zinc-300 transition-colors gap-1"
                    >
                      <span>Mail Them</span>
                      <ExternalLink size={9} className="text-zinc-500" />
                    </button>
                    {!message.isSeen && (
                      <button
                        type="button"
                        disabled={processingId === message.id}
                        onClick={() => handleSeen(message.id)}
                        className="inline-flex h-6 items-center justify-center gap-1 rounded border border-blue-900/20 bg-blue-950/20 px-2 text-[10px] font-bold text-blue-400"
                      >
                        {processingId === message.id ? <Loader2 size={10} className="animate-spin" /> : "Read"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEWPORTS */}
          <div className="hidden sm:block">
            {viewMode === "grid" ? (
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 animate-fadeIn">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className="cursor-pointer"
                    onClick={() => !message.isSeen && handleSeen(message.id)}
                  >
                    <ContactMessageCard
                      id={message.id}
                      visitorName={message.visitorName}
                      visitorEmail={message.visitorEmail}
                      note={message.note ?? undefined}
                      createdAt={message.createdAt.toISOString()}
                      isSeen={message.isSeen}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#070709] shadow-sm animate-fadeIn w-full">
                <table className="w-full text-left border-collapse min-w-[750px]">
                  <thead>
                    <tr className="border-b border-zinc-900 text-[10px] font-mono uppercase tracking-widest text-zinc-500 bg-zinc-950/40">
                      <th className="py-3 px-4 font-bold">Visitor Identity</th>
                      <th className="py-3 px-4 font-bold">Inbound Address</th>
                      <th className="py-3 px-4 font-bold">Message Note Preview</th>
                      <th className="py-3 px-4 font-bold">Chronology Receipt</th>
                      <th className="py-3 px-4 font-bold">Audit Status</th>
                      <th className="py-3 px-4 font-bold text-right">Operational Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs font-sans">
                    {filteredMessages.map((message) => (
                      <tr 
                        key={message.id} 
                        onClick={() => !message.isSeen && handleSeen(message.id)}
                        className={`hover:bg-zinc-900/30 transition-colors group/row cursor-pointer ${!message.isSeen ? "bg-blue-500/[0.02]" : ""}`}
                      >
                        <td className="py-3.5 px-4 min-w-[150px]">
                          <div className="flex items-center gap-2">
                            <User size={12} className={!message.isSeen ? "text-blue-400" : "text-zinc-600"} />
                            <div className={`font-bold transition-colors truncate max-w-[140px] ${!message.isSeen ? "text-white group-hover/row:text-blue-400" : "text-zinc-400 group-hover/row:text-white"}`}>
                              {message.visitorName}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400 truncate max-w-xs select-all">
                          {message.visitorEmail}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 max-w-xs truncate font-medium italic">
                          {message.note ? `“${message.note}”` : <span className="text-zinc-700 not-italic">No custom abstract log attached</span>}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-500 font-mono text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={11} className="text-zinc-700 shrink-0" />
                            <span>
                              {new Date(message.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-mono font-bold border ${
                            !message.isSeen ? "bg-blue-500/5 border-blue-500/10 text-blue-400" : "bg-zinc-900 border-zinc-800 text-zinc-600"
                          }`}>
                            {!message.isSeen ? "UNREAD" : "SEEN"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right shrink-0" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2.5">
                            <button
                              type="button"
                              onClick={() => executeBrowserCompose(message.visitorEmail)}
                              className="text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800 inline-flex items-center justify-center h-7 gap-1"
                            >
                              <span>Mail Them</span>
                              <ExternalLink size={10} className="text-zinc-500 group-hover/row:text-zinc-300" />
                            </button>
                            {!message.isSeen && (
                              <button
                                type="button"
                                disabled={processingId === message.id}
                                onClick={() => handleSeen(message.id)}
                                className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors bg-blue-950/10 hover:bg-blue-950/20 px-2.5 py-1 rounded border border-blue-900/10 inline-flex items-center justify-center h-7 min-w-[70px]"
                              >
                                {processingId === message.id ? <Loader2 size={10} className="animate-spin" /> : "Mark Read"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}