import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma";
import { recomputeAverageRatingForUser } from "../../../lib/reviews";
import LabourDashboardClient from "./LabourDashboardClient";


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

async function reviewContractor(formData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "LABOUR") redirect("/login");

  const jobId = formData.get("jobId")?.toString();
  const revieweeId = formData.get("revieweeId")?.toString();
  const ratingStr = formData.get("rating")?.toString();
  const comment = formData.get("comment")?.toString().trim() || null;

  const rating = Number.parseInt(ratingStr ?? "", 10);
  if (!jobId || !revieweeId || Number.isNaN(rating) || rating < 1 || rating > 5) return;

  const app = await prisma.application.findFirst({
    where: {
      jobId,
      labourId: session.user.id,
      status: "ACCEPTED",
      job: { contractorId: revieweeId, status: "CLOSED" },
    },
    include: { job: true },
  });
  if (!app) return;

  await prisma.review.upsert({
    where: {
      jobId_reviewerId_revieweeId: {
        jobId,
        reviewerId: session.user.id,
        revieweeId,
      },
    },
    update: { rating, comment },
    create: {
      jobId,
      reviewerId: session.user.id,
      revieweeId,
      rating,
      comment,
    },
  });

  await recomputeAverageRatingForUser(revieweeId);
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
            reviews: {
              where: { reviewerId: session.user.id },
            },
          },
        },
      },
    }),
  ]);

  // Fetch recommended jobs — match by city/skill, exclude already applied
  
  const appliedJobIds = applications.map((a) => a.jobId);
  const recommendedJobs = await prisma.job.findMany({
    where: {
      status: "OPEN",
      id: { notIn: appliedJobIds.length > 0 ? appliedJobIds : undefined },
      OR: [
        profile?.skill ? { skillRequired: profile.skill } : {},
        session.user.city ? { city: session.user.city } : {},
      ].filter((o) => Object.keys(o).length > 0),
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <LabourDashboardClient
      session={session}
      profile={profile}
      applications={applications}
      recommendedJobs={recommendedJobs}
      upsertAction={upsertLabourProfile}
      reviewAction={reviewContractor}
    />
  );
}
