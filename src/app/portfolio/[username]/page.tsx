import { getPortfolioByUsername } from "@/actions/portfolio";
import { getActiveTheme } from "@/actions/theme";
export const dynamic = "force-dynamic";
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

  const theme =
    await getActiveTheme(
      portfolio.id
    );

  const dark =
    theme?.darkMode;

  return (
    <main
      className={`mx-auto max-w-6xl p-8 ${
        dark
          ? "bg-black text-white"
          : ""
      }`}
    >
      <h1 className="text-5xl font-bold">
        {portfolio.title ??
          portfolio.username}
      </h1>

      {portfolio.tagline && (
        <p className="mt-4 text-xl">
          {portfolio.tagline}
        </p>
      )}

      <p className="mt-6">
        {portfolio.bio}
      </p>

      <div className="mt-10">
        <h2 className="mb-4 text-2xl font-semibold">
          Active Theme
        </h2>

        <p>
          {theme?.name ??
            "Default"}
        </p>
      </div>
    </main>
  );
}