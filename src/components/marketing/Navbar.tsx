"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, ChevronDown, Phone, MessageCircle, MapPin, Globe,
  Plane, Heart, Users, Briefcase, Compass, Star, Hotel, Bus, Train,
  FileText, BookOpen, DollarSign, Shield, Car, Package, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, whatsappUrl, phoneUrl } from "@/lib/utils";

// ─── Nav data ─────────────────────────────────────────────────────────────────

const destinations = [
  { label: "Kashmir",      href: "/destinations/kashmir",       flag: "🏔️" },
  { label: "Goa",          href: "/destinations/goa",           flag: "🏖️" },
  { label: "Kerala",       href: "/destinations/kerala",        flag: "🌴" },
  { label: "Rajasthan",    href: "/destinations/rajasthan",     flag: "🏰" },
  { label: "Himachal",     href: "/destinations/himachal-pradesh", flag: "⛰️" },
  { label: "Andaman",      href: "/destinations/andaman",       flag: "🌊" },
  { label: "Dubai",        href: "/destinations/dubai",         flag: "🌆" },
  { label: "Thailand",     href: "/destinations/thailand",      flag: "🛕" },
  { label: "Bali",         href: "/destinations/bali",          flag: "🌺" },
  { label: "Maldives",     href: "/destinations/maldives",      flag: "🐠" },
  { label: "Singapore",    href: "/destinations/singapore",     flag: "🦁" },
  { label: "Europe",       href: "/destinations/europe",        flag: "🗼" },
];

const holidays = [
  { label: "Holiday Packages",  href: "/packages",                 icon: Package },
  { label: "Domestic Tours",    href: "/packages?category=domestic", icon: MapPin },
  { label: "International",     href: "/packages?category=international", icon: Globe },
  { label: "Honeymoon",         href: "/packages?category=honeymoon", icon: Heart },
  { label: "Group Tours",       href: "/packages?category=group",  icon: Users },
  { label: "Customized Tours",  href: "/packages?category=customized", icon: Settings },
  { label: "MICE",              href: "/packages?category=mice",   icon: Briefcase },
];

const experiences = [
  { label: "Honeymoon",  href: "/experiences/honeymoon",  icon: Heart },
  { label: "Family",     href: "/experiences/family",     icon: Users },
  { label: "Adventure",  href: "/experiences/adventure",  icon: Compass },
  { label: "Luxury",     href: "/experiences/luxury",     icon: Star },
];

const services = [
  { label: "Flight Booking",     href: "/services/flight-booking",     icon: Plane },
  { label: "Hotel Booking",      href: "/services/hotel-booking",      icon: Hotel },
  { label: "Bus Tickets",        href: "/services/bus-tickets",        icon: Bus },
  { label: "Train Tickets",      href: "/services/train-tickets",      icon: Train },
  { label: "Visa Assistance",    href: "/services/visa-assistance",    icon: FileText },
  { label: "Passport",           href: "/services/passport-assistance", icon: BookOpen },
  { label: "Forex / Currency",   href: "/services/forex-currency",     icon: DollarSign },
  { label: "Travel Insurance",   href: "/services/travel-insurance",   icon: Shield },
  { label: "Airport Transfer",   href: "/services/airport-transfer",   icon: Car },
];

const mainNav = [
  { label: "Destinations", megaMenu: "destinations" },
  { label: "Holidays",     megaMenu: "holidays" },
  { label: "Experiences",  megaMenu: "experiences" },
  { label: "Services",     megaMenu: "services" },
  { label: "About",        href: "/about" },
  { label: "Travel Stories", href: "/blog" },
] as const;

type MegaMenuKey = "destinations" | "holidays" | "experiences" | "services" | null;

// ─── Mega Menu Panels ─────────────────────────────────────────────────────────

