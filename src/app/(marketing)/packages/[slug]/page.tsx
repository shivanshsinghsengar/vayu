import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock, MapPin, Check, X as XIcon, Phone, MessageCircle,
  ChevronDown, Star, ArrowLeft
} from "lucide-react";
import { formatDuration, PACKAGE_CATEGORY_LABELS, whatsappUrl, phoneUrl } from "@/lib/utils";
import type { Package } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPackage(slug: string): Promise<Package | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packages")
    .select(`
      *,
      destination:destinations(id, name, slug, country),
      itinerary:package_itineraries(*),
      inclusions:package_inclusions(*),
      exclusions:package_exclusions(*),
      images:package_images(*)
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .is("deleted_at", null)
    .single();

  if (error || !data) return null;
  return data as Package;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackage(slug);
  if (!pkg) return { title: "Package Not Found" };

  return {
    title: pkg.seo_title ?? pkg.title,
    description: pkg.seo_description ?? pkg.short_description ?? undefined,
    alternates: { canonical: `/packages/${slug}` },
    openGraph: {
      title: pkg.seo_title ?? pkg.title,
      description: pkg.seo_description ?? pkg.short_description ?? undefined,
      images: pkg.og_image_url ? [{ url: pkg.og_image_url }] : pkg.hero_image_url ? [{ url: pkg.hero_image_url }] : [],
    },
  };
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const pkg = await getPackage(slug);
  if (!pkg) notFound();

  const whatsappMessage = `Hi Vayu Holidays! I'm interested in the "${pkg.title}" package. Please share details.`;

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="relative h-[55vh] min-h-[360px] max-h-[600px] overflow-hidden">
        {pkg.hero_image_url ? (
          <Image
            src={pkg.hero_image_url}
            alt={`${pkg.title} — Vayu Holidays`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-vayu-900" />
        )}
        <div className="absolute inset-0 bg-hero-gradient" />

        {/* Back */}
        <div className="absolute top-20 left-4 sm:left-8">
          <Link
            href="/packages"
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Packages
          </Link>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-7xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex items-center gap-2 text-xs text-white/60">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li>/</li>
              <li><Link href="/packages" className="hover:text-white transition-colors">Packages</Link></li>
              <li>/</li>
              <li className="text-white">{pkg.title}</li>
            </ol>
          </nav>
          {pkg.destination && (
            <div className="flex items-center gap-1.5 text-white/80 text-sm mb-2">
              <MapPin className="w-4 h-4" />
              {pkg.destination.name}
              {pkg.destination.country && pkg.destination.country !== "India" && (
                <span>, {pkg.destination.country}</span>
              )}
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">{pkg.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <Clock className="w-4 h-4" />
              {formatDuration(pkg.duration_nights, pkg.duration_days)}
            </div>
            <Badge variant="sand">{PACKAGE_CATEGORY_LABELS[pkg.category] ?? pkg.category}</Badge>
            {pkg.price_starting_from && (
              <span className="text-white font-semibold text-base">
                From ₹{Number(pkg.price_starting_from).toLocaleString("en-IN")}
              </span>
            )}
            {!pkg.price_starting_from && (
              <span className="text-white/80 text-sm">Price on request</span>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Highlights */}
            {pkg.highlights && pkg.highlights.length > 0 && (
              <section aria-labelledby="highlights-heading">
                <h2 id="highlights-heading" className="text-xl font-semibold text-charcoal mb-4">Package Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {pkg.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2.5 p-3 bg-vayu-50 rounded-xl text-sm text-vayu-800">
                      <Star className="w-4 h-4 text-vayu-600 shrink-0" />
                      {h}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Overview */}
            {pkg.description && (
              <section aria-labelledby="overview-heading">
                <h2 id="overview-heading" className="text-xl font-semibold text-charcoal mb-4">Overview</h2>
                <div className="prose prose-sm text-charcoal-600 leading-relaxed max-w-none">
                  {pkg.description.split("\n").map((para, i) => (
                    <p key={i} className="mb-3">{para}</p>
                  ))}
                </div>
              </section>
            )}

            {/* Itinerary */}
            {pkg.itinerary && pkg.itinerary.length > 0 && (
              <section aria-labelledby="itinerary-heading">
                <h2 id="itinerary-heading" className="text-xl font-semibold text-charcoal mb-4">Day-by-Day Itinerary</h2>
                <div className="space-y-3">
                  {pkg.itinerary
                    .sort((a, b) => a.day_number - b.day_number)
                    .map((day) => (
                      <details
                        key={day.id}
                        className="group bg-white rounded-xl border border-charcoal-100 overflow-hidden"
                      >
                        <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-vayu-100 text-vayu-700 text-xs font-bold flex items-center justify-center shrink-0">
                              D{day.day_number}
                            </span>
                            <span className="font-medium text-charcoal text-sm">{day.title}</span>
                          </div>
                          <ChevronDown className="w-4 h-4 text-charcoal-400 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="px-4 pb-4 pt-0">
                          <p className="text-charcoal-500 text-sm leading-relaxed">{day.description}</p>
                          {day.activities && day.activities.length > 0 && (
                            <ul className="mt-3 space-y-1">
                              {day.activities.map((a) => (
                                <li key={a} className="flex items-center gap-2 text-xs text-charcoal-500">
                                  <Check className="w-3 h-3 text-vayu-500 shrink-0" />{a}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </details>
                    ))}
                </div>
              </section>
            )}

            {/* Inclusions / Exclusions */}
            {((pkg.inclusions && pkg.inclusions.length > 0) || (pkg.exclusions && pkg.exclusions.length > 0)) && (
              <section aria-labelledby="inclusions-heading">
                <h2 id="inclusions-heading" className="text-xl font-semibold text-charcoal mb-4">What&apos;s Included</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {pkg.inclusions && pkg.inclusions.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-vayu-700 uppercase tracking-wider mb-3">Inclusions</h3>
                      <ul className="space-y-2">
                        {pkg.inclusions.sort((a, b) => a.sort_order - b.sort_order).map((inc) => (
                          <li key={inc.id} className="flex items-start gap-2 text-sm text-charcoal-600">
                            <Check className="w-4 h-4 text-vayu-600 shrink-0 mt-0.5" />
                            {inc.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {pkg.exclusions && pkg.exclusions.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-3">Exclusions</h3>
                      <ul className="space-y-2">
                        {pkg.exclusions.sort((a, b) => a.sort_order - b.sort_order).map((exc) => (
                          <li key={exc.id} className="flex items-start gap-2 text-sm text-charcoal-600">
                            <XIcon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            {exc.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Terms */}
            {pkg.terms_and_conditions && (
              <section aria-labelledby="terms-heading">
                <h2 id="terms-heading" className="text-xl font-semibold text-charcoal mb-4">Terms &amp; Conditions</h2>
                <div className="bg-off-white rounded-xl p-5 text-sm text-charcoal-500 leading-relaxed whitespace-pre-line">
                  {pkg.terms_and_conditions}
                </div>
              </section>
            )}
          </div>

          {/* Right: sticky quote card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-card-lg border border-charcoal-100 overflow-hidden">
              <div className="p-6 border-b border-charcoal-100 bg-vayu-950">
                <p className="text-vayu-400 text-xs uppercase tracking-widest mb-1">Starting from</p>
                <p className="text-white text-2xl font-bold">
                  {pkg.price_starting_from
                    ? `₹${Number(pkg.price_starting_from).toLocaleString("en-IN")}`
                    : "Price on request"}
                </p>
                <p className="text-vayu-400 text-xs mt-1">{formatDuration(pkg.duration_nights, pkg.duration_days)}</p>
              </div>
              <div className="p-6 space-y-3">
                <Button asChild size="lg" className="w-full">
                  <Link href={`/contact?type=quote&package=${pkg.slug}`}>
                    Get a Quote
                  </Link>
                </Button>
                <Button asChild variant="whatsapp" size="lg" className="w-full">
                  <a href={whatsappUrl(whatsappMessage)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4" /> WhatsApp Us
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <a href={phoneUrl()}>
                    <Phone className="w-4 h-4" /> Call Us
                  </a>
                </Button>
              </div>
              {pkg.destination && (
                <div className="px-6 pb-4 text-xs text-charcoal-400 text-center">
                  Destination:{" "}
                  <Link
                    href={`/destinations/${pkg.destination.slug}`}
                    className="text-vayu-700 hover:underline"
                  >
                    {pkg.destination.name}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white border-t border-charcoal-100 px-4 py-3 flex gap-3 shadow-float">
        <Button asChild size="default" className="flex-1">
          <Link href={`/contact?type=quote&package=${pkg.slug}`}>Get Quote</Link>
        </Button>
        <Button asChild variant="whatsapp" size="default" className="flex-1">
          <a href={whatsappUrl(whatsappMessage)} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
