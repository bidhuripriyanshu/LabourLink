"use client";
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
} from "lucide-react";

export default function Home() {
  const { openItem, setOpenItem } = useAccordionState("q1");
  return (
    <div className="bg-white">
      <main className="mx-auto flex min-h-[calc(100vh-120px)] max-w-5xl flex-col gap-12 px-4 py-10 sm:py-14 sm:px-6">
        {/* Hero section */}
        <Card className="flex flex-col gap-6 px-5 py-8 sm:px-8 sm:py-10">
          <Badge variant="secondary">
            Daily wage workers • Local contractors • No middlemen
          </Badge>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 space-y-4">
              <h1 className="text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl">
              LabourLink – fast, trusted hiring for local work.
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
                Labourers struggle to find consistent work. Contractors struggle
                to quickly find reliable people. Local Labour Connect creates a
                simple, mobile‑first marketplace for nearby jobs with ratings,
                verification, and role-based dashboards.
              </p>
              <Separator className="my-1 w-20 bg-sky-200" />
              <div className="flex flex-col gap-3 text-sm sm:flex-row">
                <Button as="a" href="/register?role=LABOUR" size="lg" variant="default">
                  Find local work
                </Button>
                <Button
                  as="a"
                  href="/register?role=CONTRACTOR"
                  variant="outline"
                  size="lg"
                >
                  Hire nearby labour
                </Button>
              </div>
            </div>
            <Card className="mt-4 w-full max-w-xs bg-slate-50 text-xs text-slate-900 sm:mt-0">
              <CardHeader className="border-0 pb-2">
                <CardTitle className="text-sm text-slate-900">
                  Built for the real world
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-4 py-3">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-[2px] h-4 w-4 text-indigo-600" />
                    <span>Mobile‑first interface with large, thumb-friendly buttons.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-[2px] h-4 w-4 text-indigo-600" />
                    <span>Hindi / English‑friendly copy for wider reach.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-[2px] h-4 w-4 text-indigo-600" />
                    <span>Role‑based dashboards for labour, contractors and admin.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-[2px] h-4 w-4 text-indigo-600" />
                    <span>City & skill‑based job search tuned for local hiring.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </Card>

        {/* Trust section */}
        <Card className="space-y-4 px-5 py-6 sm:px-8 sm:py-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                Trusted by 500+ workers and local contractors
              </h2>
              <p className="text-xs text-slate-500 sm:text-[13px]">
                Feedback from early pilots in real neighbourhoods.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 sm:text-sm">
              <div className="flex items-center gap-0.5 text-amber-500">
                <Star className="h-4 w-4 fill-amber-400" />
                <Star className="h-4 w-4 fill-amber-400" />
                <Star className="h-4 w-4 fill-amber-400" />
                <Star className="h-4 w-4 fill-amber-400" />
                <Star className="h-4 w-4 fill-amber-200" />
              </div>
              <span className="font-medium text-slate-800">4.8/5</span>
              <span className="text-[11px] text-slate-500">
                average satisfaction
              </span>
            </div>
          </div>
          <Separator className="bg-zinc-100" />
          <div className="grid gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-3">
            <Card className="border-0 bg-white px-4 py-4 shadow-none">
              <div className="flex items-center gap-3">
                <Avatar>RS</Avatar>
                <div className="text-xs">
                  <p className="font-semibold text-slate-900">
                    Rakesh, Mason (Labour)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Found daily work in my own area.
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                "Earlier I waited at chowk every morning. Now contractors post
                work and I apply from my phone itself."
              </p>
            </Card>
            <Card className="border-0 bg-white px-4 py-4 shadow-none">
              <div className="flex items-center gap-3">
                <Avatar>PK</Avatar>
                <div className="text-xs">
                  <p className="font-semibold text-slate-900">
                    Priya, Site Supervisor
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Easier to find reliable teams.
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                "I can see skills and experience before calling. It saves me
                hours every week."
              </p>
            </Card>
            <Card className="border-0 bg-white px-4 py-4 shadow-none">
              <div className="flex items-center gap-3">
                <Avatar>AS</Avatar>
                <div className="text-xs">
                  <p className="font-semibold text-slate-900">Ahmed, Plumber</p>
                  <p className="text-[11px] text-slate-500">
                    More consistent monthly income.
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                "Because of repeat contractors on the app, my work is more
                regular and better paid."
              </p>
            </Card>
          </div>
        </Card>

        {/* How it works (detailed) */}
        <section id="how-it-works" className="space-y-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
              How LabourLink works
            </h2>
            <p className="text-xs text-slate-500 sm:text-sm">
              Simple 3-step flow for labourers and contractors.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <Card className="transition-all hover:-translate-y-0.5 hover:shadow-lg">
              <CardHeader className="border-0 pb-1">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-700">
                    <UserRoundCheck className="h-4 w-4" />
                  </div>
                  <Badge className="text-[10px] sm:text-[11px]">Step 1</Badge>
                </div>
                <CardTitle className="text-sm sm:text-base">
                  Create your profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-1">
                <p className="text-sm text-slate-500">
                  Add your skills, experience and city once to build your
                  digital work identity.
                </p>
              </CardContent>
            </Card>
            <Card className="transition-all hover:-translate-y-0.5 hover:shadow-lg">
              <CardHeader className="border-0 pb-1">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-700">
                    <BriefcaseBusiness className="h-4 w-4" />
                  </div>
                  <Badge className="text-[10px] sm:text-[11px]">Step 2</Badge>
                </div>
                <CardTitle className="text-sm sm:text-base">
                  Post or find jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-1">
                <p className="text-sm text-slate-500">
                  Contractors post local work; labourers browse and apply in a
                  few taps.
                </p>
              </CardContent>
            </Card>
            <Card className="transition-all hover:-translate-y-0.5 hover:shadow-lg">
              <CardHeader className="border-0 pb-1">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-700">
                    <Workflow className="h-4 w-4" />
                  </div>
                  <Badge className="text-[10px] sm:text-[11px]">Step 3</Badge>
                </div>
                <CardTitle className="text-sm sm:text-base">
                  Connect & track
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-1">
                <p className="text-sm text-slate-500">
                  Track applications and responses in simple, role-based
                  dashboards.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Feature grid */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            Why choose LabourLink?
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              "Role-based dashboards for labour, contractors and admin.",
              "City-based search tailored for local hiring.",
              "Ratings & verification to build long-term trust.",
              "Mobile friendly design for low-end smartphones.",
              "Hindi & English support for better accessibility.",
              "Built for expansion into maps, OTP, and more.",
            ].map((text) => (
              <Card
                key={text}
                className="flex items-start gap-3 border-slate-200 bg-white px-4 py-4 text-sm text-slate-600 shadow-sm"
              >
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-sky-50 text-sky-700">
                  <Check className="h-4 w-4" />
                </div>
                <p>{text}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Roles section */}
        <section className="grid gap-5 sm:grid-cols-3">
          <Card className="space-y-2 px-5 py-5">
            <CardTitle>For Labour</CardTitle>
            <ul className="text-sm text-slate-500">
              <li>• Create your digital work profile.</li>
              <li>• See nearby jobs in your city.</li>
              <li>• Apply and track application status.</li>
            </ul>
          </Card>
          <Card className="space-y-2 px-5 py-5">
            <CardTitle>For Contractors</CardTitle>
            <ul className="text-sm text-slate-500">
              <li>• Post work in minutes.</li>
              <li>• Filter workers by skill and rating.</li>
              <li>• Accept or reject applications easily.</li>
            </ul>
          </Card>
          <Card className="space-y-2 px-5 py-5">
            <CardTitle>For Admin</CardTitle>
            <ul className="text-sm text-slate-500">
              <li>• Verify genuine profiles and jobs.</li>
              <li>• Remove fake or abusive listings.</li>
              <li>• Keep the marketplace safe and fair.</li>
            </ul>
          </Card>
        </section>

        {/* About section */}
        <section id="about" className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            Why we built LabourLink
          </h2>
          <Card className="px-5 py-5 sm:px-6 sm:py-6">
            <div className="grid gap-6 sm:grid-cols-[2fr,1.4fr] sm:items-start">
              <div className="space-y-3">
                <p className="text-sm leading-relaxed text-slate-500">
                  Daily wage labourers often depend on middlemen or standing at
                  physical chowks to find work. Contractors waste time making
                  phone calls and still struggle to find verified, reliable
                  workers on short notice.
                </p>
                <p className="text-sm leading-relaxed text-slate-500">
                  Local Labour Connect creates a lightweight, mobile-first
                  hiring layer: one place where labourers can build a digital
                  identity and contractors can post transparent, city-based
                  jobs. Admins keep the platform safe by verifying profiles and
                  removing fake listings.
          </p>
        </div>
              <div className="space-y-3 rounded-xl bg-slate-50 px-4 py-4 text-xs text-slate-900">
                <p className="font-semibold text-slate-900">
                  Design principles:
                </p>
                <ul className="space-y-1">
                  <li>• Works smoothly on low-end smartphones.</li>
                  <li>• Large touch targets and simple language.</li>
                  <li>• Role-based dashboards, not a generic job site.</li>
                  <li>• Room to grow into ratings, OTP login & maps.</li>
                </ul>
              </div>
        </div>
          </Card>
        </section>

        {/* FAQ section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            Frequently asked questions
          </h2>
          <Accordion className="overflow-hidden">
            {[
              {
                id: "q1",
                question: "Is registration free?",
                answer:
                  "Yes. Creating a labour or contractor account is free in the MVP. In future, some advanced features may be paid.",
              },
              {
                id: "q2",
                question: "How do I contact a worker or contractor?",
                answer:
                  "Once an application is accepted, contact details are shared inside the dashboard so you can call or message directly.",
              },
              {
                id: "q3",
                question: "Is there any middleman or commission?",
                answer:
                  "No. Local Labour Connect is designed to connect workers and contractors directly, without local middlemen taking a cut.",
              },
              {
                id: "q4",
                question: "Can I post multiple jobs?",
                answer:
                  "Yes. Contractors can post multiple open jobs at the same time and manage applicants separately for each job.",
              },
            ].map(({ id, question, answer }) => (
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
                      className="flex w-full items-center justify-between py-3 text-left text-sm font-medium text-slate-800 sm:py-4"
                    >
                      <span>{question}</span>
                      <ChevronDown
                        className={
                          "h-4 w-4 text-slate-400 transition-transform " +
                          (isOpen ? "rotate-180" : "")
                        }
                      />
                    </button>
                    {isOpen && (
                      <p className="pb-3 text-sm leading-relaxed text-slate-500 sm:pb-4">
                        {answer}
                      </p>
                    )}
                  </div>
                )}
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* CTA section */}
        <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-7 text-white shadow-md sm:px-8 sm:py-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold sm:text-2xl">
                Start hiring or working today.
              </h2>
              <p className="max-w-md text-sm text-slate-100 sm:text-[15px]">
                Create your profile in minutes and join a growing network of
                local workers and contractors in your city.
              </p>
            </div>
            <div className="flex flex-col gap-3 text-sm sm:flex-row">
              <Button
                as="a"
                href="/register"
                size="lg"
                variant="default"
                className="bg-orange-300 text-indigo-700 hover:bg-slate-50"
              >
                Create worker profile
              </Button>
              <Button
                as="a"
                href="/register?role=CONTRACTOR"
                size="lg"
                variant="outline"
                className="border-slate-200 bg-indigo-600/10 text-black hover:bg-indigo-600/20"
              >
                Post a job
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