function DestinationsMega({ onClose }: { onClose: () => void }) {
  return (
    <div className="grid grid-cols-2 gap-8 p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-vayu-700 mb-4">India</p>
        <div className="grid grid-cols-2 gap-1">
          {destinations.filter((_, i) => i < 6).map(d => (
            <Link key={d.href} href={d.href} onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-charcoal hover:bg-vayu-50 hover:text-vayu-700 transition-colors">
              <span className="text-base">{d.flag}</span>
              {d.label}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-vayu-700 mb-4">International</p>
        <div className="grid grid-cols-2 gap-1">
          {destinations.filter((_, i) => i >= 6).map(d => (
            <Link key={d.href} href={d.href} onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-charcoal hover:bg-vayu-50 hover:text-vayu-700 transition-colors">
              <span className="text-base">{d.flag}</span>
              {d.label}
            </Link>
          ))}
        </div>
        <Link href="/destinations" onClick={onClose}
          className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-vayu-700 hover:text-vayu-900 transition-colors">
          View all destinations →
        </Link>
      </div>
    </div>
  );
}

function HolidaysMega({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-vayu-700 mb-4">Holiday Types</p>
      <div className="grid grid-cols-2 gap-1">
        {holidays.map(h => (
          <Link key={h.href} href={h.href} onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-charcoal hover:bg-vayu-50 hover:text-vayu-700 transition-colors">
            <h.icon className="w-4 h-4 text-vayu-600 shrink-0" />
            {h.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function ExperiencesMega({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-vayu-700 mb-4">Travel Experiences</p>
      <div className="grid grid-cols-2 gap-1">
        {experiences.map(e => (
          <Link key={e.href} href={e.href} onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-charcoal hover:bg-vayu-50 hover:text-vayu-700 transition-colors">
            <e.icon className="w-4 h-4 text-vayu-600 shrink-0" />
            {e.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function ServicesMega({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-vayu-700 mb-4">Travel Services</p>
      <div className="grid grid-cols-3 gap-1">
        {services.map(s => (
          <Link key={s.href} href={s.href} onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-charcoal hover:bg-vayu-50 hover:text-vayu-700 transition-colors">
            <s.icon className="w-4 h-4 text-vayu-600 shrink-0" />
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

function VayuLogo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 group" aria-label="Vayu Holidays Home">
      {/* Icon mark */}
      <div className={cn(
        "w-9 h-9 rounded-xl flex items-center justify-center",
        inverted ? "bg-white/15" : "bg-vayu-700"
      )}>
        <Plane className={cn("w-5 h-5 rotate-45", inverted ? "text-white" : "text-white")} />
      </div>
      {/* Word mark */}
      <div className="flex flex-col leading-none">
        <span className={cn(
          "font-bold text-lg tracking-tight",
          inverted ? "text-white" : "text-charcoal"
        )}>
          Vayu
        </span>
        <span className={cn(
          "text-xs font-medium tracking-[0.15em] uppercase",
          inverted ? "text-white/70" : "text-vayu-600"
        )}>
          Holidays
        </span>
      </div>
    </Link>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────

export function Navbar() {
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [activeMenu, setActiveMenu]     = useState<MegaMenuKey>(null);
  const [activeMobile, setActiveMobile] = useState<string | null>(null);
  const pathname = usePathname();
  const menuRef  = useRef<HTMLDivElement>(null);

  const isHeroPage = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mega menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
    setActiveMenu(null);
  }, [pathname]);

  const isTransparent = isHeroPage && !scrolled && !mobileOpen;

  return (
    <>
      <header
        ref={menuRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isTransparent
            ? "bg-transparent"
            : "bg-white/95 backdrop-blur-md shadow-card border-b border-charcoal-100"
        )}
        role="banner"
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-[70px]"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <VayuLogo inverted={isTransparent} />

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1" role="list">
            {mainNav.map((item) => {
              const isActive = item.megaMenu === activeMenu;
              const isPath   = "href" in item && pathname.startsWith(item.href as string);

              if ("megaMenu" in item) {
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => setActiveMenu(isActive ? null : item.megaMenu as MegaMenuKey)}
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isTransparent
                          ? "text-white/90 hover:text-white hover:bg-white/10"
                          : "text-charcoal-600 hover:text-charcoal hover:bg-charcoal-100/60",
                        isActive && (isTransparent ? "bg-white/15 text-white" : "bg-vayu-50 text-vayu-700")
                      )}
                      aria-expanded={isActive}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", isActive && "rotate-180")} />
                    </button>
                  </li>
                );
              }

              return (
                <li key={item.label}>
                  <Link
                    href={item.href as string}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isTransparent
                        ? "text-white/90 hover:text-white hover:bg-white/10"
                        : "text-charcoal-600 hover:text-charcoal hover:bg-charcoal-100/60",
                      isPath && (isTransparent ? "text-white" : "text-vayu-700")
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop right CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            <a
              href={phoneUrl()}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isTransparent
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-charcoal-500 hover:text-charcoal hover:bg-charcoal-100/60"
              )}
              aria-label="Call us"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Call Us</span>
            </a>
            <a
              href={whatsappUrl("Hi, I'd like to plan a trip with Vayu Holidays.")}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isTransparent
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-[#25D366] hover:bg-green-50"
              )}
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">WhatsApp</span>
            </a>
            <Button asChild size="default" variant="default"
              className={cn(isTransparent && "bg-white text-vayu-800 hover:bg-cream shadow-md")}>
              <Link href="/contact?type=plan">Plan My Trip</Link>
            </Button>
          </div>

          {/* Mobile right */}
          <div className="flex lg:hidden items-center gap-2">
            <Button asChild size="sm" variant={isTransparent ? "white" : "default"}>
              <Link href="/contact?type=plan">Plan Trip</Link>
            </Button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isTransparent ? "text-white hover:bg-white/10" : "text-charcoal hover:bg-charcoal-100"
              )}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute left-0 right-0 top-full bg-white shadow-card-lg border-t border-charcoal-100"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {activeMenu === "destinations" && <DestinationsMega onClose={() => setActiveMenu(null)} />}
                {activeMenu === "holidays"     && <HolidaysMega     onClose={() => setActiveMenu(null)} />}
                {activeMenu === "experiences"  && <ExperiencesMega  onClose={() => setActiveMenu(null)} />}
                {activeMenu === "services"     && <ServicesMega     onClose={() => setActiveMenu(null)} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-40 bg-white overflow-y-auto lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-charcoal-100">
              <VayuLogo />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-charcoal hover:bg-charcoal-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 py-6 space-y-1">
              {mainNav.map((item) => {
                if ("megaMenu" in item) {
                  const isOpen = activeMobile === item.label;
                  const subItems =
                    item.megaMenu === "destinations" ? destinations :
                    item.megaMenu === "holidays"     ? holidays :
                    item.megaMenu === "experiences"  ? experiences :
                    item.megaMenu === "services"     ? services : [];

                  return (
                    <div key={item.label}>
                      <button
                        onClick={() => setActiveMobile(isOpen ? null : item.label)}
                        className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-medium text-charcoal hover:bg-vayu-50 hover:text-vayu-700 transition-colors"
                        aria-expanded={isOpen}
                      >
                        {item.label}
                        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 py-2 space-y-0.5">
                              {subItems.map((sub) => (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-charcoal-600 hover:bg-vayu-50 hover:text-vayu-700 transition-colors"
                                >
                                  {"flag" in sub ? (
                                    <span className="text-base">{sub.flag}</span>
                                  ) : "icon" in sub ? (
                                    <sub.icon className="w-4 h-4 text-vayu-600 shrink-0" />
                                  ) : null}
                                  {sub.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href as string}
                    className={cn(
                      "flex px-4 py-3 rounded-xl text-base font-medium transition-colors",
                      pathname.startsWith(item.href as string)
                        ? "bg-vayu-50 text-vayu-700"
                        : "text-charcoal hover:bg-vayu-50 hover:text-vayu-700"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Contact section */}
            <div className="px-4 py-4 border-t border-charcoal-100 space-y-3 mt-2">
              <Button asChild size="lg" className="w-full">
                <Link href="/contact?type=plan">Plan My Trip</Link>
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="outline" size="default" className="w-full">
                  <a href={phoneUrl()}>
                    <Phone className="w-4 h-4 mr-1" /> Call Us
                  </a>
                </Button>
                <Button asChild variant="whatsapp" size="default" className="w-full">
                  <a href={whatsappUrl("Hi, I'd like to plan a trip.")} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
