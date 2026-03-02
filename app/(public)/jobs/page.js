import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import Link from "next/link";

async function applyToJob(formData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "LABOUR") redirect("/login");

  const jobId = formData.get("jobId")?.toString();
  if (!jobId) return;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });
  if (!job || job.status !== "OPEN") return;

  try {
    await prisma.application.create({
      data: {
        jobId,
        labourId: session.user.id,
      },
    });
  } catch (err) {
    // ignore duplicate applications (unique constraint on jobId + labourId)
  }

  revalidatePath("/jobs");
}

export default async function JobsPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "LABOUR") redirect("/login");

  const params = await searchParams;
  const city = params?.city?.toString().trim() || "";
  const skill = params?.skill?.toString().trim() || "";
  const title = params?.title?.toString().trim() || "";
  const minWageStr = params?.minWage?.toString().trim() || "";
  const maxWageStr = params?.maxWage?.toString().trim() || "";
  const page = Number.parseInt(params?.page?.toString() || "1", 10) || 1;
  const take = 10;
  const skip = (page - 1) * take;

  const where = {
    status: "OPEN",
    ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
    ...(skill ? { skillRequired: { contains: skill, mode: "insensitive" } } : {}),
    ...(title ? { title: { contains: title, mode: "insensitive" } } : {}),
    ...(minWageStr
      ? { wage: { gte: Number.parseInt(minWageStr, 10) || undefined } }
      : {}),
    ...(maxWageStr
      ? {
        wage: {
          ...(minWageStr ? { gte: Number.parseInt(minWageStr, 10) || undefined } : {}),
          lte: Number.parseInt(maxWageStr, 10) || undefined,
        },
      }
      : {}),
  };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: {
        contractor: true,
        applications: {
          where: { labourId: session.user.id },
        },
      },
    }),
    prisma.job.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / take));
  const hasFilters = city || skill || title || minWageStr || maxWageStr;

  function buildPageUrl(p) {
    const qs = new URLSearchParams(
      Object.fromEntries(
        Object.entries({
          city,
          skill,
          title,
          minWage: minWageStr,
          maxWage: maxWageStr,
          page: String(p),
        }).filter(([, v]) => v)
      )
    ).toString();
    return `?${qs}`;
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-900 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

  return (
    <div className="min-h-screen bg-zinc-50/60">
      {/* ── Gradient header ──────────────────────────────────── */}
      <header className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 pb-24 pt-6 sm:pb-28 sm:pt-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm transition hover:bg-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
              Home
            </Link>
            <Badge className="border-white/20 bg-white/10 text-white backdrop-blur-sm">
              {total} open job{total !== 1 ? "s" : ""}
            </Badge>
          </div>
          <div className="mt-6 sm:mt-8">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Find Local Jobs
            </h1>
            <p className="mt-1.5 max-w-lg text-sm text-indigo-100">
              Browse open jobs in your city and apply directly to contractors — no middlemen, no commission.
            </p>
          </div>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────── */}
      <main className="relative z-10 mx-auto -mt-16 max-w-5xl space-y-6 px-4 pb-16 sm:-mt-20 sm:px-6">
        {/* ── Filters card ─────────────────────────────────── */}
        <Card className="border-0 shadow-lg shadow-slate-200/60">
          <CardHeader className="border-b-0 pb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
              </div>
              <CardTitle className="text-base">Filters</CardTitle>
              {hasFilters && (
                <a
                  href="/jobs"
                  className="ml-auto text-xs font-medium text-indigo-600 transition hover:text-indigo-700"
                >
                  Clear all
                </a>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" method="GET">
              {/* Search by title — full width */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600" htmlFor="title">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                  Search by title
                </label>
                <input
                  id="title"
                  name="title"
                  defaultValue={title}
                  className={inputClass}
                  placeholder="e.g. Painter for 3 days"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                <div className="space-y-1">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600" htmlFor="city">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                    City
                  </label>
                  <input id="city" name="city" defaultValue={city} className={inputClass} placeholder="e.g. Jaipur" />
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600" htmlFor="skill">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" /></svg>
                    Skill
                  </label>
                  <input id="skill" name="skill" defaultValue={skill} className={inputClass} placeholder="e.g. Mason" />
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600" htmlFor="minWage">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    Min wage (₹)
                  </label>
                  <input id="minWage" name="minWage" type="number" min={0} defaultValue={minWageStr} className={inputClass} placeholder="0" />
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600" htmlFor="maxWage">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    Max wage (₹)
                  </label>
                  <input id="maxWage" name="maxWage" type="number" min={0} defaultValue={maxWageStr} className={inputClass} placeholder="Any" />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 active:scale-[0.98]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                Search jobs
              </button>
            </form>
          </CardContent>
        </Card>

        {/* ── Results header ───────────────────────────────── */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {total === 0
              ? "No jobs match your filters."
              : `Showing ${skip + 1}–${Math.min(skip + take, total)} of ${total} job${total !== 1 ? "s" : ""}`}
          </p>
          {hasFilters && (
            <div className="flex flex-wrap gap-1.5">
              {city && (
                <Badge variant="secondary" className="text-[10px]">
                  📍 {city}
                </Badge>
              )}
              {skill && (
                <Badge variant="secondary" className="text-[10px]">
                  🔧 {skill}
                </Badge>
              )}
              {(minWageStr || maxWageStr) && (
                <Badge variant="secondary" className="text-[10px]">
                  ₹ {minWageStr || "0"} – {maxWageStr || "∞"}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* ── Job cards ────────────────────────────────────── */}
        {jobs.length === 0 ? (
          <Card className="border-0 bg-slate-50/80 shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
              <p className="mt-3 text-sm font-medium text-slate-500">No jobs found</p>
              <p className="mt-1 text-xs text-slate-400">Try adjusting your filters or search in a different city.</p>
              <a
                href="/jobs"
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-medium text-white transition-all hover:shadow-md hover:brightness-110"
              >
                Clear filters
              </a>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const alreadyApplied = job.applications.length > 0;
              return (
                <Card
                  key={job.id}
                  className="border-0 shadow-md shadow-slate-200/60 transition-all hover:shadow-lg"
                >
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      {/* Left — job info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-slate-900">
                            {job.title}
                          </h3>
                          <Badge variant="secondary" className="text-[10px]">
                            {job.skillRequired}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                            {job.city}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                            ₹{job.wage}/day
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                            {job.contractor.name}
                          </span>
                        </div>

                        <Separator className="bg-slate-100" />

                        <p className="text-sm leading-relaxed text-slate-600">
                          {job.description}
                        </p>
                      </div>

                      {/* Right — apply button */}
                      <div className="flex flex-shrink-0 flex-col items-end gap-2">
                        <div className="rounded-xl bg-indigo-50 px-4 py-2 text-center">
                          <p className="text-lg font-bold text-indigo-600">₹{job.wage}</p>
                          <p className="text-[10px] text-indigo-400">per day</p>
                        </div>
                        <form action={applyToJob}>
                          <input type="hidden" name="jobId" value={job.id} />
                          {alreadyApplied ? (
                            <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                              Applied
                            </span>
                          ) : (
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2 text-xs font-medium text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 active:scale-[0.98]"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13" /><path d="m22 2-7 20-4-9-9-4 20-7z" /></svg>
                              Apply now
                            </button>
                          )}
                        </form>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* ── Pagination ───────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-5 py-3 shadow-sm">
            <span className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <a
                  href={buildPageUrl(page - 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:shadow"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                  Previous
                </a>
              )}
              {page < totalPages && (
                <a
                  href={buildPageUrl(page + 1)}
                  className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:shadow-md hover:brightness-110"
                >
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </a>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
