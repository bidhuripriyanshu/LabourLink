"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";

function LoginForm() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        phone: phone.trim(),
        password,
        redirect: false,
        callbackUrl,
      });
      if (res?.error) {
        setError("Invalid phone number or password.");
        setLoading(false);
        return;
      }
      window.location.href = res?.url || callbackUrl;
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Log in</CardTitle>
          <p className="text-sm text-slate-500">
            Enter your phone and password to access your dashboard.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
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
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </label>
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Signing in…" : "Log in"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-700">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
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
      <LoginForm />
    </Suspense>
  );
}
