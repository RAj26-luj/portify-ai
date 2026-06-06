import { auth } from "@/auth";

export default async function AdminPage() {
  const session = await auth();

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">
        Admin Panel
      </h1>

      <p className="mt-4">
        Welcome {session?.user?.name}
      </p>
    </main>
  );
}