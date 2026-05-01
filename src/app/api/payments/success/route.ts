import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateTransaction } from "@/lib/sslcommerz";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const tran_id = formData.get("tran_id") as string;
    const val_id = formData.get("val_id") as string;
    
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id");

    if (!tran_id || !val_id || !orderId) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/checkout?error=Invalid+payment+data`);
    }

    // Validate the transaction with SSLCommerz
    const validationResponse = await validateTransaction(val_id);

    if (validationResponse.status === "VALID" || validationResponse.status === "VALIDATED") {
      // Update order status
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
        },
      });

      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/order-confirmation/${orderId}`);
    } else {
      // Validation failed
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "CANCELLED",
        },
      });
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/checkout?error=Payment+validation+failed`);
    }
  } catch (error) {
    console.error("Payment success handler error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/checkout?error=Something+went+wrong`);
  }
}
