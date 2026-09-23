import type { Metadata } from "next";
import { Hero }                from "@/components/marketing/Hero";
import { TripPlanner }         from "@/components/marketing/TripPlanner";
import { DestinationDiscovery } from "@/components/marketing/DestinationDiscovery";
import { FeaturedPackages }    from "@/components/marketing/FeaturedPackages";
import { ExperienceSection }   from "@/components/marketing/ExperienceSection";
import { WhyVayu }             from "@/components/marketing/WhyVayu";
import { ServicesSection }     from "@/components/marketing/ServicesSection";
import { HowItWorks }          from "@/components/marketing/HowItWorks";
import { Testimonials }        from "@/components/marketing/Testimonials";
import { BlogPreview }         from "@/components/marketing/BlogPreview";
import { CustomTripCTA }       from "@/components/marketing/CustomTripCTA";
import { FinalCTA }            from "@/components/marketing/FinalCTA";

export const metadata: Metadata = {
  title: "Vayu Holidays — Thoughtfully Planned Travel",
  description:
    "Discover thoughtfully planned holidays, unforgettable destinations and personalized travel experiences with Vayu Holidays. Bhopal's premium travel agency for domestic and international tours.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      {/* Hero — full-screen cinematic */}
      <Hero />

      {/* Trip Planner — floats over hero bottom */}
      <TripPlanner />

      {/* Destination Discovery — editorial cards */}
      <DestinationDiscovery />

      {/* Featured Holiday Packages */}
      <FeaturedPackages />

      {/* Travel by Experience */}
      <ExperienceSection />

      {/* Custom Trip CTA */}
      <CustomTripCTA />

      {/* Why Vayu Holidays */}
      <WhyVayu />

      {/* Services Grid */}
      <ServicesSection />

      {/* How It Works */}
      <HowItWorks />

      {/* Testimonials — CMS controlled, hides if empty */}
      <Testimonials />

      {/* Travel Stories / Blog Preview */}
      <BlogPreview />

      {/* Final CTA */}
      <FinalCTA />
    </>
  );
}
