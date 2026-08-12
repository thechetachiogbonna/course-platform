"use client";

import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/user/Navigation";
import { cn } from "@/lib/utils";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const lessonPage =
    pathname.split("/")[1] === "courses" && pathname.includes("lesson");

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
          <Show when="signed-in">
            <UserButton />
          </Show>

          {!lessonPage && (
            <Show when="signed-out">
              <SignInButton mode="redirect">
                <Button
                  variant="default"
                  size="lg"
                  className="bg-brand-yellow text-black hover:bg-brand-yellow/90 border-transparent shadow-[0_8px_24px_rgba(229,226,0,0.18)] px-4 py-2"
                >
                  Log In
                </Button>
              </SignInButton>
            </Show>
          )}
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
