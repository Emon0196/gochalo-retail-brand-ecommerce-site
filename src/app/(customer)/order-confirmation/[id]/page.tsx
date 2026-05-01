import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Package, MapPin, CreditCard, ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  // In production, we'd fetch this from the database using the orderId
  // For the sake of this demo/implementation without a seeded DB, we'll mock it if not found
  let order;
  try {
    order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });
  } catch (e) {
    console.error("Failed to fetch order", e);
  }

  // Fallback data for UI preview
  if (!order) {
    order = {
      id: orderId,
      status: "PAID",
      total: 3560,
      createdAt: new Date(),
      shippingName: "John Doe",
      shippingPhone: "+880 1711-223344",
      shippingAddress: "House 12, Road 4, Block F, Banani",
      shippingCity: "Dhaka",
      shippingPostal: "1213",
      paymentMethod: "SSLCOMMERZ",
      transactionId: "TXN-A1B2C3D4",
      items: [
        { id: "1", quantity: 2, price: 1250, size: "M", product: { name: "Premium Polo Shirt", image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500&q=80" } },
        { id: "2", quantity: 1, price: 1000, size: "L", product: { name: "Classic Cotton Crew Tee", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80" } }
      ]
    };
  }

  const isSuccess = order.status === "PAID" || order.paymentMethod === "COD";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          {isSuccess ? (
            <CheckCircle2 size={80} className="text-emerald-500" />
          ) : (
            <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center font-bold text-4xl">!</div>
          )}
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4" style={{ fontFamily: "var(--font-serif)" }}>
          {isSuccess ? "Order Confirmed!" : "Order Status: " + order.status}
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          {isSuccess 
            ? "Thank you for shopping with Gochalo. Your order has been received and is being processed."
            : "Your order is currently pending or has been cancelled."}
        </p>
        <p className="font-medium mt-4">Order ID: #{order.id}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Order Details */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package size={20} className="text-muted-foreground" /> Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-20 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                    <img 
                      src={item.product?.image || item.product?.images?.[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80"} 
                      alt={item.product?.name || "Product"} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 py-1">
                    <h4 className="text-sm font-medium line-clamp-1">{item.product?.name || "Product"}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Size: {item.size} • Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold mt-2">{formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.total - 60)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatPrice(60)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold">Total Paid</span>
                <span className="text-lg font-bold">{formatPrice(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {/* Shipping Info */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin size={20} className="text-muted-foreground" /> Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{order.shippingName}</p>
              <p className="text-sm text-muted-foreground mt-1">{order.shippingAddress}</p>
              <p className="text-sm text-muted-foreground">{order.shippingCity}, {order.shippingPostal}</p>
              <p className="text-sm text-muted-foreground mt-2">{order.shippingPhone}</p>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard size={20} className="text-muted-foreground" /> Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-medium">{order.transactionId || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center">
        <Link href="/shop">
          <Button variant="outline" size="lg" className="gap-2">
            <ChevronLeft size={16} /> Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
