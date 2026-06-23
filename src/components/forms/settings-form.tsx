"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Eye,
  EyeOff,
  LogOut,
  Trash2,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  LockKeyhole,
  Copy,
  Check,
} from "lucide-react";
import { updatePortfolioVisibility } from "@/actions/settings";

interface SettingsFormProps {
  userId: string;
  username: string;
  initialIsPublic: boolean;
}

export default function SettingsForm({ userId, username, initialIsPublic }: SettingsFormProps) {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [loadingVisibility, setLoadingVisibility] = useState(false);

  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("success");
  const [copied, setCopied] = useState(false);

  const [deleteCode, setDeleteCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const [passwordCode, setPasswordCode] = useState("");
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [passwordCodeSent, setPasswordCodeSent] = useState(false);

  const [sendingPasswordCode, setSendingPasswordCode] = useState(false);
  const [verifyingPasswordCode, setVerifyingPasswordCode] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  function showFeedback(text: string, type: "success" | "error" | "info" = "success") {
    setMessage(text);
    setMessageType(type);
  }
  const publicPortfolioUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portfolio/${username}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicPortfolioUrl);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showFeedback("Failed to copy path configuration to clipboard matrix.", "error");
    }
  };

  async function handleSignOut() {
    await signOut({
      callbackUrl: "/",
    });
  }

  async function sendPasswordCode() {
    try {
      setSendingPasswordCode(true);
      setMessage("");

      const response = await fetch("/api/account/change-password/request-code", { method: "POST" });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setPasswordCodeSent(true);
      showFeedback(
        "Security verification code dispatched to your registered email address.",
        "success"
      );
    } catch (error) {
      showFeedback(
        error instanceof Error ? error.message : "Failed to send code structure.",
        "error"
      );
    } finally {
      setSendingPasswordCode(false);
    }
  }

  async function verifyPasswordCode() {
    try {
      setVerifyingPasswordCode(true);
      setMessage("");

      const response = await fetch("/api/account/change-password/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: passwordCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setPasswordVerified(true);
      showFeedback(
        "Cryptographic validation successful. Please declare your updated credentials token.",
        "success"
      );
    } catch (error) {
      showFeedback(
        error instanceof Error ? error.message : "Security verification failed.",
        "error"
      );
    } finally {
      setVerifyingPasswordCode(false);
    }
  }

  async function handlePasswordChange() {
    try {
      setChangingPassword(true);
      setMessage("");

      const response = await fetch("/api/account/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      window.location.href = "/";
    } catch (error) {
      showFeedback(
        error instanceof Error ? error.message : "Failed to change system pass-token.",
        "error"
      );
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleVisibilityChange(checked: boolean) {
    try {
      setLoadingVisibility(true);
      setMessage("");
      await updatePortfolioVisibility(checked);
      setIsPublic(checked);
      router.refresh();

      showFeedback(
        checked
          ? "Your public template canvas routing link is now active and live globally."
          : "Portfolio has been retracted into private draft configuration space.",
        "info"
      );
    } catch (error) {
      showFeedback(
        error instanceof Error
          ? error.message
          : "Failed to change operational visibility state mapping.",
        "error"
      );
    } finally {
      setLoadingVisibility(false);
    }
  }

  async function sendDeleteCode() {
    try {
      setSendingCode(true);
      setMessage("");

      const response = await fetch("/api/account/delete/request-code", { method: "POST" });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setCodeSent(true);
      showFeedback("Destruction verification token dispatched. Check your inbox.", "success");
    } catch (error) {
      showFeedback(
        error instanceof Error ? error.message : "Failed to emit destruction authorization code.",
        "error"
      );
    } finally {
      setSendingCode(false);
    }
  }

  async function verifyDeleteCode() {
    try {
      setVerifyingCode(true);
      setMessage("");

      const response = await fetch("/api/account/delete/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: deleteCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setVerified(true);
      showFeedback("Destruction signature verified. Final permanent purge available.", "success");
    } catch (error) {
      showFeedback(
        error instanceof Error ? error.message : "Invalid authorization signature token path.",
        "error"
      );
    } finally {
      setVerifyingCode(false);
    }
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "CRITICAL DANGER: This operation cannot be undone. All database models, records, and resume indexes will be completely erased. Confirm permanent deletion protocol?"
    );

    if (!confirmed) return;

    try {
      setDeletingAccount(true);
      setMessage("");

      const response = await fetch("/api/account/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: deleteCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      window.location.href = "/";
    } catch (error) {
      showFeedback(
        error instanceof Error
          ? error.message
          : "Account drop protocol aborted due to infrastructure exception.",
        "error"
      );
    } finally {
      setDeletingAccount(false);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 text-zinc-300 font-sans max-w-full overflow-x-hidden selection:bg-blue-500/30 selection:text-white select-none">
      {message && (
        <div
          className={`p-3 sm:p-3.5 rounded-lg sm:rounded-xl border flex items-start gap-2 sm:gap-3 text-xs animate-fadeIn ${
            messageType === "error"
              ? "border-red-500/10 bg-red-500/5 text-red-400"
              : messageType === "success"
                ? "border-emerald-500/10 bg-emerald-500/5 text-emerald-400"
                : "border-blue-500/10 bg-blue-500/5 text-blue-400"
          }`}
        >
          {messageType === "error" ? (
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          ) : messageType === "success" ? (
            <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          )}
          <span className="font-medium leading-relaxed break-words">{message}</span>
        </div>
      )}

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-[#0C0C0E] p-4 sm:p-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between group transition-colors">
          <div className="space-y-3.5 sm:space-y-4">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-200 uppercase tracking-widest font-mono flex items-center gap-2">
                {isPublic ? (
                  <Eye className="w-3.5 h-3.5 text-blue-400 sm:w-4 sm:h-4" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-zinc-500 sm:w-4 sm:h-4" />
                )}
                <span>Portfolio Visibility Canvas</span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-1 leading-relaxed">
                Control outer ingress routing. New portfolios are completely private drafts by
                default to protect configuration stages.
              </p>
            </div>

            <div className="pt-1.5 sm:pt-2">
              <label className="flex items-center gap-3 cursor-pointer select-none group/toggle">
                <input
                  type="checkbox"
                  checked={isPublic}
                  disabled={loadingVisibility}
                  onChange={(e) => handleVisibilityChange(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-600 peer-checked:after:bg-zinc-950 after:border-none after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500 relative border border-white/5 transition-colors shrink-0" />
                <span className="text-xs font-semibold text-zinc-400 group-hover/toggle:text-zinc-200 transition-colors">
                  {isPublic ? "Published (Visible to everyone)" : "Private (Hidden from visitors)"}
                </span>
              </label>
            </div>
          </div>

          {isPublic && (
            <div className="mt-4 sm:mt-5 p-3 sm:p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.02] space-y-3 animate-fadeIn">
              <div className="flex flex-col gap-2.5">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-zinc-300">
                    Your profile path is globally active
                  </p>
                  <p className="text-[10px] sm:text-xs text-zinc-500 font-mono truncate mt-0.5 break-all">
                    {publicPortfolioUrl}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex-1 inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-white/5 bg-[#0A0A0B] text-zinc-300 hover:text-white px-2.5 text-xs font-semibold transition-all select-none font-mono"
                  >
                    {copied ? (
                      <Check size={11} className="text-emerald-400" />
                    ) : (
                      <Copy size={11} className="text-zinc-500" />
                    )}
                    <span>{copied ? "Copied" : "Copy Link"}</span>
                  </button>

                  <a
                    href={`/portfolio/${username}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 px-2.5 text-xs font-bold transition-all shrink-0 select-none font-mono"
                  >
                    <span>View Live</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0C0C0E] p-4 sm:p-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)] transition-colors space-y-3.5 sm:space-y-4">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-zinc-200 uppercase tracking-widest font-mono flex items-center gap-2">
              <LockKeyhole className="w-3.5 h-3.5 text-zinc-400 sm:w-4 sm:h-4" />
              <span>Cryptographic Token Remodelling</span>
            </h3>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-1 leading-relaxed">
              Step-by-step structural authorization reset. Modifying this credentials layer drops
              out active sessions.
            </p>
          </div>

          <div className="space-y-3">
            {!passwordCodeSent && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={sendPasswordCode}
                  disabled={sendingPasswordCode}
                  className="w-full inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-white/5 bg-[#0A0A0B] hover:bg-[#121214] text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 transition-all disabled:opacity-40 select-none"
                >
                  {sendingPasswordCode ? (
                    <Loader2 size={12} className="animate-spin shrink-0" />
                  ) : null}
                  <span>
                    {sendingPasswordCode ? "Requesting Signature..." : "Request Reset Token"}
                  </span>
                </button>
              </div>
            )}

            {passwordCodeSent && !passwordVerified && (
              <div className="space-y-2.5 animate-fadeIn group/input">
                <label className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 block">
                  Verification Token{" "}
                  <span className="text-red-400 font-sans font-bold">*(Required)</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={passwordCode}
                  disabled={verifyingPasswordCode}
                  onChange={(e) => setPasswordCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit confirmation token"
                  className="w-full text-xs px-3 py-2.5 bg-[#0A0A0B] border border-white/5 rounded-lg text-zinc-100 font-mono tracking-widest text-center focus:outline-none focus:border-blue-500/60 placeholder:tracking-normal placeholder:font-sans placeholder:text-zinc-700 shadow-inner"
                />

                <button
                  type="button"
                  onClick={verifyPasswordCode}
                  disabled={verifyingPasswordCode || passwordCode.length !== 6}
                  className="w-full inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-40 select-none"
                >
                  {verifyingPasswordCode ? (
                    <Loader2 size={12} className="animate-spin shrink-0" />
                  ) : null}
                  <span>{verifyingPasswordCode ? "Asserting Token..." : "Verify Token"}</span>
                </button>
              </div>
            )}

            {passwordVerified && (
              <div className="space-y-2.5 animate-fadeIn group/input">
                <label className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 block">
                  New Secure Passphrase{" "}
                  <span className="text-red-400 font-sans font-bold">*(Required)</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter new account secure passphrase"
                  value={newPassword}
                  disabled={changingPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-[#0A0A0B] border border-white/5 rounded-lg text-zinc-100 focus:outline-none focus:border-blue-500/60 shadow-inner"
                />

                <button
                  type="button"
                  onClick={handlePasswordChange}
                  disabled={
                    changingPassword ||
                    !newPassword ||
                    newPassword.length < 8 ||
                    !/[A-Z]/.test(newPassword) ||
                    !/[a-z]/.test(newPassword) ||
                    !/[0-9]/.test(newPassword) ||
                    !/[^A-Za-z0-9]/.test(newPassword)
                  }
                  className="w-full inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-40 select-none"
                >
                  {changingPassword ? (
                    <Loader2 size={12} className="animate-spin shrink-0" />
                  ) : null}
                  <span>
                    {changingPassword ? "Overwriting Hashes..." : "Commit Passphrase Reset"}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0C0C0E] p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 sm:gap-4 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest font-mono flex items-center gap-2">
            <LogOut className="w-3.5 h-3.5 text-zinc-500" />
            <span>Terminate Active Session</span>
          </h3>
          <p className="text-[10px] sm:text-[11px] text-zinc-500 max-w-xl leading-relaxed">
            Instantly drop cryptographically signed token mappings and return back to public
            template authorization roots.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex h-8 w-full sm:w-auto items-center justify-center rounded-lg border border-white/5 bg-[#0A0A0B] hover:bg-[#121214] text-zinc-300 px-4 text-xs font-mono font-bold uppercase tracking-wider transition-colors select-none shrink-0"
        >
          Sign Out
        </button>
      </div>

      <div className="rounded-xl border border-red-500/20 bg-gradient-to-b from-red-950/10 to-transparent p-4 sm:p-6 space-y-3.5 sm:shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="space-y-0.5">
          <h3 className="text-xs sm:text-sm font-bold text-red-400 uppercase tracking-widest font-mono flex items-center gap-2">
            <Trash2 className="w-3.5 h-3.5 shrink-0" />
            <span>Permanent Account Destruction Pipeline</span>
          </h3>
          <p className="text-[10px] sm:text-[11px] text-zinc-500 leading-relaxed max-w-2xl">
            Irreversible destructive zone protocol node. Executing this step drops your custom
            subdomains, nested resume extraction indices, analytics clusters, and profile sections
            immediately from the relational database layers.
          </p>
        </div>

        <div className="pt-0.5">
          {!codeSent && (
            <button
              type="button"
              onClick={sendDeleteCode}
              disabled={sendingCode}
              className="w-full sm:w-auto inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-red-900/40 bg-red-950/20 hover:bg-red-950/30 text-red-400 px-4 text-xs font-mono font-bold uppercase tracking-wider transition-colors disabled:opacity-40 select-none"
            >
              {sendingCode ? <Loader2 size={12} className="animate-spin shrink-0" /> : null}
              <span>{sendingCode ? "Acquiring Signature..." : "Request Invalidation Token"}</span>
            </button>
          )}

          {codeSent && !verified && (
            <div className="space-y-3 max-w-sm animate-fadeIn group/input">
              <label className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-red-400/70 block">
                Purge Authorization Token{" "}
                <span className="text-red-400 font-sans font-bold">*(Required)</span>
              </label>

              <input
                type="text"
                maxLength={6}
                value={deleteCode}
                disabled={verifyingCode}
                onChange={(e) => setDeleteCode(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit deletion token"
                className="w-full text-xs px-3 py-2.5 bg-[#0A0A0B] border border-red-900/30 rounded-lg text-red-200 font-mono text-center tracking-widest focus:outline-none focus:border-red-500/50 placeholder:tracking-normal placeholder:font-sans placeholder:text-zinc-800 shadow-inner"
              />

              <button
                type="button"
                onClick={verifyDeleteCode}
                disabled={verifyingCode || deleteCode.length !== 6}
                className="w-full inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-40 select-none shadow-sm"
              >
                {verifyingCode ? <Loader2 size={12} className="animate-spin shrink-0" /> : null}
                <span>{verifyingCode ? "Asserting Token..." : "Confirm Invalidation Token"}</span>
              </button>
            </div>
          )}

          {verified && (
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={deletingAccount}
              className="w-full sm:w-auto inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:bg-red-800 text-white px-5 text-xs font-mono font-bold uppercase tracking-wider shadow-md transition-all select-none animate-fadeIn"
            >
              {deletingAccount ? (
                <Loader2 size={12} className="animate-spin shrink-0" />
              ) : (
                <Trash2 size={13} />
              )}
              <span>
                {deletingAccount ? "Purging Entities..." : "Yes, Purge Everything Permanently"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
