import { getPortfolioByUsername } from "@/actions/portfolio";

interface Props {
  params: Promise<{
    username: string;
  }>;
}

export default async function ProjectsPage({
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
        Projects
      </h1>

      <div className="grid gap-4">
        {portfolio?.projects.map(
          (project) => (
            <div
              key={project.id}
              className="rounded-xl border p-4"
            >
              <h2 className="font-bold">
                {project.title}
              </h2>

              <p>
                {
                  project.description
                }
              </p>
            </div>
          )
        )}
      </div>
    </main>
  );
}