"use client";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import {
    ArrowLeft, Wrench, MapPin, FileText, Briefcase,
    Star, CheckCircle2, Clock, XCircle, ChevronRight,
    IndianRupee, TrendingUp, FolderOpen, FolderCheck,
    User, Sparkles,
} from "lucide-react";
import LangToggle from "../../../components/LangToggle";
import { useT } from "../../../lib/i18n/LanguageContext";

/* ─── helpers ─────────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
    const t = useT();
    const map = {
        PENDING:  { labelKey: "status.pending",  bg: "bg-amber-50 text-amber-700 border-amber-200",   icon: <Clock className="h-3 w-3" /> },
        ACCEPTED: { labelKey: "status.accepted", bg: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle2 className="h-3 w-3" /> },
        REJECTED: { labelKey: "status.rejected", bg: "bg-rose-50 text-rose-700 border-rose-200",    icon: <XCircle className="h-3 w-3" /> },
    };
    const s = map[status] ?? map.PENDING;
    return (
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${s.bg}`}>
            {s.icon}
            {t(s.labelKey)}
        </span>
    );
}

function ProfileProgress({ profile, city, t }) {
    let filled = 0;
    if (profile?.skill) filled++;
    if (profile?.experience != null) filled++;
    if (city) filled++;
    const pct = Math.round((filled / 3) * 100);
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">{t("labour.profile.completion")}</span>
                <span className="font-semibold text-indigo-600">{pct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700 ease-out"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

/* ─── main component ──────────────────────────────────────────────────── */
export default function LabourDashboardClient({
    session, profile, applications, recommendedJobs, upsertAction, reviewAction,
}) {
    const user = session.user;
    const t    = useT();

    const activeProjects    = applications.filter(a => a.status === "ACCEPTED" && a.job.status === "OPEN");
    const completedProjects = applications.filter(a => a.status === "ACCEPTED" && a.job.status === "CLOSED");

    return (
        <div className="min-h-screen bg-zinc-50/60">
            {/* ── Gradient hero header ─────────────────────────────── */}
            <header className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 pb-28 pt-6 sm:pb-32 sm:pt-8">
                <div className="pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay"
                    style={{ backgroundImage: "radial-gradient(circle at 25% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
                />

                <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
                    {/* top row */}
                    <div className="flex items-center justify-between gap-2">
                        <Link href="/" className="group inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm transition hover:bg-white/20">
                            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                            {t("common.home")}
                        </Link>
                        <div className="flex items-center gap-2">
                            {/* Language toggle — visible in dashboard */}
                            <LangToggle className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" />
                            <Badge className="border-white/20 bg-white/10 text-white backdrop-blur-sm">
                                <Sparkles className="mr-1 h-3 w-3" />
                                {t("labour.badge")}
                            </Badge>
                        </div>
                    </div>

                    <div className="mt-6 sm:mt-8">
                        <p className="text-xs font-medium uppercase tracking-wider text-indigo-200">{t("labour.welcomeBack")}</p>
                        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">{user.name}</h1>
                    </div>

                    {/* stats strip */}
                    <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
                        {[
                            { icon: <Wrench className="h-4 w-4" />,   label: t("labour.skill"),         value: profile?.skill ?? t("common.notSet") },
                            { icon: <MapPin className="h-4 w-4" />,   label: t("labour.city"),          value: user.city ?? t("common.notSet") },
                            { icon: <FileText className="h-4 w-4" />, label: t("labour.applications"), value: applications.length },
                        ].map(s => (
                            <div key={s.label} className="rounded-xl bg-white/10 px-3 py-3 text-white backdrop-blur-sm transition hover:bg-white/15 sm:px-4">
                                <div className="flex items-center gap-2 text-indigo-200">
                                    {s.icon}
                                    <span className="text-[11px] font-medium uppercase tracking-wider sm:text-xs">{s.label}</span>
                                </div>
                                <p className="mt-1 truncate text-sm font-semibold sm:text-base">{s.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* ── Main content ─────────────────────────────────────── */}
            <main className="relative z-10 mx-auto -mt-20 max-w-5xl space-y-8 px-4 pb-16 sm:-mt-24 sm:px-6">

                {/* Profile + Browse row */}
                <div className="grid gap-5 md:grid-cols-2">
                    {/* Profile card */}
                    <Card className="border-0 shadow-lg shadow-slate-200/60">
                        <CardHeader className="border-b-0 pb-2">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                    <User className="h-4 w-4" />
                                </div>
                                <CardTitle className="text-base">{t("labour.profile.title")}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ProfileProgress profile={profile} city={user.city} t={t} />
                            <Separator className="bg-slate-100" />
                            <form action={upsertAction} className="space-y-3">
                                {/* Skill */}
                                <div className="space-y-1">
                                    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600" htmlFor="skill">
                                        <Wrench className="h-3 w-3 text-slate-400" />
                                        {t("labour.profile.primarySkill")}
                                    </label>
                                    <input id="skill" name="skill" defaultValue={profile?.skill ?? ""} required
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        placeholder={t("labour.profile.skillPlaceholder")} />
                                </div>
                                {/* Experience */}
                                <div className="space-y-1">
                                    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600" htmlFor="experience">
                                        <TrendingUp className="h-3 w-3 text-slate-400" />
                                        {t("labour.profile.experience")}
                                    </label>
                                    <input id="experience" name="experience" type="number" min={0} defaultValue={profile?.experience ?? 0} required
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                                </div>
                                {/* City */}
                                <div className="space-y-1">
                                    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600" htmlFor="city">
                                        <MapPin className="h-3 w-3 text-slate-400" />
                                        {t("labour.profile.city")}
                                    </label>
                                    <input id="city" name="city" defaultValue={user.city ?? ""} required
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        placeholder={t("labour.profile.cityPlaceholder")} />
                                </div>
                                <button type="submit"
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 active:scale-[0.98]">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    {t("labour.profile.save")}
                                </button>
                                <p className="text-[11px] text-slate-400">
                                    {profile ? t("labour.profile.saved") : t("labour.profile.fillOnce")}
                                </p>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Browse jobs card */}
                    <Card className="flex flex-col border-0 shadow-lg shadow-slate-200/60">
                        <CardHeader className="border-b-0 pb-2">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                    <Briefcase className="h-4 w-4" />
                                </div>
                                <CardTitle className="text-base">{t("labour.browseJobs.title")}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col justify-between gap-4">
                            <p className="text-sm leading-relaxed text-slate-500">{t("labour.browseJobs.desc")}</p>
                            <div className="space-y-3 rounded-xl bg-slate-50 px-4 py-3">
                                <p className="text-xs font-medium text-slate-600">{t("labour.browseJobs.quickStats")}</p>
                                <div className="grid grid-cols-2 gap-3 text-center">
                                    <div className="rounded-lg bg-white px-3 py-2.5 shadow-sm">
                                        <p className="text-lg font-bold text-indigo-600">
                                            {applications.filter(a => a.status === "ACCEPTED").length}
                                        </p>
                                        <p className="text-[10px] text-slate-400">{t("labour.browseJobs.accepted")}</p>
                                    </div>
                                    <div className="rounded-lg bg-white px-3 py-2.5 shadow-sm">
                                        <p className="text-lg font-bold text-amber-600">
                                            {applications.filter(a => a.status === "PENDING").length}
                                        </p>
                                        <p className="text-[10px] text-slate-400">{t("labour.browseJobs.pending")}</p>
                                    </div>
                                </div>
                            </div>
                            <Link href="/jobs"
                                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 active:scale-[0.98]">
                                <Briefcase className="h-4 w-4" />
                                {t("labour.browseJobs.openJobsList")}
                                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* ── Recommended jobs ──────────────────────────────── */}
                {recommendedJobs.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                                    <Sparkles className="h-3.5 w-3.5" />
                                </div>
                                <h2 className="text-lg font-semibold text-slate-900">{t("labour.recommended.title")}</h2>
                            </div>
                            <Link href="/jobs" className="text-xs font-medium text-indigo-600 transition hover:text-indigo-700">
                                {t("common.viewAll")}
                            </Link>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollSnapType: "x mandatory" }}>
                            {recommendedJobs.map(job => (
                                <Card key={job.id}
                                    className="min-w-[260px] max-w-[300px] flex-shrink-0 border-0 shadow-md shadow-slate-200/60 transition-all hover:-translate-y-0.5 hover:shadow-lg sm:min-w-[280px]"
                                    style={{ scrollSnapAlign: "start" }}>
                                    <CardContent className="space-y-3 p-5">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">{job.title}</h3>
                                            <Badge variant="secondary" className="flex-shrink-0 text-[10px]">{job.skillRequired}</Badge>
                                        </div>
                                        <div className="flex flex-col gap-1.5 text-xs text-slate-500">
                                            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3 w-3 text-slate-400" />{job.city}</span>
                                            <span className="inline-flex items-center gap-1.5"><IndianRupee className="h-3 w-3 text-slate-400" />₹{job.wage}{t("common.perDay")}</span>
                                        </div>
                                        <Separator className="bg-slate-100" />
                                        <p className="line-clamp-2 text-xs leading-relaxed text-slate-400">{job.description}</p>
                                        <Link href="/jobs"
                                            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 active:scale-[0.98]">
                                            {t("labour.recommended.viewApply")}
                                            <ChevronRight className="h-3 w-3" />
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Active Projects ──────────────────────────────── */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                            <FolderOpen className="h-3.5 w-3.5" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">{t("labour.active.title")}</h2>
                        {activeProjects.length > 0 && (
                            <Badge variant="secondary" className="text-[10px]">{activeProjects.length}</Badge>
                        )}
                    </div>

                    {activeProjects.length === 0 ? (
                        <Card className="border-0 border-dashed border-slate-200 bg-slate-50/80 shadow-none">
                            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                                <FolderOpen className="h-8 w-8 text-slate-300" />
                                <p className="mt-2 text-sm text-slate-400">{t("labour.active.empty")}</p>
                                <p className="text-xs text-slate-400">{t("labour.active.emptyDesc")}</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {activeProjects.map(app => (
                                <Card key={app.id} className="border-0 shadow-md shadow-slate-200/60 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                                    <CardContent className="space-y-3 p-5">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="text-sm font-semibold text-slate-900">{app.job.title}</h3>
                                            <Badge className="bg-emerald-600 text-[10px] text-white border-emerald-600">{t("status.active")}</Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                                            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{app.job.city}</span>
                                            <span className="inline-flex items-center gap-1"><Wrench className="h-3 w-3" />{app.job.skillRequired}</span>
                                            <span className="inline-flex items-center gap-1"><IndianRupee className="h-3 w-3" />₹{app.job.wage}{t("common.perDay")}</span>
                                        </div>
                                        <Separator className="bg-slate-100" />
                                        <p className="text-xs text-slate-600">
                                            <span className="font-medium">{t("labour.active.contractor")}</span>{" "}
                                            {app.job.contractor.name} ({app.job.contractor.phone}) — {app.job.contractor.city}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>

                {/* ── Completed Projects ──────────────────────────── */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <FolderCheck className="h-3.5 w-3.5" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">{t("labour.completed.title")}</h2>
                        {completedProjects.length > 0 && (
                            <Badge variant="secondary" className="text-[10px]">{completedProjects.length}</Badge>
                        )}
                    </div>

                    {completedProjects.length === 0 ? (
                        <Card className="border-0 border-dashed border-slate-200 bg-slate-50/80 shadow-none">
                            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                                <FolderCheck className="h-8 w-8 text-slate-300" />
                                <p className="mt-2 text-sm text-slate-400">{t("labour.completed.empty")}</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {completedProjects.map(app => {
                                const existing = app.job.reviews.find(r => r.revieweeId === app.job.contractor.id);
                                return (
                                    <Card key={app.id} className="border-0 shadow-md shadow-slate-200/60 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                                        <CardContent className="space-y-3 p-5">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="text-sm font-semibold text-slate-900">{app.job.title}</h3>
                                                <Badge className="border-slate-200 bg-slate-100 text-[10px] text-slate-600">{t("status.completed")}</Badge>
                                            </div>
                                            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                                                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{app.job.city}</span>
                                                <span className="inline-flex items-center gap-1"><IndianRupee className="h-3 w-3" />₹{app.job.wage}{t("common.perDay")}</span>
                                            </div>
                                            <Separator className="bg-slate-100" />
                                            <p className="text-xs text-slate-600">
                                                <span className="font-medium">{t("labour.completed.rateContractor").split(" ")[0]}:</span>{" "}
                                                {app.job.contractor.name}
                                            </p>
                                            {existing ? (
                                                <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                                                    <Star className="h-3.5 w-3.5 fill-emerald-500" />
                                                    {t("labour.completed.reviewed", { rating: existing.rating })}
                                                </div>
                                            ) : (
                                                <form action={reviewAction} className="space-y-2 rounded-lg border border-slate-100 bg-slate-50/80 p-3">
                                                    <input type="hidden" name="jobId" value={app.jobId} />
                                                    <input type="hidden" name="revieweeId" value={app.job.contractor.id} />
                                                    <p className="text-[11px] font-medium text-slate-600">{t("labour.completed.rateContractor")}</p>
                                                    <div className="flex items-center gap-3">
                                                        <select name="rating" defaultValue="5"
                                                            className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                                                            {[1,2,3,4,5].map(v => <option key={v} value={v}>{"★".repeat(v)} {v}/5</option>)}
                                                        </select>
                                                    </div>
                                                    <textarea name="comment" rows={2} placeholder={t("labour.completed.optionalComment")}
                                                        className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                                                    <button type="submit"
                                                        className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1.5 text-[11px] font-medium text-white transition-all hover:shadow-md hover:brightness-110 active:scale-[0.98]">
                                                        <Star className="h-3 w-3" />{t("labour.completed.submitReview")}
                                                    </button>
                                                </form>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* ── All applications ─────────────────────────────── */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                            <FileText className="h-3.5 w-3.5" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">{t("labour.allApps.title")}</h2>
                        {applications.length > 0 && (
                            <Badge variant="secondary" className="text-[10px]">{applications.length}</Badge>
                        )}
                    </div>
                    <p className="text-sm text-slate-500">{t("labour.allApps.desc")}</p>

                    {applications.length === 0 ? (
                        <Card className="border-0 border-dashed border-slate-200 bg-slate-50/80 shadow-none">
                            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                                <FileText className="h-8 w-8 text-slate-300" />
                                <p className="mt-2 text-sm text-slate-400">{t("labour.allApps.empty")}</p>
                                <Link href="/jobs"
                                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-medium text-white transition-all hover:shadow-md hover:brightness-110">
                                    {t("labour.allApps.browseJobs")} <ChevronRight className="h-3 w-3" />
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {applications.map(app => (
                                <Card key={app.id} className="border-0 shadow-md shadow-slate-200/60 transition-all hover:shadow-lg">
                                    <CardContent className="p-5">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="space-y-1.5">
                                                <h3 className="text-sm font-semibold text-slate-900">{app.job.title}</h3>
                                                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                                                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{app.job.city}</span>
                                                    <span className="inline-flex items-center gap-1"><Wrench className="h-3 w-3" />{app.job.skillRequired}</span>
                                                    <span className="inline-flex items-center gap-1"><IndianRupee className="h-3 w-3" />₹{app.job.wage}{t("common.perDay")}</span>
                                                </div>
                                            </div>
                                            <StatusBadge status={app.status} />
                                        </div>
                                        {app.status === "ACCEPTED" && (
                                            <div className="mt-3 rounded-lg bg-emerald-50/70 px-3 py-2 text-xs text-slate-600">
                                                <span className="font-medium text-emerald-700">{t("labour.allApps.contractor")}</span>{" "}
                                                {app.job.contractor.name} ({app.job.contractor.phone}) — {app.job.contractor.city}
                                            </div>
                                        )}
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
