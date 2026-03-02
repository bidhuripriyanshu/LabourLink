import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import Link from "next/link";
import AdminFilters from "./AdminFilters";

export const dynamic = "force-dynamic";

/* ── Server actions ──────────────────────────────────────────────── */

async function updateUserBan(formData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const userId = formData.get("userId")?.toString();
  const banned = formData.get("banned") === "true";
  if (!userId) return;

  await prisma.user.update({
    where: { id: userId },
    data: { banned },
  });

  revalidatePath("/admin");
}

async function toggleProfileVerified(formData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const profileId = formData.get("profileId")?.toString();
  const profileType = formData.get("profileType")?.toString();
  const verified = formData.get("verified") === "true";
  if (!profileId || (profileType !== "LABOUR" && profileType !== "CONTRACTOR")) return;

  if (profileType === "LABOUR") {
    await prisma.labourProfile.update({
      where: { id: profileId },
      data: { verified },
    });
  } else {
    await prisma.contractorProfile.update({
      where: { id: profileId },
      data: { verified },
    });
  }

  revalidatePath("/admin");
}

async function deleteJob(formData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const jobId = formData.get("jobId")?.toString();
  if (!jobId) return;

  await prisma.application.deleteMany({ where: { jobId } });
  await prisma.job.delete({ where: { id: jobId } });

  revalidatePath("/admin");
}

/* ── helpers ─────────────────────────────────────────────────────── */

