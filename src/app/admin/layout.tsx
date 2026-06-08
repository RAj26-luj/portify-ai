import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
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
    session.user.role !==
    "ADMIN"
  ) {
    redirect("/dashboard");
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
    <main className="min-h-screen p-6">
      {children}
    </main>
  );
}