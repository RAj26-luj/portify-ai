import { getPendingUsers } from "@/actions/admin";
export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const users =
    await getPendingUsers();

  return (
    <main className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">
        Pending Approvals
      </h1>

      <div className="rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4 text-left">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map(
  (
    user: {
      id: string;
      name: string;
      email: string;
      status: string;
    }
  ) => (
                <tr
                  key={user.id}
                  className="border-b"
                >
                  <td className="p-4">
                    {user.name}
                  </td>

                  <td className="p-4">
                    {user.email}
                  </td>

                  <td className="p-4">
                    {user.status}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}