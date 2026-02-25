import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

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

  const roleFilter = searchParams?.role?.toString() || "ALL";
  const cityFilter = searchParams?.city?.toString() || "";

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
        orderBy: { createdAt: "desc" },
      })
      .catch(() => []),
    prisma.contractorProfile
      .findMany({
        include: { user: true },
        orderBy: { createdAt: "desc" },
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
      {/* filters, users list with Ban/Unban, jobs list with Remove, labour & contractor profiles with Verify/Unverify */}
    </div>
  );
}