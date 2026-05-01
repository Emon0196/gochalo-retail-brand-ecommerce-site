import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Gochalo — Everyday Essentials for Men",
  description:
    "Shop premium men's clothing at Gochalo. T-shirts, shirts, pants, polos, jackets and accessories. Quality everyday wear with free delivery across Bangladesh.",
  keywords: ["men's clothing", "Bangladesh", "t-shirts", "shirts", "pants", "Gochalo", "fashion"],
  openGraph: {
    title: "Gochalo — Everyday Essentials for Men",
    description: "Premium men's clothing. Quality everyday wear with free delivery across Bangladesh.",
    type: "website",
    locale: "en_US",
    siteName: "Gochalo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
