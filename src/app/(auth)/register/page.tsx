"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "USER" as "USER" | "WHOLESALE",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setSuccess(data.message);
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="lg:hidden text-center mb-8">
        <Link href="/">
          <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>
            GOCHALO
          </h1>
        </Link>
      </div>

      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Create an account</h2>
        <p className="text-muted-foreground">
          Join Gochalo for exclusive deals and easy shopping
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 text-emerald-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2"
          >
            <CheckCircle size={16} /> {success}
          </motion.div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            placeholder="Your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone number (optional)</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+880 1XXX-XXXXXX"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Account Type */}
        <div className="space-y-3">
          <Label>Account type</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "USER" })}
              className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                formData.role === "USER"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <p className="text-sm font-semibold">Retail</p>
              <p className="text-xs text-muted-foreground mt-1">Personal shopping</p>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "WHOLESALE" })}
              className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                formData.role === "WHOLESALE"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <p className="text-sm font-semibold">Wholesale</p>
              <p className="text-xs text-muted-foreground mt-1">Bulk orders</p>
            </button>
          </div>
          {formData.role === "WHOLESALE" && (
            <p className="text-xs text-accent">
              Wholesale accounts require admin approval before accessing wholesale pricing.
            </p>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin mr-2" /> Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-8">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-foreground font-semibold hover:text-accent transition-colors"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
