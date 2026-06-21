import { getPortfolioByUsername } from "@/actions/portfolio";
import { notFound } from "next/navigation";

interface Props {
  params: {
    username: string;
  };
}

export default async function ProjectsPage({
  params,
}: Props) {
  const result = await getPortfolioByUsername(
    params.username
  );

  if (
    !result ||
    !result.success ||
    !result.data ||
    !result.data.isPublic
  ) {
    return notFound();
  }

  const portfolio = result.data;
  const projects =
    (portfolio as any).projects ?? [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">
        Projects
      </h1>

      {projects.length === 0 ? (
        <p className="text-sm text-gray-500">
          No projects added
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project: any) => (
            <div
              key={project.id}
              className="border rounded-xl p-5 space-y-4"
            >
              {project.coverImage && (
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}

              <div>
                <h2 className="text-lg font-semibold">
                  {project.title}
                </h2>

                {project.shortDescription && (
                  <p className="text-sm text-gray-600 mt-2">
                    {
                      project.shortDescription
                    }
                  </p>
                )}
              </div>

              {project.description && (
                <p className="text-sm text-gray-500">
                  {project.description}
                </p>
              )}

              {project.techStack?.length >
                0 && (
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map(
                    (
                      tech: string,
                      index: number
                    ) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 rounded bg-gray-100"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              )}

              <div className="flex gap-4 text-sm">
                {project.githubUrl && (
                  <a
                    href={
                      project.githubUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    GitHub
                  </a>
                )}

                {project.liveUrl && (
                  <a
                    href={
                      project.liveUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    Live
                  </a>
                )}

                {project.demoUrl && (
                  <a
                    href={
                      project.demoUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    Demo
                  </a>
                )}
              </div>

              {project.metrics?.length >
                0 && (
                <div className="border-t pt-3">
                  <h3 className="text-sm font-medium mb-2">
                    Metrics
                  </h3>

                  <div className="space-y-2">
                    {project.metrics.map(
                      (metric: any) => (
                        <div
                          key={
                            metric.id
                          }
                          className="flex justify-between text-xs"
                        >
                          <span>
                            {
                              metric.label
                            }
                          </span>

                          <span className="font-medium">
                            {
                              metric.value
                            }
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}