import { getPortfolioByUsername } from "@/actions/portfolio";
import { notFound } from "next/navigation";

interface Props {
  params: {
    username: string;
  };
}

export default async function CertificatesPage({ params }: Props) {
  const result = await getPortfolioByUsername(params.username);

  if (!result || !result.success || !result.data || !result.data.isPublic) {
    return notFound();
  }

  const portfolio = result.data;
  const certifications = (portfolio as any).certifications ?? [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Certificates</h1>

      {certifications.length === 0 ? (
        <p className="text-sm text-gray-500">No certificates added</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {certifications.map((c: any) => (
            <div key={c.id} className="border rounded-xl p-5 space-y-2">
              <p className="font-semibold">{c.name}</p>

              {c.issuer && <p className="text-sm text-gray-600">{c.issuer}</p>}

              {c.issueDate && (
                <p className="text-xs text-gray-500">
                  Issued: {new Date(c.issueDate).getFullYear()}
                </p>
              )}

              {c.expiryDate && (
                <p className="text-xs text-gray-500">
                  Expires: {new Date(c.expiryDate).getFullYear()}
                </p>
              )}

              {c.credentialUrl && (
                <a href={c.credentialUrl} target="_blank" className="text-xs text-blue-600">
                  Verify Certificate
                </a>
              )}

              {c.skillsCovered?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {c.skillsCovered.map((s: string, i: number) => (
                    <span key={i} className="text-[10px] px-2 py-1 bg-gray-100 rounded">
                      {s}
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
