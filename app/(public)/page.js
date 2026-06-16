"use client";
import { useState, useEffect, useRef } from "react";
import {
  CheckCircle2, Star, UserRoundCheck, BriefcaseBusiness,
  Workflow, Check, ChevronDown, ChevronRight, Search,
  MapPin, Wrench, Users, Building2, TrendingUp, Shield,
  Smartphone, Globe2, Zap, Paintbrush, Plug, Hammer,
  Droplets, Sparkles, ArrowRight, Play, Quote,
} from "lucide-react";
import { useT } from "../../lib/i18n/LanguageContext";
import LangToggle from "../../components/LangToggle";

/* ─── Static data ─────────────────────────────────────────────────── */
const FALLBACK_TESTIMONIALS = [
  {
    id: "f1", name: "Rakesh Kumar", role: "Mason", city: "Jaipur", rating: 5,
    message: "Earlier I waited at the chowk every morning hoping for work. Now I apply from my phone. I got 3 regular clients in the first month itself.",
    avatar: "RK", color: "from-indigo-500 to-violet-600",
  },
  {
    id: "f2", name: "Priya Sharma", role: "Site Supervisor", city: "Delhi", rating: 5,
    message: "I can see skills, experience, and ratings before calling anyone. It saves me hours every week and the quality of workers is much better.",
    avatar: "PS", color: "from-emerald-500 to-teal-600",
  },
  {
    id: "f3", name: "Ahmed Khan", role: "Plumber", city: "Mumbai", rating: 4,
    message: "Because of repeat contractors on the app, my work is more regular and better paid. My family is happier now with steady income.",
    avatar: "AK", color: "from-amber-500 to-orange-600",
  },
];

const SKILLS = [
  { nameKey: "landing.skill.painter",      icon: Paintbrush, value: "Painter",     from: "#f97316", to: "#fb923c", bg: "rgba(249,115,22,0.08)" },
  { nameKey: "landing.skill.electrician",  icon: Plug,        value: "Electrician", from: "#eab308", to: "#ca8a04", bg: "rgba(234,179,8,0.08)"  },
  { nameKey: "landing.skill.mason",        icon: Hammer,      value: "Mason",       from: "#6366f1", to: "#7c3aed", bg: "rgba(99,102,241,0.08)" },
  { nameKey: "landing.skill.plumber",      icon: Droplets,    value: "Plumber",     from: "#0ea5e9", to: "#06b6d4", bg: "rgba(14,165,233,0.08)" },
  { nameKey: "landing.skill.cleaner",      icon: Sparkles,    value: "Cleaner",     from: "#10b981", to: "#14b8a6", bg: "rgba(16,185,129,0.08)" },
];

const CITIES = ["Indore", "Ujjain", "Jaipur", "Ahmedabad", "Bhopal", "Surat"];

const LOGOS = [
  { name: "Govt. MP", abbr: "MP" },
  { name: "NSDC", abbr: "NS" },
  { name: "Skill India", abbr: "SI" },
  { name: "MSME", abbr: "MS" },
  { name: "NHB", abbr: "NH" },
];

