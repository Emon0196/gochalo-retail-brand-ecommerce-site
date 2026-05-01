import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Download, Info } from "lucide-react";

// Mock data for wholesale
const wholesaleProducts = [
  { id: "1", name: "Classic Cotton Crew Tee (Pack of 12)", sku: "TEE-W-12", retailPrice: 10200, wholesalePrice: 6000, moq: 5 },
  { id: "2", name: "Oxford Button-Down Shirt (Pack of 6)", sku: "OXF-W-6", retailPrice: 9900, wholesalePrice: 5400, moq: 3 },
  { id: "3", name: "Premium Polo Shirt (Pack of 10)", sku: "POL-W-10", retailPrice: 12500, wholesalePrice: 7500, moq: 5 },
  { id: "4", name: "Slim Fit Chinos (Pack of 5)", sku: "CHI-W-5", retailPrice: 7250, wholesalePrice: 4500, moq: 4 },
];

export default function WholesaleCatalogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b pb-8">
        <div>
          <Badge variant="accent" className="mb-3">Wholesale Exclusive</Badge>
          <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>
            B2B Catalog
          </h1>
          <p className="text-muted-foreground mt-2">
            Order in bulk with exclusive wholesale pricing. Minimum Order Quantities (MOQ) apply.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download size={16} /> Download Price List
        </Button>
      </div>

      <div className="bg-primary/5 rounded-xl p-4 mb-8 flex items-start gap-3">
        <Info className="text-primary mt-0.5" size={20} />
        <div>
          <p className="text-sm">
            Wholesale orders are currently processed manually. Please contact your account manager to place an order or request an invoice. Direct checkout for wholesale will be available soon.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/50 text-muted-foreground uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4 rounded-tl-xl">Product</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4 text-center">MOQ</th>
              <th className="px-6 py-4 text-right">Retail Value</th>
              <th className="px-6 py-4 text-right">Wholesale Price</th>
              <th className="px-6 py-4 rounded-tr-xl text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {wholesaleProducts.map((product) => {
              const margin = Math.round(((product.retailPrice - product.wholesalePrice) / product.retailPrice) * 100);
              return (
                <tr key={product.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <Package size={18} className="text-muted-foreground" />
                    </div>
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{product.sku}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center bg-secondary rounded-md px-2 py-1 text-xs font-medium">
                      {product.moq} Units
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground line-through">
                    {formatPrice(product.retailPrice)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-bold text-base text-accent">{formatPrice(product.wholesalePrice)}</div>
                    <div className="text-[10px] text-emerald-600 font-medium">+{margin}% Margin</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button size="sm" variant="outline">Add to Quote</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
