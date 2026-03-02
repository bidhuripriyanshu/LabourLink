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

/* ─── data ──────────────────────────────────────────────────────────── */

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
  { name: "Painter", icon: Paintbrush, color: "from-orange-500 to-amber-500", bg: "bg-orange-50" },
  { name: "Electrician", icon: Plug, color: "from-yellow-500 to-amber-600", bg: "bg-yellow-50" },
  { name: "Mason", icon: Hammer, color: "from-indigo-500 to-violet-500", bg: "bg-indigo-50" },
  { name: "Plumber", icon: Droplets, color: "from-sky-500 to-cyan-500", bg: "bg-sky-50" },
  { name: "Cleaner", icon: Sparkles, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50" },
];

const CITIES = [
  "Indore",
  "Ujjain"
  "Jaipur",
  "Ahmedabad",
  "Lucknow",
  "Bhopal",
];

const HOW_IT_WORKS = [
  {
    step: 1,
    icon: UserRoundCheck,
    title: "Create your profile",
    desc: "Add your skills, experience, and city once to build your digital work identity. It takes less than 2 minutes.",
  },
  {
    step: 2,
    icon: BriefcaseBusiness,
    title: "Post or find jobs",
    desc: "Contractors post local work with clear wage details. Labourers browse and apply in a few taps — no middlemen.",
  },
  {
    step: 3,
    icon: Workflow,
    title: "Connect & earn",
    desc: "Track applications, get accepted, and start working. Build your reputation with ratings and reviews.",
  },
];

const FEATURES = [
  {
    icon: Shield,
    title: "Verified & trusted",
    desc: "Admin-verified profiles and ratings ensure only genuine workers and contractors.",
  },
  {
    icon: MapPin,
    title: "Hyperlocal matching",
    desc: "Find work walking distance from you. City and skill-based search tuned for local hiring.",
  },
  {
    icon: Smartphone,
    title: "Works on any phone",
    desc: "Mobile-first UI designed for low-end smartphones with large buttons and simple navigation.",
  },
  {
    icon: Zap,
    title: "Zero commission",
    desc: "No middlemen, no cuts. Workers and contractors connect directly and keep 100% of earnings.",
  },
  {
    icon: Globe2,
    title: "Hindi & English ready",
    desc: "Built for India's workforce with bilingual support for wider accessibility.",
  },
  {
    icon: TrendingUp,
    title: "Grow your reputation",
    desc: "Earn ratings, build a track record, and get recommended to more contractors over time.",
  },
];

const FAQ = [
  {
    id: "q1",
    question: "Is registration free?",
    answer:
      "Yes. Creating a labour or contractor account is completely free. In the future, some advanced features may be paid, but basic features will always remain free.",
  },
  {
    id: "q2",
    question: "How do I contact a worker or contractor?",
    answer:
      "Once an application is accepted, contact details are shared inside the dashboard so you can call or message directly. No middlemen involved.",
  },
  {
    id: "q3",
    question: "Is there any middleman or commission?",
    answer:
      "No. LabourLink is designed to connect workers and contractors directly, without local middlemen taking a cut of your hard-earned money.",
  },
  {
    id: "q4",
    question: "Can I post multiple jobs?",
    answer:
      "Yes. Contractors can post multiple open jobs at the same time and manage applicants separately for each job from their dashboard.",
  },
];


