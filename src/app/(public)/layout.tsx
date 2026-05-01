import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartSheet from "@/components/cart/CartSheet";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <CartSheet />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
