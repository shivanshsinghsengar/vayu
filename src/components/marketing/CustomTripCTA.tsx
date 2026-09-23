"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";

// ─── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
  name:         z.string().min(2, "Name is required"),
  phone:        z.string().min(10, "Enter a valid phone number"),
  email:        z.string().email("Enter a valid email").or(z.literal("")),
  destination:  z.string().min(1, "Please enter a destination"),
  travel_dates: z.string().optional(),
  travellers:   z.string().min(1, "How many travellers?"),
  travel_type:  z.string().min(1, "Select a trip type"),
  budget:       z.string().optional(),
  preferences:  z.string().optional(),
  special_req:  z.string().optional(),
});

type FormData = z.infer<typeof schema>;

// ─── Multi-step form ───────────────────────────────────────────────────────────

const steps = [
  { label: "Your Details", fields: ["name", "phone", "email"] },
  { label: "Trip Details", fields: ["destination", "travel_dates", "travellers", "travel_type"] },
  { label: "Preferences",  fields: ["budget", "preferences", "special_req"] },
];

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2" aria-label="Form progress">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`transition-all duration-300 rounded-full ${
            i < current ? "w-5 h-2 bg-vayu-700" :
            i === current ? "w-8 h-2 bg-vayu-700" :
            "w-2 h-2 bg-charcoal-200"
          }`}
          aria-current={i === current ? "step" : undefined}
        />
      ))}
    </div>
  );
}

function CustomTripModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch, trigger } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", preferences: "", special_req: "", budget: "", travel_dates: "" },
  });

  async function nextStep() {
    const fields = steps[step].fields as (keyof FormData)[];
    const valid = await trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "custom_trip" }),
      });
      if (!res.ok) throw new Error("Failed");
      setDone(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10 px-6"
      >
        <div className="w-16 h-16 rounded-full bg-vayu-100 flex items-center justify-center mx-auto mb-5">
          <Check className="w-8 h-8 text-vayu-700" />
        </div>
        <h3 className="text-xl font-semibold text-charcoal mb-2">Request Received!</h3>
        <p className="text-charcoal-500 text-sm max-w-xs mx-auto leading-relaxed">
          Our travel expert will get in touch with you shortly to discuss your trip.
        </p>
        <Button onClick={onClose} className="mt-6">Done</Button>
      </motion.div>
    );
  }

  return (
    <div className="max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-4 border-b border-charcoal-100">
        <div>
          <h2 className="text-lg font-semibold text-charcoal">Create My Trip</h2>
          <p className="text-sm text-charcoal-400 mt-0.5">{steps[step].label}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-charcoal-400 hover:bg-charcoal-100 hover:text-charcoal transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress */}
      <div className="px-6 py-3 flex items-center justify-between">
        <StepDots current={step} total={steps.length} />
        <span className="text-xs text-charcoal-400">Step {step + 1} of {steps.length}</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="px-6 py-4 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* Step 0 */}
              {step === 0 && (
                <>
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
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" {...register("email")} placeholder="you@email.com" className="mt-1.5" />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                  </div>
                </>
              )}

              {/* Step 1 */}
              {step === 1 && (
                <>
                  <div>
                    <Label htmlFor="destination">Destination *</Label>
                    <Input id="destination" {...register("destination")} placeholder="Where do you want to go?" className="mt-1.5" />
                    {errors.destination && <p className="text-xs text-red-500 mt-1">{errors.destination.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="travel_dates">Travel Dates</Label>
                    <Input id="travel_dates" type="text" {...register("travel_dates")} placeholder="e.g. Dec 20 – Dec 28" className="mt-1.5" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Number of Travellers *</Label>
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
                      {errors.travellers && <p className="text-xs text-red-500 mt-1">{errors.travellers.message}</p>}
                    </div>
                    <div>
                      <Label>Trip Type *</Label>
                      <Select onValueChange={(v) => setValue("travel_type", v)}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Trip type" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Honeymoon", "Family", "Couple", "Group", "Adventure", "Luxury", "MICE"].map((t) => (
                            <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.travel_type && <p className="text-xs text-red-500 mt-1">{errors.travel_type.message}</p>}
                    </div>
                  </div>
                </>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <>
                  <div>
                    <Label>Budget Range (per person)</Label>
                    <Select onValueChange={(v) => setValue("budget", v)}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select budget" />
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
                    <Label htmlFor="preferences">Preferences</Label>
                    <Textarea
                      id="preferences"
                      {...register("preferences")}
                      placeholder="Adventure, beach, mountains, food, culture..."
                      className="mt-1.5 min-h-[80px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="special_req">Special Requirements</Label>
                    <Textarea
                      id="special_req"
                      {...register("special_req")}
                      placeholder="Dietary needs, accessibility, celebrations..."
                      className="mt-1.5 min-h-[80px]"
                    />
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex justify-between items-center pt-2 border-t border-charcoal-100">
          {step > 0 ? (
            <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          ) : (
            <div />
          )}

          {step < steps.length - 1 ? (
            <Button type="button" onClick={nextStep}>
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button type="submit" disabled={submitting}>
              {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting…</> : "Submit Request"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────────

export function CustomTripCTA() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section
        className="relative py-28 lg:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden"
        aria-labelledby="custom-trip-heading"
      >
        {/* Background */}
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-vayu-950/80" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label text-vayu-400 justify-center mb-4">
              <span className="w-8 h-0.5 bg-vayu-600 rounded-full" />
              Custom Trips
              <span className="w-8 h-0.5 bg-vayu-600 rounded-full" />
            </span>
            <h2
              id="custom-trip-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mt-4"
            >
              Can&apos;t Find the Perfect Package?
            </h2>
            <p className="mt-5 text-vayu-300 text-lg max-w-xl mx-auto leading-relaxed">
              Tell us what you have in mind. We&apos;ll help turn it into your journey.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="xl"
                variant="white"
                onClick={() => setOpen(true)}
              >
                Create My Trip
              </Button>
              <Button
                asChild size="xl"
                className="bg-vayu-700/80 hover:bg-vayu-700 border border-white/20 backdrop-blur-sm"
              >
                <a
                  href="https://wa.me/919999999999?text=Hi, I'd like to plan a custom trip with Vayu Holidays."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp Us
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.25 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white rounded-2xl shadow-float overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Create My Trip form"
            >
              <CustomTripModal onClose={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
