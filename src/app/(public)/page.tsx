"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
  Star,
  ChevronRight,
  Timer,
} from "lucide-react";
import { useState, useEffect } from "react";

/* ─── sample data (replaced by DB in production) ─── */
const categories = [
  { name: "T-Shirts", slug: "t-shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", count: 48 },
  { name: "Shirts", slug: "shirts", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80", count: 36 },
  { name: "Pants", slug: "pants", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80", count: 28 },
  { name: "Polos", slug: "polos", image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&q=80", count: 22 },
  { name: "Jackets", slug: "jackets", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80", count: 18 },
  { name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", count: 32 },
];

// removed mock products

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

/* ─────────── PAGE ─────────── */
export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const mapped = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.retailPrice,
            originalPrice: p.retailPrice * 1.2,
            image: p.images?.[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
            isNew: p.isNew,
            isBestSeller: p.isBestSeller,
            rating: 4.8,
          }));
          setProducts(mapped);
        } else {
          console.error("Expected array from /api/products, got:", data);
        }
      })
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  return (
    <>
      <HeroSection />
      <TrustBar />
      <CategoriesSection />
      <NewArrivalsSection products={products} />
      <OfferBanner />
      <BestSellersSection products={products} />
      <BrandStorySection />
      <NewsletterSection />
    </>
  );
}

/* ─── HERO ─── */
function HeroSection() {
  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden bg-primary">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1600&q=80"
          alt="Men's fashion"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <Badge variant="accent" className="mb-6 text-sm px-4 py-1.5">
            New Season Collection
          </Badge>
          <h1
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Dress for<br />
            <span className="text-[#c8a97e]">Every Day</span>
          </h1>
          <p className="text-lg text-white/70 mb-8 max-w-md leading-relaxed">
            Quality essentials that fit your style and your life. Premium men&apos;s
            clothing delivered across Bangladesh.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/shop">
              <Button size="xl" className="bg-white text-primary hover:bg-white/90 gap-2">
                Shop Now <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/shop?featured=true">
              <Button size="xl" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                New Arrivals
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2.5 bg-white/60 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}

/* ─── TRUST BAR ─── */
function TrustBar() {
  const items = [
    { icon: Truck, label: "Free Delivery", sub: "On orders over ৳2,000" },
    { icon: Shield, label: "Secure Payment", sub: "bKash, Nagad & Card" },
    { icon: RotateCcw, label: "Easy Returns", sub: "7-day return policy" },
    { icon: Star, label: "Premium Quality", sub: "Guaranteed satisfaction" },
  ];
  return (
    <section className="border-b bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <item.icon size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CATEGORIES ─── */
function CategoriesSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: "var(--font-serif)" }}>
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Find exactly what you&apos;re looking for — from casual basics to smart essentials.
          </p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {categories.map((cat, i) => (
            <motion.div key={cat.slug} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.1 }}>
              <Link
                href={`/shop?category=${cat.slug}`}
                className="group relative block aspect-[4/5] rounded-2xl overflow-hidden bg-secondary"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-bold mb-1">{cat.name}</h3>
                  <p className="text-white/60 text-sm flex items-center gap-1">
                    {cat.count} Products <ChevronRight size={14} />
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── NEW ARRIVALS ─── */
function NewArrivalsSection({ products }: { products: any[] }) {
  const openCart = useCartStore((s) => s.openCart);
  const addItem = useCartStore((s) => s.addItem);
  const newProducts = products.filter((p) => p.isNew).slice(0, 4);

  const handleQuickAdd = (product: any) => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      size: "M",
      slug: product.slug,
      quantity: 1,
    });
    openCart();
  };

  return (
    <section className="py-20 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="flex items-end justify-between mb-12">
          <div>
            <Badge variant="accent" className="mb-3">Just Dropped</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "var(--font-serif)" }}>
              New Arrivals
            </h2>
          </div>
          <Link href="/shop?featured=true" className="hidden sm:flex items-center gap-1 text-sm font-medium hover:text-accent transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {newProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} onQuickAdd={() => handleQuickAdd(product)} />
          ))}
        </div>
        <div className="sm:hidden text-center mt-8">
          <Link href="/shop?featured=true">
            <Button variant="outline" className="gap-2">View All New Arrivals <ArrowRight size={16} /></Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── OFFER BANNER ─── */
function OfferBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e] to-[#16213e]" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div {...fadeUp}>
          <Badge className="bg-accent/20 text-accent border-accent/30 mb-6 text-sm px-4 py-1.5">
            <Timer size={14} className="mr-1" /> Limited Time Offer
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-serif)" }}>
            Up to 30% Off Everything
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-lg mx-auto">
            Use code <span className="font-bold text-accent">WELCOME20</span> at checkout for an extra 20% off your first order.
          </p>
          {/* Countdown */}
          <div className="flex justify-center gap-4 mb-10">
            {Object.entries(timeLeft).map(([label, value]) => (
              <div key={label} className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    {String(value).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-xs text-white/40 mt-2 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
          <Link href="/shop">
            <Button size="xl" className="bg-accent hover:bg-accent/90 text-white gap-2">
              Shop the Sale <ArrowRight size={18} />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── BEST SELLERS ─── */
function BestSellersSection({ products }: { products: any[] }) {
  const openCart = useCartStore((s) => s.openCart);
  const addItem = useCartStore((s) => s.addItem);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  if (bestSellers.length === 0) {
    bestSellers.push(...products.slice(0, 4));
  }

  const handleQuickAdd = (product: any) => {
    addItem({
      id: product.id, productId: product.id, name: product.name,
      image: product.image, price: product.price, size: "M", slug: product.slug, quantity: 1,
    });
    openCart();
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="flex items-end justify-between mb-12">
          <div>
            <Badge variant="secondary" className="mb-3">Most Popular</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "var(--font-serif)" }}>
              Best Sellers
            </h2>
          </div>
          <Link href="/shop?bestseller=true" className="hidden sm:flex items-center gap-1 text-sm font-medium hover:text-accent transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {bestSellers.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} onQuickAdd={() => handleQuickAdd(product)} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── BRAND STORY ─── */
function BrandStorySection() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp} className="space-y-6">
            <Badge variant="outline" className="text-sm">Our Story</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
              Built for the<br />Everyday Man
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              At Gochalo, we believe great style shouldn&apos;t be complicated. We create
              quality everyday clothing for men who value comfort, fit, and simplicity.
              Every piece is designed to be versatile — from office to weekend, morning to night.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Based in Dhaka, we&apos;re proud to serve customers across Bangladesh with
              fast delivery, easy returns, and styles that keep up with your life.
            </p>
            <Link href="/shop">
              <Button variant="outline" size="lg" className="gap-2 mt-2">
                Explore Collection <ArrowRight size={16} />
              </Button>
            </Link>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden aspect-[3/4]">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80" alt="Gochalo lifestyle" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-square">
                <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&q=80" alt="Gochalo style" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="rounded-2xl overflow-hidden aspect-square">
                <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&q=80" alt="Gochalo quality" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[3/4]">
                <img src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=500&q=80" alt="Gochalo craft" className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── NEWSLETTER ─── */
function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeUp}
          className="relative rounded-3xl bg-primary text-primary-foreground p-10 sm:p-16 text-center overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              Join the Gochalo Club
            </h2>
            <p className="text-primary-foreground/60 mb-8 max-w-md mx-auto">
              Subscribe for exclusive deals, early access to new drops, and 10% off your next order.
            </p>
            {submitted ? (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-accent font-medium text-lg">
                ✓ You&apos;re in! Check your inbox for your discount code.
              </motion.p>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 h-12"
                />
                <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-white whitespace-nowrap">
                  Get 10% Off
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── PRODUCT CARD ─── */
function ProductCard({
  product,
  index,
  onQuickAdd,
}: {
  product: any;
  index: number;
  onQuickAdd: () => void;
}) {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  return (
    <motion.div {...fadeUp} transition={{ duration: 0.6, delay: index * 0.1 }} className="group">
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
          {discount > 0 && (
            <Badge variant="destructive" className="absolute top-3 right-3">-{discount}%</Badge>
          )}
          {/* Quick add overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button
              onClick={(e) => { e.preventDefault(); onQuickAdd(); }}
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
    </motion.div>
  );
}
