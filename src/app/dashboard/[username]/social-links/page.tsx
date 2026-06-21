"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  Plus, 
  Share2, 
  Loader2, 
  AlertTriangle, 
  HelpCircle,
  AlertCircle,
  Check
} from "lucide-react";

import {
  getSocialLinks,
  deleteSocialLink,
} from "@/actions/social-link";

import { getMyPortfolioId } from "@/actions/portfolio";

import SocialLinkCard from "@/components/cards/social-link-card";
import SocialLinkForm from "@/components/forms/social-link-form";

type SocialLink = {
  id: string;
  platform: string;
  url: string;
  username?: string;
  iconName?: string;
  iconUrl?: string;
  displayOrder?: number;
};

export default function SocialLinksPage() {
  const { username } = useParams();

  const [links, setLinks] = useState<SocialLink[]>([]);
  const [portfolioId, setPortfolioId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<SocialLink | null>(null);

  // Advanced SaaS safeguarding interface interaction states
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Tracks which entry is actively presenting its inline verification/confirmation UI
  const [activeConfirmDeleteId, setActiveConfirmDeleteId] = useState<string | null>(null);

  async function loadLinks(id: string) {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Query structural social link data nodes
      const result = await getSocialLinks(id);

      // 🛡️ Safe Condition Narrowing: Guard checking layout structure fields envelope
      if (!result || !result.success || !("data" in result) || !Array.isArray(result.data)) {
        throw new Error("error" in result && typeof result.error === "string" ? result.error : "Failed to load social links");
      }

      // ✅ Safe State Mutation: Normalizes null -> undefined directly during API response compilation
      setLinks(
        result.data.map((link: any) => ({
          id: link.id,
          platform: link.platform,
          url: link.url,
          username: link.username ?? undefined,
          iconName: link.iconName ?? undefined,
          iconUrl: link.iconUrl ?? undefined,
          displayOrder: typeof link.displayOrder === "number" ? link.displayOrder : 0,
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sync your social graph endpoints");
    } finally {
      setLoading(false);
    }
  }

  // 2. Mount chronological identity initialization lifecycle hooks
  useEffect(() => {
    (async () => {
      try {
        const portfolioResult = await getMyPortfolioId();

        if (!portfolioResult || !portfolioResult.success || !portfolioResult.data) {
          throw new Error("error" in portfolioResult && typeof portfolioResult.error === "string" ? portfolioResult.error : "Portfolio not found");
        }

        const id = portfolioResult.data;
        setPortfolioId(id);
        await loadLinks(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to initialize portfolio credentials");
        setLoading(false);
      }
    })();
  }, [username]);

  async function handleDelete(id: string) {
    try {
      setProcessingId(id);
      setActionError(null);
      
      const result = await deleteSocialLink(id);

      if (!result || !result.success) {
        throw new Error("error" in result && typeof result.error === "string" ? result.error : "Delete failed");
      }

      setLinks((prev) => prev.filter((item) => item.id !== id));
      setActiveConfirmDeleteId(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to safely sever integration context endpoint connection.");
    } finally {
      setProcessingId(null);
    }
  }

  function handleAddNew() {
    setEditingItem(null);
    setShowForm(true);
  }

  function handleEdit(item: SocialLink) {
    setEditingItem(item);
    setShowForm(true);
  }

  async function handleSuccess() {
    setShowForm(false);
    setEditingItem(null);
    if (portfolioId) {
      await loadLinks(portfolioId);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3 px-4 text-center">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        <p className="text-sm font-medium text-zinc-400 font-mono tracking-wide">
          Loading social index mapping...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl my-6 mx-4 rounded-xl border border-red-500/10 bg-red-500/5 p-4 flex gap-3 items-start text-white">
        <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-zinc-200">Execution Error</h4>
          <p className="text-xs text-red-400 leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white px-4 sm:px-0 py-4 sm:py-0">
      {/* HEADER CONTROLS ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 shrink-0">
              <Share2 size={16} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">Social Connections</h1>
          </div>
          <p className="text-xs text-zinc-500 font-medium leading-relaxed">
            Manage your synchronized external brand networks and hyperlink parameters
          </p>
        </div>

        <button
          onClick={handleAddNew}
          disabled={processingId !== null}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3.5 py-2.5 sm:py-2 text-xs font-semibold shadow-sm transition-colors focus:outline-none select-none w-full sm:w-auto shrink-0"
        >
          <Plus size={14} />
          <span>Add Social Link</span>
        </button>
      </div>

      {/* COMPACT INLINE ACTION ERROR PANEL */}
      {actionError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/10 bg-red-500/5 p-3 text-xs text-red-400 animate-fadeIn">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <span className="font-medium flex-1 leading-normal">{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-zinc-500 hover:text-zinc-300 font-mono text-[10px] ml-2">✕</button>
        </div>
      )}

      {/* RENDER SYSTEM */}
      {links.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 p-6 sm:p-12 text-center max-w-xl mx-auto">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900 text-zinc-500 mb-4">
            <HelpCircle size={18} />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200">No networks unified</h3>
          <p className="text-xs text-zinc-500 max-w-xs mt-1 leading-relaxed">
            Link GitHub, LinkedIn, or personal vectors to assemble your primary public hub.
          </p>
          <button
            onClick={handleAddNew}
            className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 px-4 py-2 text-xs font-medium transition-colors w-full sm:w-auto"
          >
            Connect First Identity Link
          </button>
        </div>
      ) : (
        <>
          {/* MOBILE COMPACT LIST LAYOUT */}
          <div className="block sm:hidden space-y-2">
            {links.map((link) => (
              <div 
                key={link.id}
                className="flex flex-col p-3 rounded-lg border border-zinc-900 bg-[#070709] hover:bg-zinc-900/20 transition-all gap-2"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0 font-bold text-[10px] uppercase font-mono">
                      {link.platform ? link.platform.slice(0, 2) : "LN"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-zinc-200 truncate capitalize">
                        {link.platform || "Connection Node"}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-mono truncate max-w-[200px]">
                        {link.url}
                      </p>
                    </div>
                  </div>
                  
                  {activeConfirmDeleteId !== link.id && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEdit(link)}
                        className="text-[10px] font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveConfirmDeleteId(link.id)}
                        className="text-[10px] font-semibold text-red-400 hover:text-red-300 transition-colors bg-red-950/20 border border-red-900/30 px-2 py-1 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* MOBILE INLINE RECONCILIATION Safety overlay banner */}
                {activeConfirmDeleteId === link.id && (
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-2 flex items-center justify-between gap-3 animate-fadeIn w-full">
                    <div className="flex items-center gap-1 text-red-400 font-mono text-[9px] uppercase tracking-wider font-bold">
                      <AlertCircle size={11} className="animate-pulse" />
                      <span>Purge Integration?</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveConfirmDeleteId(null)}
                        className="h-6 rounded bg-zinc-800 text-zinc-300 font-mono text-[9px] font-bold uppercase tracking-wider px-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={processingId === link.id}
                        onClick={() => handleDelete(link.id)}
                        className="h-6 rounded bg-red-600 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 inline-flex items-center gap-1"
                      >
                        {processingId === link.id ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                        <span>Drop</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* DESKTOP RESPONSIVE GRID LAYOUT */}
          <div className="hidden sm:grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-[1200px]">
            {links.map((link) => (
              <div key={link.id} className="relative group">
                <SocialLinkCard
                  id={link.id}
                  platform={link.platform}
                  url={link.url}
                  username={link.username}
                  iconName={link.iconName}
                  iconUrl={link.iconUrl}
                  
                  onEdit={() => handleEdit(link)}
                  onDelete={() => setActiveConfirmDeleteId(link.id)}
                />

                {/* ABSOLUTE OVERLAY SYSTEM ON INDIVIDUAL CARD ELEMENT NODES */}
                {activeConfirmDeleteId === link.id && (
                  <div className="absolute inset-0 bg-black/95 border border-red-900/40 rounded-xl p-4 sm:p-5 flex flex-col justify-between z-30 animate-fadeIn">
                    <div className="flex items-start gap-3 text-red-400">
                      <AlertCircle size={16} className="shrink-0 mt-0.5 animate-pulse" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Sever Edge Gateway?</h4>
                        <p className="text-[11px] text-zinc-500 leading-normal">
                          This action drops the hyperlink reference node configuration from your visible public ecosystem routing index.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 border-t border-zinc-900 pt-3">
                      <button
                        type="button"
                        onClick={() => setActiveConfirmDeleteId(null)}
                        className="h-7 px-3 text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 rounded-md transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={processingId === link.id}
                        onClick={() => handleDelete(link.id)}
                        className="h-7 px-3 text-[10px] font-mono font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white rounded-md transition-all inline-flex items-center gap-1 shadow-sm"
                      >
                        {processingId === link.id ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                        <span>Confirm Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* FORM CONTROLLER MODAL DIALOGUE */}
      {showForm && portfolioId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-xl rounded-xl border border-zinc-800 bg-[#0C0C0E] p-4 sm:p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-5 flex items-center justify-between border-b border-zinc-900 pb-3">
              <h2 className="text-sm sm:text-base font-bold tracking-tight text-zinc-200">
                {editingItem ? "Modify Social Connection" : "Integrate New Social Connection"}
              </h2>

              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
                className="text-zinc-500 hover:text-zinc-300 text-xs sm:text-sm font-mono transition-colors bg-zinc-950 border border-zinc-900 px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <SocialLinkForm
              portfolioId={portfolioId}
              initialData={editingItem ?? undefined}
              onSuccess={handleSuccess}
              onClose={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}