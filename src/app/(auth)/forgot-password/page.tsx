"use client";

import { useState } from "react";

import { forgotPassword } from "@/actions/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    await forgotPassword({
      email,
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
          Forgot Password
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="rounded border p-3"
        />

        <button
          disabled={loading}
          className="rounded border p-3"
        >
          {loading
            ? "Loading..."
            : "Send Reset Link"}
        </button>
      </form>
    </main>
  );
}