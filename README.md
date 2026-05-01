# Gochalo - Modern Men's E-commerce Platform

Gochalo is a premium, high-performance e-commerce platform designed for the modern Bangladeshi man. Built with Next.js 15, it offers a seamless shopping experience for both retail and wholesale (B2B) customers, featuring a sleek design, robust backend, and local payment integration.

## 🚀 Key Features

- **Dynamic Product Catalog**: Real-time product discovery with category filtering and advanced search.
- **Wholesale/B2B Portal**: Exclusive bulk pricing and order management for business partners, unlocked for registered users.
- **Secure Checkout**: Integrated with SSLCommerz for reliable local payments (bKash, Nagad, Card).
- **Responsive Design**: Mobile-first architecture with glassmorphism aesthetics and smooth Framer Motion animations.
- **Advanced Auth**: Role-based access control (USER, WHOLESALE, ADMIN) powered by NextAuth.js.
- **Admin Dashboard**: Comprehensive management interface for products, orders, and user approvals.

## 🛠 Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Backend**: [Prisma ORM](https://www.prisma.io/) with [PostgreSQL](https://www.postgresql.org/)
- **Database Hosting**: [Supabase](https://supabase.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Payment Gateway**: SSLCommerz
- **UI Components**: shadcn/ui

## 📦 Getting Started

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL database (Local or Supabase)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/gochalo-retail-brand-ecommerce-site.git
   cd gochalo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   # Database
   DATABASE_URL="your_transaction_pooler_url"
   DIRECT_URL="your_session_pooler_url"

   # Auth
   NEXTAUTH_SECRET="your_secret_key"
   NEXTAUTH_URL="http://localhost:3000"

   # Payments (SSLCommerz)
   SSLCOMMERZ_STORE_ID="your_id"
   SSLCOMMERZ_STORE_PASSWORD="your_password"
   SSLCOMMERZ_IS_SANDBOX="true"
   ```

4. **Setup Database:**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

## 🚢 Deployment

### Supabase Setup
- Create a new project on Supabase.
- Use the **Session Pooler** URL for `DIRECT_URL` and the **Transaction Pooler** URL for `DATABASE_URL`.
- Ensure you URL-encode special characters in your database password.

### Vercel Deployment
- Import the project to Vercel.
- Configure all environment variables in the Vercel dashboard.
- Set the `NEXTAUTH_URL` to your production domain.

## 📄 License

This project is proprietary and confidential. All rights reserved.

---
Built with ❤️ by the Gochalo Team.
