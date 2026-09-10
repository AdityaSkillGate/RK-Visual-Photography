import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/app/admin/actions";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { AdminToastProvider } from "@/components/admin/AdminToastContext";
import { AdminConfirmProvider } from "@/components/admin/AdminConfirmDialog";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // Route protection & session expiration handling
  if (!session?.user) {
    redirect("/admin/login?error=session_expired");
  }

  // Strict Single Role Check: User must be an ADMIN
  if (session.profile?.role !== "admin") {
    redirect("/admin/login?error=unauthorized");
  }

  return (
    <AdminToastProvider>
      <AdminConfirmProvider>
        <div className="flex min-h-screen bg-charcoal-950 text-ivory-100 font-sans antialiased selection:bg-gold-500/30 selection:text-gold-200">
          {/* Desktop Fixed Sidebar */}
          <div className="hidden lg:block shrink-0 sticky top-0 h-screen z-20">
            <AdminSidebar />
          </div>

          {/* Main Area */}
          <div className="flex flex-1 flex-col min-w-0">
            <AdminHeader
              userEmail={session.user.email}
              userName={session.profile?.full_name || undefined}
            />

            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {children}
            </main>
          </div>
        </div>
      </AdminConfirmProvider>
    </AdminToastProvider>
  );
}
