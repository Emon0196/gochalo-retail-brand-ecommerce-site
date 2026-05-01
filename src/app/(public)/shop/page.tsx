import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingBag, Filter } from "lucide-react";

import { prisma } from "@/lib/prisma";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category as string;
  const sort = resolvedParams.sort as string;

  const whereClause = category ? { category: { slug: category } } : {};
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-low") orderBy = { retailPrice: "asc" };
  else if (sort === "price-high") orderBy = { retailPrice: "desc" };
  else if (sort === "popular") orderBy = { isBestSeller: "desc" };

  const dbProducts = await prisma.product.findMany({
    where: whereClause,
    orderBy,
    include: { variants: true }
  });

  const products = dbProducts.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.retailPrice,
    originalPrice: p.retailPrice * 1.2,
    image: p.images?.[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
    isNew: p.isNew,
    rating: 4.8,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>
            {category ? category.charAt(0).toUpperCase() + category.slice(1) : "All Products"}
          </h1>
          <p className="text-muted-foreground mt-2">Showing {products.length} products</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none gap-2">
            <Filter size={16} /> Filters
          </Button>
          <select 
            className="flex h-10 w-full md:w-[200px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            defaultValue={sort || "newest"}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 space-y-8 flex-shrink-0">
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h3>
            <ul className="space-y-2">
              {['All', 'T-Shirts', 'Shirts', 'Pants', 'Polos', 'Jackets', 'Accessories'].map(cat => (
                <li key={cat}>
                  <Link 
                    href={cat === 'All' ? '/shop' : `/shop?category=${cat.toLowerCase()}`}
                    className={`text-sm ${
                      (category === cat.toLowerCase() || (!category && cat === 'All'))
                        ? 'text-accent font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    } transition-colors`}
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Price Range</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300 text-accent focus:ring-accent" />
                <span className="text-sm text-muted-foreground">Under ৳1,000</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300 text-accent focus:ring-accent" />
                <span className="text-sm text-muted-foreground">৳1,000 - ৳2,000</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300 text-accent focus:ring-accent" />
                <span className="text-sm text-muted-foreground">Over ৳2,000</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 lg:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group">
              <Link href={`/shop/${product.slug}`} className="block">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {product.isNew && (
                    <Badge variant="accent" className="absolute top-3 left-3">New</Badge>
                  )}
                  {/* Quick Add (simulate) */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Button
                      className="w-full bg-white/95 text-primary hover:bg-white gap-2 backdrop-blur-sm"
                    >
                      <ShoppingBag size={16} /> Quick Add
                    </Button>
                  </div>
                </div>
              </Link>
              <div className="space-y-1.5 px-1">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"} />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">{product.rating}</span>
                </div>
                <Link href={`/shop/${product.slug}`}>
                  <h3 className="text-sm font-medium group-hover:text-accent transition-colors line-clamp-1">{product.name}</h3>
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{formatPrice(product.price)}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
