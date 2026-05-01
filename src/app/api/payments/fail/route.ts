import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id");

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "CANCELLED",
        },
      });
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/checkout?error=Payment+failed`);
  } catch (error) {
    console.error("Payment fail handler error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/checkout?error=Payment+failed`);
  }
}
