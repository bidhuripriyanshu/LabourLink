"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "../../../../components/ui/card";

const ROLES = [
  {
    value: "LABOUR",
    label: "I'm a worker",
    desc: "Find local jobs near you",
    gradient: "from-indigo-600 to-violet-600",
    ring: "ring-indigo-500/30",
    border: "border-indigo-500",
    bg: "bg-indigo-50",
  },
  {
    value: "CONTRACTOR",
    label: "I'm a contractor",
    desc: "Hire skilled workers",
    gradient: "from-emerald-600 to-teal-600",
    ring: "ring-emerald-500/30",
    border: "border-emerald-500",
    bg: "bg-emerald-50",
  },
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

  const activeRole = ROLES.find((r) => r.value === role) || ROLES[0];

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

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & heading */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-md shadow-indigo-500/20">
              LL
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Join LabourLink — it&apos;s free and takes 2 minutes.
          </p>
        </div>

        <Card className="border-0 shadow-xl shadow-slate-200/60">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                  {error}
                </div>
              )}

             
              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-600">
                  I am a
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`group relative rounded-xl border-2 p-4 text-left transition-all ${role === r.value
                          ? `${r.border} ${r.bg} ring-2 ${r.ring}`
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                    >
                      <span className="text-xl">{r.emoji}</span>
                      <p className="mt-1.5 text-sm font-semibold text-slate-900">
                        {r.label}
                      </p>
                      <p className="text-[11px] text-slate-500">{r.desc}</p>
                      {role === r.value && (
                        <div className="absolute right-2 top-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

            
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600" htmlFor="name">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rakesh Kumar"
                  className={inputClass}
                  required
                />
              </div>

            
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600" htmlFor="phone">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  Phone number
                </label>
                <input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +919876543210"
                  className={inputClass}
                  required
                />
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600" htmlFor="city">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className={inputClass}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600" htmlFor="password">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className={inputClass}
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${activeRole.gradient} px-5 py-3 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg hover:brightness-110 active:scale-[0.98] disabled:opacity-60`}
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
                    Creating account…
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>
                    Sign up
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[11px] text-slate-400">or</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <p className="mt-4 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-indigo-600 transition hover:text-indigo-700"
              >
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-[11px] text-slate-400">
          By signing up you agree to our terms and privacy policy.
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
