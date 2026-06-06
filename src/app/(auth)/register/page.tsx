"use client";

import { useState } from "react";

import { registerUser } from "@/actions/auth";

export default function RegisterPage() {
  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    await registerUser(form);

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-4 rounded-xl border p-6"
      >
        <h1 className="text-2xl font-bold">
          Register
        </h1>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          className="rounded border p-3"
        />

        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
          className="rounded border p-3"
        />

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password:
                e.target.value,
            })
          }
          className="rounded border p-3"
        />

        <input
          placeholder="Confirm Password"
          type="password"
          value={
            form.confirmPassword
          }
          onChange={(e) =>
            setForm({
              ...form,
              confirmPassword:
                e.target.value,
            })
          }
          className="rounded border p-3"
        />

        <button
          disabled={loading}
          className="rounded border p-3"
        >
          {loading
            ? "Loading..."
            : "Register"}
        </button>
      </form>
    </main>
  );
}