import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { initPayment, SSLCommerzPaymentData } from "@/lib/sslcommerz";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    // In a real app, you might want to enforce auth. 
    // Here we allow guest checkout, but link to user if logged in.
    const userId = session?.user?.id;

    const body = await req.json();
    const { name, phone, email, address, city, postalCode, items, total, paymentMethod } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const transactionId = `TXN-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Create order in DB
    let order;
    if (userId) {
      order = await prisma.order.create({
        data: {
          userId,
          total,
          paymentMethod,
          transactionId,
          shippingName: name,
          shippingPhone: phone,
          shippingAddress: address,
          shippingCity: city,
          shippingPostal: postalCode,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              variantId: item.variantId || null,
              quantity: item.quantity,
              price: item.price,
              size: item.size,
            })),
          },
        },
      });
    } else {
      // Handle guest checkout by returning a fake order ID if no DB relation is possible without a user
      // For this implementation, User is required in Order. So we either require login or create a guest user.
      // Let's create a guest user or use a dummy one if not logged in.
      let guestUser = await prisma.user.findUnique({ where: { email: email }});
      if (!guestUser) {
        guestUser = await prisma.user.create({
          data: {
            email,
            name,
            phone,
            password: uuidv4(), // Random password for guest
          }
        });
      }
      
      order = await prisma.order.create({
        data: {
          userId: guestUser.id,
          total,
          paymentMethod,
          transactionId,
          shippingName: name,
          shippingPhone: phone,
          shippingAddress: address,
          shippingCity: city,
          shippingPostal: postalCode,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              variantId: item.variantId || null,
              quantity: item.quantity,
              price: item.price,
              size: item.size,
            })),
          },
        },
      });
    }

    if (paymentMethod === "COD") {
      return NextResponse.json({ orderId: order.id });
    }

    // Initialize SSLCommerz
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const paymentData: SSLCommerzPaymentData = {
      total_amount: total,
      currency: "BDT",
      tran_id: transactionId,
      success_url: `${baseUrl}/api/payments/success?tran_id=${transactionId}&order_id=${order.id}`,
      fail_url: `${baseUrl}/api/payments/fail?tran_id=${transactionId}&order_id=${order.id}`,
      cancel_url: `${baseUrl}/api/payments/cancel?tran_id=${transactionId}&order_id=${order.id}`,
      ipn_url: `${baseUrl}/api/payments/ipn`,
      shipping_method: "Courier",
      product_name: "Gochalo Apparel",
      product_category: "Clothing",
      product_profile: "physical-goods",
      cus_name: name,
      cus_email: email,
      cus_add1: address,
      cus_city: city,
      cus_postcode: postalCode,
      cus_country: "Bangladesh",
      cus_phone: phone,
      ship_name: name,
      ship_add1: address,
      ship_city: city,
      ship_postcode: postalCode,
      ship_country: "Bangladesh",
    };

    const apiResponse = await initPayment(paymentData);

    if (apiResponse?.GatewayPageURL) {
      return NextResponse.json({ url: apiResponse.GatewayPageURL, orderId: order.id });
    } else {
      console.error("SSLCommerz Init Error:", apiResponse);
      return NextResponse.json({ error: "Payment gateway initialization failed" }, { status: 500 });
    }
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Something went wrong during checkout" },
      { status: 500 }
    );
  }
}
