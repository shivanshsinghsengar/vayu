"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ExternalLink, LogOut, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import type { Profile } from "@/types";

const ROLE_LABELS: Record<string, string> = {
  super_admin:     "Super Admin",
  admin:           "Admin",
  content_manager: "Content Manager",
  travel_executive:"Travel Executive",
};

interface Props {
  profile: Pick<Profile, "role" | "full_name" | "email">;
}

export function AdminHeader({ profile }: Props) {
  const router   = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out.");
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="h-16 bg-white border-b border-charcoal-100 flex items-center justify-between px-6 shrink-0">
      {/* Left */}
      <div />

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* View site */}
        <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-1.5" /> View Site
          </Link>
        </Button>

        {/* Profile */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-charcoal-100">
          <div className="w-8 h-8 rounded-full bg-vayu-100 flex items-center justify-center text-vayu-700 font-semibold text-sm">
            {profile.full_name?.charAt(0).toUpperCase() ?? <User className="w-4 h-4" />}
          </div>
          <div className="hidden sm:block leading-none">
            <p className="text-xs font-semibold text-charcoal truncate max-w-[120px]">
              {profile.full_name ?? profile.email}
            </p>
            <p className="text-[10px] text-charcoal-400 mt-0.5">
              {ROLE_LABELS[profile.role] ?? profile.role}
            </p>
          </div>
        </div>

        {/* Sign out */}
        <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out" className="text-charcoal-400 hover:text-charcoal">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
