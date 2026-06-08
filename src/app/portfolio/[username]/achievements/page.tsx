import { getPortfolioByUsername } from "@/actions/portfolio";
export const dynamic = "force-dynamic";
interface Props {
  params: Promise<{
    username: string;
  }>;
}

export default async function AchievementsPage({
  params,
}: Props) {
  const { username } =
    await params;

  const portfolio =
    await getPortfolioByUsername(
      username
    );

  return (
    <main className="p-8">
      <h1 className="mb-6 text-4xl font-bold">
        Achievements
      </h1>

      {portfolio?.achievements.map(
        (
  item: {
    id: string;
    title: string;
    description?: string | null;
    issuer?: string | null;
    url?: string | null;
  }
) => (
          <div
            key={item.id}
            className="mb-4 rounded-xl border p-4"
          >
            {item.title}
          </div>
        )
      )}
    </main>
  );
}