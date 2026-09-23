"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const experiences = [
  {
    slug: "honeymoon",
    label: "Honeymoon",
    tagline: "Romantic escapes",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=700&q=80",
    alt: "Romantic beach sunset for honeymoon couples",
    color: "from-rose-900/60",
  },
  {
    slug: "family",
    label: "Family",
    tagline: "Memorable family holidays",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=700&q=80",
    alt: "Family enjoying a scenic mountain holiday",
    color: "from-amber-900/60",
  },
  {
    slug: "adventure",
    label: "Adventure",
    tagline: "Experiences for explorers",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&q=80",
    alt: "Adventure trekking in the mountains",
    color: "from-emerald-900/60",
  },
  {
    slug: "luxury",
    label: "Luxury",
    tagline: "Premium travel experiences",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=700&q=80",
    alt: "Luxury overwater villa with pool",
    color: "from-slate-900/60",
  },
  {
    slug: "group",
    label: "Group",
    tagline: "Travel together",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&q=80",
    alt: "Group of friends travelling together",
    color: "from-indigo-900/60",
  },
  {
    slug: "mice",
    label: "MICE",
    tagline: "Business & corporate travel",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&q=80",
    alt: "Corporate conference and MICE travel",
    color: "from-zinc-900/60",
  },
  {
    slug: "customized",
    label: "Customized",
    tagline: "Built around you",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=700&q=80",
    alt: "Scenic customized travel itinerary view",
    color: "from-vayu-900/60",
  },
];

export function ExperienceSection() {
  return (
    <section
      className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8"
      aria-labelledby="experiences-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="section-label justify-center">
            <span className="divider-accent" />
            Travel by Experience
            <span className="divider-accent" />
          </span>
          <h2
            id="experiences-heading"
            className="mt-4 text-3xl sm:text-4xl font-bold text-charcoal tracking-tight"
          >
            What Kind of Traveller Are You?
          </h2>
          <p className="mt-3 text-charcoal-400 text-base max-w-xl mx-auto">
            Whether you seek romance, adventure or pure luxury — we have a journey for you.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.slug}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer ${
                i === 0 ? "sm:col-span-1 lg:col-span-2 lg:row-span-2" : ""
              }`}
            >
              <Link href={`/experiences/${exp.slug}`} className="block">
                <div
                  className={`relative overflow-hidden ${
                    i === 0 ? "h-56 sm:h-64 lg:h-full lg:min-h-[360px]" : "h-44 sm:h-52"
                  }`}
                >
                  <Image
                    src={exp.image}
                    alt={exp.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-108"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${exp.color} to-transparent`} />

                  {/* Text overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <h3 className="text-white font-semibold text-base sm:text-lg leading-tight">
                      {exp.label}
                    </h3>
                    <p className="text-white/75 text-xs sm:text-sm mt-0.5">{exp.tagline}</p>
                    <div className="overflow-hidden h-0 group-hover:h-6 transition-all duration-300 mt-1">
                      <span className="flex items-center gap-1 text-white text-xs font-medium">
                        Explore <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
