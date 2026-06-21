import { getPortfolioByUsername } from "@/actions/portfolio";
import { notFound } from "next/navigation";

interface Props {
  params: {
    username: string;
  };
}

export default async function EducationPage({ params }: Props) {
  const result = await getPortfolioByUsername(params.username);

  if (!result.success || !result.data) {
    return notFound();
  }

  const portfolio = result.data;
  const education = portfolio.educations ?? [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Education</h1>

      {education.length === 0 ? (
        <p className="text-sm text-gray-500">No education details added</p>
      ) : (
        <div className="space-y-4">
          {education.map((e: any) => (
            <div key={e.id} className="border rounded-xl p-5 space-y-1">
              <p className="font-semibold">{e.institution}</p>

              <p className="text-sm text-gray-600">
                {e.degree}
                {e.fieldOfStudy ? ` • ${e.fieldOfStudy}` : ""}
              </p>

              {(e.startDate || e.endDate) && (
                <p className="text-xs text-gray-500">
                  {e.startDate
                    ? new Date(e.startDate).getFullYear()
                    : ""}
                  {e.endDate
                    ? ` - ${new Date(e.endDate).getFullYear()}`
                    : " - Present"}
                </p>
              )}

              {e.description && (
                <p className="text-xs text-gray-500">{e.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}