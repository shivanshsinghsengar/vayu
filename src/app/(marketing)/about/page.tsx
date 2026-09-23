import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Headphones, Map, Compass, LifeBuoy, MessageSquare, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Vayu Holidays — Bhopal's premium travel agency. Meet our management team and discover our commitment to thoughtfully planned travel.",
  alternates: { canonical: "/about" },
};

const management = [
  { name: "Simran Singh Sengar",  role: "Chairman",                 initial: "S" },
  { name: "Shubham Vishwkarma",   role: "Managing Director & CEO",  initial: "S" },
  { name: "Hardik Singh Sengar",  role: "Director",                 initial: "H" },
];

const values = [
  { icon: Headphones, title: "Expert Guidance",        desc: "Knowledgeable travel experts who genuinely care about your journey." },
  { icon: Map,        title: "Tailored Planning",      desc: "Every itinerary is crafted specifically for you." },
  { icon: Compass,    title: "Curated Experiences",    desc: "We go beyond the surface to find authentic, memorable experiences." },
  { icon: LifeBuoy,   title: "End-to-End Support",     desc: "From first enquiry to safe return — we're with you throughout." },
  { icon: MessageSquare, title: "Open Communication", desc: "Transparent pricing, honest advice and clear communication always." },
  { icon: Users,      title: "People First",           desc: "We build relationships, not just bookings." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="relative overflow-hidden bg-vayu-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 text-vayu-400 text-xs font-semibold uppercase tracking-widest mb-5">
            <span className="w-8 h-0.5 bg-vayu-700 rounded-full" />
            About Vayu Holidays
            <span className="w-8 h-0.5 bg-vayu-700 rounded-full" />
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Travel Planned with Care
          </h1>
          <p className="mt-5 text-vayu-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Vayu Holidays is a premium travel agency based in Bhopal, Madhya Pradesh. We specialize in
            thoughtfully planned holidays — domestic and international — tailored to each traveller.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 mb-20 items-center">
          <div>
            <span className="section-label mb-4">Our Story</span>
            <h2 className="text-3xl font-bold text-charcoal mt-2 mb-5">
              Built for Travellers Who Want More
            </h2>
            <div className="space-y-4 text-charcoal-600 text-sm leading-relaxed">
              <p>
                Vayu Holidays was founded with a clear purpose: to make travel planning honest, personal and genuinely enjoyable. Based in the heart of Bhopal, we work with travellers across India to plan domestic and international holidays that feel exactly right.
              </p>
              <p>
                Our office at Raksha Vihar, Vayu Residency on Airport Road is home to a team that loves travel as much as our clients do. We take time to understand what each traveller is looking for and then plan accordingly — not according to a template.
              </p>
              <p>
                From a quiet backwater stay in Kerala to a luxury resort in Maldives or a family trip to Rajasthan — we handle every detail with the same care.
              </p>
            </div>
            <div className="mt-8 flex gap-3">
              <Button asChild size="lg">
                <Link href="/contact?type=plan">Plan Your Trip</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/packages">Browse Packages</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-card-lg">
            <Image
              src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=900&q=80"
              alt="Travel planning at Vayu Holidays"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Values */}
        <section className="mb-20" aria-labelledby="values-heading">
          <div className="text-center mb-12">
            <span className="section-label justify-center">
              <span className="divider-accent" /> Our Values <span className="divider-accent" />
            </span>
            <h2 id="values-heading" className="mt-4 text-3xl font-bold text-charcoal">How We Work</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="p-6 bg-white rounded-2xl shadow-card border border-charcoal-100 hover:shadow-card-md transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-vayu-50 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-vayu-700" />
                </div>
                <h3 className="font-semibold text-charcoal text-base mb-2">{v.title}</h3>
                <p className="text-charcoal-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Management */}
        <section aria-labelledby="team-heading">
          <div className="text-center mb-12">
            <span className="section-label justify-center">
              <span className="divider-accent" /> Leadership <span className="divider-accent" />
            </span>
            <h2 id="team-heading" className="mt-4 text-3xl font-bold text-charcoal">Our Management</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {management.map((m) => (
              <div key={m.name} className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-vayu-100 text-vayu-700 text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-card">
                  {m.initial}
                </div>
                <h3 className="font-semibold text-charcoal">{m.name}</h3>
                <p className="text-sm text-vayu-700 mt-1">{m.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
