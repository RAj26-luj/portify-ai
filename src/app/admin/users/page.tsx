"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  ShieldAlert,
  Ban,
  ShieldCheck,
  UserX,
  Terminal,
  Search,
  Users,
} from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  status: "PENDING" | "APPROVED" | "REJECTED";
  isBlocked: boolean;
  createdAt: string;
};

type ResponseData = {
  users: User[];
};

export default function UsersPage() {
  const [data, setData] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to load users");
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

  const updateUser = async (id: string, type: "BLOCK" | "UNBLOCK") => {
    setProcessingId(id);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type }),
      });

      if (!res.ok) throw new Error("Update failed");

      setData((prev) => {
        if (!prev) return prev;
        return {
          users: prev.users.map((u) => (u.id === id ? { ...u, isBlocked: type === "BLOCK" } : u)),
        };
      });
    } catch (err) {
      setError("Action failed. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 bg-[#050505] text-zinc-500 font-mono border border-white/5 rounded-xl mx-3">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <p className="text-[10px] uppercase tracking-widest">// Compiling user analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mx-3 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center gap-3 text-xs font-mono text-red-400">
        <ShieldAlert size={16} className="shrink-0 text-red-500" />
        <span>Error: {error}</span>
      </div>
    );
  }

  const users = data?.users || [];
  const approvedUsers = users.filter((u) => u.status === "APPROVED" && !u.isBlocked);
  const rejectedUsers = users.filter((u) => u.status === "REJECTED");
  const blockedUsers = users.filter((u) => u.isBlocked);

  const UserCard = ({ user, type }: { user: User; type: "APPROVE" | "REJECT" | "BLOCK" }) => (
    <div className="bg-[#111113] border border-white/5 rounded-lg p-3 sm:p-4 flex items-center justify-between gap-4 group hover:border-white/10 transition-all">
      <div className="min-w-0">
        <p className="font-bold text-white text-xs sm:text-sm truncate">{user.name}</p>
        <p className="text-[10px] sm:text-xs font-mono text-zinc-500 truncate">{user.email}</p>
      </div>

      {type === "BLOCK" && (
        <button
          onClick={() => updateUser(user.id, "BLOCK")}
          disabled={processingId === user.id}
          className="text-[9px] font-bold uppercase tracking-widest px-2 py-1.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-400 rounded transition-all"
        >
          {processingId === user.id ? <Loader2 size={10} className="animate-spin" /> : "Block"}
        </button>
      )}
      {type === "REJECT" && (
        <span className="text-[9px] font-bold uppercase tracking-widest text-red-400">
          Rejected
        </span>
      )}
      {type === "APPROVE" && (
        <button
          onClick={() => updateUser(user.id, "UNBLOCK")}
          disabled={processingId === user.id}
          className="text-[9px] font-bold uppercase tracking-widest px-2 py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 rounded transition-all"
        >
          {processingId === user.id ? <Loader2 size={10} className="animate-spin" /> : "Unblock"}
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-3 py-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h1 className="text-xl font-black text-white">Users Management</h1>
          <p className="text-[11px] text-zinc-500">Platform identity oversight control.</p>
        </div>
        <Users className="text-zinc-700" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-3">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
            <ShieldCheck size={12} /> Approved ({approvedUsers.length})
          </h2>
          <div className="space-y-2">
            {approvedUsers.map((u) => (
              <UserCard key={u.id} user={u} type="BLOCK" />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-orange-400 flex items-center gap-2">
            <Ban size={12} /> Blocked ({blockedUsers.length})
          </h2>
          <div className="space-y-2">
            {blockedUsers.map((u) => (
              <UserCard key={u.id} user={u} type="APPROVE" />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-red-400 flex items-center gap-2">
            <UserX size={12} /> Rejected ({rejectedUsers.length})
          </h2>
          <div className="space-y-2">
            {rejectedUsers.map((u) => (
              <UserCard key={u.id} user={u} type="REJECT" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
