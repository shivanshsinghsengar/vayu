import React from "react";
import Link from "next/link";
import { Plane, MapPin, Phone, Mail, Instagram, Facebook, Youtube, Twitter, MessageCircle } from "lucide-react";
import { whatsappUrl, phoneUrl } from "@/lib/utils";

const quickLinks = [
  { label: "Holiday Packages", href: "/packages" },
  { label: "Destinations",     href: "/destinations" },
  { label: "Services",         href: "/services" },
  { label: "Travel Stories",   href: "/blog" },
  { label: "About Us",         href: "/about" },
  { label: "Contact",          href: "/contact" },
];

const destinationLinks = [
  { label: "Kashmir",     href: "/destinations/kashmir" },
  { label: "Goa",         href: "/destinations/goa" },
  { label: "Kerala",      href: "/destinations/kerala" },
  { label: "Dubai",       href: "/destinations/dubai" },
  { label: "Bali",        href: "/destinations/bali" },
  { label: "Maldives",    href: "/destinations/maldives" },
];

const legalLinks = [
  { label: "Privacy Policy",    href: "/privacy" },
  { label: "Terms & Conditions",href: "/terms" },
  { label: "Cookie Policy",     href: "/cookies" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-vayu-700 flex items-center justify-center">
                <Plane className="w-5 h-5 text-white rotate-45" />
              </div>
              <div className="leading-none">
                <span className="font-bold text-lg text-white block">Vayu</span>
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-vayu-400">Holidays</span>
              </div>
            </div>

            <p className="text-charcoal-300 text-sm leading-relaxed max-w-xs">
              Thoughtfully planned holidays, unforgettable destinations and personalized travel experiences.
            </p>

            {/* Address */}
            <address className="not-italic mt-5 space-y-2">
              <div className="flex items-start gap-2 text-sm text-charcoal-300">
                <MapPin className="w-4 h-4 text-vayu-500 shrink-0 mt-0.5" />
                <span>Raksha Vihar, Vayu Residency,<br />Airport Road, Bhopal,<br />Madhya Pradesh, India</span>
              </div>
              <a
                href={phoneUrl()}
                className="flex items-center gap-2 text-sm text-charcoal-300 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-vayu-500 shrink-0" />
                <span>Contact number — coming soon</span>
              </a>
              <a
                href="mailto:info@vayuholidays.com"
                className="flex items-center gap-2 text-sm text-charcoal-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-vayu-500 shrink-0" />
                <span>info@vayuholidays.com</span>
              </a>
            </address>

            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Instagram,       href: "#", label: "Instagram" },
                { icon: Facebook,        href: "#", label: "Facebook" },
                { icon: Youtube,         href: "#", label: "YouTube" },
                { icon: Twitter,         href: "#", label: "Twitter / X" },
                { icon: MessageCircle,   href: whatsappUrl(), label: "WhatsApp" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href !== "#" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-charcoal-700 flex items-center justify-center text-charcoal-300 hover:bg-vayu-700 hover:text-white transition-all duration-200"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-5">
              Quick Links
            </h3>
            <ul className="space-y-2.5" role="list">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-charcoal-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-5">
              Top Destinations
            </h3>
            <ul className="space-y-2.5" role="list">
              {destinationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-charcoal-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/destinations" className="text-sm text-vayu-400 hover:text-vayu-300 transition-colors font-medium">
                  View all →
                </Link>
              </li>
            </ul>
          </div>

          {/* Management */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-5">
              Management
            </h3>
            <ul className="space-y-4" role="list">
              {[
                { name: "Simran Singh Sengar",  role: "Chairman" },
                { name: "Shubham Vishwkarma",   role: "Managing Director & CEO" },
                { name: "Hardik Singh Sengar",  role: "Director" },
              ].map((m) => (
                <li key={m.name}>
                  <p className="text-sm text-white font-medium">{m.name}</p>
                  <p className="text-xs text-charcoal-400 mt-0.5">{m.role}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-charcoal-700 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-400">
          <p>© {year} Vayu Holidays. All rights reserved.</p>
          <nav aria-label="Legal links">
            <ul className="flex flex-wrap gap-4 justify-center sm:justify-end" role="list">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
