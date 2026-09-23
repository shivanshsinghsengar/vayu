import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Sun, CheckCircle, ArrowRight, MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/utils";
import type { Destination, Package } from "@/types";

interface Props { params: Promise<{ slug: string }> }

async function getData(slug: string) {
  const supabase = await createClient();
  const [destRes, pkgRes] = await Promise.all([
    supabase
      .from("destinations")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single(),
    supabase
      .from("packages")
      .select("id, title, slug, category, duration_nights, duration_days, price_starting_from, hero_image_url, short_description")
      .eq("is_published", true)
      .limit(6),
  ]);
  return {
    destination: destRes.data as Destination | null,
    packages: (pkgRes.data ?? []) as Package[],
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("destinations").select("name, seo_description, seo_title").eq("slug", slug).single();
  if (!data) return { title: "Destination Not Found" };
  return {
    title: data.seo_title ?? data.name,
    description: data.seo_description ?? undefined,
    alternates: { canonical: `/destinations/${slug}` },
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const { destination, packages } = await getData(slug);
  if (!destination) notFound();

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] max-h-[650px] overflow-hidden">
        {destination.hero_image_url ? (
          <Image src={destination.hero_image_url} alt={`${destination.name} — Vayu Holidays`} fill priority className="object-cover" sizes="100vw" />
        ) : (
          <div className="w-full h-full bg-vayu-900" />
        )}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-7xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex items-center gap-2 text-xs text-white/60">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li>/</li>
              <li><Link href="/destinations" className="hover:text-white">Destinations</Link></li>
              <li>/</li>
              <li className="text-white">{destination.name}</li>
            </ol>
          </nav>
          <Badge variant="sand" className="mb-3">{destination.country}</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">{destination.name}</h1>
          {destination.short_description && (
            <p className="mt-3 text-white/80 text-base max-w-xl">{destination.short_description}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 space-y-10">
            {destination.description && (
              <section>
                <h2 className="text-xl font-semibold text-charcoal mb-4">About {destination.name}</h2>
                <div className="text-charcoal-600 text-sm leading-relaxed space-y-3">
                  {destination.description.split("\n").map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </section>
            )}

            {destination.best_time_to_visit && (
              <section>
                <h2 className="text-xl font-semibold text-charcoal mb-4 flex items-center gap-2">
                  <Sun className="w-5 h-5 text-amber-500" /> Best Time to Visit
                </h2>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-900">
                  {destination.best_time_to_visit}
                </div>
              </section>
            )}

            {destination.popular_experiences && destination.popular_experiences.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-charcoal mb-4">Popular Experiences</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {destination.popular_experiences.map((exp) => (
                    <div key={exp} className="flex items-center gap-2.5 p-3 bg-vayu-50 rounded-xl text-sm text-vayu-800">
                      <CheckCircle className="w-4 h-4 text-vayu-600 shrink-0" /> {exp}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {destination.travel_tips && destination.travel_tips.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-charcoal mb-4">Travel Tips</h2>
                <ul className="space-y-2.5">
                  {destination.travel_tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-charcoal-600">
                      <span className="w-5 h-5 rounded-full bg-vayu-100 text-vayu-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-charcoal-100 shadow-card p-6">
              <h3 className="font-semibold text-charcoal mb-4">Plan a Trip to {destination.name}</h3>
              <Button asChild size="lg" className="w-full mb-3">
                <Link href={`/contact?type=plan&destination=${destination.slug}`}>Get a Quote</Link>
              </Button>
              <Button asChild variant="whatsapp" size="lg" className="w-full">
                <a href={whatsappUrl(`Hi! I'm interested in travelling to ${destination.name}`)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4" /> WhatsApp Us
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Packages for this destination */}
        {packages.length > 0 && (
          <section className="mt-14" aria-labelledby="dest-packages-heading">
            <div className="flex items-center justify-between mb-6">
              <h2 id="dest-packages-heading" className="text-2xl font-bold text-charcoal">Packages for {destination.name}</h2>
              <Link href={`/packages?destination=${destination.slug}`} className="flex items-center gap-1 text-sm font-medium text-vayu-700 hover:text-vayu-900">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {packages.slice(0, 3).map((pkg) => (
                <Link key={pkg.id} href={`/packages/${pkg.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-md transition-all duration-300 hover:-translate-y-1 block">
                  {pkg.hero_image_url && (
                    <div className="relative h-44 overflow-hidden">
                      <Image src={pkg.hero_image_url} alt={pkg.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="33vw" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-charcoal text-sm group-hover:text-vayu-700 transition-colors">{pkg.title}</h3>
                    <p className="text-xs text-charcoal-400 mt-1">{pkg.duration_nights}N / {pkg.duration_days}D</p>
                    {pkg.price_starting_from && (
                      <p className="text-vayu-700 text-sm font-semibold mt-2">
                        From ₹{Number(pkg.price_starting_from).toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
