import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[280px_1fr] bg-background">
      <AdminSidebar />
      <main className="p-4 md:p-6 lg:p-8 overflow-y-auto">{children}</main>
    </div>
  );
};
