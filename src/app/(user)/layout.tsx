import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/user/Navigation";
import { UserButton } from "@clerk/nextjs";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <Navigation />
        <main className="flex gap-6 flex-1 w-full max-w-375 mx-auto px-4 pb-10 max-md:pb-28 py-6 overflow-y-auto">
          {children}
        </main>
        <div className="absolute top-6 right-6">
          <UserButton />
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
