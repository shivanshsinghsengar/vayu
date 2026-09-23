import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  MessageSquare, Package, MapPin, FileText,
  Clock, TrendingUp, Plus, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime, STATUS_LABELS } from "@/lib/utils";
import type { Enquiry } from "@/types";

async function getStats() {
  const supabase = await createClient();

  const [totalEnq, newEnq, activePkg, publishedDest, followUp, recentEnq] = await Promise.all([
    supabase.from("enquiries").select("id", { count: "exact", head: true }),
    supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("packages").select("id", { count: "exact", head: true }).eq("is_published", true).is("deleted_at", null),
    supabase.from("destinations").select("id", { count: "exact", head: true }).eq("is_published", true).is("deleted_at", null),
    supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "follow_up"),
    supabase.from("enquiries").select("id, name, destination, status, created_at, package_id").order("created_at", { ascending: false }).limit(8),
  ]);

  return {
    totalEnquiries:  totalEnq.count ?? 0,
    newEnquiries:    newEnq.count ?? 0,
    activePackages:  activePkg.count ?? 0,
    destinations:    publishedDest.count ?? 0,
    followUps:       followUp.count ?? 0,
    recentEnquiries: (recentEnq.data ?? []) as Enquiry[],
  };
}

const STATUS_COLORS_MAP: Record<string, string> = {
  new:        "bg-blue-100 text-blue-700",
  contacted:  "bg-yellow-100 text-yellow-700",
  qualified:  "bg-purple-100 text-purple-700",
  quote_sent: "bg-indigo-100 text-indigo-700",
  follow_up:  "bg-orange-100 text-orange-700",
  booked:     "bg-green-100 text-green-700",
  lost:       "bg-red-100 text-red-700",
  closed:     "bg-gray-100 text-gray-600",
};

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    { label: "Total Enquiries",    value: stats.totalEnquiries, icon: MessageSquare, href: "/admin/enquiries",      color: "bg-blue-50 text-blue-700" },
    { label: "New Enquiries",      value: stats.newEnquiries,   icon: TrendingUp,    href: "/admin/enquiries?status=new", color: "bg-vayu-50 text-vayu-700" },
    { label: "Active Packages",    value: stats.activePackages, icon: Package,       href: "/admin/packages",       color: "bg-amber-50 text-amber-700" },
    { label: "Destinations",       value: stats.destinations,   icon: MapPin,        href: "/admin/destinations",   color: "bg-emerald-50 text-emerald-700" },
    { label: "Pending Follow-ups", value: stats.followUps,      icon: Clock,         href: "/admin/enquiries?status=follow_up", color: "bg-orange-50 text-orange-700" },
  ];

  const quickActions = [
    { label: "Add Package",     href: "/admin/packages/new",     icon: Plus },
    { label: "Add Destination", href: "/admin/destinations/new", icon: Plus },
    { label: "Add Blog Post",   href: "/admin/blog/new",         icon: Plus },
    { label: "View Enquiries",  href: "/admin/enquiries",        icon: Eye },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Dashboard</h1>
        <p className="text-sm text-charcoal-400 mt-1">Overview of your travel business</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-2xl p-5 border border-charcoal-100 shadow-card hover:shadow-card-md transition-all duration-200 hover:-translate-y-0.5 group"
          >
            <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-charcoal">{card.value}</p>
            <p className="text-xs text-charcoal-400 mt-1 group-hover:text-vayu-700 transition-colors">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Enquiries */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-charcoal-100 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-100">
            <h2 className="font-semibold text-charcoal text-sm">Recent Enquiries</h2>
            <Link href="/admin/enquiries" className="text-xs text-vayu-700 font-medium hover:text-vayu-900 transition-colors">
              View all →
            </Link>
          </div>

          {stats.recentEnquiries.length === 0 ? (
            <div className="py-12 text-center text-charcoal-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No enquiries yet</p>
            </div>
          ) : (
            <div className="divide-y divide-charcoal-100">
              {stats.recentEnquiries.map((enq) => (
                <Link
                  key={enq.id}
                  href={`/admin/enquiries/${enq.id}`}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-off-white transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-charcoal text-sm truncate">{enq.name}</p>
                    <p className="text-xs text-charcoal-400 mt-0.5 truncate">
                      {enq.destination ?? "Destination not specified"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS_MAP[enq.status] ?? ""}`}>
                      {STATUS_LABELS[enq.status] ?? enq.status}
                    </span>
                    <span className="text-xs text-charcoal-400 hidden sm:block">
                      {formatRelativeTime(enq.created_at)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-charcoal-100 shadow-card p-6">
          <h2 className="font-semibold text-charcoal text-sm mb-4">Quick Actions</h2>
          <div className="space-y-2.5">
            {quickActions.map((action) => (
              <Button key={action.href} asChild variant="outline" size="default" className="w-full justify-start gap-2">
                <Link href={action.href}>
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
