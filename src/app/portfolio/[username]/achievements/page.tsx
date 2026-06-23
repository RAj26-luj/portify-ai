import { getPortfolioByUsername } from "@/actions/portfolio";
import { notFound } from "next/navigation";

interface Props {
  params: {
    username: string;
  };
}

export default async function AchievementsPage({ params }: Props) {
  const result = await getPortfolioByUsername(params.username);

  if (!result || !result.success || !result.data || !result.data.isPublic) {
    return notFound();
  }

  const portfolio = result.data;
  const achievements = (portfolio as any).achievements ?? [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Achievements</h1>

      {achievements.length === 0 ? (
        <p className="text-sm text-gray-500">No achievements added</p>
      ) : (
        <div className="space-y-4">
          {achievements.map((a: any) => (
            <div key={a.id} className="border rounded-xl p-5 space-y-2">
              <div className="flex justify-between gap-4">
                <p className="font-semibold">{a.title}</p>

                {a.achievementDate && (
                  <span className="text-xs text-gray-500">
                    {new Date(a.achievementDate).getFullYear()}
                  </span>
                )}
              </div>

              {a.issuer && <p className="text-sm text-gray-600">{a.issuer}</p>}

              {a.description && <p className="text-xs text-gray-500">{a.description}</p>}

              {a.rank && <p className="text-xs text-gray-500">Rank: {a.rank}</p>}

              {a.certificateUrl && (
                <a href={a.certificateUrl} target="_blank" className="text-xs text-blue-600">
                  View Certificate
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
