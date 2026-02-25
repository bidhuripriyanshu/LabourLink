import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import AdminFilters from "./AdminFilters";

async function updateUserBan(formData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const userId = formData.get("userId")?.toString();
  const banned = formData.get("banned") === "true";
  if (!userId) return;

  await prisma.user.update({
    where: { id: userId },
    data: { banned },
  });

  revalidatePath("/admin");
}

async function toggleProfileVerified(formData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const profileId = formData.get("profileId")?.toString();
  const profileType = formData.get("profileType")?.toString();
  const verified = formData.get("verified") === "true";
  if (!profileId || (profileType !== "LABOUR" && profileType !== "CONTRACTOR")) return;

  if (profileType === "LABOUR") {
    await prisma.labourProfile.update({
      where: { id: profileId },
      data: { verified },
    });
  } else {
    await prisma.contractorProfile.update({
      where: { id: profileId },
      data: { verified },
    });
  }

  revalidatePath("/admin");
}

async function deleteJob(formData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const jobId = formData.get("jobId")?.toString();
  if (!jobId) return;

  await prisma.application.deleteMany({ where: { jobId } });
  await prisma.job.delete({ where: { id: jobId } });

  revalidatePath("/admin");
}

export default async function AdminPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const roleFilter = params?.role?.toString() || "ALL";
  const cityFilter = params?.city?.toString() || "";

  const whereUser = {
    ...(roleFilter !== "ALL" ? { role: roleFilter } : {}),
    ...(cityFilter ? { city: cityFilter } : {}),
  };

  const [users, labourProfiles, contractorProfiles, jobs] = await Promise.all([
    prisma.user.findMany({
      where: whereUser,
      orderBy: { createdAt: "desc" },
    }),
    prisma.labourProfile
      .findMany({
        include: { user: true },
        orderBy: { id: "desc" },
      })
      .catch(() => []),
    prisma.contractorProfile
      .findMany({
        include: { user: true },
        orderBy: { id: "desc" },
      })
      .catch(() => []),
    prisma.job.findMany({
      include: { contractor: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* ── Page Header ── */}
      <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-slate-500">Users</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-slate-500">Labour Profiles</p>
            <p className="text-2xl font-bold">{labourProfiles.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-slate-500">Contractor Profiles</p>
            <p className="text-2xl font-bold">{contractorProfiles.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-slate-500">Jobs</p>
            <p className="text-2xl font-bold">{jobs.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Filters ── */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminFilters roleFilter={roleFilter} cityFilter={cityFilter} />
        </CardContent>
      </Card>

      {/* ── Users Table ── */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-slate-500">
                <th className="pb-2 pr-4">Name</th>
                <th className="pb-2 pr-4">Phone</th>
                <th className="pb-2 pr-4">Role</th>
                <th className="pb-2 pr-4">City</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-medium">{u.name}</td>
                  <td className="py-2 pr-4">{u.phone}</td>
                  <td className="py-2 pr-4">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{u.role}</span>
                  </td>
                  <td className="py-2 pr-4">{u.city}</td>
                  <td className="py-2 pr-4">
                    {u.banned ? (
                      <span className="rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-xs font-medium">Banned</span>
                    ) : (
                      <span className="rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium">Active</span>
                    )}
                  </td>
                  <td className="py-2">
                    <form action={updateUserBan}>
                      <input type="hidden" name="userId" value={u.id} />
                      <input type="hidden" name="banned" value={u.banned ? "false" : "true"} />
                      <button
                        type="submit"
                        className={`rounded-lg px-3 py-1 text-xs font-medium text-white ${u.banned ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                          }`}
                      >
                        {u.banned ? "Unban" : "Ban"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={6} className="py-4 text-center text-slate-400">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ── Labour Profiles ── */}
      <Card>
        <CardHeader>
          <CardTitle>Labour Profiles ({labourProfiles.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-slate-500">
                <th className="pb-2 pr-4">Name</th>
                <th className="pb-2 pr-4">Skill</th>
                <th className="pb-2 pr-4">Experience</th>
                <th className="pb-2 pr-4">Rating</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {labourProfiles.map((lp) => (
                <tr key={lp.id} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-medium">{lp.user?.name ?? "—"}</td>
                  <td className="py-2 pr-4">{lp.skill}</td>
                  <td className="py-2 pr-4">{lp.experience} yrs</td>
                  <td className="py-2 pr-4">{lp.rating.toFixed(1)}</td>
                  <td className="py-2 pr-4">
                    {lp.verified ? (
                      <span className="rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium">Verified</span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 text-yellow-700 px-2 py-0.5 text-xs font-medium">Unverified</span>
                    )}
                  </td>
                  <td className="py-2">
                    <form action={toggleProfileVerified}>
                      <input type="hidden" name="profileId" value={lp.id} />
                      <input type="hidden" name="profileType" value="LABOUR" />
                      <input type="hidden" name="verified" value={lp.verified ? "false" : "true"} />
                      <button
                        type="submit"
                        className={`rounded-lg px-3 py-1 text-xs font-medium text-white ${lp.verified ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"
                          }`}
                      >
                        {lp.verified ? "Unverify" : "Verify"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {labourProfiles.length === 0 && (
                <tr><td colSpan={6} className="py-4 text-center text-slate-400">No labour profiles.</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ── Contractor Profiles ── */}
      <Card>
        <CardHeader>
          <CardTitle>Contractor Profiles ({contractorProfiles.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-slate-500">
                <th className="pb-2 pr-4">Name</th>
                <th className="pb-2 pr-4">Company</th>
                <th className="pb-2 pr-4">Rating</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {contractorProfiles.map((cp) => (
                <tr key={cp.id} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-medium">{cp.user?.name ?? "—"}</td>
                  <td className="py-2 pr-4">{cp.companyName}</td>
                  <td className="py-2 pr-4">{cp.rating.toFixed(1)}</td>
                  <td className="py-2 pr-4">
                    {cp.verified ? (
                      <span className="rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium">Verified</span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 text-yellow-700 px-2 py-0.5 text-xs font-medium">Unverified</span>
                    )}
                  </td>
                  <td className="py-2">
                    <form action={toggleProfileVerified}>
                      <input type="hidden" name="profileId" value={cp.id} />
                      <input type="hidden" name="profileType" value="CONTRACTOR" />
                      <input type="hidden" name="verified" value={cp.verified ? "false" : "true"} />
                      <button
                        type="submit"
                        className={`rounded-lg px-3 py-1 text-xs font-medium text-white ${cp.verified ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"
                          }`}
                      >
                        {cp.verified ? "Unverify" : "Verify"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {contractorProfiles.length === 0 && (
                <tr><td colSpan={5} className="py-4 text-center text-slate-400">No contractor profiles.</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ── Jobs ── */}
      <Card>
        <CardHeader>
          <CardTitle>Jobs ({jobs.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-slate-500">
                <th className="pb-2 pr-4">Title</th>
                <th className="pb-2 pr-4">Skill</th>
                <th className="pb-2 pr-4">City</th>
                <th className="pb-2 pr-4">Wage</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2 pr-4">Posted By</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-medium">{job.title}</td>
                  <td className="py-2 pr-4">{job.skillRequired}</td>
                  <td className="py-2 pr-4">{job.city}</td>
                  <td className="py-2 pr-4">₹{job.wage}</td>
                  <td className="py-2 pr-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${job.status === "OPEN"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                      }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="py-2 pr-4">{job.contractor?.name ?? "—"}</td>
                  <td className="py-2">
                    <form action={deleteJob}>
                      <input type="hidden" name="jobId" value={job.id} />
                      <button
                        type="submit"
                        className="rounded-lg bg-red-600 hover:bg-red-700 px-3 py-1 text-xs font-medium text-white"
                      >
                        Remove
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr><td colSpan={7} className="py-4 text-center text-slate-400">No jobs found.</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}