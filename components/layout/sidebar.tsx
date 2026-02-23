"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Database,
  Users,
  Briefcase,
  LogOut,
  LayoutDashboard,
  PlusCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const menuItems: SidebarItem[] = [
  {
    label: "Add Project",
    href: "/projects?create=true",
    icon: <PlusCircle size={18} />,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  { label: "Master", href: "/master", icon: <Database size={18} /> },
  { label: "Contractors", href: "/contractors", icon: <Users size={18} /> },
  { label: "Projects", href: "/projects", icon: <Briefcase size={18} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("mock_user"); // Cleanup just in case
      router.push("/login");
      // Force reload to clear auth state if needed, though router.push usually suffices if state is reactive
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r z-50 flex flex-col">
      {/* Logo */}
      <div className="flex-none">
        <div className="flex flex-col items-center justify-center gap-4 border-b px-4 py-8">
          <div className="relative w-15 h-15">
            <Image
              src="/logo.png"
              alt="Jal Jeevan Mission Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-xl font-bold text-gray-900 text-center leading-tight">
            Jal Jeevan Mission
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-hidden mt-6">
        <ScrollArea className="h-full px-3">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const isAddProject = item.label === "Add Project";
              const isProjects = item.label === "Projects";
              const isCreateActive = searchParams.get("create") === "true";

              let isActive = false;
              if (isAddProject) {
                isActive = pathname === "/projects" && isCreateActive;
              } else if (isProjects) {
                isActive = pathname === "/projects" && !isCreateActive;
              } else {
                isActive = pathname.startsWith(item.href);
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm mx-auto w-[200px] font-medium transition-colors ${
                    isAddProject
                      ? "bg-[#136FB6] text-white shadow-md shadow-[#136FB6]/20 hover:bg-[#105E9A]"
                      : isActive
                        ? "bg-[#136FB6]/5 text-[#136FB6]"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Bottom Section: Logout */}
      <div className="flex-none p-4 border-t bg-white">
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="gap-2 flex justify-start w-[200px] text-[#136FB6] hover:bg-[#136FB6]/5 rounded-xl font-medium"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
