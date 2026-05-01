"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Invalid Reset Link</h2>
        <p className="text-muted-foreground">
          This password reset link is invalid or has expired.
        </p>
        <Link href="/forgot-password">
          <Button>Request a New Link</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={28} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold">Password Reset!</h2>
        <p className="text-muted-foreground">
          Your password has been successfully updated. Redirecting to sign in...
        </p>
        <Link href="/login">
          <Button className="mt-4">Go to Sign In</Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <>
      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Set new password</h2>
        <p className="text-muted-foreground">
          Enter your new password below.
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
          <Label htmlFor="password">New password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm new password</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin mr-2" /> Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
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
      <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </motion.div>
  );
}
