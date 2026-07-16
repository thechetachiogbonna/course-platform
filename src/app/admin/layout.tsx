import Navigation from "@/components/admin/Navigation";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen overflow-hidden">
        <Navigation />
        <main className="flex gap-6 flex-1 w-full max-w-7xl mx-auto px-4 pb-10 max-md:pb-28 py-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
