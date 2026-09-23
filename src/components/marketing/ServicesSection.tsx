"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plane, Hotel, Bus, Train, FileText, BookOpen,
  DollarSign, Shield, Car, Package, Settings, Users,
  Heart, Globe, Briefcase, ArrowRight
} from "lucide-react";

const services = [
  {
    icon: Package,
    title: "Holiday Packages",
    desc: "Curated domestic & international packages for every traveller.",
    href: "/services/holiday-packages",
    category: "holiday",
  },
  {
    icon: Globe,
    title: "International Tours",
    desc: "Premium tours to destinations across the globe.",
    href: "/services/international-tours",
    category: "holiday",
  },
  {
    icon: Heart,
    title: "Honeymoon Packages",
    desc: "Romantic getaways crafted with care for couples.",
    href: "/services/honeymoon-packages",
    category: "holiday",
  },
  {
    icon: Users,
    title: "Group Tours",
    desc: "Well-organised tours for groups big and small.",
    href: "/services/group-tours",
    category: "holiday",
  },
  {
    icon: Settings,
    title: "Customized Tours",
    desc: "Your trip, planned entirely around your preferences.",
    href: "/services/customized-tours",
    category: "holiday",
  },
  {
    icon: Briefcase,
    title: "MICE",
    desc: "Corporate events, conferences and incentive travel.",
    href: "/services/mice",
    category: "holiday",
  },
  {
    icon: Plane,
    title: "Flight Booking",
    desc: "Domestic and international flight booking assistance.",
    href: "/services/flight-booking",
    category: "booking",
  },
  {
    icon: Hotel,
    title: "Hotel Booking",
    desc: "Handpicked hotel recommendations across all budgets.",
    href: "/services/hotel-booking",
    category: "booking",
  },
  {
    icon: Bus,
    title: "Bus Tickets",
    desc: "Bus ticket assistance for your travel needs.",
    href: "/services/bus-tickets",
    category: "booking",
  },
  {
    icon: Train,
    title: "Train Tickets",
    desc: "Train reservation and booking assistance.",
    href: "/services/train-tickets",
    category: "booking",
  },
  {
    icon: FileText,
    title: "Visa Assistance",
    desc: "Complete visa guidance for international travel.",
    href: "/services/visa-assistance",
    category: "assistance",
  },
  {
    icon: BookOpen,
    title: "Passport Assistance",
    desc: "Passport application and renewal guidance.",
    href: "/services/passport-assistance",
    category: "assistance",
  },
  {
    icon: DollarSign,
    title: "Forex / Currency",
    desc: "Currency exchange assistance for international travel.",
    href: "/services/forex-currency",
    category: "assistance",
  },
  {
    icon: Shield,
    title: "Travel Insurance",
    desc: "Right coverage for a worry-free journey.",
    href: "/services/travel-insurance",
    category: "assistance",
  },
  {
    icon: Car,
    title: "Airport Transfer",
    desc: "Reliable cab and airport transfer services.",
    href: "/services/airport-transfer",
    category: "assistance",
  },
];

export function ServicesSection() {
  return (
    <section
      className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-off-white"
      aria-labelledby="services-heading"
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
            Our Services
            <span className="divider-accent" />
          </span>
          <h2
            id="services-heading"
            className="mt-4 text-3xl sm:text-4xl font-bold text-charcoal tracking-tight"
          >
            Everything You Need for a Great Trip
          </h2>
          <p className="mt-3 text-charcoal-400 text-base max-w-xl mx-auto">
            From flights and hotels to visas and insurance — we handle every detail so you don&apos;t have to.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {services.map((svc, i) => (
            <motion.div
              key={svc.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <Link
                href={svc.href}
                className="group flex flex-col items-center text-center p-5 bg-white rounded-2xl border border-charcoal-100 hover:border-vayu-300 hover:shadow-card-md transition-all duration-300 h-full"
                aria-label={svc.title}
              >
                <div className="w-12 h-12 rounded-xl bg-vayu-50 flex items-center justify-center mb-3 group-hover:bg-vayu-700 transition-colors duration-300">
                  <svc.icon className="w-5 h-5 text-vayu-700 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-charcoal text-sm leading-snug group-hover:text-vayu-700 transition-colors">
                  {svc.title}
                </h3>
                <p className="text-charcoal-400 text-xs mt-1.5 leading-relaxed line-clamp-2 hidden sm:block">
                  {svc.desc}
                </p>
                <span className="mt-2 text-vayu-600 text-xs font-medium flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
