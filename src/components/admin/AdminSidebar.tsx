"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Plane, LayoutDashboard, Package, MapPin, MessageSquare, Settings2,
  FileText, Star, Image, Tag, Megaphone, Users, BarChart3,
  ChevronLeft, ChevronRight, Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types";

const navItems = [
  { label: "Dashboard",    href: "/admin",               icon: LayoutDashboard },
  { label: "Enquiries",    href: "/admin/enquiries",      icon: MessageSquare,  badge: "CRM" },
  { label: "Packages",     href: "/admin/packages",       icon: Package },
  { label: "Destinations", href: "/admin/destinations",   icon: MapPin },
  { label: "Blog",         href: "/admin/blog",           icon: FileText },
  { label: "Testimonials", href: "/admin/testimonials",   icon: Star },
  { label: "Services",     href: "/admin/services",       icon: Globe },
  { label: "Offers",       href: "/admin/offers",         icon: Tag },
  { label: "Banners",      href: "/admin/banners",        icon: Megaphone },
  { label: "Media",        href: "/admin/media",          icon: Image },
  { label: "Users",        href: "/admin/users",          icon: Users,          adminOnly: true },
  { label: "Settings",     href: "/admin/settings",       icon: Settings2,      adminOnly: true },
];

interface Props {
  profile: Pick<Profile, "role" | "full_name" | "email">;
}

export function AdminSidebar({ profile }: Props) {
  const pathname   = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isAdmin = ["super_admin", "admin"].includes(profile.role);
  const visibleNav = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside
      className={cn(
        "flex flex-col bg-vayu-950 text-white transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
      aria-label="Admin navigation"
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-16 border-b border-vayu-800 px-4",
        collapsed ? "justify-center" : "gap-2.5"
      )}>
        <div className="w-8 h-8 rounded-lg bg-vayu-700 flex items-center justify-center shrink-0">
          <Plane className="w-4 h-4 text-white rotate-45" />
        </div>
        {!collapsed && (
          <div className="leading-none overflow-hidden">
            <span className="font-bold text-sm text-white block truncate">Vayu Holidays</span>
            <span className="text-[10px] font-medium tracking-widest uppercase text-vayu-400">Admin</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto no-scrollbar" aria-label="Admin menu">
        <ul className="space-y-0.5 px-2" role="list">
          {visibleNav.map((item) => {
            const isActive = item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-vayu-700 text-white"
                      : "text-vayu-400 hover:bg-vayu-900 hover:text-white",
                    collapsed && "justify-center"
                  )}
                  title={collapsed ? item.label : undefined}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className="w-4.5 h-4.5 shrink-0" />
                  {!collapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-vayu-800 text-vayu-400">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-vayu-800">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-vayu-500 hover:text-white hover:bg-vayu-900 transition-colors text-sm",
            collapsed && "justify-center"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
