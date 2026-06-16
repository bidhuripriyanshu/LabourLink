"use client";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Avatar } from "../../components/ui/avatar";
import {
  Accordion,
  AccordionItem,
  useAccordionState,
} from "../../components/ui/accordion";

import {
  CheckCircle2,
  Star,
  UserRoundCheck,
  BriefcaseBusiness,
  Workflow,
  Check,
  ChevronDown,
  ChevronRight,
  Search,
  MapPin,
  Wrench,
  Users,
  Building2,
  TrendingUp,
  Shield,
  Smartphone,
  Globe2,
  Zap,
  Paintbrush,
  Plug,
  Hammer,
  Droplets,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { useT } from "../../lib/i18n/LanguageContext";


const FALLBACK_TESTIMONIALS = [
  {
    id: "f1",
    name: "Rakesh Kumar",
    role: "Mason",
    city: "Jaipur",
    rating: 5,
    message:
      "Earlier I waited at the chowk every morning hoping for work. Now contractors post jobs and I apply from my phone. I got 3 regular clients in the first month itself.",
  },
  {
    id: "f2",
    name: "Priya Sharma",
    role: "Site Supervisor",
    city: "Delhi",
    rating: 5,
    message:
      "I can see skills, experience, and ratings before calling anyone. It saves me hours every week and the quality of workers I find is much better than before.",
  },
  {
    id: "f3",
    name: "Ahmed Khan",
    role: "Plumber",
    city: "Mumbai",
    rating: 4,
    message:
      "Because of repeat contractors on the app, my work is more regular and better paid. My family is happier now that I have steady income throughout the month.",
  },
];

const SKILLS = [
  { nameKey: "landing.skill.painter", icon: Paintbrush, color: "from-orange-500 to-amber-500", bg: "bg-orange-50" },
  { nameKey: "landing.skill.electrician", icon: Plug, color: "from-yellow-500 to-amber-600", bg: "bg-yellow-50" },
  { nameKey: "landing.skill.mason", icon: Hammer, color: "from-indigo-500 to-violet-500", bg: "bg-indigo-50" },
  { nameKey: "landing.skill.plumber", icon: Droplets, color: "from-sky-500 to-cyan-500", bg: "bg-sky-50" },
  { nameKey: "landing.skill.cleaner", icon: Sparkles, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50" },
];

const SKILL_VALUES = ["Painter", "Electrician", "Mason", "Plumber", "Cleaner"];

const CITIES = [
  "Indore",
  "Ujjain",
  "Jaipur",
  "Ahmedabad",
  "Bhopal",
];


export default function Home() {
  const { openItem, setOpenItem } = useAccordionState("q1");
  const [feedbacks, setFeedbacks] = useState(FALLBACK_TESTIMONIALS);
  const [avgRating, setAvgRating] = useState(4.8);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const t = useT();

  const HOW_IT_WORKS = [
    {
      step: 1,
      icon: UserRoundCheck,
      title: t("landing.howItWorks.step1.title"),
      desc: t("landing.howItWorks.step1.desc"),
    },
    {
      step: 2,
      icon: BriefcaseBusiness,
      title: t("landing.howItWorks.step2.title"),
      desc: t("landing.howItWorks.step2.desc"),
    },
    {
      step: 3,
      icon: Workflow,
      title: t("landing.howItWorks.step3.title"),
      desc: t("landing.howItWorks.step3.desc"),
    },
  ];

  const FEATURES = [
    { icon: Shield, title: t("landing.features.verified.title"), desc: t("landing.features.verified.desc") },
    { icon: MapPin, title: t("landing.features.hyperlocal.title"), desc: t("landing.features.hyperlocal.desc") },
    { icon: Smartphone, title: t("landing.features.mobile.title"), desc: t("landing.features.mobile.desc") },
    { icon: Zap, title: t("landing.features.zero.title"), desc: t("landing.features.zero.desc") },
    { icon: Globe2, title: t("landing.features.language.title"), desc: t("landing.features.language.desc") },
    { icon: TrendingUp, title: t("landing.features.reputation.title"), desc: t("landing.features.reputation.desc") },
  ];

  const FAQ = [
    { id: "q1", question: t("landing.faq.q1"), answer: t("landing.faq.a1") },
    { id: "q2", question: t("landing.faq.q2"), answer: t("landing.faq.a2") },
    { id: "q3", question: t("landing.faq.q3"), answer: t("landing.faq.a3") },
    { id: "q4", question: t("landing.faq.q4"), answer: t("landing.faq.a4") },
  ];

  useEffect(() => {
    fetch("/api/feedback")
      .then((r) => r.json())
      .then((data) => {
        if (data.feedbacks?.length > 0) {
          setFeedbacks(data.feedbacks);
          setAvgRating(Number(data.average?.toFixed(1)) || 4.8);
          setTotalFeedbacks(data.total || 0);
        }
      })
      .catch(() => { });
  }, []);

  const filledStars = Math.round(avgRating);

  return (
    <div className="bg-white">
      <main className="overflow-hidden">
      
        <section className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 pb-20 pt-12 sm:pb-28 sm:pt-16">
         
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          
          <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
            <div className="flex flex-col items-center text-center">
              <Badge className="border-white/20 bg-white/10 text-white backdrop-blur-sm">
                <Sparkles className="mr-1.5 h-3 w-3" />
                {t("landing.badge")}
              </Badge>

              <h1 className="mt-6 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                {t("landing.title")}
                <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                  {t("landing.titleHighlight")}
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-indigo-100 sm:text-base">
                {t("landing.subtitle")}
              </p>

             
              <div className="mt-8 w-full max-w-2xl">
                <div className="flex flex-col gap-2 rounded-2xl bg-white/10 p-2 backdrop-blur-md sm:flex-row sm:items-center sm:rounded-full sm:p-1.5">
              
                  <div className="relative flex-1">
                    <Wrench className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <select
                      className="w-full appearance-none rounded-xl bg-white py-3 pl-10 pr-4 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 sm:rounded-full"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        {t("landing.selectSkill")}
                      </option>
                      {SKILLS.map((s, i) => (
                        <option key={SKILL_VALUES[i]} value={SKILL_VALUES[i]}>
                          {t(s.nameKey)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* City input */}
                  <div className="relative flex-1">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder={t("landing.enterCity")}
                      className="w-full rounded-xl bg-white py-3 pl-10 pr-4 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 sm:rounded-full"
                    />
                  </div>
                 
                  <Button
                    as="a"
                    href="/jobs"
                    size="lg"
                    className="gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:brightness-110 sm:rounded-full"
                  >
                    <Search className="h-4 w-4" />
                    {t("landing.findWork")}
                  </Button>
                </div>
              </div>

       
              <div className="mt-10 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {[
                  { value: "30+", label: t("landing.workers"), icon: Users },
                  { value: "10+", label: t("landing.contractors"), icon: Building2 },
                  { value: "5+", label: t("landing.cities"), icon: MapPin },
                  { value: `${avgRating}/5`, label: t("landing.avgRating"), icon: Star },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center rounded-2xl bg-white/10 px-3 py-4 backdrop-blur-sm transition hover:bg-white/15"
                  >
                    <stat.icon className="h-5 w-5 text-amber-300" />
                    <p className="mt-1.5 text-xl font-bold text-white sm:text-2xl">
                      {stat.value}
                    </p>
                    <p className="text-[11px] font-medium text-indigo-200 sm:text-xs">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 -mt-10 mx-auto max-w-5xl px-4 sm:-mt-12 sm:px-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
            {SKILLS.map((skill, i) => (
              <a
                key={SKILL_VALUES[i]}
                href={`/jobs?skill=${encodeURIComponent(SKILL_VALUES[i])}`}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-5 shadow-lg shadow-slate-200/60 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${skill.bg} transition-transform group-hover:scale-110`}
                >
                  <skill.icon className="h-6 w-6 text-slate-700" />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  {t(skill.nameKey)}
                </span>
              </a>
            ))}
          </div>
        </section>

      
        <div className="h-16 sm:h-20" />

        
        <section className="mx-auto max-w-5xl px-4 sm:px-6">
          <Card className="space-y-5 border-0 px-5 py-7 shadow-lg shadow-slate-200/40 sm:px-8 sm:py-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                  {totalFeedbacks > 0
                    ? t("landing.testimonials.trustedBy", { count: totalFeedbacks })
                    : t("landing.testimonials.trustedByFallback")}
                </h2>
                <p className="text-sm text-slate-500">
                  {t("landing.testimonials.subtitle")}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i <= filledStars
                        ? "fill-amber-400"
                        : "fill-amber-200"
                        }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-slate-800">
                  {avgRating}/5
                </span>
                <span className="text-xs text-slate-400">
                  {t("landing.testimonials.avgSatisfaction")}
                </span>
              </div>
            </div>
            <Separator className="bg-zinc-100" />
            <div className="grid gap-5 sm:grid-cols-3">
              {feedbacks.map((fb) => {
                const initials = fb.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <Card
                    key={fb.id}
                    className="border-0 bg-slate-50/80 px-5 py-5 shadow-none transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-11 w-11 text-sm">
                        {initials}
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {fb.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {fb.role}
                          {fb.city ? ` · ${fb.city}` : ""}
                        </p>
                        <div className="mt-0.5 flex gap-0.5 text-amber-400">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i <= fb.rating ? "fill-amber-400" : "fill-amber-200"
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      &ldquo;{fb.message}&rdquo;
                    </p>
                  </Card>
                );
              })}
            </div>
          </Card>
        </section>

        <div className="h-16 sm:h-20" />

        
        <section
          id="how-it-works"
          className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6"
        >
          <div className="text-center">
            <Badge variant="secondary" className="mx-auto">
              {t("landing.howItWorks.badge")}
            </Badge>
            <h2 className="mt-3 text-xl font-bold text-slate-900 sm:text-2xl">
              {t("landing.howItWorks.title")}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {t("landing.howItWorks.subtitle")}
            </p>
          </div>

          <div className="relative grid gap-6 sm:grid-cols-3">
            <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-[52px] hidden h-0.5 bg-gradient-to-r from-indigo-200 via-violet-200 to-indigo-200 sm:block" />

            {HOW_IT_WORKS.map((item) => (
              <Card
                key={item.step}
                className="relative z-10 border-0 px-5 py-6 text-center shadow-lg shadow-slate-200/40 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20">
                  <item.icon className="h-6 w-6" />
                </div>
                <Badge className="mx-auto mt-3 text-[10px]">
                  {t("landing.howItWorks.step")} {item.step}
                </Badge>
                <h3 className="mt-3 text-base font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                  {item.desc}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <div className="h-16 sm:h-20" />

        <section className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {t("landing.features.title")}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {t("landing.features.subtitle")}
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Card
                key={f.title}
                className="group border-0 px-5 py-5 shadow-md shadow-slate-200/40 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                  {f.desc}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <div className="h-16 sm:h-20" />

      
        <section className="bg-slate-50/80 py-12 sm:py-16">
          <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                {t("landing.cities.title")}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {t("landing.cities.subtitle")}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {CITIES.map((city) => (
                <a
                  key={city}
                  href={`/jobs?city=${encodeURIComponent(city)}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md"
                >
                  <MapPin className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-indigo-500" />
                  {city}
                </a>
              ))}
            </div>
          </div>
        </section>

      
        <section className="mx-auto max-w-5xl space-y-6 px-4 py-16 sm:px-6 sm:py-20">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {t("landing.roles.title")}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {t("landing.roles.subtitle")}
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                title: t("landing.roles.labour.title"),
                gradient: "from-indigo-600 to-violet-600",
                items: [
                  t("landing.roles.labour.item1"),
                  t("landing.roles.labour.item2"),
                  t("landing.roles.labour.item3"),
                  t("landing.roles.labour.item4"),
                ],
              },
              {
                title: t("landing.roles.contractor.title"),
                gradient: "from-emerald-600 to-teal-600",
                items: [
                  t("landing.roles.contractor.item1"),
                  t("landing.roles.contractor.item2"),
                  t("landing.roles.contractor.item3"),
                  t("landing.roles.contractor.item4"),
                ],
              },
              {
                title: t("landing.roles.admin.title"),
                gradient: "from-amber-600 to-orange-600",
                items: [
                  t("landing.roles.admin.item1"),
                  t("landing.roles.admin.item2"),
                  t("landing.roles.admin.item3"),
                  t("landing.roles.admin.item4"),
                ],
              },
            ].map((role) => (
              <Card
                key={role.title}
                className="group overflow-hidden border-0 shadow-lg shadow-slate-200/40 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`bg-gradient-to-r ${role.gradient} px-5 py-4`}
                >
                  <h3 className="text-base font-bold text-white">
                    {role.title}
                  </h3>
                </div>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {role.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

       
        <section
          id="about"
          className="bg-slate-50/80 py-12 sm:py-16"
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <Card className="border-0 p-6 shadow-lg shadow-slate-200/40 sm:p-8">
              <div className="grid gap-6 sm:grid-cols-[2fr,1.4fr] sm:items-start">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-slate-900">
                    {t("landing.about.title")}
                  </h2>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {t("landing.about.p1")}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {t("landing.about.p2")}
                  </p>
                </div>
                <div className="space-y-3 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 px-5 py-5">
                  <p className="text-sm font-semibold text-slate-900">
                    {t("landing.about.principles")}
                  </p>
                  <ul className="space-y-2">
                    {[
                      t("landing.about.principle1"),
                      t("landing.about.principle2"),
                      t("landing.about.principle3"),
                      t("landing.about.principle4"),
                    ].map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-500" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </section>

       
        <section className="mx-auto max-w-5xl space-y-6 px-4 py-16 sm:px-6 sm:py-20">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {t("landing.faq.title")}
            </h2>
          </div>
          <Card className="border-0 px-5 py-2 shadow-lg shadow-slate-200/40 sm:px-8">
            <Accordion className="overflow-hidden">
              {FAQ.map(({ id, question, answer }) => (
                <AccordionItem
                  key={id}
                  value={id}
                  openItem={openItem}
                  setOpenItem={setOpenItem}
                >
                  {({ isOpen, toggle }) => (
                    <div>
                      <button
                        type="button"
                        onClick={toggle}
                        className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold text-slate-800 sm:py-5"
                      >
                        <span>{question}</span>
                        <ChevronDown
                          className={
                            "h-4 w-4 flex-shrink-0 text-slate-400 transition-transform " +
                            (isOpen ? "rotate-180" : "")
                          }
                        />
                      </button>
                      {isOpen && (
                        <p className="pb-4 text-sm leading-relaxed text-slate-500 sm:pb-5">
                          {answer}
                        </p>
                      )}
                    </div>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </section>

        
        <section className="px-4 pb-16 sm:px-6 sm:pb-20">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 py-10 shadow-2xl shadow-indigo-500/20 sm:px-12 sm:py-14">
         
            <div className="pointer-events-none absolute right-0 top-0 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
            <div className="relative flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between w-full">
                <div className="space-y-3 sm:max-w-lg">
                  <h2 className="text-2xl font-bold text-white sm:text-3xl">
                    {t("landing.cta.title")}
                  </h2>
                  <p className="text-sm leading-relaxed text-indigo-100 sm:text-base">
                    {t("landing.cta.subtitle")}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    as="a"
                    href="/register?role=LABOUR"
                    size="lg"
                    className="gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 px-6 text-slate-900 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:brightness-110"
                  >
                    {t("landing.cta.findWork")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    as="a"
                    href="/register?role=CONTRACTOR"
                    size="lg"
                    variant="outline"
                    className="gap-2 rounded-xl border-white/30 bg-white/10 px-6 text-white backdrop-blur-sm hover:bg-white/20"
                  >
                    {t("landing.cta.hireWorkers")}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
