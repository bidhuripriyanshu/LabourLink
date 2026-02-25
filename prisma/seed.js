/**
 * Phase 1 — Optional seed data for Local Labour Connect
 * Run: npx prisma db seed
 */
import { prisma } from "../lib/prisma.js";

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      name: "Admin User",
      phone: "9090909090",
      role: "ADMIN",
      city: "Bhopal",
      password: hashedPassword,
    },
  });
  console.log("Seed completed:", { labourUser: labourUser.id, contractorUser: contractorUser.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
