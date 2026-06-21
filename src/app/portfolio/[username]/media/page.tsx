import { getPortfolioByUsername } from "@/actions/portfolio";
import { notFound } from "next/navigation";

interface Props {
  params: {
    username: string;
  };
}

export default async function MediaPage({ params }: Props) {
  // 1. Fetch public portfolio specification models from server response envelope
  const result = await getPortfolioByUsername(params.username);

  // 🛡️ Discriminated Union Guard: Directs type narrowing parameters and handles hidden portfolios safely
  if (!result || !result.success || !result.data || !result.data.isPublic) {
    return notFound();
  }

  // ✅ Safe Context: Accessing relational tracks is guaranteed type-narrowed out of the success lane
  const portfolio = result.data;
  const media = (portfolio as any).media ?? [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Media</h1>

      {media.length === 0 ? (
        <p className="text-sm text-gray-500">No media uploaded</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {media.map((m: any) => (
            <div key={m.id} className="border rounded-xl overflow-hidden">
              {m.type === "IMAGE" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.url}
                  alt={m.name || "media"}
                  className="w-full h-48 object-cover"
                />
              )}

              {m.type !== "IMAGE" && (
                <div className="p-4 space-y-2">
                  <p className="font-semibold text-sm">{m.name || "File"}</p>
                  <a
                    href={m.url}
                    target="_blank"
                    className="text-xs text-blue-600"
                  >
                    View File
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}