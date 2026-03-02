"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import {
    ArrowLeft,
    Building2,
    MapPin,
    Briefcase,
    Star,
    CheckCircle2,
    Clock,
    XCircle,
    ChevronRight,
    IndianRupee,
    Users,
    ClipboardList,
    PlusCircle,
    Lock,
    Sparkles,
    FileText,
    Wrench,
    UserRoundCheck,
    UserRoundX,
} from "lucide-react";

/* ─── helpers ─────────────────────────────────────────────────────────── */
function statusBadge(status) {
    const map = {
        PENDING: {
            label: "Pending",
            bg: "bg-amber-50 text-amber-700 border-amber-200",
            icon: <Clock className="h-3 w-3" />,
        },
        ACCEPTED: {
            label: "Accepted",
            bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
            icon: <CheckCircle2 className="h-3 w-3" />,
        },
        REJECTED: {
            label: "Rejected",
            bg: "bg-rose-50 text-rose-700 border-rose-200",
            icon: <XCircle className="h-3 w-3" />,
        },
    };
    const s = map[status] ?? map.PENDING;
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${s.bg}`}
        >
            {s.icon}
            {s.label}
        </span>
    );
}

function jobStatusBadge(status) {
    if (status === "CLOSED") {
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                <Lock className="h-3 w-3" />
                Closed
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
            <CheckCircle2 className="h-3 w-3" />
            Open
        </span>
    );
}

function ProfileProgress({ profile }) {
    const pct = profile?.companyName ? 100 : 0;
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">Profile completion</span>
                <span className="font-semibold text-emerald-600">{pct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700 ease-out"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

const inputClass =
    "w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 transition focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

/* ─── main component ──────────────────────────────────────────────────── */
export default function ContractorDashboardClient({
    session,
    profile,
    jobs,
    upsertAction,
    createJobAction,
    updateAppStatusAction,
    closeJobAction,
    reviewAction,
}) {
    const user = session.user;
    const totalApplicants = jobs.reduce((n, j) => n + j.applications.length, 0);
    const openJobs = jobs.filter((j) => j.status === "OPEN");
    const closedJobs = jobs.filter((j) => j.status === "CLOSED");

    return (
        <div className="min-h-screen bg-zinc-50/60">
            {/* ── Gradient hero header ────────────────────────────────── */}
            <header className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 pb-28 pt-6 sm:pb-32 sm:pt-8">
                <div
                    className="pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 25% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 50%, white 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />

                <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            className="group inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm transition hover:bg-white/20"
                        >
                            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                            Home
                        </Link>
                        <Badge className="border-white/20 bg-white/10 text-white backdrop-blur-sm">
                            <Sparkles className="mr-1 h-3 w-3" />
                            Contractor
                        </Badge>
                    </div>

                    <div className="mt-6 sm:mt-8">
                        <p className="text-xs font-medium uppercase tracking-wider text-emerald-200">
                            Welcome back
                        </p>
                        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                            {user.name}
                        </h1>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
                        {[
                            {
                                icon: <Building2 className="h-4 w-4" />,
                                label: "Company",
                                value: profile?.companyName ?? "Not set",
                            },
                            {
                                icon: <Briefcase className="h-4 w-4" />,
                                label: "Jobs posted",
                                value: jobs.length,
                            },
                            {
                                icon: <Users className="h-4 w-4" />,
                                label: "Applicants",
                                value: totalApplicants,
                            },
                        ].map((s) => (
                            <div
                                key={s.label}
                                className="rounded-xl bg-white/10 px-3 py-3 text-white backdrop-blur-sm transition hover:bg-white/15 sm:px-4"
                            >
                                <div className="flex items-center gap-2 text-emerald-200">
                                    {s.icon}
                                    <span className="text-[11px] font-medium uppercase tracking-wider sm:text-xs">
                                        {s.label}
                                    </span>
                                </div>
                                <p className="mt-1 truncate text-sm font-semibold sm:text-base">
                                    {s.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* ── Main content ────────────────────────────────────────── */}
            <main className="relative z-10 mx-auto -mt-20 max-w-5xl space-y-8 px-4 pb-16 sm:-mt-24 sm:px-6">
                {/* Profile + Post job row */}
                <div className="grid gap-5 md:grid-cols-2">
                    {/* Company profile card */}
                    <Card className="border-0 shadow-lg shadow-slate-200/60">
                        <CardHeader className="border-b-0 pb-2">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                    <Building2 className="h-4 w-4" />
                                </div>
                                <CardTitle className="text-base">Company profile</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ProfileProgress profile={profile} />
                            <Separator className="bg-slate-100" />
                            <form action={upsertAction} className="space-y-3">
                                <div className="space-y-1">
                                    <label
                                        className="flex items-center gap-1.5 text-xs font-medium text-slate-600"
                                        htmlFor="companyName"
                                    >
                                        <Building2 className="h-3 w-3 text-slate-400" />
                                        Company / Contractor name
                                    </label>
                                    <input
                                        id="companyName"
                                        name="companyName"
                                        defaultValue={profile?.companyName ?? ""}
                                        required
                                        className={inputClass}
                                        placeholder="e.g. Shakti Construction Co."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 active:scale-[0.98]"
                                >
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Save profile
                                </button>
                                <p className="text-[11px] text-slate-400">
                                    {profile
                                        ? "Profile saved ✓ — You can update it anytime."
                                        : "Set this once so labourers know who is hiring."}
                                </p>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Post a new job card */}
                    <Card className="border-0 shadow-lg shadow-slate-200/60">
                        <CardHeader className="border-b-0 pb-2">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                                    <PlusCircle className="h-4 w-4" />
                                </div>
                                <CardTitle className="text-base">Post a new job</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form action={createJobAction} className="space-y-3">
                                <div className="space-y-1">
                                    <label
                                        className="flex items-center gap-1.5 text-xs font-medium text-slate-600"
                                        htmlFor="title"
                                    >
                                        <Briefcase className="h-3 w-3 text-slate-400" />
                                        Job title
                                    </label>
                                    <input
                                        id="title"
                                        name="title"
                                        required
                                        className={inputClass}
                                        placeholder="e.g. Mason required for 5 days"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label
                                        className="flex items-center gap-1.5 text-xs font-medium text-slate-600"
                                        htmlFor="description"
                                    >
                                        <FileText className="h-3 w-3 text-slate-400" />
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        required
                                        rows={3}
                                        className={inputClass}
                                        placeholder="Short description of work, timing, and payment details."
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div className="space-y-1">
                                        <label
                                            className="flex items-center gap-1.5 text-xs font-medium text-slate-600"
                                            htmlFor="skillRequired"
                                        >
                                            <Wrench className="h-3 w-3 text-slate-400" />
                                            Skill required
                                        </label>
                                        <input
                                            id="skillRequired"
                                            name="skillRequired"
                                            required
                                            className={inputClass}
                                            placeholder="e.g. Mason"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label
                                            className="flex items-center gap-1.5 text-xs font-medium text-slate-600"
                                            htmlFor="city"
                                        >
                                            <MapPin className="h-3 w-3 text-slate-400" />
                                            City
                                        </label>
                                        <input
                                            id="city"
                                            name="city"
                                            defaultValue={user.city ?? ""}
                                            required
                                            className={inputClass}
                                            placeholder="e.g. Jaipur"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label
                                            className="flex items-center gap-1.5 text-xs font-medium text-slate-600"
                                            htmlFor="wage"
                                        >
                                            <IndianRupee className="h-3 w-3 text-slate-400" />
                                            Daily wage (₹)
                                        </label>
                                        <input
                                            id="wage"
                                            name="wage"
                                            type="number"
                                            min={1}
                                            required
                                            className={inputClass}
                                            placeholder="e.g. 800"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 active:scale-[0.98]"
                                >
                                    <PlusCircle className="h-3.5 w-3.5" />
                                    Post job
                                </button>
                                <p className="text-[11px] text-slate-400">
                                    Jobs are created as OPEN. You can close them once work is done.
                                </p>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* ── Quick overview strip ────────────────────────────── */}
                <div className="grid grid-cols-3 gap-4">
                    <Card className="border-0 shadow-md shadow-slate-200/60">
                        <CardContent className="flex flex-col items-center py-5 text-center">
                            <p className="text-2xl font-bold text-emerald-600">{openJobs.length}</p>
                            <p className="mt-0.5 text-xs text-slate-500">Open jobs</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md shadow-slate-200/60">
                        <CardContent className="flex flex-col items-center py-5 text-center">
                            <p className="text-2xl font-bold text-slate-600">{closedJobs.length}</p>
                            <p className="mt-0.5 text-xs text-slate-500">Closed jobs</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md shadow-slate-200/60">
                        <CardContent className="flex flex-col items-center py-5 text-center">
                            <p className="text-2xl font-bold text-violet-600">{totalApplicants}</p>
                            <p className="mt-0.5 text-xs text-slate-500">Total applicants</p>
                        </CardContent>
                    </Card>
                </div>

                {/* ── Jobs & applicants ────────────────────────────────── */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                            <ClipboardList className="h-3.5 w-3.5" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Your jobs & applicants
                        </h2>
                        {jobs.length > 0 && (
                            <Badge variant="secondary" className="text-[10px]">
                                {jobs.length}
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-slate-500">
                        Manage applications and close jobs when hiring is complete.
                    </p>

                    {jobs.length === 0 ? (
                        <Card className="border-0 bg-slate-50/80 shadow-none">
                            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                                <Briefcase className="h-8 w-8 text-slate-300" />
                                <p className="mt-2 text-sm text-slate-400">
                                    No jobs posted yet. Create your first job above.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-5">
                            {jobs.map((job) => (
                                <Card
                                    key={job.id}
                                    className="border-0 shadow-lg shadow-slate-200/60 transition-all hover:shadow-xl"
                                >
                                    {/* Job header */}
                                    <CardHeader className="border-b-0 pb-2">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2">
                                                    <CardTitle className="text-base">{job.title}</CardTitle>
                                                    {jobStatusBadge(job.status)}
                                                </div>
                                                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                                                    <span className="inline-flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" /> {job.city}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1">
                                                        <Wrench className="h-3 w-3" /> {job.skillRequired}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1">
                                                        <IndianRupee className="h-3 w-3" /> ₹{job.wage}/day
                                                    </span>
                                                </div>
                                            </div>
                                            {job.status === "OPEN" && (
                                                <form action={closeJobAction}>
                                                    <input type="hidden" name="jobId" value={job.id} />
                                                    <button
                                                        type="submit"
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow active:scale-[0.98]"
                                                    >
                                                        <Lock className="h-3 w-3" />
                                                        Close job
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <p className="text-sm leading-relaxed text-slate-600">
                                            {job.description}
                                        </p>
                                        <Separator className="bg-slate-100" />

                                        {/* Applicants */}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-slate-400" />
                                                <p className="text-xs font-semibold text-slate-700">
                                                    Applicants ({job.applications.length})
                                                </p>
                                            </div>

                                            {job.applications.length === 0 ? (
                                                <p className="mt-2 text-xs text-slate-400">
                                                    No applications yet.
                                                </p>
                                            ) : (
                                                <ul className="mt-3 space-y-2">
                                                    {job.applications.map((app) => (
                                                        <li
                                                            key={app.id}
                                                            className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition-all hover:bg-slate-50"
                                                        >
                                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                                <div className="space-y-0.5">
                                                                    <p className="text-sm font-medium text-slate-900">
                                                                        {app.labour.name}
                                                                    </p>
                                                                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                                                                        <span className="inline-flex items-center gap-1">
                                                                            <MapPin className="h-2.5 w-2.5" />
                                                                            {app.labour.city}
                                                                        </span>
                                                                        {statusBadge(app.status)}
                                                                    </div>
                                                                </div>

                                                                {/* Accept / Reject */}
                                                                {app.status === "PENDING" && job.status === "OPEN" && (
                                                                    <div className="flex gap-2">
                                                                        <form action={updateAppStatusAction}>
                                                                            <input type="hidden" name="applicationId" value={app.id} />
                                                                            <input type="hidden" name="status" value="ACCEPTED" />
                                                                            <button
                                                                                type="submit"
                                                                                className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 active:scale-[0.98]"
                                                                            >
                                                                                <UserRoundCheck className="h-3 w-3" />
                                                                                Accept
                                                                            </button>
                                                                        </form>
                                                                        <form action={updateAppStatusAction}>
                                                                            <input type="hidden" name="applicationId" value={app.id} />
                                                                            <input type="hidden" name="status" value="REJECTED" />
                                                                            <button
                                                                                type="submit"
                                                                                className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 active:scale-[0.98]"
                                                                            >
                                                                                <UserRoundX className="h-3 w-3" />
                                                                                Reject
                                                                            </button>
                                                                        </form>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Review form for closed jobs with accepted workers */}
                                                            {app.status === "ACCEPTED" &&
                                                                job.status === "CLOSED" &&
                                                                (() => {
                                                                    const existing = job.reviews.find(
                                                                        (r) => r.revieweeId === app.labour.id
                                                                    );
                                                                    return existing ? (
                                                                        <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                                                                            <Star className="h-3.5 w-3.5 fill-emerald-500" />
                                                                            Reviewed — rated {existing.rating}/5
                                                                        </div>
                                                                    ) : (
                                                                        <form
                                                                            action={reviewAction}
                                                                            className="mt-3 space-y-2 rounded-lg border border-slate-100 bg-white p-3"
                                                                        >
                                                                            <input type="hidden" name="jobId" value={job.id} />
                                                                            <input type="hidden" name="revieweeId" value={app.labour.id} />
                                                                            <p className="text-[11px] font-medium text-slate-600">
                                                                                Rate this worker
                                                                            </p>
                                                                            <div className="flex items-center gap-3">
                                                                                <select
                                                                                    name="rating"
                                                                                    defaultValue="5"
                                                                                    className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                                                                >
                                                                                    {[1, 2, 3, 4, 5].map((v) => (
                                                                                        <option key={v} value={v}>
                                                                                            {"★".repeat(v)} {v}/5
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>
                                                                            <textarea
                                                                                name="comment"
                                                                                rows={2}
                                                                                placeholder="Optional comment…"
                                                                                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-xs text-slate-700 transition focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                                                            />
                                                                            <button
                                                                                type="submit"
                                                                                className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1.5 text-[11px] font-medium text-white transition-all hover:shadow-md hover:brightness-110 active:scale-[0.98]"
                                                                            >
                                                                                <Star className="h-3 w-3" />
                                                                                Submit review
                                                                            </button>
                                                                        </form>
                                                                    );
                                                                })()}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
