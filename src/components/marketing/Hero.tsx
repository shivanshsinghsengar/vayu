"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const heroSlides = [
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85",
    alt: "Majestic mountain landscape — discover Himalayan destinations",
    location: "Himachal Pradesh, India",
  },
  {
    src: "https://images.unsplash.com/photo-1538485399081-7c9b21c78ffe?w=1920&q=85",
    alt: "Crystal clear waters of the Maldives",
    location: "Maldives",
  },
  {
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=85",
    alt: "Golden beach at sunset",
    location: "Goa, India",
  },
  {
    src: "https://images.unsplash.com/photo-1499678329028-101435549a4e?w=1920&q=85",
    alt: "Tropical palm lined beach",
    location: "Kerala, India",
  },
];

export function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[current];

  return (
    <section
      className="relative w-full h-screen min-h-[600px] max-h-[900px] overflow-hidden"
      aria-label="Hero — Vayu Holidays"
    >
      {/* Background images with Ken Burns */}
      {heroSlides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        >
          <Image
            src={s.src}
            alt={s.alt}
            fill
            priority={i === 0}
            className={`object-cover ${i === current ? "animate-ken-burns" : ""}`}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-hero-gradient" aria-hidden="true" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-center text-center px-4 sm:px-6">
        {/* Location pill */}
        <motion.div
          key={current + "-loc"}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-medium mb-6"
        >
          <MapPin className="w-3 h-3" />
          <span>{slide.location}</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          className="text-white font-bold text-4xl sm:text-5xl md:text-6xl lg:text-display-xl max-w-4xl leading-[1.08] tracking-tight text-balance"
        >
          Your Journey.
          <br />
          <span className="text-sand-200">Beautifully Planned.</span>
        </motion.h1>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="mt-6 text-white/85 text-base sm:text-lg max-w-xl text-balance leading-relaxed"
        >
          Discover thoughtfully planned holidays, unforgettable destinations and
          personalized travel experiences with Vayu Holidays.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="mt-8 flex flex-col sm:flex-row gap-3 items-center"
        >
          <Button asChild size="xl" variant="white">
            <Link href="/packages">Explore Holidays</Link>
          </Button>
          <Button asChild size="xl" variant="default"
            className="bg-vayu-700/90 hover:bg-vayu-700 backdrop-blur-sm border border-white/20">
            <Link href="/contact?type=plan">Plan My Trip</Link>
          </Button>
        </motion.div>

        {/* Slide indicators */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2" aria-label="Slide indicators">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current ? "w-8 h-1.5 bg-white" : "w-2 h-1.5 bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === current}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60"
        aria-hidden="true"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </motion.div>
    </section>
  );
}
