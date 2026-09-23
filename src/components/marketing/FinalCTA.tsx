"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/utils";

export function FinalCTA() {
  return (
    <section
      className="relative py-32 lg:py-44 px-4 sm:px-6 lg:px-8 overflow-hidden"
      aria-labelledby="final-cta-heading"
    >
      {/* Background image */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-vayu-950/85 via-vayu-900/70 to-charcoal/80" />
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          <h2
            id="final-cta-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] text-balance"
          >
            Where will your next story begin?
          </h2>
          <p className="mt-6 text-white/75 text-lg max-w-lg mx-auto leading-relaxed">
            Let Vayu Holidays help you plan it.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="xl" variant="white">
              <Link href="/contact?type=plan">Plan My Trip</Link>
            </Button>
            <Button
              asChild
              size="xl"
              className="bg-[#25D366] hover:bg-[#20bc5b] text-white gap-2"
            >
              <a
                href={whatsappUrl("Hi Vayu Holidays! I'd like to plan a trip.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
