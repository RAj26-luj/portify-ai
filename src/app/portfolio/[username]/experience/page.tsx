import { getPortfolioByUsername } from "@/actions/portfolio";
import { notFound } from "next/navigation";

interface Props {
  params: {
    username: string;
  };
}

export default async function ExperiencePage({ params }: Props) {
  // 1. Fetch public portfolio profiles out of the unified response wrapper envelope
  const result = await getPortfolioByUsername(params.username);

  // 🛡️ Discriminated Union Guard: Directs type narrowing parameters and handles hidden portfolios safely
  if (!result || !result.success || !result.data || !result.data.isPublic) {
    return notFound();
  }

  // ✅ Safe Context: Accessing relational tracks is guaranteed type-narrowed out of the success lane
  const portfolio = result.data;
  const experiences = (portfolio as any).experiences ?? [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Experience</h1>

      {experiences.length === 0 ? (
        <p className="text-sm text-gray-500">No experience added</p>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp: any) => (
            <div key={exp.id} className="border rounded-xl p-5 space-y-2">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-semibold">{exp.company}</p>
                  <p className="text-sm text-gray-600">{exp.position}</p>
                </div>

                {exp.employmentType && (
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                    {exp.employmentType}
                  </span>
                )}
              </div>

              {(exp.startDate || exp.endDate || exp.currentlyWorking) && (
                <p className="text-xs text-gray-500">
                  {exp.startDate
                    ? new Date(exp.startDate).getFullYear()
                    : ""}
                  {" - "}
                  {exp.currentlyWorking
                    ? "Present"
                    : exp.endDate
                      ? new Date(exp.endDate).getFullYear()
                      : ""}
                </p>
              )}

              {exp.location && (
                <p className="text-xs text-gray-500">{exp.location}</p>
              )}

              {exp.description && (
                <p className="text-xs text-gray-500">{exp.description}</p>
              )}

              {exp.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {exp.technologies.map((t: string, i: number) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-1 bg-gray-100 rounded"
                    >
                      {t}
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