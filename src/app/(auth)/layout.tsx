export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Brand visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"
            alt="Gochalo Store"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <div>
            <h1 className="text-4xl font-bold tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>
              GOCHALO
            </h1>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
              Everyday Essentials<br />for the Modern Man
            </h2>
            <p className="text-primary-foreground/70 text-lg max-w-md">
              Quality clothing that fits your lifestyle. From daily basics to statement pieces.
            </p>
          </div>
          <div className="flex gap-8">
            <div>
              <p className="text-2xl font-bold">500+</p>
              <p className="text-sm text-primary-foreground/60">Products</p>
            </div>
            <div>
              <p className="text-2xl font-bold">10K+</p>
              <p className="text-sm text-primary-foreground/60">Happy Customers</p>
            </div>
            <div>
              <p className="text-2xl font-bold">4.8★</p>
              <p className="text-sm text-primary-foreground/60">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