/* ─── Tiny helpers ────────────────────────────────────────────────── */
function StarRow({ rating, size = "h-4 w-4" }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`${size} ${i <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} />
      ))}
    </div>
  );
}

function AnimCount({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      ob.disconnect();
      let start = 0;
      const step = Math.ceil(target / 40);
      const id = setInterval(() => {
        start = Math.min(start + step, target);
        setVal(start);
        if (start >= target) clearInterval(id);
      }, 30);
    }, { threshold: 0.3 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Page ────────────────────────────────────────────────────────── */
export default function Home() {
  const [feedbacks, setFeedbacks]     = useState(FALLBACK_TESTIMONIALS);
  const [avgRating, setAvgRating]     = useState(4.8);
  const [totalFeedbacks]              = useState(0);
  const [openFaq, setOpenFaq]         = useState("q1");
  const [skill, setSkill]             = useState("");
  const [city,  setCity]              = useState("");
  const t = useT();

  useEffect(() => {
    fetch("/api/feedback").then(r => r.json()).then(d => {
      if (d.feedbacks?.length > 0) {
        setFeedbacks(d.feedbacks);
        setAvgRating(Number(d.average?.toFixed(1)) || 4.8);
      }
    }).catch(() => {});
  }, []);

  const HOW_IT_WORKS = [
    { step:1, icon: UserRoundCheck, title: t("landing.howItWorks.step1.title"), desc: t("landing.howItWorks.step1.desc"), color:"#6366f1" },
    { step:2, icon: BriefcaseBusiness, title: t("landing.howItWorks.step2.title"), desc: t("landing.howItWorks.step2.desc"), color:"#10b981" },
    { step:3, icon: Workflow, title: t("landing.howItWorks.step3.title"), desc: t("landing.howItWorks.step3.desc"), color:"#f59e0b" },
  ];

  const FEATURES = [
    { icon: Shield,     title: t("landing.features.verified.title"),   desc: t("landing.features.verified.desc"),   span:"col-span-2", accent:"#6366f1" },
    { icon: MapPin,     title: t("landing.features.hyperlocal.title"), desc: t("landing.features.hyperlocal.desc"), span:"col-span-1", accent:"#10b981" },
    { icon: Smartphone, title: t("landing.features.mobile.title"),     desc: t("landing.features.mobile.desc"),     span:"col-span-1", accent:"#0ea5e9" },
    { icon: Zap,        title: t("landing.features.zero.title"),       desc: t("landing.features.zero.desc"),       span:"col-span-1", accent:"#f59e0b" },
    { icon: Globe2,     title: t("landing.features.language.title"),   desc: t("landing.features.language.desc"),   span:"col-span-1", accent:"#ec4899" },
    { icon: TrendingUp, title: t("landing.features.reputation.title"), desc: t("landing.features.reputation.desc"), span:"col-span-2", accent:"#f97316" },
  ];

  const FAQ = [
    { id:"q1", q: t("landing.faq.q1"), a: t("landing.faq.a1") },
    { id:"q2", q: t("landing.faq.q2"), a: t("landing.faq.a2") },
    { id:"q3", q: t("landing.faq.q3"), a: t("landing.faq.a3") },
    { id:"q4", q: t("landing.faq.q4"), a: t("landing.faq.a4") },
  ];

  return (
    <div className="bg-[#09090b] text-white antialiased">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative isolate min-h-[92vh] flex items-center overflow-hidden">

        {/* Mesh gradient background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div style={{background:"radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.35) 0%, transparent 70%)"}} className="absolute inset-0" />
          <div style={{background:"radial-gradient(ellipse 60% 40% at 80% 80%, rgba(16,185,129,0.12) 0%, transparent 60%)"}} className="absolute inset-0" />
          {/* grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          {/* floating blobs */}
          <div className="absolute top-1/4 -left-32 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl animate-pulse" style={{animationDuration:"4s"}} />
          <div className="absolute bottom-1/4 -right-32 h-72 w-72 rounded-full bg-emerald-600/15 blur-3xl animate-pulse" style={{animationDuration:"6s"}} />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            {/* Left — text */}
            <div className="space-y-8">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-indigo-300 backdrop-blur-sm">
                <Sparkles className="h-3 w-3" />
                {t("landing.badge")}
              </div>

              <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                {t("landing.title")}
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                  {t("landing.titleHighlight")}
                </span>
              </h1>

              <p className="max-w-lg text-base leading-relaxed text-zinc-400 sm:text-lg">
                {t("landing.subtitle")}
              </p>

              {/* Search bar */}
              <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md sm:flex-row">
                <div className="relative flex-1">
                  <Wrench className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <select
                    value={skill}
                    onChange={e => setSkill(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-zinc-900 py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="" disabled>{t("landing.selectSkill")}</option>
                    {SKILLS.map(s => <option key={s.value} value={s.value}>{t(s.nameKey)}</option>)}
                  </select>
                </div>
                <div className="relative flex-1">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder={t("landing.enterCity")}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <a
                  href={`/jobs?skill=${encodeURIComponent(skill)}&city=${encodeURIComponent(city)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 hover:shadow-indigo-600/50 active:scale-[0.97]"
                >
                  <Search className="h-4 w-4" />
                  {t("landing.findWork")}
                </a>
              </div>

              {/* CTA row */}
              <div className="flex flex-wrap items-center gap-4">
                <a href="/register?role=LABOUR" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-zinc-900 shadow-xl transition-all hover:bg-zinc-100 hover:shadow-2xl active:scale-[0.97]">
                  {t("landing.cta.findWork")} <ArrowRight className="h-4 w-4" />
                </a>
                <a href="/register?role=CONTRACTOR" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10">
                  {t("landing.cta.hireWorkers")} <ChevronRight className="h-4 w-4" />
                </a>
                <div className="ml-auto">
                  <LangToggle className="border-white/20 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white" />
                </div>
              </div>
            </div>

            {/* Right — visual card stack */}
            <div className="relative hidden lg:flex lg:items-center lg:justify-center">
              {/* Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-600/20 via-transparent to-emerald-600/15 blur-2xl" />

              <div className="relative w-full max-w-sm space-y-3">
                {/* Card 1 — job posting */}
                <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-5 shadow-2xl backdrop-blur-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-zinc-500">New job posted · Jaipur</p>
                      <p className="mt-1 text-base font-bold text-white">5-day Mason Required</p>
                      <p className="mt-0.5 text-sm text-zinc-400">Shakti Construction Co.</p>
                    </div>
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">Open</span>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Jaipur</span>
                    <span className="flex items-center gap-1"><Hammer className="h-3 w-3" /> Mason</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">₹ 850/day</span>
                  </div>
                  <button className="mt-4 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500">Apply Now</button>
                </div>

                {/* Card 2 — notification */}
                <div className="ml-8 rounded-2xl border border-white/10 bg-zinc-900/80 p-4 shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-bold text-white shadow">
                      ✓
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Application Accepted!</p>
                      <p className="text-xs text-zinc-400">Contractor will contact you soon</p>
                    </div>
                  </div>
                </div>

                {/* Card 3 — stats */}
                <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-4 shadow-xl backdrop-blur-md">
                  <p className="text-xs font-medium text-zinc-500 mb-3">Platform this week</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label:"Jobs Posted", val:"24" },
                      { label:"Workers Hired", val:"18" },
                      { label:"Avg Wage", val:"₹780" },
                    ].map(s => (
                      <div key={s.label} className="rounded-xl bg-white/5 px-3 py-2.5 text-center">
                        <p className="text-lg font-black text-white">{s.val}</p>
                        <p className="text-[10px] text-zinc-500">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { n:30,  suf:"+", label: t("landing.workers"),     icon: Users,     color:"text-indigo-400" },
              { n:10,  suf:"+", label: t("landing.contractors"), icon: Building2, color:"text-emerald-400" },
              { n:5,   suf:"+", label: t("landing.cities"),      icon: MapPin,    color:"text-amber-400"   },
              { n:4.8, suf:"/5",label: t("landing.avgRating"),   icon: Star,      color:"text-pink-400"    },
            ].map(s => (
              <div key={s.label} className="group flex flex-col items-center gap-1.5 rounded-2xl border border-white/8 bg-white/4 px-4 py-5 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/8">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <p className="text-2xl font-black text-white"><AnimCount target={s.n} suffix={s.suf} /></p>
                <p className="text-center text-[11px] font-medium text-zinc-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY (logo bar) ──────────────────────────────────── */}
      <section className="border-y border-white/6 bg-zinc-950 py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-zinc-600">Trusted & recognised by</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {LOGOS.map(l => (
              <div key={l.name} className="flex items-center gap-2 opacity-40 transition hover:opacity-70">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-xs font-bold text-zinc-300">{l.abbr}</span>
                <span className="text-sm font-semibold text-zinc-400">{l.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS PILL GRID ──────────────────────────────────────── */}
      <section className="bg-zinc-950 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Browse by skill</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {SKILLS.map(s => (
              <a
                key={s.value}
                href={`/jobs?skill=${encodeURIComponent(s.value)}`}
                className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-white/8 bg-zinc-900 px-4 py-6 transition-all hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl"
              >
                {/* Glow bg */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" style={{background:`radial-gradient(ellipse at 50% 100%, ${s.from}22 0%, transparent 70%)`}} />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl" style={{background:s.bg, border:`1px solid ${s.from}30`}}>
                  <s.icon className="h-6 w-6" style={{color:s.from}} />
                </div>
                <span className="relative text-sm font-semibold text-zinc-200 group-hover:text-white">{t(s.nameKey)}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-[#09090b] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold text-indigo-400">
              {t("landing.howItWorks.badge")}
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{t("landing.howItWorks.title")}</h2>
            <p className="mt-2 text-base text-zinc-400">{t("landing.howItWorks.subtitle")}</p>
          </div>

          {/* Timeline grid */}
          <div className="relative grid gap-6 sm:grid-cols-3">
            {/* Connector line */}
            <div className="pointer-events-none absolute left-[17%] right-[17%] top-[28px] hidden h-px bg-gradient-to-r from-indigo-500/0 via-indigo-500/40 to-indigo-500/0 sm:block" />

            {HOW_IT_WORKS.map((item, idx) => (
              <div key={item.step} className="group relative flex flex-col items-center text-center">
                {/* Step number ring */}
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl transition-transform group-hover:-translate-y-1">
                  <item.icon className="h-6 w-6" style={{color: item.color}} />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white shadow" style={{background: item.color}}>
                    {item.step}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES BENTO GRID ───────────────────────────────────── */}
      <section className="bg-zinc-950 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{t("landing.features.title")}</h2>
            <p className="mt-2 text-base text-zinc-400">{t("landing.features.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`group relative overflow-hidden rounded-2xl border border-white/8 bg-zinc-900 p-6 transition-all hover:-translate-y-0.5 hover:border-white/20 ${
                  i === 0 || i === 5 ? "sm:col-span-2" : "sm:col-span-1"
                }`}
              >
                {/* Glow on hover */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{background:`radial-gradient(ellipse at 20% 20%, ${f.accent}18 0%, transparent 60%)`}} />
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{background:`${f.accent}15`, border:`1px solid ${f.accent}30`}}>
                    <f.icon className="h-5 w-5" style={{color:f.accent}} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-white">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
      <section className="bg-[#09090b] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* Header */}
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                {totalFeedbacks > 0
                  ? t("landing.testimonials.trustedBy", {count: totalFeedbacks})
                  : t("landing.testimonials.trustedByFallback")}
              </h2>
              <p className="mt-2 text-base text-zinc-400">{t("landing.testimonials.subtitle")}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <StarRow rating={Math.round(avgRating)} />
              <span className="text-lg font-bold text-white">{avgRating}</span>
              <span className="text-sm text-zinc-500">{t("landing.testimonials.avgSatisfaction")}</span>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {feedbacks.map(fb => {
              const initials = fb.avatar || fb.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
              return (
                <div key={fb.id} className="group relative overflow-hidden rounded-2xl border border-white/8 bg-zinc-900 p-6 transition-all hover:-translate-y-1 hover:border-white/20">
                  <Quote className="absolute right-4 top-4 h-8 w-8 text-white/5 transition group-hover:text-white/10" />
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${fb.color || "from-indigo-500 to-violet-600"} text-sm font-bold text-white shadow-lg`}>
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{fb.name}</p>
                      <p className="text-xs text-zinc-500">{fb.role}{fb.city ? ` · ${fb.city}` : ""}</p>
                      <StarRow rating={fb.rating} size="h-3 w-3" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-400">&ldquo;{fb.message}&rdquo;</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CITIES ────────────────────────────────────────────────── */}
      <section className="bg-zinc-950 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-black tracking-tight">{t("landing.cities.title")}</h2>
            <p className="mt-1 text-sm text-zinc-400">{t("landing.cities.subtitle")}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {CITIES.map(c => (
              <a
                key={c}
                href={`/jobs?city=${encodeURIComponent(c)}`}
                className="group flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:-translate-y-0.5 hover:border-indigo-500/40 hover:bg-indigo-600/10 hover:text-indigo-300 hover:shadow-lg hover:shadow-indigo-600/10"
              >
                <MapPin className="h-3.5 w-3.5 text-zinc-600 transition-colors group-hover:text-indigo-400" />
                {c}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ─────────────────────────────────────────────────── */}
      <section className="bg-[#09090b] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{t("landing.roles.title")}</h2>
            <p className="mt-2 text-base text-zinc-400">{t("landing.roles.subtitle")}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { title: t("landing.roles.labour.title"),     from:"#6366f1", to:"#7c3aed", items:[t("landing.roles.labour.item1"),t("landing.roles.labour.item2"),t("landing.roles.labour.item3"),t("landing.roles.labour.item4")], href:"/register?role=LABOUR" },
              { title: t("landing.roles.contractor.title"), from:"#10b981", to:"#0d9488", items:[t("landing.roles.contractor.item1"),t("landing.roles.contractor.item2"),t("landing.roles.contractor.item3"),t("landing.roles.contractor.item4")], href:"/register?role=CONTRACTOR" },
              { title: t("landing.roles.admin.title"),      from:"#f59e0b", to:"#ea580c", items:[t("landing.roles.admin.item1"),t("landing.roles.admin.item2"),t("landing.roles.admin.item3"),t("landing.roles.admin.item4")], href:"/login" },
            ].map(role => (
              <div key={role.title} className="group relative overflow-hidden rounded-2xl border border-white/8 bg-zinc-900 transition-all hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl">
                {/* Top gradient bar */}
                <div className="h-1.5 w-full" style={{background:`linear-gradient(to right, ${role.from}, ${role.to})`}} />
                <div className="p-6">
                  <h3 className="text-base font-bold text-white">{role.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {role.items.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-zinc-400">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{color: role.from}} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a href={role.href} className="mt-6 flex items-center gap-1 text-sm font-semibold transition-all hover:gap-2" style={{color: role.from}}>
                    Get started <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────── */}
      <section id="about" className="bg-zinc-950 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-3xl border border-white/8 bg-zinc-900">
            <div className="grid gap-0 sm:grid-cols-[2fr,1.4fr]">
              <div className="border-b border-white/8 p-8 sm:border-b-0 sm:border-r">
                <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{t("landing.about.title")}</h2>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400">{t("landing.about.p1")}</p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{t("landing.about.p2")}</p>
              </div>
              <div className="p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{t("landing.about.principles")}</p>
                <ul className="mt-4 space-y-3">
                  {[t("landing.about.principle1"), t("landing.about.principle2"), t("landing.about.principle3"), t("landing.about.principle4")].map(p => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-400" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="bg-[#09090b] py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{t("landing.faq.title")}</h2>
          </div>
          <div className="space-y-3">
            {FAQ.map(({id, q, a}) => (
              <div
                key={id}
                className={`overflow-hidden rounded-2xl border transition-all ${openFaq === id ? "border-indigo-500/30 bg-zinc-900" : "border-white/8 bg-zinc-900/50"}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === id ? null : id)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className={`text-sm font-semibold transition-colors ${openFaq === id ? "text-white" : "text-zinc-300"}`}>{q}</span>
                  <ChevronDown className={`h-4 w-4 flex-shrink-0 text-zinc-500 transition-transform ${openFaq === id ? "rotate-180 text-indigo-400" : ""}`} />
                </button>
                {openFaq === id && (
                  <div className="px-6 pb-5">
                    <p className="text-sm leading-relaxed text-zinc-400">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section className="bg-zinc-950 px-4 py-20 sm:px-6">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-10 shadow-2xl sm:p-16">
          {/* Overlay mesh */}
          <div className="pointer-events-none absolute inset-0">
            <svg className="h-full w-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="ctogrid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ctogrid)" />
            </svg>
          </div>
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-900/30 blur-3xl" />

          <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div className="max-w-lg">
              <h2 className="text-2xl font-black leading-tight text-white sm:text-4xl">{t("landing.cta.title")}</h2>
              <p className="mt-3 text-sm leading-relaxed text-indigo-200 sm:text-base">{t("landing.cta.subtitle")}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:shrink-0">
              <a
                href="/register?role=LABOUR"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-indigo-700 shadow-xl transition-all hover:bg-indigo-50 hover:shadow-2xl active:scale-[0.97]"
              >
                {t("landing.cta.findWork")} <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/register?role=CONTRACTOR"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                {t("landing.cta.hireWorkers")} <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
