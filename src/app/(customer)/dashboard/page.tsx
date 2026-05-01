import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Package, Clock, AlertTriangle } from "lucide-react";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const resolvedParams = await searchParams;
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  // Fetch recent orders
  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  } catch (e) {
    console.error("Failed to fetch orders", e);
  }

  const isWholesalePending = resolvedParams.status === "pending_approval";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ fontFamily: "var(--font-serif)" }}>
          My Account
        </h1>
        <p className="text-muted-foreground">Welcome back, {session.user.name || session.user.email}</p>
      </div>

      {isWholesalePending && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 mb-8 flex items-start gap-3">
          <AlertTriangle className="text-amber-500 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold">Wholesale Account Pending Approval</h3>
            <p className="text-sm mt-1">
              Your wholesale account is currently under review by our admin team. You will not be able to access wholesale catalogs or pricing until approved. This usually takes 1-2 business days.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User size={20} className="text-muted-foreground" /> Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{session.user.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{session.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Type</p>
                <div className="mt-1">
                  <Badge variant={(session.user as any).role === "WHOLESALE" ? "accent" : "secondary"}>
                    {(session.user as any).role}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order History */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package size={20} className="text-muted-foreground" /> Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Clock size={32} className="mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-sm">Order #{order.id.slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-sm">{formatPrice(order.total)}</p>
                          <Badge 
                            variant="outline" 
                            className={`mt-1 text-[10px] ${
                              order.status === "PAID" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                              order.status === "CANCELLED" ? "bg-red-50 text-red-600 border-red-200" :
                              "bg-amber-50 text-amber-600 border-amber-200"
                            }`}
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
