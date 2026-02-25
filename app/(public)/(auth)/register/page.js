"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";

const ROLES = [
  { value: "LABOUR", label: "I'm a worker", desc: "Find local jobs" },
  { value: "CONTRACTOR", label: "I'm a contractor", desc: "Hire workers" },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState(
    roleParam === "CONTRACTOR" ? "CONTRACTOR" : "LABOUR"
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, password, role, city }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
        setLoading(false);
        return;
      }

      router.push("/login?registered=1");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Create an account</CardTitle>
          <p className="text-sm text-slate-500">
            Choose your role and fill in your details.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">I am a</span>
              <div className="flex gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`flex-1 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                      role === r.value
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className="font-medium">{r.label}</span>
                    <span className="block text-xs text-slate-500">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">Full name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rakesh Kumar"
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">Phone number</span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +919876543210"
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">City</span>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai"
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
                minLength={6}
              />
            </label>
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Creating account…" : "Sign up"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-sm text-slate-500">Loading...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
