import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions, ROLE_DASHBOARDS } from "../../lib/auth";

/**
 * Redirects to role-specific dashboard after login
 */
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role) redirect("/login");

  const path = ROLE_DASHBOARDS[session.user.role];
  redirect(path || "/");
}
