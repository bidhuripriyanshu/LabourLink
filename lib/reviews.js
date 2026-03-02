import { prisma } from "./prisma";

/**
 * Recompute average rating for a user and update their profile rating.
 * Supports LABOUR and CONTRACTOR roles.
 */
export async function recomputeAverageRatingForUser(userId) {
  const agg = await prisma.review.aggregate({
    where: { revieweeId: userId },
    _avg: { rating: true },
  });

  const avg = agg._avg.rating ?? 0;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) return;

  if (user.role === "LABOUR") {
    await prisma.labourProfile.updateMany({
      where: { userId },
      data: { rating: avg },
    });
  } else if (user.role === "CONTRACTOR") {
    await prisma.contractorProfile.updateMany({
      where: { userId },
      data: { rating: avg },
    });
  }
}

