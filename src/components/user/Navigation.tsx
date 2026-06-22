"use client";

import { LayoutDashboard, Boxes, BookOpen, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Sidebar, SidebarContent } from "../ui/sidebar";

export default function Navigation() {
  const mainNavItems = [
    {
      id: "products",
      label: "Products",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      id: "courses",
      label: "My Courses",
      href: "/courses",
      icon: BookOpen,
    },
    {
      id: "purchases",
      label: "Purchases",
      href: "/purchases",
      icon: Boxes,
    },
  ];

  const { user } = useUser();
  const pathname = usePathname();

  return (
    <>
      <Sidebar>
        <SidebarContent>
          {/* Desktop Sidebar */}
          <aside className="hidden md:flex flex-col py-6 bg-[#161615] h-screen w-72 border-r border-[#252524] shadow-2xl sticky bottom-0 top-0 shrink-0 z-30">
            {/* Brand Header */}
            <div className="px-6 mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                  Course Platform
                </span>
              </div>
            </div>

            {/* Profile Card */}
            <div className="px-4 mb-6">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#201f1f] border border-[#2d2a2a]">
                <div className="w-10 h-10 rounded-full border border-brand-yellow/40 overflow-hidden relative bg-[#2a2a29] shrink-0">
                  <img
                    alt={`${user?.firstName} ${user?.lastName}`}
                    src={user?.imageUrl}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="truncate">
                  <p className="font-semibold text-sm text-white truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-[#c9c8ab] font-medium truncate">
                    {user?.emailAddresses[0].emailAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Navigation Items */}
            <nav className="grow space-y-3 px-2">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const currentPath: string | undefined = pathname.split("/")[1];
                const isSelected = currentPath
                  ? item.id === currentPath
                  : currentPath === undefined && item.id !== "products"
                    ? false
                    : true;

                return (
                  <Link
                    className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 text-left ${
                      isSelected
                        ? "bg-brand-yellow text-[#1c1d00] font-bold shadow-[0_4px_12px_rgba(226,236,0,0.2)]"
                        : "text-[#c8c6c5] hover:text-white hover:bg-[#252524]"
                    }`}
                    href={item.href}
                    key={item.id}
                    id={`nav-${item.id}`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </SidebarContent>
      </Sidebar>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        id="mobile-nav"
        className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-[#131313]/90 backdrop-blur-xl border-t border-[#353534]/40 shadow-2xl rounded-t-2xl"
      >
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isSelected = pathname === item.href;

          return (
            <button key={item.id} id={`m-nav-${item.id}`}>
              <Link
                className={`flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? "text-brand-yellow bg-brand-yellow/10 px-3 py-1 rounded-full"
                    : "text-gray-400 opacity-60 hover:opacity-100"
                }`}
                href={item.href}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-bold mt-1">{item.label}</span>
              </Link>
            </button>
          );
        })}
        <button
          id="m-nav-settings"
          // onClick={() => onChangeView("settings")}
          className={`flex flex-col items-center justify-center transition-all ${
            pathname === "/settings"
              ? "text-brand-yellow bg-brand-yellow/10 px-3 py-1 rounded-full"
              : "text-gray-400 opacity-60 hover:opacity-100"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Settings</span>
        </button>
      </nav>
    </>
  );
}
