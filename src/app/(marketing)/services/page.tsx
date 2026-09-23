import type { Metadata } from "next";
import Link from "next/link";
import { ServicesSection } from "@/components/marketing/ServicesSection";
import { FinalCTA } from "@/components/marketing/FinalCTA";

export const metadata: Metadata = {
  title: "Travel Services",
  description:
    "From flights and hotels to visa assistance and travel insurance — Vayu Holidays handles every detail of your journey.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-vayu-950 pt-28 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-xs text-vayu-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li className="text-vayu-600">/</li>
              <li className="text-white">Services</li>
            </ol>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Our Services</h1>
          <p className="mt-2 text-vayu-300 text-base max-w-xl">
            Everything you need for a seamless journey — all under one roof.
          </p>
        </div>
      </div>
      <ServicesSection />
      <FinalCTA />
    </div>
  );
}
