"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Headphones, FileText, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Tell Us Your Plan",
    description:
      "Share your destination, dates, number of travellers and any preferences through our simple enquiry form.",
  },
  {
    number: "02",
    icon: Headphones,
    title: "Speak With a Travel Expert",
    description:
      "Our dedicated travel expert will get in touch to understand your requirements and answer your questions.",
  },
  {
    number: "03",
    icon: FileText,
    title: "Receive Your Quote",
    description:
      "We'll prepare a detailed, transparent itinerary and quote tailored specifically for you.",
  },
  {
    number: "04",
    icon: Plane,
    title: "Start Your Journey",
    description:
      "Confirm your booking and leave the rest to us. We handle every detail so you can travel with ease.",
  },
];

export function HowItWorks() {
  return (
    <section
      className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8"
      aria-labelledby="how-it-works-heading"
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
          <span className="section-label justify-center">
            <span className="divider-accent" />
            How It Works
            <span className="divider-accent" />
          </span>
          <h2
            id="how-it-works-heading"
            className="mt-4 text-3xl sm:text-4xl font-bold text-charcoal tracking-tight"
          >
            From Idea to Journey in 4 Steps
          </h2>
          <p className="mt-3 text-charcoal-400 text-base max-w-xl mx-auto">
            We keep things simple, honest and transparent from start to finish.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-charcoal-100" aria-hidden="true" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col items-center text-center relative"
            >
              {/* Step circle */}
              <div className="relative z-10 w-20 h-20 rounded-2xl bg-white border-2 border-vayu-100 shadow-card flex flex-col items-center justify-center mb-6 group-hover:border-vayu-400 transition-colors">
                <step.icon className="w-7 h-7 text-vayu-600 mb-1" />
                <span className="text-xs font-bold text-vayu-400 tracking-widest">
                  {step.number}
                </span>
              </div>

              <h3 className="font-semibold text-charcoal text-base mb-2.5">
                {step.title}
              </h3>
              <p className="text-charcoal-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-14 text-center"
        >
          <Button asChild size="xl">
            <Link href="/contact?type=plan">Start Planning Now</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
