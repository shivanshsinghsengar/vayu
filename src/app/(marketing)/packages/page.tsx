import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, MapPin, Star, ArrowRight } from "lucide-react";
import { formatDuration, PACKAGE_CATEGORY_LABELS } from "@/lib/utils";
import type { Package } from "@/types";

export const metadata: Metadata = {
  title: "Holiday Packages",
  description:
    "Browse our curated holiday packages — domestic tours, international travel, honeymoon getaways, group tours and more.",
  alternates: { canonical: "/packages" },
};

// ─── Category filter map ───────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "",              label: "All Packages" },
  { value: "domestic",     label: "Domestic" },
  { value: "international",label: "International" },
  { value: "honeymoon",    label: "Honeymoon" },
  { value: "family",       label: "Family" },
  { value: "adventure",    label: "Adventure" },
  { value: "luxury",       label: "Luxury" },
  { value: "group",        label: "Group" },
  { value: "mice",         label: "MICE" },
];

async function getPackages(category?: string): Promise<Package[]> {
  const supabase = await createClient();
  let query = supabase
    .from("packages")
    .select(`*, destination:destinations(id, name, slug)`)
    .eq("is_published", true)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) return [];
  return (data ?? []) as Package[];
}

interface PageProps {
  searchParams: Promise<{ category?: string; destination?: string }>;
}

export default async function PackagesPage({ searchParams }: PageProps) {
  const params   = await searchParams;
  const category = params.category ?? "";
  const packages = await getPackages(category || undefined);

  return (
    <div className="min-h-screen bg-cream">
      {/* Page hero */}
      <div className="bg-vayu-950 pt-28 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-xs text-vayu-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li className="text-vayu-600">/</li>
              <li className="text-white">Packages</li>
            </ol>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Holiday Packages</h1>
          <p className="mt-2 text-vayu-300 text-base max-w-xl">
            Curated itineraries for every kind of traveller — from Himalayan escapes to tropical getaways.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-[70px] z-30 bg-white border-b border-charcoal-100 shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto no-scrollbar py-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={cat.value ? `/packages?category=${cat.value}` : "/packages"}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  category === cat.value
                    ? "bg-vayu-700 text-white border-vayu-700 shadow-sm"
                    : "bg-white text-charcoal-500 border-charcoal-100 hover:border-vayu-300 hover:text-vayu-700"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Package grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {packages.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-vayu-50 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-7 h-7 text-vayu-400" />
            </div>
            <h2 className="text-lg font-semibold text-charcoal mb-2">No packages found</h2>
            <p className="text-charcoal-400 text-sm mb-6">
              We&apos;re adding more packages soon. Check back or contact us for a custom itinerary.
            </p>
            <Button asChild>
              <Link href="/contact?type=plan">Request a Custom Trip</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <article
                key={pkg.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
                aria-label={`Package: ${pkg.title}`}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  {pkg.hero_image_url ? (
                    <Image
                      src={pkg.hero_image_url}
                      alt={`${pkg.title} — travel package`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-vayu-100 flex items-center justify-center">
                      <MapPin className="w-10 h-10 text-vayu-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="sand" className="text-xs font-semibold shadow-sm">
                      {PACKAGE_CATEGORY_LABELS[pkg.category] ?? pkg.category}
                    </Badge>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-5">
                  {pkg.destination && (
                    <div className="flex items-center gap-1.5 text-charcoal-400 text-xs mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{pkg.destination.name}</span>
                    </div>
                  )}
                  <h2 className="font-semibold text-charcoal text-lg leading-snug group-hover:text-vayu-700 transition-colors">
                    {pkg.title}
                  </h2>
                  <div className="flex items-center gap-1.5 text-charcoal-400 text-xs mt-2">
                    <Clock className="w-3 h-3" />
                    <span>{formatDuration(pkg.duration_nights, pkg.duration_days)}</span>
                  </div>
                  {pkg.short_description && (
                    <p className="mt-3 text-charcoal-500 text-sm leading-relaxed line-clamp-2 flex-1">
                      {pkg.short_description}
                    </p>
                  )}
                  {pkg.highlights && pkg.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {pkg.highlights.slice(0, 3).map((h) => (
                        <span key={h} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-vayu-50 text-vayu-700 text-xs">
                          <Star className="w-2.5 h-2.5" />{h}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-charcoal-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-charcoal-400">Starting from</p>
                      <p className="text-vayu-700 font-semibold text-base">
                        {pkg.price_starting_from
                          ? `₹${Number(pkg.price_starting_from).toLocaleString("en-IN")}`
                          : "On Request"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/packages/${pkg.slug}`}>
                          View <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                      <Button asChild size="sm">
                        <Link href={`/contact?type=quote&package=${pkg.slug}`}>Quote</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
