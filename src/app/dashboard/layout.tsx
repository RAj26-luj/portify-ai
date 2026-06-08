import { auth } from "@/auth";
import { redirect } from "next/navigation";

import Sidebar from "@/components/layout/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session =
    await auth();

  if (!session) {
    redirect("/login");
  }

  if (
    session.user.isBlocked
  ) {
    redirect("/login");
  }

  if (
    session.user.status !==
    "APPROVED"
  ) {
    redirect(
      "/pending-approval"
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}