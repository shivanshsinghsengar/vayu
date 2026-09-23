"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import toast from "react-hot-toast";
import type { Destination, Package } from "@/types";

const schema = z.object({
  title:              z.string().min(2, "Title required"),
  slug:               z.string().min(2, "Slug required"),
  destination_id:     z.string().optional(),
  category:           z.string().min(1, "Category required"),
  duration_nights:    z.coerce.number().min(0),
  duration_days:      z.coerce.number().min(1),
  price_starting_from:z.coerce.number().optional(),
  currency:           z.string().default("INR"),
  short_description:  z.string().optional(),
  description:        z.string().optional(),
  hero_image_url:     z.string().url("Valid URL required").or(z.literal("")).optional(),
  hotel_info:         z.string().optional(),
  transport_info:     z.string().optional(),
  terms_and_conditions: z.string().optional(),
  is_featured:        z.boolean().default(false),
  is_published:       z.boolean().default(false),
  seo_title:          z.string().optional(),
  seo_description:    z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const CATEGORIES = [
  "domestic","international","honeymoon","family","group","adventure","luxury","customized","mice"
];

interface Props {
  destinations: Destination[];
  package?: Package;
}

export function PackageForm({ destinations, package: pkg }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [highlights, setHighlights] = useState<string[]>(pkg?.highlights ?? []);
  const [newHighlight, setNewHighlight] = useState("");
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title:               pkg?.title ?? "",
      slug:                pkg?.slug ?? "",
      destination_id:      pkg?.destination_id ?? "",
      category:            pkg?.category ?? "",
      duration_nights:     pkg?.duration_nights ?? 0,
      duration_days:       pkg?.duration_days ?? 1,
      price_starting_from: pkg?.price_starting_from ?? undefined,
      currency:            pkg?.currency ?? "INR",
      short_description:   pkg?.short_description ?? "",
      description:         pkg?.description ?? "",
      hero_image_url:      pkg?.hero_image_url ?? "",
      hotel_info:          pkg?.hotel_info ?? "",
      transport_info:      pkg?.transport_info ?? "",
      terms_and_conditions:pkg?.terms_and_conditions ?? "",
      is_featured:         pkg?.is_featured ?? false,
      is_published:        pkg?.is_published ?? false,
      seo_title:           pkg?.seo_title ?? "",
      seo_description:     pkg?.seo_description ?? "",
    },
  });

  const titleValue = watch("title");

  function autoSlug() {
    if (!pkg) setValue("slug", slugify(titleValue));
  }

  async function onSubmit(data: FormData) {
    setSaving(true);
    const payload = {
      ...data,
      highlights,
      destination_id:      data.destination_id || null,
      price_starting_from: data.price_starting_from || null,
      hero_image_url:      data.hero_image_url || null,
    };

    let error;
    if (pkg) {
      ({ error } = await supabase.from("packages").update(payload).eq("id", pkg.id));
    } else {
      ({ error } = await supabase.from("packages").insert(payload));
    }

    setSaving(false);
    if (error) {
      toast.error(error.message.includes("slug") ? "Slug already exists." : "Failed to save package.");
    } else {
      toast.success(pkg ? "Package updated." : "Package created.");
      router.push("/admin/packages");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {/* Basic info */}
      <section className="bg-white rounded-2xl border border-charcoal-100 shadow-card p-6 space-y-5">
        <h2 className="font-semibold text-charcoal text-sm">Basic Information</h2>

        <div>
          <Label htmlFor="title">Package Title *</Label>
          <Input id="title" {...register("title")} onBlur={autoSlug} className="mt-1.5" placeholder="e.g. Kashmir Escape" />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="slug">URL Slug *</Label>
            <Input id="slug" {...register("slug")} className="mt-1.5" placeholder="kashmir-escape" />
            {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
          </div>
          <div>
            <Label>Category *</Label>
            <Select defaultValue={pkg?.category} onValueChange={(v) => setValue("category", v)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
          </div>
        </div>

        <div>
          <Label>Destination</Label>
          <Select defaultValue={pkg?.destination_id ?? ""} onValueChange={(v) => setValue("destination_id", v)}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No destination</SelectItem>
              {destinations.map((d) => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="duration_nights">Nights</Label>
            <Input id="duration_nights" type="number" min={0} {...register("duration_nights")} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="duration_days">Days</Label>
            <Input id="duration_days" type="number" min={1} {...register("duration_days")} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="price_starting_from">Price (₹)</Label>
            <Input id="price_starting_from" type="number" min={0} {...register("price_starting_from")} className="mt-1.5" placeholder="Leave blank = On Request" />
          </div>
        </div>

        <div>
          <Label htmlFor="hero_image_url">Hero Image URL</Label>
          <Input id="hero_image_url" {...register("hero_image_url")} className="mt-1.5" placeholder="https://..." />
        </div>

        <div>
          <Label htmlFor="short_description">Short Description</Label>
          <Textarea id="short_description" {...register("short_description")} className="mt-1.5 min-h-[80px]" placeholder="One-line summary shown on cards" />
        </div>

        <div>
          <Label htmlFor="description">Full Description</Label>
          <Textarea id="description" {...register("description")} className="mt-1.5 min-h-[160px]" placeholder="Full package overview…" />
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-white rounded-2xl border border-charcoal-100 shadow-card p-6 space-y-4">
        <h2 className="font-semibold text-charcoal text-sm">Highlights</h2>
        <div className="flex gap-2">
          <Input
            value={newHighlight}
            onChange={(e) => setNewHighlight(e.target.value)}
            placeholder="e.g. Dal Lake houseboat"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (newHighlight.trim()) { setHighlights([...highlights, newHighlight.trim()]); setNewHighlight(""); }
              }
            }}
          />
          <Button type="button" variant="outline" onClick={() => {
            if (newHighlight.trim()) { setHighlights([...highlights, newHighlight.trim()]); setNewHighlight(""); }
          }}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {highlights.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {highlights.map((h, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vayu-50 text-vayu-700 text-sm">
                {h}
                <button type="button" onClick={() => setHighlights(highlights.filter((_, j) => j !== i))}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Additional info */}
      <section className="bg-white rounded-2xl border border-charcoal-100 shadow-card p-6 space-y-5">
        <h2 className="font-semibold text-charcoal text-sm">Additional Information</h2>
        <div>
          <Label htmlFor="hotel_info">Hotel Information</Label>
          <Textarea id="hotel_info" {...register("hotel_info")} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="transport_info">Transport Information</Label>
          <Textarea id="transport_info" {...register("transport_info")} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="terms_and_conditions">Terms &amp; Conditions</Label>
          <Textarea id="terms_and_conditions" {...register("terms_and_conditions")} className="mt-1.5 min-h-[120px]" />
        </div>
      </section>

      {/* SEO */}
      <section className="bg-white rounded-2xl border border-charcoal-100 shadow-card p-6 space-y-5">
        <h2 className="font-semibold text-charcoal text-sm">SEO</h2>
        <div>
          <Label htmlFor="seo_title">SEO Title</Label>
          <Input id="seo_title" {...register("seo_title")} className="mt-1.5" placeholder="Overrides page title in search results" />
        </div>
        <div>
          <Label htmlFor="seo_description">SEO Description</Label>
          <Textarea id="seo_description" {...register("seo_description")} className="mt-1.5" placeholder="Max 160 characters" />
        </div>
      </section>

      {/* Publish */}
      <section className="bg-white rounded-2xl border border-charcoal-100 shadow-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("is_published")} className="rounded" />
              <span className="text-sm font-medium text-charcoal">Published</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("is_featured")} className="rounded" />
              <span className="text-sm font-medium text-charcoal">Featured on homepage</span>
            </label>
          </div>
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</> : (pkg ? "Update Package" : "Create Package")}
          </Button>
        </div>
      </section>
    </form>
  );
}
