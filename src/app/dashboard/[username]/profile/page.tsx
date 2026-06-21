"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  User, 
  Loader2, 
  AlertTriangle, 
  UserCheck, 
  ShieldAlert
} from "lucide-react";

import { getProfile } from "@/actions/user";
import ProfileCard from "@/components/cards/profile-card";
import ProfileForm from "@/components/forms/profile-form";

export default function ProfilePage() {
  const params = useParams();
  const username = params?.username as string;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function loadProfile() {
    try {
      setLoading(true);
      setActionError(null);
      
      // 1. Fetch action envelope payload
      const result = await getProfile();

      // 🛡️ Discriminated Union Guard
      if (!result || !result.success) {
        throw new Error(result?.error || "Failed compiling your identity data profile metrics.");
      }

      // 🔍 Key Presence Guard: Solves union property narrowing block completely
      if (!("data" in result)) {
        throw new Error("Identity record payload context is unresolvable.");
      }

      // ✅ Safe Unwrapping: Asserts payload directly into state safely
      setProfile(result.data ?? null);
    } catch (err) {
      setProfile(null);
      setActionError(
        err instanceof Error 
          ? err.message 
          : "Failed to sync your global core profile parameters."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, [username]);

  // Analyzes completion telemetry boundaries to surface warnings
  const isProfileIncomplete = profile && (
    !profile.name || 
    !profile.bio || 
    !profile.portfolio?.title || 
    !profile.portfolio?.tagline || 
    !profile.portfolio?.bio ||
    !profile.portfolio?.profileImage
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[45vh] sm:min-h-[55vh] gap-4 bg-[#050505] text-zinc-500 border border-zinc-900 rounded-xl select-none font-mono p-4 text-center mx-3 sm:mx-auto">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-[10px] sm:text-xs uppercase tracking-widest">// Re-indexing identity parameters...</p>
      </div>
    );
  }

  if (actionError) {
    return (
      <div className="mx-auto max-w-xl my-6 rounded-none sm:rounded-xl border-y sm:border border-red-500/10 bg-gradient-to-b from-red-500/5 to-transparent p-4 sm:p-5 text-white w-full">
        <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-zinc-200">Identity Load Defect</h4>
          <p className="text-[11px] sm:text-xs text-red-400/90 leading-relaxed">{actionError}</p>
          <button onClick={loadProfile} className="h-8 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-xs font-semibold text-zinc-300">
            Retry Verification
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 text-white w-full max-w-5xl mx-auto font-sans antialiased px-3 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-x-hidden">
      
      {/* ACTIONS CONTROL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-4 sm:pb-5 px-4 sm:px-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400">
              <User size={15} />
            </div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-zinc-100">Profile Settings</h1>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-500 font-medium leading-relaxed">
            Manage your personal credentials, metadata definitions, background hooks, and portfolio bio details.
          </p>
        </div>
      </div>

      {/* CORE FRAMEWORK WARNING WELL */}
      {isProfileIncomplete && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.02] p-4 flex gap-3 items-start w-full animate-fadeIn mx-4 sm:mx-0">
          <ShieldAlert className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1 flex-1">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              [Telemetry Warning: Missing Profile Schemas Identified]
            </p>
            <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed max-w-4xl">
              Your public presence parameters are currently fragmented. Failing to provide fields like the **Avatar Profile Image**, **Portfolio Title**, **Core Tagline**, or **Short Bio** leaves placeholder blocks empty on your live landing layout node. Complete all required fields inside the config drawer to optimize theme scaling.
            </p>
          </div>
        </div>
      )}

      {!profile ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 p-6 sm:p-12 text-center max-w-xl mx-auto my-4 w-full">
          <UserCheck size={18} className="text-zinc-500 mb-3" />
          <h3 className="text-xs sm:text-sm font-bold text-zinc-200">Identity Profile Unpopulated</h3>
          <button type="button" onClick={() => setEditing(true)} className="mt-4 inline-flex h-9 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 px-4 text-xs font-semibold w-full sm:w-auto">
            Map Core Identity Block
          </button>
        </div>
      ) : !editing ? (
        <div className="w-full">
          <ProfileCard profile={profile} onEdit={() => setEditing(true)} />
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-[#0C0C0E] p-4 sm:p-6 shadow-2xl relative w-full animate-fadeIn">
          {/* Form Sticky Sub-Header Layout */}
          <div className="mb-4 flex items-center gap-2 border-b border-white/5 pb-3 sticky top-0 bg-[#0C0C0E] z-10 px-4 sm:px-0">
            <User size={14} className="text-blue-400" />
            <h2 className="text-[10px] sm:text-xs font-bold font-mono text-zinc-400 uppercase tracking-widest">
              Modify Identity Framework Parameters
            </h2>
          </div>

          {/* Core Embedded Subform Context Viewport */}
          <div className="w-full overflow-x-hidden px-4 sm:px-0">
            <ProfileForm
              initialData={profile}
              onCancel={() => setEditing(false)}
              onSuccess={async () => {
                setEditing(false);
                await loadProfile();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}