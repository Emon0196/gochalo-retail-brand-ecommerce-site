"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { name: "T-Shirts", href: "/shop?category=t-shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200" },
  { name: "Shirts", href: "/shop?category=shirts", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200" },
  { name: "Pants", href: "/shop?category=pants", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200" },
  { name: "Polos", href: "/shop?category=polos", image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=200" },
  { name: "Jackets", href: "/shop?category=jackets", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200" },
  { name: "Accessories", href: "/shop?category=accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.totalItems());
  const openCart = useCartStore((s) => s.openCart);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border/50"
          : "bg-white border-b border-border/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 -ml-2 cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>
              GOCHALO
            </h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Home
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setIsShopDropdownOpen(true)}
              onMouseLeave={() => setIsShopDropdownOpen(false)}
            >
              <Link
                href="/shop"
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                Shop <ChevronDown size={14} className={`transition-transform ${isShopDropdownOpen ? "rotate-180" : ""}`} />
              </Link>
              <AnimatePresence>
                {isShopDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white rounded-xl shadow-xl border border-border/50 p-6 grid grid-cols-3 gap-4"
                  >
                    {categories.map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        className="group flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <span className="text-sm font-medium">{cat.name}</span>
                      </Link>
                    ))}
                    <Link
                      href="/shop"
                      className="col-span-3 text-center py-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors border-t mt-2 pt-4"
                    >
                      View All Products →
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/shop?featured=true" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              New Arrivals
            </Link>
            <Link href="/shop?bestseller=true" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Best Sellers
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            <Link href="/shop" className="p-2 text-foreground/70 hover:text-foreground transition-colors hidden sm:flex">
              <Search size={20} />
            </Link>

            {session ? (
              <div className="relative group">
                <button className="p-2 text-foreground/70 hover:text-foreground transition-colors cursor-pointer">
                  <User size={20} />
                </button>
                <div className="absolute right-0 top-full w-48 bg-white rounded-xl shadow-xl border border-border/50 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-2 border-b border-border/50">
                    <p className="text-sm font-medium truncate">{session.user?.name || session.user?.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{(session.user as any)?.role?.toLowerCase()}</p>
                  </div>
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary transition-colors">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link href="/wholesale/catalog" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary transition-colors">
                    <LogOut size={16} className="rotate-180" /> B2B Portal
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary transition-colors w-full text-left text-destructive cursor-pointer"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="p-2 text-foreground/70 hover:text-foreground transition-colors">
                <User size={20} />
              </Link>
            )}

            <button
              onClick={openCart}
              className="p-2 text-foreground/70 hover:text-foreground transition-colors relative cursor-pointer"
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden border-t border-border/30"
          >
            <div className="px-4 py-6 space-y-1 bg-white">
              <Link href="/" className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/shop" className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                Shop All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-secondary pl-8 text-foreground/70"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              <Link href="/shop?featured=true" className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                New Arrivals
              </Link>
              <Link href="/wholesale/catalog" className="block px-4 py-3 text-sm font-medium text-accent rounded-lg hover:bg-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                B2B Portal
              </Link>
              {!session && (
                <div className="pt-4 border-t mt-4">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full" size="lg">Sign In</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
