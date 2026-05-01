import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<void> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Gochalo" <${process.env.SMTP_USER || "noreply@gochalo.com"}>`,
    to: email,
    subject: "Reset Your Password — Gochalo",
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #fafafa;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 28px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.5px;">GOCHALO</h1>
        </div>
        <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <h2 style="color: #1a1a1a; font-size: 20px; margin-bottom: 16px;">Reset Your Password</h2>
          <p style="color: #666; font-size: 15px; line-height: 1.6;">
            We received a request to reset your password. Click the button below to set a new password.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" 
               style="background: #1a1a1a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #999; font-size: 13px; line-height: 1.5;">
            This link expires in 1 hour. If you didn't request this, please ignore this email.
          </p>
        </div>
        <p style="text-align: center; color: #bbb; font-size: 12px; margin-top: 24px;">
          © ${new Date().getFullYear()} Gochalo. All rights reserved.
        </p>
      </div>
    `,
  });
}
