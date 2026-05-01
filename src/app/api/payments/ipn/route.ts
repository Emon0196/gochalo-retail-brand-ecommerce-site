import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateTransaction } from "@/lib/sslcommerz";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const val_id = formData.get("val_id") as string;
    const tran_id = formData.get("tran_id") as string;
    const status = formData.get("status") as string;

    if (!val_id || !tran_id) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    if (status === "VALID") {
      const validationResponse = await validateTransaction(val_id);

      if (validationResponse.status === "VALID" || validationResponse.status === "VALIDATED") {
        await prisma.order.updateMany({
          where: { transactionId: tran_id, status: "PENDING" },
          data: { status: "PAID" },
        });
      }
    }

    return NextResponse.json({ message: "IPN received" });
  } catch (error) {
    console.error("IPN handler error:", error);
    return NextResponse.json({ message: "Error processing IPN" }, { status: 500 });
  }
}
