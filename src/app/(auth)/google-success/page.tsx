import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function GoogleSuccessPage() {
  const session = await auth();

  const user = session?.user as {
    id?: string;
    role?: string;
    status?: string;
    username?: string;
    isBlocked?: boolean;
  } | null;

  if (!user?.id) {
    redirect("/login");
  }

  if (user.isBlocked) {
    redirect("/unauthorized");
  }

  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  if (user.status === "APPROVED") {
    if (user.username) {
      redirect(`/dashboard/${user.username}`);
    }

    redirect("/dashboard");
  }

  if (user.status === "REJECTED") {
    redirect("/unauthorized");
  }

  const approval = await prisma.approvalRequest.findUnique({
    where: {
      userId: user.id,
    },
  });

if (
  user.status === "PENDING" &&
  approval &&
  approval.note !== "__SKIPPED__" &&
  !approval.note
) {
  redirect("/approval-note");
}

  redirect("/pending-approval");
}