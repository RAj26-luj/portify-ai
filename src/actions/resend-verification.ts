"use server";

export async function resendVerification(
  email: string
) {
  const res =
    await fetch(
      `${process.env.NEXTAUTH_URL}/api/auth/resend-verification`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email,
        }),
      }
    );

  return res.json();
}