export default function Home() {
  const { openItem, setOpenItem } = useAccordionState("q1");
  const [feedbacks, setFeedbacks] = useState(FALLBACK_TESTIMONIALS);
  const [avgRating, setAvgRating] = useState(4.8);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);

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
                No middlemen · No commission · 100% free
              </Badge>

              <h1 className="mt-6 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                Find Local Work in Minutes —{" "}
                <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                  No Middlemen.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-indigo-100 sm:text-base">
                LabourLink connects daily‑wage workers with trusted local
                contractors. Search by skill and city, apply in one tap, and
                start earning today.
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
                        Select skill…
                      </option>
                      {SKILLS.map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* City input */}
                  <div className="relative flex-1">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Enter your city…"
                      className="w-full rounded-xl bg-white py-3 pl-10 pr-4 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 sm:rounded-full"
                    />
                  </div>
                  {/* CTA */}
                  <Button
                    as="a"
                    href="/jobs"
                    size="lg"
                    className="gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:brightness-110 sm:rounded-full"
                  >
                    <Search className="h-4 w-4" />
                    Find Work Near Me
                  </Button>
                </div>
              </div>

       
              <div className="mt-10 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {[
                  { value: "50+", label: "Workers", icon: Users },
                  { value: "20+", label: "Contractors", icon: Building2 },
                  { value: "5+", label: "Cities", icon: MapPin },
                  { value: `${avgRating}/5`, label: "Avg Rating", icon: Star },
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
            {SKILLS.map((skill) => (
              <a
                key={skill.name}
                href={`/jobs?skill=${encodeURIComponent(skill.name)}`}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-5 shadow-lg shadow-slate-200/60 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${skill.bg} transition-transform group-hover:scale-110`}
                >
                  <skill.icon className="h-6 w-6 text-slate-700" />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  {skill.name}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* spacer */}
        <div className="h-16 sm:h-20" />

        
        <section className="mx-auto max-w-5xl px-4 sm:px-6">
          <Card className="space-y-5 border-0 px-5 py-7 shadow-lg shadow-slate-200/40 sm:px-8 sm:py-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                  {totalFeedbacks > 0
                    ? `Trusted by ${totalFeedbacks}+ users`
                    : "Trusted by 500+ workers and contractors"}
                </h2>
                <p className="text-sm text-slate-500">
                  Real stories from real people using LabourLink.
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
                  average satisfaction
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
              Simple 3-step process
            </Badge>
            <h2 className="mt-3 text-xl font-bold text-slate-900 sm:text-2xl">
              How LabourLink Works
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              From sign-up to your first job — in minutes, not days.
            </p>
          </div>

          <div className="relative grid gap-6 sm:grid-cols-3">
            {/* connecting line (desktop only) */}
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
                  Step {item.step}
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
              Why Choose LabourLink?
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Built for India&apos;s blue-collar workforce — simple, fast, and
              fair.
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
                Cities We Serve
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Growing fast across India — your city might already be here.
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
              Built for Everyone
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Three roles, one platform.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                title: "For Labour",
                gradient: "from-indigo-600 to-violet-600",
                items: [
                  "Create your digital work profile",
                  "See nearby jobs matched to your skill",
                  "Apply and track application status",
                  "Build reputation with ratings",
                ],
              },
              {
                title: "For Contractors",
                gradient: "from-emerald-600 to-teal-600",
                items: [
                  "Post work in minutes",
                  "Filter workers by skill and rating",
                  "Accept or reject applications easily",
                  "Review workers after project ends",
                ],
              },
              {
                title: "For Admin",
                gradient: "from-amber-600 to-orange-600",
                items: [
                  "Verify genuine profiles and jobs",
                  "Remove fake or abusive listings",
                  "Monitor platform health & analytics",
                  "Keep the marketplace safe and fair",
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
                    Why We Built LabourLink
                  </h2>
                  <p className="text-sm leading-relaxed text-slate-500">
                    Daily wage labourers often depend on middlemen or standing at
                    physical chowks to find work. Contractors waste time making
                    phone calls and still struggle to find verified, reliable
                    workers on short notice.
                  </p>
                  <p className="text-sm leading-relaxed text-slate-500">
                    LabourLink creates a lightweight, mobile-first hiring layer:
                    one place where labourers can build a digital identity and
                    contractors can post transparent, city-based jobs. Admins
                    keep the platform safe by verifying profiles and removing
                    fake listings.
                  </p>
                </div>
                <div className="space-y-3 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 px-5 py-5">
                  <p className="text-sm font-semibold text-slate-900">
                    Design principles
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Works smoothly on low-end smartphones",
                      "Large touch targets and simple language",
                      "Role-based dashboards, not a generic job site",
                      "Room to grow into OTP login, maps & more",
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
              Frequently Asked Questions
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
            {/* subtle glow */}
            <div className="pointer-events-none absolute right-0 top-0 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
            <div className="relative flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between w-full">
                <div className="space-y-3 sm:max-w-lg">
                  <h2 className="text-2xl font-bold text-white sm:text-3xl">
                    Ready to Start Earning Locally?
                  </h2>
                  <p className="text-sm leading-relaxed text-indigo-100 sm:text-base">
                    Create your profile in minutes and join a growing network of
                    local workers and contractors in your city. No fees, no
                    middlemen.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    as="a"
                    href="/register?role=LABOUR"
                    size="lg"
                    className="gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 px-6 text-slate-900 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:brightness-110"
                  >
                    Find work near me
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    as="a"
                    href="/register?role=CONTRACTOR"
                    size="lg"
                    variant="outline"
                    className="gap-2 rounded-xl border-white/30 bg-white/10 px-6 text-white backdrop-blur-sm hover:bg-white/20"
                  >
                    Hire local workers
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
