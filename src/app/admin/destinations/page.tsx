import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DestinationTogglePublish } from "@/components/admin/DestinationTogglePublish";
import type { Destination } from "@/types";

async function getDestinations(): Promise<Destination[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("destinations")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });
  return (data ?? []) as Destination[];
}

export default async function AdminDestinationsPage() {
  const destinations = await getDestinations();

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Destinations</h1>
          <p className="text-sm text-charcoal-400 mt-1">{destinations.length} destinations</p>
        </div>
        <Button asChild>
          <Link href="/admin/destinations/new"><Plus className="w-4 h-4 mr-1.5" /> New Destination</Link>
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-charcoal-100 shadow-card overflow-hidden">
        {destinations.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-charcoal-400 text-sm mb-4">No destinations yet.</p>
            <Button asChild size="sm"><Link href="/admin/destinations/new">Create First Destination</Link></Button>
          </div>
        ) : (
          <div className="divide-y divide-charcoal-100">
            {destinations.map((dest) => (
              <div key={dest.id} className="flex items-center gap-4 px-6 py-4 hover:bg-off-white transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-charcoal">{dest.name}</p>
                  <p className="text-xs text-charcoal-400 mt-0.5">{dest.country}{dest.region ? ` · ${dest.region}` : ""}</p>
                </div>
                <DestinationTogglePublish id={dest.id} isPublished={dest.is_published} />
                <div className="flex gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/destinations/${dest.id}/edit`}><Edit className="w-3.5 h-3.5" /></Link>
                  </Button>
                  {dest.is_published && (
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/destinations/${dest.slug}`} target="_blank"><Eye className="w-3.5 h-3.5" /></Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
