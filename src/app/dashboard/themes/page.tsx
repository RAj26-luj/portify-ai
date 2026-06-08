import { themes } from "@/constants/themes";

export default function ThemesPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold">
        Themes
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        {themes.map(
          (theme: { id: string; name: string; description: string }) => (
            <div
              key={theme.id}
              className="rounded-lg border p-4"
            >
              <h2 className="font-semibold">
                {theme.name}
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {theme.description}
              </p>

              <button
                className="mt-4 rounded border px-4 py-2"
              >
                Apply Theme
              </button>
            </div>
          )
        )}
      </div>
    </main>
  );
}