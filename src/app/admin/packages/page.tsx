import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDuration, PACKAGE_CATEGORY_LABELS } from "@/lib/utils";
import { PackageTogglePublish } from "@/components/admin/PackageTogglePublish";
import type { Package } from "@/types";

async function getPackages(): Promise<Package[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("packages")
    .select("*, destination:destinations(name, slug)")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });
  return (data ?? []) as Package[];
}

export default async function AdminPackagesPage() {
  const packages = await getPackages();

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Packages</h1>
          <p className="text-sm text-charcoal-400 mt-1">{packages.length} packages</p>
        </div>
        <Button asChild>
          <Link href="/admin/packages/new"><Plus className="w-4 h-4 mr-1.5" /> New Package</Link>
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-charcoal-100 shadow-card overflow-hidden">
        {packages.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-charcoal-400 text-sm mb-4">No packages yet.</p>
            <Button asChild size="sm"><Link href="/admin/packages/new">Create First Package</Link></Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal-100 bg-off-white">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Package</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-charcoal-400 uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-charcoal-400 uppercase tracking-wider hidden lg:table-cell">Duration</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-charcoal-400 uppercase tracking-wider hidden lg:table-cell">Price</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-off-white transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-charcoal">{pkg.title}</p>
                        {pkg.destination && (
                          <p className="text-xs text-charcoal-400">{pkg.destination.name}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <Badge variant="sand" className="text-xs">
                        {PACKAGE_CATEGORY_LABELS[pkg.category] ?? pkg.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-charcoal-500 text-xs">
                      {formatDuration(pkg.duration_nights, pkg.duration_days)}
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-charcoal-600 text-sm">
                      {pkg.price_starting_from
                        ? `₹${Number(pkg.price_starting_from).toLocaleString("en-IN")}`
                        : "On Request"}
                    </td>
                    <td className="py-3 px-4">
                      <PackageTogglePublish id={pkg.id} isPublished={pkg.is_published} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 justify-end">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/packages/${pkg.id}/edit`}><Edit className="w-3.5 h-3.5" /></Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/packages/${pkg.slug}`} target="_blank"><Eye className="w-3.5 h-3.5" /></Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
