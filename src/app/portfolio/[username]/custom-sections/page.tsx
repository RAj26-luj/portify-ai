import { getPortfolioByUsername } from "@/actions/portfolio";
import { notFound } from "next/navigation";

interface Props {
  params: {
    username: string;
  };
}

export default async function CustomSectionsPage({ params }: Props) {
  const result = await getPortfolioByUsername(params.username);

  if (!result || !result.success || !result.data || !result.data.isPublic) {
    return notFound();
  }

  const portfolio = result.data;
  const sections = (portfolio as any).customSections ?? [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Custom Sections</h1>

      {sections.length === 0 ? (
        <p className="text-sm text-gray-500">No custom sections added</p>
      ) : (
        <div className="space-y-4">
          {sections.map((s: any) => (
            <div key={s.id} className="border rounded-xl p-5 space-y-2">
              <div className="flex justify-between gap-4">
                <p className="font-semibold">{s.title}</p>

                {s.sectionType && (
                  <span className="text-[10px] px-2 py-1 bg-gray-100 rounded">{s.sectionType}</span>
                )}
              </div>

              {s.subtitle && <p className="text-sm text-gray-600">{s.subtitle}</p>}

              {s.description && <p className="text-xs text-gray-500">{s.description}</p>}

              {s.richTextContent && (
                <p className="text-xs text-gray-500 line-clamp-4">{s.richTextContent}</p>
              )}

              {s.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.imageUrl} alt={s.title} className="w-full h-48 object-cover rounded" />
              )}

              {s.buttonText && s.buttonUrl && (
                <a href={s.buttonUrl} target="_blank" className="text-xs text-blue-600">
                  {s.buttonText}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
