"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, LogOut, ExternalLink, ShieldCheck, User } from "lucide-react";
import AdminBreadcrumbs from "./AdminBreadcrumbs";
import AdminMobileNav from "./AdminMobileNav";
import { logoutAction } from "@/app/admin/actions";
import { useAdminConfirm } from "./AdminConfirmDialog";

interface AdminHeaderProps {
  userEmail?: string;
  userName?: string;
}

export default function AdminHeader({ userEmail, userName }: AdminHeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const confirm = useAdminConfirm();

  const handleSignOut = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const shouldSignOut = await confirm({
      title: "Sign Out of Studio CMS?",
      message: "You will need to re-authenticate to manage portfolio content, galleries, or inquiries.",
      confirmText: "Sign Out",
      variant: "warning",
    });

    if (shouldSignOut) {
      await logoutAction();
    }
  };

  const displayName = userName || userEmail?.split("@")[0] || "Admin";

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-bronze-border/60 bg-charcoal-950/80 px-4 sm:px-6 backdrop-blur-md">
        {/* Left Side: Mobile Menu Button + Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="rounded-lg p-2 text-sand-400 hover:text-ivory-100 hover:bg-charcoal-900 lg:hidden transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>

          <AdminBreadcrumbs />
        </div>

        {/* Right Side: Quick Site Link & Admin Profile Pill */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-bronze-border bg-charcoal-900 px-3 py-1 text-xs font-medium tracking-editorial text-sand-300 hover:border-gold-500/40 hover:text-ivory-100 transition-colors"
          >
            <span>Live Studio</span>
            <ExternalLink size={12} />
          </Link>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 rounded-full border border-bronze-border/80 bg-charcoal-900/90 py-1 pl-1.5 pr-2.5 shadow-sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-charcoal-800 text-gold-400 border border-gold-500/30">
              <User size={14} />
            </div>

            <div className="hidden md:flex flex-col text-left leading-none">
              <span className="text-xs font-medium text-ivory-100 truncate max-w-[130px]">
                {displayName}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-gold-400 flex items-center gap-1 mt-0.5">
                <ShieldCheck size={9} />
                ADMIN
              </span>
            </div>

            {/* Sign Out Trigger with Confirmation */}
            <form onSubmit={handleSignOut} className="ml-1 border-l border-bronze-border/60 pl-1.5">
              <button
                type="submit"
                className="flex h-6 w-6 items-center justify-center rounded-full text-sand-500 hover:bg-charcoal-800 hover:text-red-400 transition-colors"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut size={13} />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AdminMobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
    </>
  );
}
