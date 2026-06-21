"use client";

import { useEffect, useState } from "react";
import { 
  Loader2, 
  Clock, 
  Inbox, 
  ShieldAlert, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Check 
} from "lucide-react";

type ApprovalRequest = {
  id: string;
  userId: string;
  note?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
};

type ResponseData = {
  approvals: ApprovalRequest[];
};

export default function ApprovalsPage() {
  const [data, setData] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/approval");
        if (!res.ok) throw new Error("Failed to load approvals");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const action = async (id: string, type: "APPROVE" | "REJECT") => {
    setProcessingId(id);
    try {
      const res = await fetch("/api/approval", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type }),
      });

      if (!res.ok) throw new Error("Action failed");

      setData((prev) => {
        if (!prev) return prev;
        return {
          approvals: prev.approvals.map((a) =>
            a.id === id ? { ...a, status: type === "APPROVE" ? "APPROVED" : "REJECTED" } : a
          ),
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 bg-[#050505] text-zinc-500 font-mono border border-white/5 rounded-2xl mx-3 md:mx-0">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <p className="text-[10px] uppercase tracking-widest">// Syncing Stream...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mx-3 md:mx-0 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center gap-3 text-xs font-mono text-red-400">
        <ShieldAlert size={16} className="shrink-0 text-red-500" />
        <span>System Error: {error}</span>
      </div>
    );
  }

  const pendingRequests = data?.approvals.filter((a) => a.status === "PENDING") || [];
  const processedRequests = data?.approvals.filter((a) => a.status !== "PENDING") || [];

  return (
    <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto px-3 md:px-4 py-4 md:py-8 text-zinc-300 antialiased">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-blue-500/5 border border-blue-500/10 text-blue-400 font-mono text-[9px] uppercase tracking-widest">
            <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
            <span>Admin Authorization Console</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Approvals</h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold px-3 py-2 rounded-lg bg-[#111113] border border-white/5">
          <span>Pending Queue:</span>
          <span className="text-blue-400">{pendingRequests.length}</span>
        </div>
      </div>

      {/* PENDING LIST */}
      <div className="space-y-3">
        {pendingRequests.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/5 rounded-xl text-xs text-zinc-500 font-mono">
            <Inbox size={24} className="mx-auto mb-3 opacity-50" />
            <p>No active requests found.</p>
          </div>
        ) : (
          pendingRequests.map((a) => (
            <div key={a.id} className="border border-white/5 bg-[#111113] rounded-xl p-4 sm:p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <p className="font-bold text-white truncate">{a.user.name}</p>
                  <p className="text-[11px] font-mono text-zinc-500 truncate">{a.user.email}</p>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1 text-[9px] font-mono px-2 py-1 rounded bg-amber-500/5 border border-amber-500/10 text-amber-400 uppercase">
                  <Clock size={10} /> Pending
                </span>
              </div>

              {a.note && (
                <div className="bg-[#0A0A0B] border border-white/5 rounded-lg p-3 text-xs text-zinc-400 font-sans italic">
                  {a.note}
                </div>
              )}

              <div className="flex gap-2 w-full">
                <button
                  onClick={() => action(a.id, "REJECT")}
                  disabled={processingId === a.id}
                  className="flex-1 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-wider py-2.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-400 rounded-lg transition-all"
                >
                  {processingId === a.id ? <Loader2 size={12} className="animate-spin" /> : <><X size={12} /> Reject</>}
                </button>
                <button
                  onClick={() => action(a.id, "APPROVE")}
                  disabled={processingId === a.id}
                  className="flex-1 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-wider py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all"
                >
                  {processingId === a.id ? <Loader2 size={12} className="animate-spin" /> : <><Check size={12} /> Approve</>}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* HISTORY */}
      {processedRequests.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-white/5">
          <h2 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-600">Decision Registry</h2>
          <div className="bg-[#0A0A0B] rounded-lg border border-white/5 divide-y divide-white/5">
            {processedRequests.map((log) => (
              <div key={log.id} className="flex items-center justify-between px-4 py-3 text-[11px] font-mono">
                <span className="truncate text-zinc-300">{log.user.name}</span>
                <span className={`px-2 py-0.5 rounded border uppercase ${
                  log.status === "APPROVED" 
                    ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/10" 
                    : "bg-red-500/5 text-red-400 border-red-500/10"
                }`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}