import { getPortfolioByUsername } from "@/actions/portfolio";
import { notFound } from "next/navigation";

interface Props {
  params: {
    username: string;
  };
}

export default async function TestimonialsPage({ params }: Props) {
  const result = await getPortfolioByUsername(params.username);

  if (!result.success || !result.data) {
    return notFound();
  }

  const portfolio = result.data;
  const testimonials = portfolio.testimonials ?? [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Testimonials</h1>

      {testimonials.length === 0 ? (
        <p className="text-sm text-gray-500">No testimonials available</p>
      ) : (
        <div className="grid gap-4">
          {testimonials.map((t: any) => (
            <div key={t.id} className="border rounded-xl p-5 space-y-2">
              <p className="text-sm text-gray-600">{t.testimonial}</p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{t.authorName}</p>

                  {t.authorRole && (
                    <p className="text-xs text-gray-500">
                      {t.authorRole}
                      {t.company ? `, ${t.company}` : ""}
                    </p>
                  )}
                </div>

                {t.profileImage && (
                  <img
                    src={t.profileImage}
                    alt={t.authorName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}