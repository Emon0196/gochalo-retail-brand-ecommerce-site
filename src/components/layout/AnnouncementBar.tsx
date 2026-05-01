"use client";

import { useEffect, useState } from "react";

const offers = [
  "🚚 Free Delivery on Orders Over ৳2,000",
  "🔥 New Arrivals — Fresh Styles Every Week",
  "💳 Secure Payments with bKash, Nagad & Card",
  "🎁 20% Off Your First Order — Use Code: WELCOME20",
  "📦 Easy Returns Within 7 Days",
];

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-primary text-primary-foreground relative overflow-hidden">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-primary-foreground/60 hover:text-primary-foreground text-xs cursor-pointer"
        aria-label="Close announcement"
      >
        ✕
      </button>
      <div className="flex animate-marquee whitespace-nowrap py-2.5">
        {[...offers, ...offers].map((offer, i) => (
          <span
            key={i}
            className="mx-8 text-xs font-medium tracking-wide"
          >
            {offer}
          </span>
        ))}
      </div>
    </div>
  );
}
