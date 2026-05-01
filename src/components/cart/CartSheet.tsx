"use client";

import { useCartStore, type CartItem } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";

export default function CartSheet() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, clearCart } =
    useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          {/* Sheet */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} />
                <h2 className="text-lg font-semibold">Your Cart</h2>
                <span className="text-sm text-muted-foreground">
                  ({items.length} {items.length === 1 ? "item" : "items"})
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-secondary rounded-lg transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-muted-foreground/30 mb-4" />
                  <p className="text-lg font-medium mb-2">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Looks like you haven&apos;t added anything yet.
                  </p>
                  <Button onClick={closeCart} asChild>
                    <Link href="/shop">Start Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItemCard
                      key={`${item.productId}-${item.size}`}
                      item={item}
                      onRemove={() => removeItem(item.productId, item.size)}
                      onUpdateQuantity={(qty) =>
                        updateQuantity(item.productId, item.size, qty)
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-lg font-semibold">{formatPrice(totalPrice())}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping calculated at checkout
                </p>
                <Button asChild size="lg" className="w-full" onClick={closeCart}>
                  <Link href="/checkout" className="flex items-center gap-2">
                    Checkout <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CartItemCard({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: CartItem;
  onRemove: () => void;
  onUpdateQuantity: (qty: number) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-4 p-3 rounded-xl bg-secondary/30"
    >
      <Link href={`/shop/${item.slug}`} className="w-20 h-24 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/shop/${item.slug}`} className="text-sm font-medium truncate block hover:text-accent transition-colors">
          {item.name}
        </Link>
        <p className="text-xs text-muted-foreground mt-0.5">Size: {item.size}</p>
        <p className="text-sm font-semibold mt-1">{formatPrice(item.price)}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              className="p-1.5 hover:bg-secondary transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="px-3 text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              className="p-1.5 hover:bg-secondary transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
          <button
            onClick={onRemove}
            className="p-1.5 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
            aria-label="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
