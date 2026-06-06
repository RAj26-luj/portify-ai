import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-muted-foreground">
          Welcome{" "}
          {session?.user?.name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">
            Projects
          </h3>

          <p className="mt-2 text-2xl font-bold">
            0
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">
            Skills
          </h3>

          <p className="mt-2 text-2xl font-bold">
            0
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">
            Experience
          </h3>

          <p className="mt-2 text-2xl font-bold">
            0
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">
            Education
          </h3>

          <p className="mt-2 text-2xl font-bold">
            0
          </p>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="mb-2 text-xl font-semibold">
          Portfolio Progress
        </h2>

        <p>
          Complete your profile,
          projects, skills and
          experience to publish
          your portfolio.
        </p>
      </div>
    </main>
  );
}