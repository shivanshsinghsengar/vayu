"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { Testimonial } from "@/types";

// Empty state — testimonials come from CMS
const placeholderTestimonials: Testimonial[] = [];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-charcoal-200"}`}
        />
      ))}
    </div>
  );
}

interface TestimonialsProps {
  testimonials?: Testimonial[];
  show?: boolean;
}

export function Testimonials({ testimonials = placeholderTestimonials, show = true }: TestimonialsProps) {
  const [current, setCurrent] = useState(0);

  // Section hidden if disabled from CMS
  if (!show || testimonials.length === 0) {
    return null;
  }

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const t = testimonials[current];

  return (
    <section
      className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-off-white"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="section-label justify-center">
            <span className="divider-accent" />
            Traveller Stories
            <span className="divider-accent" />
          </span>
          <h2
            id="testimonials-heading"
            className="mt-4 text-3xl sm:text-4xl font-bold text-charcoal tracking-tight"
          >
            What Our Travellers Say
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-3xl p-8 sm:p-10 shadow-card-md border border-charcoal-100"
            >
              <Quote className="w-10 h-10 text-vayu-100 mb-6" aria-hidden="true" />

              <p className="text-charcoal text-lg sm:text-xl font-medium leading-relaxed text-balance mb-8">
                &ldquo;{t.review}&rdquo;
              </p>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  {t.photo_url ? (
                    <Image
                      src={t.photo_url}
                      alt={`${t.customer_name} — Vayu Holidays traveller`}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-vayu-100 flex items-center justify-center text-vayu-700 font-semibold text-lg">
                      {t.customer_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-charcoal text-sm">{t.customer_name}</p>
                    {t.trip_package && (
                      <p className="text-charcoal-400 text-xs mt-0.5">{t.trip_package}</p>
                    )}
                  </div>
                </div>
                <StarRating rating={t.rating} />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full border border-charcoal-200 flex items-center justify-center text-charcoal hover:border-vayu-600 hover:text-vayu-700 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`transition-all rounded-full ${
                      i === current ? "w-6 h-2 bg-vayu-700" : "w-2 h-2 bg-charcoal-200"
                    }`}
                    aria-label={`Testimonial ${i + 1}`}
                    aria-current={i === current}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full border border-charcoal-200 flex items-center justify-center text-charcoal hover:border-vayu-600 hover:text-vayu-700 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
