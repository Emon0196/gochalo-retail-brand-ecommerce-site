"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { Star, ShoppingBag, Plus, Minus, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

// Remove mockProduct

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.product) {
          const dbProduct = data.product;
          setProduct({
            id: dbProduct.id,
            name: dbProduct.name,
            slug: dbProduct.slug,
            price: dbProduct.retailPrice,
            originalPrice: dbProduct.retailPrice * 1.2,
            description: dbProduct.description,
            images: dbProduct.images && dbProduct.images.length > 0 ? dbProduct.images : ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"],
            sizes: dbProduct.variants ? Array.from(new Set(dbProduct.variants.map((v: any) => v.size))) : ["S", "M", "L", "XL"],
            variants: dbProduct.variants,
            inStock: true,
            rating: 4.8,
            reviews: 124,
          });
        }
        setLoading(false);
      });
  }, [slug]);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const handleAddToCart = () => {
    if (!selectedSize) return;

    const variant = product.variants?.find((v: any) => v.size === selectedSize);

    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      size: selectedSize,
      variantId: variant?.id || undefined,
      slug: product.slug,
      quantity,
    });
    
    openCart();
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-24 text-center">Loading...</div>;
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-24 text-center">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Product Images */}
        <div className="w-full lg:w-1/2 space-y-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="aspect-[4/5] bg-secondary rounded-2xl overflow-hidden"
          >
            <img 
              src={product.images[activeImage]} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img: string, i: number) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-colors ${
                  activeImage === i ? "border-accent" : "border-transparent"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">Best Seller</Badge>
              <div className="flex items-center gap-1 text-sm">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2" style={{ fontFamily: "var(--font-serif)" }}>
              {product.name}
            </h1>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Size</h3>
                <button className="text-sm text-accent underline underline-offset-4">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border flex items-center justify-center font-medium transition-colors ${
                      selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50 text-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="text-sm text-destructive mt-2 hidden" id="size-error">Please select a size</p>
              )}
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border rounded-lg h-12">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 hover:bg-secondary transition-colors h-full"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 font-medium min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 hover:bg-secondary transition-colors h-full"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <Button 
                size="xl" 
                className="flex-1 gap-2"
                disabled={!selectedSize}
                onClick={handleAddToCart}
              >
                <ShoppingBag size={18} /> Add to Cart
              </Button>
            </div>

            <div className="space-y-4 py-6 border-t border-b mb-8">
              <div className="flex items-center gap-3 text-sm">
                <Truck size={18} className="text-muted-foreground" />
                <span>Free delivery on orders over ৳2,000</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw size={18} className="text-muted-foreground" />
                <span>7-day easy returns policy</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <ShieldCheck size={18} className="text-muted-foreground" />
                <span>Secure payment with bKash, Nagad & Cards</span>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
