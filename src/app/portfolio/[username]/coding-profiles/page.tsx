import { getPortfolioByUsername } from "@/actions/portfolio";
import { notFound } from "next/navigation";

interface Props {
  params: {
    username: string;
  };
}

export default async function CodingProfilesPage({ params }: Props) {
  // 1. Fetch public portfolio specifications from server response envelope
  const result = await getPortfolioByUsername(params.username);

  // 🛡️ Discriminated Union Guard: Enforces strict data availability and isPublic canvas matching rules
  if (!result || !result.success || !result.data || !result.data.isPublic) {
    return notFound();
  }

  // ✅ Safe Context: Accessing .codingProfiles is guaranteed type-narrowed out of the success lane
  const portfolio = result.data;
  const profiles = (portfolio as any).codingProfiles ?? [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Coding Profiles</h1>

      {profiles.length === 0 ? (
        <p className="text-sm text-gray-500">No coding profiles added</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {profiles.map((p: any) => (
            <div key={p.id} className="border rounded-xl p-5 space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-semibold">{p.platform}</p>

                {p.rank && (
                  <span className="text-[10px] px-2 py-1 bg-gray-100 rounded">
                    {p.rank}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600">{p.username}</p>

              {p.currentRating && (
                <p className="text-xs text-gray-500">
                  Rating: {p.currentRating}
                  {p.maxRating ? ` (Max: ${p.maxRating})` : ""}
                </p>
              )}

              <div className="flex flex-wrap gap-2 pt-2 text-xs">
                {p.problemsSolved && (
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    Solved: {p.problemsSolved}
                  </span>
                )}

                {p.contestsAttended && (
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    Contests: {p.contestsAttended}
                  </span>
                )}
              </div>

              <div className="pt-2">
                <a
                  href={p.profileUrl}
                  target="_blank"
                  className="text-xs text-blue-600"
                >
                  View Profile
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}