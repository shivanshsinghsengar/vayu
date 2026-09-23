"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";
import { whatsappUrl } from "@/lib/utils";

const schema = z.object({
  name:         z.string().min(2, "Name is required"),
  phone:        z.string().min(10, "Valid phone number required"),
  email:        z.string().email("Valid email required").or(z.literal("")),
  destination:  z.string().optional(),
  travel_dates: z.string().optional(),
  travellers:   z.string().optional(),
  travel_type:  z.string().optional(),
  budget:       z.string().optional(),
  message:      z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") ?? "general";
  const packageSlug = searchParams.get("package");

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", destination: searchParams.get("destination") ?? "" },
  });

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source: type === "quote" ? "package_page" : type === "plan" ? "contact_page" : "contact_page",
          package_slug: packageSlug,
        }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      toast.error("Something went wrong. Please try again or WhatsApp us.");
    } finally {
      setSubmitting(false);
    }
  }

  const title =
    type === "quote" ? "Request a Quote" :
    type === "plan"  ? "Plan My Trip" :
    "Contact Us";

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-vayu-950 pt-28 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-xs text-vayu-400">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li className="text-vayu-600">/</li>
              <li className="text-white">Contact</li>
            </ol>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{title}</h1>
          <p className="mt-2 text-vayu-300 text-base max-w-lg">
            Tell us about your trip. Our travel expert will get back to you promptly.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            {done ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-10 shadow-card text-center"
              >
                <div className="w-16 h-16 rounded-full bg-vayu-100 flex items-center justify-center mx-auto mb-5">
                  <Check className="w-8 h-8 text-vayu-700" />
                </div>
                <h2 className="text-xl font-semibold text-charcoal mb-2">Thank you!</h2>
                <p className="text-charcoal-500 text-sm max-w-xs mx-auto">
                  We&apos;ve received your enquiry. Our travel expert will contact you shortly.
                </p>
                <Button asChild className="mt-6">
                  <Link href="/">Back to Home</Link>
                </Button>
              </motion.div>
            ) : (
              <div className="bg-white rounded-2xl p-7 shadow-card border border-charcoal-100">
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" {...register("name")} placeholder="Your full name" className="mt-1.5" />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" type="tel" {...register("phone")} placeholder="+91 XXXXX XXXXX" className="mt-1.5" />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" {...register("email")} placeholder="you@email.com" className="mt-1.5" />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="destination">Destination</Label>
                      <Input id="destination" {...register("destination")} placeholder="Where do you want to go?" className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="travel_dates">Travel Dates</Label>
                      <Input id="travel_dates" {...register("travel_dates")} placeholder="e.g. Jan 15 – Jan 22" className="mt-1.5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label>Number of Travellers</Label>
                      <Select onValueChange={(v) => setValue("travellers", v)}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="How many?" />
                        </SelectTrigger>
                        <SelectContent>
                          {["1", "2", "3", "4", "5–8", "9–15", "15+"].map((n) => (
                            <SelectItem key={n} value={n}>{n}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Trip Type</Label>
                      <Select onValueChange={(v) => setValue("travel_type", v)}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Honeymoon", "Family", "Couple", "Group", "Adventure", "Luxury", "MICE"].map((t) => (
                            <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Budget Range (per person)</Label>
                    <Select onValueChange={(v) => setValue("budget", v)}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          ["under-25k", "Under ₹25,000"],
                          ["25k-50k", "₹25,000 – ₹50,000"],
                          ["50k-1l", "₹50,000 – ₹1,00,000"],
                          ["1l-2l", "₹1,00,000 – ₹2,00,000"],
                          ["2l-plus", "₹2,00,000+"],
                        ].map(([v, l]) => (
                          <SelectItem key={v} value={v}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" {...register("message")} placeholder="Tell us more about your travel plans, preferences or questions…" className="mt-1.5 min-h-[100px]" />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                    {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending…</> : "Send Enquiry"}
                  </Button>

                  <p className="text-xs text-charcoal-400 text-center">
                    Or{" "}
                    <a href={whatsappUrl("Hi Vayu Holidays! I'd like to plan a trip.")} target="_blank" rel="noopener noreferrer" className="text-vayu-700 font-medium hover:underline">
                      WhatsApp us directly →
                    </a>
                  </p>
                </form>
              </div>
            )}
          </div>

          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-vayu-950 rounded-2xl p-7 text-white">
              <h2 className="text-lg font-semibold mb-5">Get in Touch</h2>
              <div className="space-y-4">
                <a href="#" className="flex items-start gap-3 text-vayu-300 hover:text-white transition-colors">
                  <Phone className="w-5 h-5 shrink-0 mt-0.5 text-vayu-500" />
                  <div>
                    <p className="text-xs text-vayu-500 mb-0.5">Phone</p>
                    <p className="text-sm">Contact number — coming soon</p>
                  </div>
                </a>
                <a href="mailto:info@vayuholidays.com" className="flex items-start gap-3 text-vayu-300 hover:text-white transition-colors">
                  <Mail className="w-5 h-5 shrink-0 mt-0.5 text-vayu-500" />
                  <div>
                    <p className="text-xs text-vayu-500 mb-0.5">Email</p>
                    <p className="text-sm">info@vayuholidays.com</p>
                  </div>
                </a>
                <div className="flex items-start gap-3 text-vayu-300">
                  <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-vayu-500" />
                  <div>
                    <p className="text-xs text-vayu-500 mb-0.5">Office</p>
                    <address className="not-italic text-sm leading-relaxed">
                      Raksha Vihar, Vayu Residency,<br />
                      Airport Road, Bhopal,<br />
                      Madhya Pradesh, India
                    </address>
                  </div>
                </div>
              </div>

              <Button asChild variant="whatsapp" size="lg" className="w-full mt-7">
                <a href={whatsappUrl("Hi Vayu Holidays! I'd like to plan a trip.")} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                </a>
              </Button>
            </div>

            <div className="bg-vayu-50 rounded-2xl p-6 border border-vayu-100">
              <h3 className="font-semibold text-charcoal text-sm mb-3">Management</h3>
              <ul className="space-y-3">
                {[
                  { name: "Simran Singh Sengar",  role: "Chairman" },
                  { name: "Shubham Vishwkarma",   role: "Managing Director & CEO" },
                  { name: "Hardik Singh Sengar",  role: "Director" },
                ].map((m) => (
                  <li key={m.name}>
                    <p className="font-medium text-charcoal text-sm">{m.name}</p>
                    <p className="text-xs text-charcoal-400">{m.role}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
