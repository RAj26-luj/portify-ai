import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import { getCustomSections } from "@/actions/custom-section";
import { getPortfolioId } from "@/lib/get-portfolio-id";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  if (
    user.role !== "ADMIN" &&
    user.status !== "APPROVED"
  ) {
    redirect("/pending-approval");
  }

  const portfolioId = await getPortfolioId();

  const customSectionsResult = portfolioId
  ? await getCustomSections(portfolioId)
  : null;

const customSections =
  customSectionsResult?.success && customSectionsResult.data
    ? customSectionsResult.data
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-white antialiased selection:bg-blue-500/20 selection:text-white">
      {/* Premium Glassmorphic Top Bar Navigation Overlay */}
      <Navbar />

      <div className="flex flex-1 relative w-full flex-col lg:flex-row">
        {/* Fixed Structural Core Control Sidebar */}
        <Sidebar
          customSections={customSections.map((section) => ({
            id: section.id,
            title: section.title,
            iconUrl: section.iconUrl,
          }))}
        />

        {/* 
          Main Dashboard Workspace Console Layout Matrix:
          Removed desktop-only padding constraints on small screens to guarantee full viewport edge responsiveness.
          Offsetting left by lg:pl-64 on larger screens to fit the structural dashboard panels seamlessly.
          Offsetting top by pt-16 to preserve clearance parameters under Navbar view windows.
        */}
        <div className="flex-1 flex flex-col lg:pl-64 pt-16 min-w-0 w-full">
          <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
          
          {/* Flat Operational Production Footer Section */}
          <Footer />
        </div>
      </div>
    </div>
  );
}