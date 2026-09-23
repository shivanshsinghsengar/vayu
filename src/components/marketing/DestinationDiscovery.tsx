"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const destinations = [
  {
    name: "Kashmir",
    slug: "kashmir",
    region: "India",
    tagline: "Paradise on Earth",
    image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&q=80",
    alt: "Dal Lake and houseboats in Kashmir",
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    name: "Goa",
    slug: "goa",
    region: "India",
    tagline: "Sun, Sand & Culture",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
    alt: "Golden beach in Goa at sunset",
    span: "",
  },
  {
    name: "Kerala",
    slug: "kerala",
    region: "India",
    tagline: "God's Own Country",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
    alt: "Kerala backwaters and lush greenery",
    span: "",
  },
  {
    name: "Rajasthan",
    slug: "rajasthan",
    region: "India",
    tagline: "Land of Kings",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed6a4dc?w=800&q=80",
    alt: "Jaisalmer golden fort in Rajasthan",
    span: "",
  },
  {
    name: "Dubai",
    slug: "dubai",
    region: "International",
    tagline: "City of Wonders",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    alt: "Dubai skyline with Burj Khalifa",
    span: "",
  },
  {
    name: "Bali",
    slug: "bali",
    region: "International",
    tagline: "Island of the Gods",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    alt: "Bali temple at sunset",
    span: "lg:col-span-2",
  },
  {
    name: "Maldives",
    slug: "maldives",
    region: "International",
    tagline: "Where Luxury Meets Nature",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    alt: "Maldives overwater bungalows and turquoise water",
    span: "",
  },
];

const tabs = ["All", "India", "International"];

function DestinationCard({
  dest,
  index,
}: {
  dest: (typeof destinations)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className={cn("group relative overflow-hidden rounded-2xl cursor-pointer", dest.span)}
    >
      <Link href={`/destinations/${dest.slug}`} className="block h-full">
        {/* Image */}
        <div className="relative w-full h-52 sm:h-64 lg:h-full min-h-[200px]">
          <Image
            src={dest.image}
            alt={dest.alt}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-card-gradient" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-1">
            {dest.region}
          </p>
          <h3 className="text-white font-semibold text-xl leading-tight">
            {dest.name}
          </h3>
          <p className="text-white/80 text-sm mt-0.5">{dest.tagline}</p>

          {/* Hover CTA */}
          <div className="overflow-hidden h-0 group-hover:h-8 transition-all duration-300 mt-1">
            <span className="flex items-center gap-1 text-white text-sm font-medium">
              Explore <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function DestinationDiscovery() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered =
    activeTab === "All"
      ? destinations
      : destinations.filter((d) => d.region === activeTab);

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8" aria-labelledby="destinations-heading">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-label">
              <span className="divider-accent" />
              Destinations
            </span>
            <h2
              id="destinations-heading"
              className="mt-3 text-3xl sm:text-4xl font-bold text-charcoal tracking-tight"
            >
              Where Would You Like to Go?
            </h2>
            <p className="mt-3 text-charcoal-400 text-base max-w-lg">
              From the valleys of Kashmir to the shores of Bali — we&apos;ll plan it all.
            </p>
          </motion.div>

          {/* Filter tabs */}
          <div className="flex gap-1 p-1 bg-off-white rounded-xl border border-charcoal-100 shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  activeTab === tab
                    ? "bg-white shadow-card text-vayu-700"
                    : "text-charcoal-500 hover:text-charcoal"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[220px]">
          {filtered.map((dest, i) => (
            <DestinationCard key={dest.slug} dest={dest} index={i} />
          ))}
        </div>

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-vayu-700 font-semibold text-sm hover:text-vayu-900 transition-colors group"
          >
            View all destinations
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
