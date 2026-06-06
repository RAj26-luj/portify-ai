import { getPortfolioByUsername } from "@/actions/portfolio";

interface Props {
  params: Promise<{
    username: string;
  }>;
}

export default async function EducationPage({
  params,
}: Props) {
  const { username } =
    await params;

  const portfolio =
    await getPortfolioByUsername(
      username
    );

  return (
    <main className="p-8">
      <h1 className="mb-6 text-4xl font-bold">
        Education
      </h1>

      {portfolio?.educations.map(
        (item) => (
          <div
            key={item.id}
            className="mb-4 rounded-xl border p-4"
          >
            <h2>
              {item.institution}
            </h2>

            <p>{item.degree}</p>
          </div>
        )
      )}
    </main>
  );
}