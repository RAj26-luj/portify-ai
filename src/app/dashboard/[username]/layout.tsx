import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import { getCustomSections } from "@/actions/custom-section";
import { getPortfolioId } from "@/lib/get-portfolio-id";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  const user = session?.user as {
    role?: string;
    status?: string;
    isBlocked?: boolean;
  } | null;

  if (!user) {
    redirect("/login");
  }

  if (user.isBlocked) {
    redirect("/unauthorized");
  }

  if (user.status === "REJECTED") {
    redirect("/unauthorized");
  }

  if (user.status === "PENDING") {
    redirect("/pending-approval");
  }

  if (user.role !== "ADMIN" && user.status !== "APPROVED") {
    redirect("/pending-approval");
  }

  const portfolioId = await getPortfolioId();

  const customSectionsResult = portfolioId ? await getCustomSections(portfolioId) : null;

  const customSections =
    customSectionsResult?.success && customSectionsResult.data ? customSectionsResult.data : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-white antialiased selection:bg-blue-500/20 selection:text-white">
      <Navbar />

      <div className="flex flex-1 relative w-full flex-col lg:flex-row">
        <Sidebar
          customSections={customSections.map((section) => ({
            id: section.id,
            title: section.title,
            iconUrl: section.iconUrl,
          }))}
        />

        <div className="flex-1 flex flex-col lg:pl-64 pt-16 min-w-0 w-full">
          <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto w-full">{children}</div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}
