import Navigation from "@/components/admin/Navigation";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-screen overflow-hidden">
      <Navigation />
      <main className="flex gap-6 flex-1 w-full max-w-7xl mx-auto px-4 py-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
