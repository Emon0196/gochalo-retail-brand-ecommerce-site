import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>
              GOCHALO
            </h2>
            <p className="text-sm text-primary-foreground/60 leading-relaxed">
              Everyday essentials for the modern man. Quality clothing that fits your lifestyle,
              crafted with care for comfort and style.
            </p>
            <div className="flex gap-4">
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: "Shop All", href: "/shop" },
                { label: "New Arrivals", href: "/shop?featured=true" },
                { label: "Best Sellers", href: "/shop?bestseller=true" },
                { label: "T-Shirts", href: "/shop?category=t-shirts" },
                { label: "Shirts", href: "/shop?category=shirts" },
                { label: "Pants", href: "/shop?category=pants" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Customer Care</h3>
            <ul className="space-y-3">
              {[
                { label: "My Account", href: "/dashboard" },
                { label: "Track Order", href: "/dashboard" },
                { label: "Shipping Policy", href: "#" },
                { label: "Returns & Exchanges", href: "#" },
                { label: "Size Guide", href: "#" },
                { label: "FAQs", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-primary-foreground/60">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/60">
                <Phone size={18} className="flex-shrink-0" />
                <span>+880 1XXX-XXXXXX</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/60">
                <Mail size={18} className="flex-shrink-0" />
                <span>hello@gochalo.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} Gochalo. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-xs text-primary-foreground/40">We accept:</span>
              <div className="flex gap-2">
                {["bKash", "Nagad", "Visa", "Mastercard"].map((method) => (
                  <span
                    key={method}
                    className="px-2 py-1 bg-primary-foreground/10 rounded text-[10px] font-medium"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
