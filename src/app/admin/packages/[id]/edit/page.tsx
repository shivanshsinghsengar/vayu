import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PackageForm } from "@/components/admin/PackageForm";
import type { Package, Destination } from "@/types";

interface Props { params: Promise<{ id: string }> }

async function getData(id: string) {
  const supabase = await createClient();
  const [pkgRes, destRes] = await Promise.all([
    supabase.from("packages").select("*").eq("id", id).single(),
    supabase.from("destinations").select("id, name, slug").eq("is_published", true).order("name"),
  ]);
  return {
    package:      pkgRes.data as Package | null,
    destinations: (destRes.data ?? []) as Destination[],
  };
}

export default async function EditPackagePage({ params }: Props) {
  const { id } = await params;
  const { package: pkg, destinations } = await getData(id);
  if (!pkg) notFound();

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-charcoal mb-6">Edit: {pkg.title}</h1>
      <PackageForm destinations={destinations} package={pkg} />
    </div>
  );
}
