"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, MapPin, ArrowRight, Tag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatDuration } from "@/lib/utils";
import type { Package } from "@/types";

// Placeholder packages — replaced by CMS data in production
const placeholderPackages: Partial<Package>[] = [
  {
    id: "1",
    title: "Kashmir Escape",
    slug: "kashmir-escape",
    category: "domestic",
    duration_nights: 5,
    duration_days: 6,
    hero_image_url:
      "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&q=80",
    short_description:
      "Srinagar, Gulmarg, Pahalgam — a serene escape into the valleys of Kashmir.",
    highlights: ["Dal Lake houseboat", "Gulmarg cable car", "Pahalgam meadows"],
    is_featured: true,
    destination: { name: "Kashmir", slug: "kashmir" } as any,
  },
  {
    id: "2",
    title: "Maldives Retreat",
    slug: "maldives-retreat",
    category: "luxury",
    duration_nights: 4,
    duration_days: 5,
    hero_image_url:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
    short_description:
      "Overwater villas, crystal lagoons and pristine beaches in the Maldives.",
    highlights: ["Overwater bungalow", "Snorkelling", "Private sunset cruise"],
    is_featured: true,
    destination: { name: "Maldives", slug: "maldives" } as any,
  },
  {
    id: "3",
    title: "Bali Discovery",
    slug: "bali-discovery",
    category: "international",
    duration_nights: 6,
    duration_days: 7,
    hero_image_url:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    short_description:
      "Temples, terraced rice fields, and vibrant beach clubs across Bali.",
    highlights: ["Ubud rice terraces", "Tanah Lot temple", "Seminyak beach"],
    is_featured: true,
    destination: { name: "Bali", slug: "bali" } as any,
  },
  {
    id: "4",
    title: "Rajasthan Royal",
    slug: "rajasthan-royal",
    category: "domestic",
    duration_nights: 7,
    duration_days: 8,
    hero_image_url:
      "https://images.unsplash.com/photo-1477587458883-47145ed6a4dc?w=800&q=80",
    short_description:
      "Jaipur, Jodhpur, Udaipur — the golden triangle of royal Rajasthan.",
    highlights: ["Amber Fort", "Mehrangarh", "City Palace", "Desert safari"],
    is_featured: true,
    destination: { name: "Rajasthan", slug: "rajasthan" } as any,
  },
  {
    id: "5",
    title: "Kerala Backwaters",
    slug: "kerala-backwaters",
    category: "honeymoon",
    duration_nights: 4,
    duration_days: 5,
    hero_image_url:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
    short_description:
      "Houseboat stays, Ayurvedic wellness and the lush backwaters of Kerala.",
    highlights: ["Alleppey houseboat", "Ayurveda spa", "Munnar tea estates"],
    is_featured: true,
    destination: { name: "Kerala", slug: "kerala" } as any,
  },
  {
    id: "6",
    title: "Dubai Experience",
    slug: "dubai-experience",
    category: "international",
    duration_nights: 4,
    duration_days: 5,
    hero_image_url:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    short_description:
      "Burj Khalifa, desert safaris and world-class dining in Dubai.",
    highlights: ["Burj Khalifa", "Desert safari", "Dubai Mall", "Dhow cruise"],
    is_featured: true,
    destination: { name: "Dubai", slug: "dubai" } as any,
  },
];

const categoryLabels: Record<string, string> = {
  honeymoon: "Honeymoon",
  family: "Family",
  group: "Group",
  adventure: "Adventure",
  luxury: "Luxury",
  customized: "Customized",
  mice: "MICE",
  domestic: "Domestic",
  international: "International",
};

const filterTabs = ["All", "Domestic", "International", "Honeymoon", "Luxury"];

function PackageCard({
  pkg,
  index,
}: {
  pkg: Partial<Package>;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
      aria-label={`Package: ${pkg.title}`}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={pkg.hero_image_url!}
          alt={`${pkg.title} travel package`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="sand" className="text-xs font-semibold shadow-sm">
            {categoryLabels[pkg.category!] ?? pkg.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Destination */}
        <div className="flex items-center gap-1.5 text-charcoal-400 text-xs mb-2">
          <MapPin className="w-3 h-3" />
          <span>{pkg.destination?.name}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-charcoal text-lg leading-snug group-hover:text-vayu-700 transition-colors">
          {pkg.title}
        </h3>

        {/* Duration */}
        <div className="flex items-center gap-1.5 text-charcoal-400 text-xs mt-2">
          <Clock className="w-3 h-3" />
          <span>{formatDuration(pkg.duration_nights!, pkg.duration_days!)}</span>
        </div>

        {/* Description */}
        <p className="mt-3 text-charcoal-500 text-sm leading-relaxed line-clamp-2 flex-1">
          {pkg.short_description}
        </p>

        {/* Highlights */}
        {pkg.highlights && pkg.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {pkg.highlights.slice(0, 3).map((h) => (
              <span
                key={h}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-vayu-50 text-vayu-700 text-xs"
              >
                <Star className="w-2.5 h-2.5" />
                {h}
              </span>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="mt-4 pt-4 border-t border-charcoal-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-charcoal-400">Starting from</p>
            <p className="text-vayu-700 font-semibold text-base">
              {pkg.price_starting_from ? `₹${pkg.price_starting_from.toLocaleString("en-IN")}` : "On Request"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/packages/${pkg.slug}`}>View</Link>
            </Button>
            <Button asChild size="sm">
              <Link href={`/contact?type=quote&package=${pkg.slug}`}>Quote</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

interface FeaturedPackagesProps {
  packages?: Partial<Package>[];
}

export function FeaturedPackages({ packages = placeholderPackages }: FeaturedPackagesProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? packages
      : packages.filter(
          (p) =>
            (p.category ?? "").toLowerCase() === activeFilter.toLowerCase() ||
            (p.destination?.name ?? "").toLowerCase() === activeFilter.toLowerCase()
        );

  return (
    <section
      className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-off-white"
      aria-labelledby="packages-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-label">
              <span className="divider-accent" />
              Holiday Packages
            </span>
            <h2
              id="packages-heading"
              className="mt-3 text-3xl sm:text-4xl font-bold text-charcoal tracking-tight"
            >
              Holidays Worth Remembering
            </h2>
            <p className="mt-3 text-charcoal-400 text-base max-w-lg">
              Carefully planned packages for every kind of traveller.
            </p>
          </motion.div>

          {/* Filter tabs */}
          <div className="flex gap-1 flex-wrap">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border",
                  activeFilter === tab
                    ? "bg-vayu-700 text-white border-vayu-700 shadow-sm"
                    : "bg-white text-charcoal-500 border-charcoal-100 hover:border-vayu-300 hover:text-vayu-700"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length > 0 ? (
            filtered.map((pkg, i) => (
              <PackageCard key={pkg.id} pkg={pkg} index={i} />
            ))
          ) : (
            <div className="col-span-3 py-16 text-center text-charcoal-400">
              <Tag className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No packages found for this category.</p>
            </div>
          )}
        </div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Button asChild variant="outline" size="lg">
            <Link href="/packages">
              View All Packages <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
