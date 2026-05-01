"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowRight, ShieldCheck, CreditCard, Banknote } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("SSLCOMMERZ");

  const shippingCost = 60; // Standard shipping inside Dhaka
  const grandTotal = totalPrice() + shippingCost;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Add some items to your cart to proceed with checkout.</p>
        <Button onClick={() => router.push("/shop")} size="lg">Continue Shopping</Button>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/payments/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items,
          total: grandTotal,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize payment");
      }

      if (data.url) {
        // Redirect to SSLCommerz Sandbox payment page
        window.location.href = data.url;
      } else {
        // If COD or other direct method (though we use SSLCommerz)
        clearCart();
        router.push(`/order-confirmation/${data.orderId}`);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>Checkout</h1>
        <p className="text-muted-foreground mt-2">Complete your order securely.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Side - Forms */}
        <div className="w-full lg:w-[60%] space-y-8">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg">
              {error}
            </motion.div>
          )}

          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
            {/* Contact Info */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" required placeholder="John Doe" 
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" required type="tel" placeholder="+880 1XXX-XXXXXX" 
                    value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" required type="email" placeholder="you@example.com" 
                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  />
                </div>
              </div>
            </section>

            <Separator />

            {/* Shipping Info */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Address line</Label>
                  <Input 
                    id="address" required placeholder="House 12, Road 4, Block F, Banani" 
                    value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" required placeholder="Dhaka" 
                    value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input 
                    id="postalCode" required placeholder="1213" 
                    value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} 
                  />
                </div>
              </div>
            </section>

            <Separator />

            {/* Payment Method */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("SSLCOMMERZ")}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${
                    paymentMethod === "SSLCOMMERZ" ? "border-accent bg-accent/5" : "border-border hover:border-accent/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard size={24} className={paymentMethod === "SSLCOMMERZ" ? "text-accent" : "text-muted-foreground"} />
                    <div className="text-left">
                      <p className="font-semibold text-sm">Online Payment</p>
                      <p className="text-xs text-muted-foreground mt-0.5">bKash, Nagad, Visa, Mastercard via SSLCommerz</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "SSLCOMMERZ" ? "border-accent" : "border-muted"
                  }`}>
                    {paymentMethod === "SSLCOMMERZ" && <div className="w-2.5 h-2.5 bg-accent rounded-full" />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${
                    paymentMethod === "COD" ? "border-accent bg-accent/5" : "border-border hover:border-accent/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Banknote size={24} className={paymentMethod === "COD" ? "text-accent" : "text-muted-foreground"} />
                    <div className="text-left">
                      <p className="font-semibold text-sm">Cash on Delivery</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Pay when you receive the order</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "COD" ? "border-accent" : "border-muted"
                  }`}>
                    {paymentMethod === "COD" && <div className="w-2.5 h-2.5 bg-accent rounded-full" />}
                  </div>
                </button>
              </div>
            </section>
          </form>
        </div>

        {/* Right Side - Order Summary */}
        <div className="w-full lg:w-[40%]">
          <Card className="sticky top-24 shadow-lg border-primary/10">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex gap-4">
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0 relative border border-border/50">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-bl-lg flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 py-1">
                      <h4 className="text-sm font-medium line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Size: {item.size}</p>
                      <p className="text-sm font-semibold mt-2">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="mb-4" />

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(totalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">{formatPrice(shippingCost)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                form="checkout-form" 
                size="xl" 
                className="w-full gap-2 bg-accent hover:bg-accent/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <><Loader2 size={18} className="animate-spin" /> Processing...</>
                ) : (
                  <>Pay {formatPrice(grandTotal)} <ArrowRight size={18} /></>
                )}
              </Button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Secure SSL encrypted checkout</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
