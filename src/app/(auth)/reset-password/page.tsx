"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { resetPassword } from "@/actions/auth";

export default function ResetPasswordPage() {
  const params =
    useSearchParams();

  const token =
    params.get("token") ?? "";

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    await resetPassword({
      token,
      password,
      confirmPassword,
    });

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-4 rounded-xl border p-6"
      >
        <h1 className="text-2xl font-bold">
          Reset Password
        </h1>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="rounded border p-3"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={
            confirmPassword
          }
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
          className="rounded border p-3"
        />

        <button
          disabled={loading}
          className="rounded border p-3"
        >
          {loading
            ? "Loading..."
            : "Reset Password"}
        </button>
      </form>
    </main>
  );
}