import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Destination } from "@/types";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Explore our curated destinations — from the valleys of Kashmir to the shores of Bali. Find your perfect travel destination with Vayu Holidays.",
  alternates: { canonical: "/destinations" },
};

async function getDestinations(): Promise<Destination[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("destinations")
    .select("*")
    .eq("is_published", true)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });
  return (data ?? []) as Destination[];
}

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  const india         = destinations.filter((d) => d.country === "India");
  const international = destinations.filter((d) => d.country !== "India");

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-vayu-950 pt-28 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-xs text-vayu-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li className="text-vayu-600">/</li>
              <li className="text-white">Destinations</li>
            </ol>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Our Destinations</h1>
          <p className="mt-2 text-vayu-300 text-base max-w-xl">
            From the peaks of the Himalayas to tropical island escapes — discover where we can take you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {destinations.length === 0 ? (
          <div className="py-24 text-center">
            <MapPin className="w-12 h-12 text-vayu-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-charcoal mb-2">Destinations coming soon</h2>
            <p className="text-charcoal-400 text-sm mb-6">Contact us to explore any destination.</p>
            <Button asChild><Link href="/contact">Contact Us</Link></Button>
          </div>
        ) : (
          <>
            {india.length > 0 && (
              <section className="mb-14" aria-labelledby="india-heading">
                <h2 id="india-heading" className="text-2xl font-bold text-charcoal mb-8 flex items-center gap-3">
                  <span>🇮🇳</span> India
                </h2>
                <DestinationGrid destinations={india} />
              </section>
            )}
            {international.length > 0 && (
              <section aria-labelledby="international-heading">
                <h2 id="international-heading" className="text-2xl font-bold text-charcoal mb-8 flex items-center gap-3">
                  <span>🌍</span> International
                </h2>
                <DestinationGrid destinations={international} />
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function DestinationGrid({ destinations }: { destinations: Destination[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {destinations.map((dest) => (
        <Link
          key={dest.id}
          href={`/destinations/${dest.slug}`}
          className="group relative overflow-hidden rounded-2xl aspect-[4/3] block"
          aria-label={dest.name}
        >
          {dest.hero_image_url ? (
            <Image
              src={dest.hero_image_url}
              alt={`${dest.name} — travel destination`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-vayu-100" />
          )}
          <div className="absolute inset-0 bg-card-gradient" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-lg leading-tight">{dest.name}</h3>
            {dest.short_description && (
              <p className="text-white/70 text-xs mt-1 line-clamp-1">{dest.short_description}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