function roleBadge(role) {
  const map = {
    LABOUR: "bg-indigo-50 text-indigo-700 border-indigo-200",
    CONTRACTOR: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ADMIN: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${map[role] || map.LABOUR}`}>
      {role}
    </span>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default async function AdminPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const roleFilter = params?.role?.toString() || "ALL";
  const cityFilter = params?.city?.toString() || "";

  const whereUser = {
    ...(roleFilter !== "ALL" ? { role: roleFilter } : {}),
    ...(cityFilter ? { city: cityFilter } : {}),
  };

  const [users, labourProfiles, contractorProfiles, jobs] = await Promise.all([
    prisma.user.findMany({
      where: whereUser,
      orderBy: { createdAt: "desc" },
    }),
    prisma.labourProfile
      .findMany({ include: { user: true } })
      .catch(() => []),
    prisma.contractorProfile
      .findMany({ include: { user: true } })
      .catch(() => []),
    prisma.job.findMany({
      include: { contractor: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  return (
    <div className="min-h-screen bg-zinc-50/60">
      {/* ── Gradient header ─────────────────────────────────── */}
      <header className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 pb-24 pt-6 sm:pb-28 sm:pt-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm transition hover:bg-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
              Home
            </Link>
            <Badge className="border-white/20 bg-white/10 text-white backdrop-blur-sm">
              ⚙️ Admin Panel
            </Badge>
          </div>
          <div className="mt-6 sm:mt-8">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Admin Dashboard
            </h1>
            <p className="mt-1.5 text-sm text-orange-100">
              Manage users, verify profiles, and moderate job listings.
            </p>
          </div>

          {/* Quick stats */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[
              { label: "Total users", value: users.length, emoji: "👥" },
              { label: "Labour profiles", value: labourProfiles.length, emoji: "👷" },
              { label: "Contractor profiles", value: contractorProfiles.length, emoji: "🏗️" },
              { label: "Jobs posted", value: jobs.length, emoji: "📋" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl bg-white/10 px-3 py-3 text-white backdrop-blur-sm transition hover:bg-white/15 sm:px-4"
              >
                <span className="text-lg">{s.emoji}</span>
                <p className="mt-1 text-lg font-bold sm:text-xl">{s.value}</p>
                <p className="text-[11px] font-medium text-orange-200 sm:text-xs">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────── */}
      <main className="relative z-10 mx-auto -mt-16 max-w-6xl space-y-6 px-4 pb-16 sm:-mt-20 sm:px-6">
        {/* Filters */}
        <Card className="border-0 shadow-lg shadow-slate-200/60">
          <CardHeader className="border-b-0 pb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
              </div>
              <CardTitle className="text-base">Filters</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <AdminFilters roleFilter={roleFilter} cityFilter={cityFilter} />
          </CardContent>
        </Card>

        {/* ── Users table ──────────────────────────────────── */}
        <Card className="border-0 shadow-lg shadow-slate-200/60">
          <CardHeader className="border-b-0 pb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <CardTitle className="text-base">Users</CardTitle>
              <Badge variant="secondary" className="text-[10px]">{users.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">
                No users match the filters.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-left">
                      <th className="py-2.5 pr-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Name</th>
                      <th className="py-2.5 pr-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Phone</th>
                      <th className="py-2.5 pr-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Role</th>
                      <th className="py-2.5 pr-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">City</th>
                      <th className="py-2.5 pr-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Status</th>
                      <th className="py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-slate-50 transition hover:bg-slate-50/60">
                        <td className="py-2.5 pr-3 font-medium text-slate-900">{u.name}</td>
                        <td className="py-2.5 pr-3 text-slate-600">{u.phone}</td>
                        <td className="py-2.5 pr-3">{roleBadge(u.role)}</td>
                        <td className="py-2.5 pr-3 text-slate-600">{u.city}</td>
                        <td className="py-2.5 pr-3">
                          {u.banned ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-700">
                              🚫 Banned
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                              ✓ Active
                            </span>
                          )}
                        </td>
                        <td className="py-2.5">
                          <form action={updateUserBan}>
                            <input type="hidden" name="userId" value={u.id} />
                            <input type="hidden" name="banned" value={u.banned ? "false" : "true"} />
                            <button
                              type="submit"
                              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-medium transition-all active:scale-[0.97] ${u.banned
                                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                  : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                                }`}
                            >
                              {u.banned ? "Unban" : "Ban"}
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Labour & Contractor profiles side by side ────── */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Labour profiles */}
          <Card className="border-0 shadow-lg shadow-slate-200/60">
            <CardHeader className="border-b-0 pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" /></svg>
                </div>
                <CardTitle className="text-base">Labour Profiles</CardTitle>
                <Badge variant="secondary" className="text-[10px]">{labourProfiles.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {labourProfiles.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">No labour profiles found.</p>
              ) : (
                <div className="space-y-2">
                  {labourProfiles.map((lp) => (
                    <div
                      key={lp.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition hover:bg-slate-50"
                    >
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-slate-900">
                          {lp.user.name}
                        </p>
                        <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                          <span>🔧 {lp.skill || "—"}</span>
                          <span>📅 {lp.experience}yr</span>
                          <span>⭐ {lp.rating.toFixed(1)}</span>
                          {lp.verified ? (
                            <span className="font-medium text-emerald-600">✓ Verified</span>
                          ) : (
                            <span className="text-slate-400">Not verified</span>
                          )}
                        </div>
                      </div>
                      <form action={toggleProfileVerified}>
                        <input type="hidden" name="profileId" value={lp.id} />
                        <input type="hidden" name="profileType" value="LABOUR" />
                        <input type="hidden" name="verified" value={lp.verified ? "false" : "true"} />
                        <button
                          type="submit"
                          className={`rounded-lg px-2.5 py-1 text-[10px] font-medium transition-all active:scale-[0.97] ${lp.verified
                              ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            }`}
                        >
                          {lp.verified ? "Unverify" : "Verify"}
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contractor profiles */}
          <Card className="border-0 shadow-lg shadow-slate-200/60">
            <CardHeader className="border-b-0 pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                </div>
                <CardTitle className="text-base">Contractor Profiles</CardTitle>
                <Badge variant="secondary" className="text-[10px]">{contractorProfiles.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {contractorProfiles.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">No contractor profiles found.</p>
              ) : (
                <div className="space-y-2">
                  {contractorProfiles.map((cp) => (
                    <div
                      key={cp.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition hover:bg-slate-50"
                    >
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-slate-900">
                          {cp.user.name}
                        </p>
                        <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                          <span>🏢 {cp.companyName}</span>
                          <span>⭐ {cp.rating.toFixed(1)}</span>
                          {cp.verified ? (
                            <span className="font-medium text-emerald-600">✓ Verified</span>
                          ) : (
                            <span className="text-slate-400">Not verified</span>
                          )}
                        </div>
                      </div>
                      <form action={toggleProfileVerified}>
                        <input type="hidden" name="profileId" value={cp.id} />
                        <input type="hidden" name="profileType" value="CONTRACTOR" />
                        <input type="hidden" name="verified" value={cp.verified ? "false" : "true"} />
                        <button
                          type="submit"
                          className={`rounded-lg px-2.5 py-1 text-[10px] font-medium transition-all active:scale-[0.97] ${cp.verified
                              ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            }`}
                        >
                          {cp.verified ? "Unverify" : "Verify"}
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Jobs ─────────────────────────────────────────── */}
        <Card className="border-0 shadow-lg shadow-slate-200/60">
          <CardHeader className="border-b-0 pb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
              </div>
              <CardTitle className="text-base">Jobs</CardTitle>
              <Badge variant="secondary" className="text-[10px]">{jobs.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">No jobs found.</p>
            ) : (
              <div className="space-y-2">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition hover:bg-slate-50"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium text-slate-900">
                          {job.title}
                        </p>
                        {job.status === "OPEN" ? (
                          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                            Open
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                            Closed
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                        <span>📍 {job.city}</span>
                        <span>🔧 {job.skillRequired}</span>
                        <span>₹{job.wage}/day</span>
                        <span>By: {job.contractor.name}</span>
                      </div>
                    </div>
                    <form action={deleteJob}>
                      <input type="hidden" name="jobId" value={job.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1 rounded-lg bg-rose-100 px-2.5 py-1 text-[10px] font-medium text-rose-700 transition-all hover:bg-rose-200 active:scale-[0.97]"
                      >
                        🗑️ Remove
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}