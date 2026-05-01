import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: "If an account exists with this email, you will receive a password reset link.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpiry: resetExpiry,
      },
    });

    try {
      await sendPasswordResetEmail(email, resetToken);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // In development, log the reset URL
      if (process.env.NODE_ENV === "development") {
        console.log(`\n🔗 Password Reset URL: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}\n`);
      }
    }

    return NextResponse.json({
      message: "If an account exists with this email, you will receive a password reset link.",
      ...(process.env.NODE_ENV === "development" ? { devToken: resetToken } : {}),
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
