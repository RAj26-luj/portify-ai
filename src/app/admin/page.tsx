"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import UsersPage from "./users/page";
import ApprovalsPage from "./approvals/page";
import { 
  Loader2, 
  ShieldAlert, 
  Layers, 
  Users, 
  ClipboardCheck, 
  LayoutDashboard, 
  Terminal, 
  LogOut,
  ShieldCheck, 
  Clock,
  Menu,
  X
} from "lucide-react";

type Stats = {
  totalUsers: number;
  approvedUsers: number;
  pendingUsers: number;
  totalPortfolios: number;
};

type ResponseData = {
  stats: Stats;
};

type Tab = "dashboard" | "users" | "approvals";

export default function AdminDashboardPage() {
  const [data, setData] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin");
        if (!res.ok) throw new Error("Failed to load admin dashboard");
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 bg-[#050505] text-zinc-500 font-mono border border-white/5 rounded-2xl select-none mx-3">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <p className="text-[10px] uppercase tracking-widest">// Syncing Admin Schemas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 mx-3 rounded-xl bg-red-500/5 border border-red-500/10 text-center text-xs font-mono text-red-400">
        <ShieldAlert className="mx-auto mb-2" size={20} />
        <p>Initialization Error: {error}</p>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { label: "Total Users", value: data.stats.totalUsers.toLocaleString(), icon: <Users size={14} /> },
    { label: "Approved", value: data.stats.approvedUsers.toLocaleString(), icon: <ShieldCheck size={14} /> },
    { label: "Pending", value: data.stats.pendingUsers.toLocaleString(), icon: <Clock size={14} /> },
    { label: "Portfolios", value: data.stats.totalPortfolios.toLocaleString(), icon: <Layers size={14} /> },
  ];

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "dashboard", label: "Overview", icon: <LayoutDashboard size={14} /> },
    { id: "users", label: "Users", icon: <Users size={14} /> },
    { id: "approvals", label: "Approvals", icon: <ClipboardCheck size={14} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h1 className="text-xl font-black text-white">Admin Dashboard</h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Platform Control Plane</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-zinc-400">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-red-400 border border-white/5 rounded-lg transition-all"
          >
            <LogOut size={12} /> Logout
          </button>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#111113] border border-white/5 rounded-xl p-4 transition-all hover:border-white/10">
            <div className="flex justify-between items-start mb-2 text-zinc-500">{s.icon}</div>
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="flex bg-[#111113] border border-white/5 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-bold uppercase tracking-widest rounded transition-all ${
              activeTab === tab.id ? "bg-[#1A1A1D] text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ACTIVE VIEW */}
      <div className="bg-[#0A0A0B] border border-white/5 rounded-xl p-3 sm:p-6 min-h-[400px]">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="p-4 border border-white/5 rounded-lg bg-[#111113]/50">
              <h2 className="text-xs font-bold text-white mb-4">// System Quick Actions</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <button onClick={() => setActiveTab("users")} className="p-4 border border-white/5 rounded-lg text-left hover:bg-[#1A1A1D] transition-all">
                  <p className="text-xs font-bold text-white mb-1">Manage Users →</p>
                  <p className="text-[10px] text-zinc-500">View registry and adjust user blocks.</p>
                </button>
                <button onClick={() => setActiveTab("approvals")} className="p-4 border border-white/5 rounded-lg text-left hover:bg-[#1A1A1D] transition-all">
                  <p className="text-xs font-bold text-white mb-1">Review Approvals →</p>
                  <p className="text-[10px] text-zinc-500">Process onboarding requests queue.</p>
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === "users" && <UsersPage />}
        {activeTab === "approvals" && <ApprovalsPage />}
      </div>
    </div>
  );
}