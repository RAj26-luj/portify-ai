import { getPortfolioByUsername } from "@/actions/portfolio";

interface Props {
  params: Promise<{
    username: string;
  }>;
}

export default async function PortfolioPage({
  params,
}: Props) {
  const { username } =
    await params;

  const portfolio =
    await getPortfolioByUsername(
      username
    );

  if (!portfolio) {
    return (
      <div className="p-10">
        Portfolio Not Found
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="text-5xl font-bold">
        {portfolio.title ??
          portfolio.username}
      </h1>

      <p className="mt-4">
        {portfolio.bio}
      </p>
    </main>
  );
}