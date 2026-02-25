import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

async function upsertCompanyProfile(formData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "CONTRACTOR") redirect("/login");

  const companyName = formData.get("companyName")?.toString().trim();
  if (!companyName) return;

  await prisma.contractorProfile.upsert({
    where: { userId: session.user.id },
    update: { companyName },
    create: {
      userId: session.user.id,
      companyName,
    },
  });

  revalidatePath("/dashboard/contractor");
}

async function createJob(formData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "CONTRACTOR") redirect("/login");

  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const skillRequired = formData.get("skillRequired")?.toString().trim();
  const city = formData.get("city")?.toString().trim();
  const wageValue = formData.get("wage")?.toString().trim();

  if (!title || !description || !skillRequired || !city || !wageValue) return;

  const wage = Number.parseInt(wageValue, 10);
  if (Number.isNaN(wage) || wage <= 0) return;

  await prisma.job.create({
    data: {
      contractorId: session.user.id,
      title,
      description,
      skillRequired,
      city,
      wage,
    },
  });

  revalidatePath("/dashboard/contractor");
}

async function updateApplicationStatus(formData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "CONTRACTOR") redirect("/login");

  const applicationId = formData.get("applicationId")?.toString();
  const status = formData.get("status")?.toString();

  if (!applicationId || (status !== "ACCEPTED" && status !== "REJECTED")) return;

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: true },
  });

  if (!application || application.job.contractorId !== session.user.id) return;

  await prisma.application.update({
    where: { id: applicationId },
    data: { status },
  });

  revalidatePath("/dashboard/contractor");
}

async function closeJob(formData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "CONTRACTOR") redirect("/login");

  const jobId = formData.get("jobId")?.toString();
  if (!jobId) return;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job || job.contractorId !== session.user.id) return;

  await prisma.job.update({
    where: { id: jobId },
    data: { status: "CLOSED" },
  });

  revalidatePath("/dashboard/contractor");
}

export default async function ContractorDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "CONTRACTOR") redirect("/login");

  const profile = await prisma.contractorProfile.findUnique({
    where: { userId: session.user.id },
  });

  const jobs = await prisma.job.findMany({
    where: { contractorId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      applications: {
        include: {
          labour: true,
        },
      },
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Contractor Dashboard</h1>
        <p className="mt-1 text-slate-500">Welcome, {session.user.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Company profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={upsertCompanyProfile} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700" htmlFor="companyName">
                  Company / Contractor name
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  defaultValue={profile?.companyName ?? ""}
                  required
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Shakti Construction Co."
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                Save profile
              </button>
              {profile ? (
                <p className="text-xs text-slate-500">Profile last saved. You can update it anytime.</p>
              ) : (
                <p className="text-xs text-slate-500">Set this once so labourers know who is hiring.</p>
              )}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Post a new job</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createJob} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700" htmlFor="title">
                  Job title
                </label>
                <input
                  id="title"
                  name="title"
                  required
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Mason required for 5 days"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={3}
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Short description of work, timing, and payment details."
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700" htmlFor="skillRequired">
                    Skill required
                  </label>
                  <input
                    id="skillRequired"
                    name="skillRequired"
                    required
                    className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. Mason"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700" htmlFor="city">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    defaultValue={session.user.city ?? ""}
                    required
                    className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. Jaipur"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700" htmlFor="wage">
                    Daily wage (₹)
                  </label>
                  <input
                    id="wage"
                    name="wage"
                    type="number"
                    min={1}
                    required
                    className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. 800"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                Post job
              </button>
              <p className="text-xs text-slate-500">Jobs are created as OPEN. You can close them once work is done.</p>
            </form>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900">Your jobs & applicants</h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage applications and close jobs when hiring is complete.
        </p>

        {jobs.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No jobs posted yet. Create your first job above.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-base">{job.title}</CardTitle>
                    <p className="mt-1 text-xs text-slate-500">
                      {job.city} • {job.skillRequired} • ₹{job.wage}/day
                    </p>
                  </div>
                  <form action={closeJob}>
                    <input type="hidden" name="jobId" value={job.id} />
                    <button
                      type="submit"
                      disabled={job.status === "CLOSED"}
                      className="inline-flex items-center rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {job.status === "CLOSED" ? "Closed" : "Close job"}
                    </button>
                  </form>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">{job.description}</p>
                  <div className="mt-3">
                    <p className="text-xs font-medium text-slate-700">
                      Applicants ({job.applications.length})
                    </p>
                    {job.applications.length === 0 ? (
                      <p className="mt-1 text-xs text-slate-500">No applications yet.</p>
                    ) : (
                      <ul className="mt-2 space-y-2">
                        {job.applications.map((app) => (
                          <li
                            key={app.id}
                            className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-xs"
                          >
                            <div>
                              <p className="font-medium text-slate-900">
                                {app.labour.name} ({app.labour.city})
                              </p>
                              <p className="text-slate-500">
                                Status: {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                              </p>
                            </div>
                            {app.status === "PENDING" && job.status === "OPEN" && (
                              <div className="flex gap-2">
                                <form action={updateApplicationStatus}>
                                  <input type="hidden" name="applicationId" value={app.id} />
                                  <input type="hidden" name="status" value="ACCEPTED" />
                                  <button
                                    type="submit"
                                    className="inline-flex items-center rounded-md bg-emerald-600 px-2 py-1 text-xs font-medium text-white shadow-sm hover:bg-emerald-700"
                                  >
                                    Accept
                                  </button>
                                </form>
                                <form action={updateApplicationStatus}>
                                  <input type="hidden" name="applicationId" value={app.id} />
                                  <input type="hidden" name="status" value="REJECTED" />
                                  <button
                                    type="submit"
                                    className="inline-flex items-center rounded-md bg-rose-600 px-2 py-1 text-xs font-medium text-white shadow-sm hover:bg-rose-700"
                                  >
                                    Reject
                                  </button>
                                </form>
                              </div>
                            )}
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
      </div>
    </div>
  );
}