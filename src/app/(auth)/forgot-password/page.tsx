"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setSuccess(true);
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

      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail size={28} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold">Check your email</h2>
          <p className="text-muted-foreground">
            We&apos;ve sent a password reset link to <strong>{email}</strong>. 
            Please check your inbox and follow the instructions.
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            Didn&apos;t receive the email? Check your spam folder or try again.
          </p>
          <div className="pt-4 space-y-3">
            <Button onClick={() => setSuccess(false)} variant="outline" className="w-full">
              Try a different email
            </Button>
            <Link href="/login" className="block">
              <Button variant="ghost" className="w-full">
                <ArrowLeft size={16} className="mr-2" /> Back to sign in
              </Button>
            </Link>
          </div>
        </motion.div>
      ) : (
        <>
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> Back to sign in
          </Link>

          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Forgot your password?</h2>
            <p className="text-muted-foreground">
              No worries! Enter your email and we&apos;ll send you a reset link.
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

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" /> Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </>
      )}
    </motion.div>
  );
}
