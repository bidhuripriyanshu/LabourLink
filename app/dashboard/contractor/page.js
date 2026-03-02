import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma";
import { recomputeAverageRatingForUser } from "../../../lib/reviews";
import ContractorDashboardClient from "./ContractorDashboardClient";

/* ── Server actions ────────────────────────────────────────────────── */

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

async function reviewLabour(formData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "CONTRACTOR") redirect("/login");

  const jobId = formData.get("jobId")?.toString();
  const revieweeId = formData.get("revieweeId")?.toString();
  const ratingStr = formData.get("rating")?.toString();
  const comment = formData.get("comment")?.toString().trim() || null;

  const rating = Number.parseInt(ratingStr ?? "", 10);
  if (!jobId || !revieweeId || Number.isNaN(rating) || rating < 1 || rating > 5) return;

  const app = await prisma.application.findFirst({
    where: {
      jobId,
      labourId: revieweeId,
      status: "ACCEPTED",
      job: { contractorId: session.user.id, status: "CLOSED" },
    },
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
  revalidatePath("/dashboard/contractor");
}

/* ── Page component ────────────────────────────────────────────────── */

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
      reviews: {
        where: { reviewerId: session.user.id },
      },
    },
  });

  return (
    <ContractorDashboardClient
      session={session}
      profile={profile}
      jobs={jobs}
      upsertAction={upsertCompanyProfile}
      createJobAction={createJob}
      updateAppStatusAction={updateApplicationStatus}
      closeJobAction={closeJob}
      reviewAction={reviewLabour}
    />
  );
}