export default function PendingApprovalPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="max-w-lg rounded-xl border p-6 text-center">
        <h1 className="mb-4 text-3xl font-bold">
          Account Pending Approval
        </h1>

        <p>
          Your account has been created.
          Please wait for admin approval.
        </p>
      </div>
    </main>
  );
}