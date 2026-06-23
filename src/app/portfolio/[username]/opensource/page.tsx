import { getPortfolioByUsername } from "@/actions/portfolio";
import { notFound } from "next/navigation";

interface Props {
  params: {
    username: string;
  };
}

export default async function OpenSourcePage({ params }: Props) {
  const result = await getPortfolioByUsername(params.username);

  if (!result || !result.success || !result.data || !result.data.isPublic) {
    return notFound();
  }

  const portfolio = result.data;
  const openSource = (portfolio as any).openSourceProjects ?? [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Open Source</h1>

      {openSource.length === 0 ? (
        <p className="text-sm text-gray-500">No contributions added</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {openSource.map((o: any) => (
            <div key={o.id} className="border rounded-xl p-5 space-y-2">
              <p className="font-semibold">{o.repositoryName}</p>

              {o.contributionTitle && (
                <p className="text-sm text-gray-600">{o.contributionTitle}</p>
              )}

              {o.description && <p className="text-xs text-gray-500">{o.description}</p>}

              {o.contributionType && (
                <span className="text-[10px] px-2 py-1 bg-gray-100 rounded">
                  {o.contributionType}
                </span>
              )}

              {o.linesChanged && (
                <p className="text-xs text-gray-500">Lines changed: {o.linesChanged}</p>
              )}

              <div className="flex gap-3 text-xs pt-2">
                {o.repositoryUrl && (
                  <a href={o.repositoryUrl} target="_blank" className="text-blue-600">
                    Repo
                  </a>
                )}

                {o.pullRequestUrl && (
                  <a href={o.pullRequestUrl} target="_blank" className="text-blue-600">
                    PR
                  </a>
                )}
              </div>

              {o.impactMetrics?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {o.impactMetrics.map((m: string, i: number) => (
                    <span key={i} className="text-[10px] px-2 py-1 bg-gray-100 rounded">
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
