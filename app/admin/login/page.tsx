"use client";

import React, { useActionState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/app/admin/actions";
import Button from "@/components/ui/Button";
import { Lock, Mail, AlertCircle, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin";
  const errorParam = searchParams.get("error");
  const [state, formAction, isPending] = useActionState(loginAction, null);

  // Derive display error either from server action state or query params
  const errorMessage =
    state?.error ||
    (errorParam === "session_expired"
      ? "Your admin session has expired. Please sign in again."
      : errorParam === "unauthorized"
      ? "Unauthorized access: Admin role privileges required."
      : errorParam
      ? "Authentication required to access Studio CMS."
      : null);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-charcoal-950 px-4 py-12 text-ivory-100">
      {/* Background ambient gold aura */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20"
        aria-hidden="true"
      >
        <div className="h-96 w-96 rounded-full bg-gold-500/10 blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium tracking-editorial text-sand-400 uppercase transition-colors hover:text-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-sm"
        >
          <ArrowLeft size={14} /> Return to Studio
        </Link>

        {/* Login Box */}
        <div className="rounded-2xl border border-bronze-border/70 bg-charcoal-900/80 p-8 shadow-card-luxury backdrop-blur-md sm:p-10">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center space-y-3 mb-8">
            <div className="relative h-14 w-14 overflow-hidden rounded-full border border-gold-500/40 p-1 shadow-gold-subtle">
              <Image
                src="/assets/logo/logo.png"
                alt="RK Logo"
                fill
                sizes="56px"
                className="object-contain"
                priority
              />
            </div>
            <div className="space-y-1">
              <h1 className="font-display text-2xl font-light tracking-wide text-ivory-100">
                Studio Management
              </h1>
              <p className="text-xs text-sand-400 font-light tracking-editorial uppercase">
                RK Visual Photography • Admin Portal
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              className="mb-6 flex items-center gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300"
              role="alert"
            >
              <AlertCircle size={16} className="shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form action={formAction} className="space-y-5">
            <input type="hidden" name="redirectTo" value={redirectTo} />

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-xs font-medium tracking-editorial text-sand-300 uppercase"
              >
                Username or Email
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sand-500">
                  <Mail size={16} aria-hidden="true" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="username email"
                  required
                  placeholder="admin or admin@rkvisual.com"
                  className="w-full rounded-xl border border-bronze-border/80 bg-charcoal-950/80 py-2.5 pl-10 pr-4 text-sm text-ivory-100 placeholder-sand-600 transition-colors focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-xs font-medium tracking-editorial text-sand-300 uppercase"
              >
                Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sand-500">
                  <Lock size={16} aria-hidden="true" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-bronze-border/80 bg-charcoal-950/80 py-2.5 pl-10 pr-4 text-sm text-ivory-100 placeholder-sand-600 transition-colors focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isPending}
                className="w-full justify-center"
              >
                Sign In to Studio CMS
              </Button>
            </div>
          </form>
        </div>

        {/* Security Notice */}
        <p className="text-center text-[11px] text-sand-600 tracking-editorial uppercase">
          Protected Area • Authorized Studio Personnel Only
        </p>
      </div>
    </div>
  );
}
