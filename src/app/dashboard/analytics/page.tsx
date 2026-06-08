import { auth } from "@/auth";

import { getAnalytics } from "@/actions/analytics";
import { getPortfolioByUserId } from "@/actions/portfolio";
export const dynamic = "force-dynamic";
export default async function AnalyticsPage() {
  const session =
    await auth();

  if (!session?.user?.id) {
    return null;
  }

  const portfolio =
    await getPortfolioByUserId(
      session.user.id
    );

  if (!portfolio) {
    return (
      <main className="p-6">
        Portfolio not found
      </main>
    );
  }

  const analytics =
    await getAnalytics(
      portfolio.id
    );

  const stats = [
    {
      title:
        "Portfolio Views",
      value:
        analytics.portfolioViews,
    },
    {
      title:
        "Unique Visitors",
      value:
        analytics.uniqueVisitors,
    },
 {
  title:
    "Resume Downloads",
  value:
    analytics.resumeDownloads,
},
    {
      title:
        "Contact Messages",
      value:
        analytics.contactMessages,
    },
  ];

  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold">
        Analytics
      </h1>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat: { title: string; value: number }) => (
          <div
            key={stat.title}
            className="rounded-lg border p-4"
          >
            <h2 className="text-sm text-muted-foreground">
              {stat.title}
            </h2>

            <p className="mt-2 text-3xl font-bold">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="mb-2 text-xl font-semibold">
          Visitor Insights
        </h2>

      <div className="space-y-2 text-sm">
  <p>
    Countries:
    {analytics.countries.length}
  </p>

  <p>
    Devices:
    {analytics.devices.length}
  </p>

  <p>
    Browsers:
    {analytics.browsers.length}
  </p>

  <p>
    Referrers:
    {analytics.referrers.length}
  </p>
</div>
      </div>
    </main>
  );
}