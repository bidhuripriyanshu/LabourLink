import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

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

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Find local jobs</h1>
        <p className="mt-1 text-slate-500">
          Browse open jobs in your city and apply directly to contractors.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 md:grid-cols-4" method="GET">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700" htmlFor="city">
                City
              </label>
              <input
                id="city"
                name="city"
                defaultValue={city}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. Jaipur"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700" htmlFor="skill">
                Skill
              </label>
              <input
                id="skill"
                name="skill"
                defaultValue={skill}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. Mason"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700" htmlFor="minWage">
                Min wage (₹)
              </label>
              <input
                id="minWage"
                name="minWage"
                type="number"
                min={0}
                defaultValue={minWageStr}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700" htmlFor="maxWage">
                Max wage (₹)
              </label>
              <input
                id="maxWage"
                name="maxWage"
                type="number"
                min={0}
                defaultValue={maxWageStr}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1 md:col-span-4">
              <label className="block text-sm font-medium text-slate-700" htmlFor="title">
                Search by title
              </label>
              <input
                id="title"
                name="title"
                defaultValue={title}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. Painter for 3 days"
              />
            </div>
            <div className="md:col-span-4">
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                Apply filters
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {jobs.length === 0 ? (
          <p className="text-sm text-slate-500">No jobs match your filters.</p>
        ) : (
          jobs.map((job) => {
            const alreadyApplied = job.applications.length > 0;
            return (
              <Card key={job.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-base">{job.title}</CardTitle>
                    <p className="mt-1 text-xs text-slate-500">
                      {job.city} • {job.skillRequired} • ₹{job.wage}/day
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Contractor: {job.contractor.name} ({job.contractor.city})
                    </p>
                  </div>
                  <div className="text-xs text-slate-500">Status: {job.status}</div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">{job.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                      You can apply once per job. Contractor sees your details on acceptance.
                    </p>
                    <form action={applyToJob}>
                      <input type="hidden" name="jobId" value={job.id} />
                      <button
                        type="submit"
                        disabled={alreadyApplied}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        {alreadyApplied ? "Already applied" : "Apply"}
                      </button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="space-x-2">
          {page > 1 && (
            <a
              href={`?${new URLSearchParams({
                ...Object.fromEntries(
                  Object.entries({
                    city,
                    skill,
                    title,
                    minWage: minWageStr,
                    maxWage: maxWageStr,
                  }).filter(([, v]) => v),
                ),
                page: String(page - 1),
              }).toString()}`}
              className="rounded-md border border-slate-200 px-2 py-1 hover:bg-slate-50"
            >
              Previous
            </a>
          )}
          {page < totalPages && (
            <a
              href={`?${new URLSearchParams({
                ...Object.fromEntries(
                  Object.entries({
                    city,
                    skill,
                    title,
                    minWage: minWageStr,
                    maxWage: maxWageStr,
                  }).filter(([, v]) => v),
                ),
                page: String(page + 1),
              }).toString()}`}
              className="rounded-md border border-slate-200 px-2 py-1 hover:bg-slate-50"
            >
              Next
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
