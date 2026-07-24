"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/user/Navigation";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const defaultPages = new Map<string, boolean>([
    ["/", true],
    ["/courses", true],
    ["/purchases", true],
  ]);

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Navigation />
        <div
          className={cn(
            "absolute top-6 right-6 z-50 md:hidden",
            !defaultPages.has(pathname) && "top-3",
            pathname.includes("lesson") && "top-10",
          )}
        >
          <UserButton />
        </div>
        <main
          className={cn(
            "flex gap-6 flex-1 w-full max-w-375 mx-auto px-4 pb-10 max-md:pb-28 py-6 overflow-y-hidden",
            !defaultPages.has(pathname) && "pt-12",
          )}
        >
          {children}
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
