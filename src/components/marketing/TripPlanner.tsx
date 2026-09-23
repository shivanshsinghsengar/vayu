"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Users, Tag, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const travelTypes = [
  { value: "honeymoon", label: "Honeymoon" },
  { value: "family",    label: "Family" },
  { value: "couple",    label: "Couple" },
  { value: "group",     label: "Group" },
  { value: "adventure", label: "Adventure" },
  { value: "luxury",    label: "Luxury" },
  { value: "mice",      label: "MICE / Corporate" },
];

const budgetRanges = [
  { value: "under-25k",   label: "Under ₹25,000" },
  { value: "25k-50k",     label: "₹25,000 – ₹50,000" },
  { value: "50k-1l",      label: "₹50,000 – ₹1,00,000" },
  { value: "1l-2l",       label: "₹1,00,000 – ₹2,00,000" },
  { value: "2l-plus",     label: "₹2,00,000+" },
];

const popularDestinations = [
  "Kashmir", "Goa", "Kerala", "Rajasthan", "Himachal",
  "Andaman", "Dubai", "Thailand", "Bali", "Maldives",
];

export function TripPlanner() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [travelType, setTravelType]   = useState("");
  const [travellers, setTravellers]   = useState("");
  const [budget, setBudget]           = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (travelType)  params.set("category", travelType);
    if (travellers)  params.set("travellers", travellers);
    if (budget)      params.set("budget", budget);

    if (destination || travelType) {
      router.push(`/packages?${params.toString()}`);
    } else {
      router.push("/contact?type=plan");
    }
  }

  return (
    <section
      className="relative z-10 -mt-20 pb-12 px-4 sm:px-6 lg:px-8"
      aria-label="Trip planner"
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="max-w-5xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-planner border border-charcoal-100/50 overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-charcoal-100">
            <h2 className="text-base font-semibold text-charcoal">Find Your Perfect Trip</h2>
            <p className="text-sm text-charcoal-400 mt-0.5">Tell us what you&apos;re looking for</p>
          </div>

          <form onSubmit={handleSearch} noValidate>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Destination */}
              <div className="lg:col-span-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-400 mb-2">
                  Where to?
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                  <input
                    type="text"
                    placeholder="Destination or country"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    list="destination-list"
                    className="w-full h-11 pl-9 pr-3 rounded-xl border border-charcoal-100 text-sm bg-off-white text-charcoal placeholder:text-charcoal-300
                               focus:outline-none focus:ring-2 focus:ring-vayu-600 focus:ring-offset-0 transition-colors"
                    aria-label="Enter destination"
                  />
                  <datalist id="destination-list">
                    {popularDestinations.map((d) => (
                      <option key={d} value={d} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Travel type */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-400 mb-2">
                  Trip Type
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 z-10 pointer-events-none" />
                  <Select value={travelType} onValueChange={setTravelType}>
                    <SelectTrigger className="h-11 pl-9 rounded-xl border-charcoal-100 bg-off-white text-sm">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {travelTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Travellers */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-400 mb-2">
                  Travellers
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 z-10 pointer-events-none" />
                  <Select value={travellers} onValueChange={setTravellers}>
                    <SelectTrigger className="h-11 pl-9 rounded-xl border-charcoal-100 bg-off-white text-sm">
                      <SelectValue placeholder="How many?" />
                    </SelectTrigger>
                    <SelectContent>
                      {["1", "2", "3–4", "5–8", "9–15", "15+"].map((n) => (
                        <SelectItem key={n} value={n}>{n} {n === "1" ? "person" : "people"}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-400 mb-2">
                  Budget (per person)
                </label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 z-10 pointer-events-none" />
                  <Select value={budget} onValueChange={setBudget}>
                    <SelectTrigger className="h-11 pl-9 rounded-xl border-charcoal-100 bg-off-white text-sm">
                      <SelectValue placeholder="Budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetRanges.map((b) => (
                        <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-charcoal-100 pt-4">
              <p className="text-xs text-charcoal-400">
                Not sure yet?{" "}
                <a href="/contact?type=plan" className="text-vayu-700 font-medium hover:text-vayu-900 transition-colors">
                  Speak to a travel expert →
                </a>
              </p>
              <Button type="submit" size="lg" className="gap-2 min-w-[160px]">
                <Search className="w-4 h-4" />
                Find My Trip
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
