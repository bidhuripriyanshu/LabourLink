import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";


async function upsertLabourProfile(formData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "LABOUR") redirect("/login");

  const skill = formData.get("skill")?.toString().trim();
  const experienceStr = formData.get("experience")?.toString().trim();
  const city = formData.get("city")?.toString().trim();

  if (!skill || !experienceStr || !city) return;

  const experience = Number.parseInt(experienceStr, 10);
  if (Number.isNaN(experience) || experience < 0) return;

  await prisma.labourProfile.upsert({
    where: { userId: session.user.id },
    update: { skill, experience },
    create: {
      userId: session.user.id,
      skill,
      experience,
    },
  });

  if (city && city !== session.user.city) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { city },
    });
  }

  revalidatePath("/dashboard/labour");
}

export default async function LabourDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "LABOUR") redirect("/login");

  const [profile, applications] = await Promise.all([
    prisma.labourProfile.findUnique({
      where: { userId: session.user.id },
    }),
    prisma.application.findMany({
      where: { labourId: session.user.id },
      orderBy: { id: "desc" },
      include: {
        job: {
          include: {
            contractor: true,
          },
        },
      },
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Labour Dashboard</h1>
        <p className="mt-1 text-slate-500">Welcome, {session.user.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={upsertLabourProfile} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700" htmlFor="skill">
                  Primary skill
                </label>
                <input
                  id="skill"
                  name="skill"
                  defaultValue={profile?.skill ?? ""}
                  required
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Mason, Painter, Electrician"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700" htmlFor="experience">
                  Experience (years)
                </label>
                <input
                  id="experience"
                  name="experience"
                  type="number"
                  min={0}
                  defaultValue={profile?.experience ?? 0}
                  required
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                Save profile
              </button>
              {profile ? (
                <p className="text-xs text-slate-500">Profile saved. This helps contractors find you.</p>
              ) : (
                <p className="text-xs text-slate-500">
                  Fill this once so you can be matched with the right jobs.
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Browse jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Find work in your city that matches your skill.
            </p>
            <a
              href="/jobs"
              className="mt-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Open jobs list
            </a>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900">Your applications</h2>
        <p className="mt-1 text-sm text-slate-500">
          Track which jobs are pending, accepted, or rejected. Contractor contact is shown when
          accepted.
        </p>

        {applications.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            You have not applied to any jobs yet. Browse jobs to get started.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {applications.map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <CardTitle className="text-base">{app.job.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    {app.job.city} • {app.job.skillRequired} • ₹{app.job.wage}/day
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Status: {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                  </p>
                  {app.status === "ACCEPTED" && (
                    <p className="mt-2 text-xs text-slate-700">
                      Contractor contact: {app.job.contractor.name} ({app.job.contractor.phone}) —{" "}
                      {app.job.contractor.city}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}