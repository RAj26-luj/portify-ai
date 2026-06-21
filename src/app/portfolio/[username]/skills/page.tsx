import { getPortfolioByUsername } from "@/actions/portfolio";
import { notFound } from "next/navigation";

interface Props {
  params: {
    username: string;
  };
}

export default async function SkillsPage({ params }: Props) {
  const result = await getPortfolioByUsername(params.username);

  if (!result.success || !result.data) {
    return notFound();
  }

  const portfolio = result.data;
  const skills = portfolio.skills ?? [];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Skills</h1>

      {skills.length === 0 ? (
        <p className="text-sm text-gray-500">No skills added</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skills.map((skill: any) => (
            <div key={skill.id} className="border rounded-lg p-4 space-y-1">
              <p className="font-semibold">{skill.name}</p>

              {skill.proficiency && (
                <p className="text-xs text-gray-500">
                  {skill.proficiency}
                </p>
              )}

              {skill.description && (
                <p className="text-xs text-gray-500">
                  {skill.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}