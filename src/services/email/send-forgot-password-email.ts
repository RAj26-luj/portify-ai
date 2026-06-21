import { sendEmail } from "@/lib/nodemailer";

export async function sendForgotPasswordEmail(
  email: string,
  token: string,
  userId?: string
) {
  await sendEmail({
    to: email,
    userId,
    type: "PASSWORD_RESET",
    subject: "Reset your Portify AI password",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reset Password</title>
<style>
body {
  margin:0;
  padding:0;
  background:#f8fafc;
  font-family:Arial,sans-serif;
}
.container{
  max-width:520px;
  margin:40px auto;
  background:#fff;
  padding:40px;
  border-radius:16px;
  border:1px solid #e2e8f0;
}
.code-box{
  margin:30px 0;
  text-align:center;
  font-size:32px;
  font-weight:bold;
  letter-spacing:8px;
  background:#f1f5f9;
  padding:16px;
  border-radius:12px;
}
</style>
</head>
<body>
<div class="container">
<h2>Reset Your Password</h2>

<p>We received a password reset request.</p>

<p>Use the OTP below to reset your password:</p>

<div class="code-box">
${token}
</div>

<p>This OTP will expire in 1 hour.</p>

<p>If you didn't request this reset, ignore this email.</p>
</div>
</body>
</html>
`,
  });
}