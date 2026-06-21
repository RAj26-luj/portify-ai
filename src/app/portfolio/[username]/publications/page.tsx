import { getPortfolioByUsername } from "@/actions/portfolio";
import { notFound } from "next/navigation";

interface Props {
  params: {
    username: string;
  };
}

export default async function PublicationsPage({ params }: Props) {
  // 1. Fetch public collections out of the unified response wrapper envelope
  const result = await getPortfolioByUsername(params.username);

  // 🛡️ Discriminated Union Guard: Enforces strict data availability and checks portfolio visibility
  if (!result || !result.success || !result.data || !result.data.isPublic) {
    return notFound();
  }

  // ✅ Safe Context: Accessing relational child tracks is guaranteed type-narrowed out of the success lane
  const portfolio = result.data;
  const publications = (portfolio as any).publications ?? [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Publications</h1>

      {publications.length === 0 ? (
        <p className="text-sm text-gray-500">No publications added</p>
      ) : (
        <div className="space-y-4">
          {publications.map((p: any) => (
            <div key={p.id} className="border rounded-xl p-5 space-y-2">
              <div className="flex justify-between gap-4">
                <p className="font-semibold">{p.title}</p>

                {p.publicationDate && (
                  <span className="text-xs text-gray-500">
                    {new Date(p.publicationDate).getFullYear()}
                  </span>
                )}
              </div>

              {p.journal && (
                <p className="text-sm text-gray-600">{p.journal}</p>
              )}

              {p.publisher && (
                <p className="text-xs text-gray-500">{p.publisher}</p>
              )}

              {p.abstract && (
                <p className="text-xs text-gray-500 line-clamp-3">
                  {p.abstract}
                </p>
              )}

              <div className="flex gap-3 text-xs pt-2">
                {p.publicationUrl && (
                  <a
                    href={p.publicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    Read
                  </a>
                )}

                {p.pdfUrl && (
                  <a
                    href={p.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    PDF
                  </a>
                )}
              </div>

              {p.authors?.length > 0 && (
                <p className="text-[11px] text-gray-400 pt-1">
                  Authors: {p.authors.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}