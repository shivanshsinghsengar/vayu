import { createClient } from "@/lib/supabase/server";
import { PackageForm } from "@/components/admin/PackageForm";
import type { Destination } from "@/types";

async function getDestinations(): Promise<Destination[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("destinations").select("id, name, slug").eq("is_published", true).order("name");
  return (data ?? []) as Destination[];
}

export default async function NewPackagePage() {
  const destinations = await getDestinations();
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-charcoal mb-6">New Package</h1>
      <PackageForm destinations={destinations} />
    </div>
  );
}
