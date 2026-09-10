"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

interface AdminMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminMobileNav({ isOpen, onClose }: AdminMobileNavProps) {
  // Close drawer on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent body scrolling when open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      className="fixed inset-0 z-50 lg:hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-950/80 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative z-10 flex h-full w-72 max-w-[85vw] flex-col bg-charcoal-950 shadow-2xl animate-in slide-in-from-left duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-4 z-20 rounded-lg p-2 text-sand-400 hover:text-ivory-100 hover:bg-charcoal-850 transition-colors"
          aria-label="Close navigation menu"
        >
          <X size={18} />
        </button>

        <AdminSidebar className="w-full border-r-0" onNavigate={onClose} />
      </div>
    </div>
  );
}
