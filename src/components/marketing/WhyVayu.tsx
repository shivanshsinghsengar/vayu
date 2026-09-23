"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Headphones, Map, Compass, LifeBuoy, MessageSquare, Users
} from "lucide-react";

const reasons = [
  {
    icon: Headphones,
    title: "Expert Travel Assistance",
    description:
      "Our team understands travel deeply. We guide you through every decision — from destination to departure.",
  },
  {
    icon: Map,
    title: "Personalized Itineraries",
    description:
      "Every itinerary is crafted for you — your interests, your pace, your budget.",
  },
  {
    icon: Compass,
    title: "Curated Experiences",
    description:
      "We handpick experiences that go beyond the tourist trail — authentic, meaningful and memorable.",
  },
  {
    icon: LifeBuoy,
    title: "End-to-End Support",
    description:
      "From the first enquiry to your return home, we are with you every step of the way.",
  },
  {
    icon: MessageSquare,
    title: "Transparent Communication",
    description:
      "No hidden surprises. We share every detail of your trip clearly and honestly.",
  },
  {
    icon: Users,
    title: "Dedicated Assistance",
    description:
      "You get a dedicated travel expert who knows your journey and is reachable when you need them.",
  },
];

export function WhyVayu() {
  return (
    <section
      className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-vayu-950"
      aria-labelledby="why-vayu-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="section-label text-vayu-400 justify-center">
            <span className="w-12 h-0.5 bg-vayu-600 rounded-full" />
            Why Vayu Holidays
            <span className="w-12 h-0.5 bg-vayu-600 rounded-full" />
          </span>
          <h2
            id="why-vayu-heading"
            className="mt-4 text-3xl sm:text-4xl font-bold text-white tracking-tight"
          >
            Travel Planned the Way It Should Be
          </h2>
          <p className="mt-3 text-vayu-300 text-base max-w-2xl mx-auto">
            We believe great travel is built on honesty, care and genuine expertise — not just brochures.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group p-7 rounded-2xl bg-vayu-900/50 border border-vayu-800/50 hover:bg-vayu-900 hover:border-vayu-700 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-vayu-800 flex items-center justify-center mb-5 group-hover:bg-vayu-700 transition-colors">
                <reason.icon className="w-5 h-5 text-vayu-300" />
              </div>
              <h3 className="text-white font-semibold text-base mb-2.5">
                {reason.title}
              </h3>
              <p className="text-vayu-400 text-sm leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
