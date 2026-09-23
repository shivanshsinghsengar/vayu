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
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import toast from "react-hot-toast";
import type { Destination } from "@/types";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  country: z.string().default("India"),
  region: z.string().optional(),
  short_description: z.string().optional(),
  description: z.string().optional(),
  hero_image_url: z.string().url().or(z.literal("")).optional(),
  best_time_to_visit: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(false),
});
type FormData = z.infer<typeof schema>;

interface Props { destination?: Destination }

export function DestinationForm({ destination: dest }: Props) {
  const router = useRouter(); const supabase = createClient();
  const [experiences, setExperiences] = useState<string[]>(dest?.popular_experiences ?? []);
  const [tips, setTips]               = useState<string[]>(dest?.travel_tips ?? []);
  const [newExp, setNewExp]           = useState("");
  const [newTip, setNewTip]           = useState("");
  const [saving, setSaving]           = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: dest?.name ?? "", slug: dest?.slug ?? "", country: dest?.country ?? "India",
      region: dest?.region ?? "", short_description: dest?.short_description ?? "",
      description: dest?.description ?? "", hero_image_url: dest?.hero_image_url ?? "",
      best_time_to_visit: dest?.best_time_to_visit ?? "",
      seo_title: dest?.seo_title ?? "", seo_description: dest?.seo_description ?? "",
      is_featured: dest?.is_featured ?? false, is_published: dest?.is_published ?? false,
    },
  });
  const titleValue = watch("name");

  async function onSubmit(data: FormData) {
    setSaving(true);
    const payload = { ...data, popular_experiences: experiences, travel_tips: tips, hero_image_url: data.hero_image_url || null };
    let error;
    if (dest) { ({ error } = await supabase.from("destinations").update(payload).eq("id", dest.id)); }
    else { ({ error } = await supabase.from("destinations").insert(payload)); }
    setSaving(false);
    if (error) { toast.error(error.message.includes("slug") ? "Slug already exists." : "Failed to save."); }
    else { toast.success(dest ? "Updated." : "Created."); router.push("/admin/destinations"); router.refresh(); }
  }

  function addItem(list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, val: string, setVal: React.Dispatch<React.SetStateAction<string>>) {
    if (val.trim()) { setList([...list, val.trim()]); setVal(""); }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="bg-white rounded-2xl border border-charcoal-100 shadow-card p-6 space-y-5">
        <h2 className="font-semibold text-charcoal text-sm">Destination Details</h2>
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input id="name" {...register("name")} onBlur={() => { if (!dest) setValue("slug", slugify(titleValue)); }} className="mt-1.5" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" {...register("slug")} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" {...register("country")} className="mt-1.5" />
          </div>
        </div>
        <div>
          <Label htmlFor="hero_image_url">Hero Image URL</Label>
          <Input id="hero_image_url" {...register("hero_image_url")} className="mt-1.5" placeholder="https://..." />
        </div>
        <div>
          <Label htmlFor="short_description">Short Description</Label>
          <Input id="short_description" {...register("short_description")} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="description">Full Description</Label>
          <Textarea id="description" {...register("description")} className="mt-1.5 min-h-[140px]" />
        </div>
        <div>
          <Label htmlFor="best_time_to_visit">Best Time to Visit</Label>
          <Input id="best_time_to_visit" {...register("best_time_to_visit")} className="mt-1.5" placeholder="e.g. October to March" />
        </div>
      </div>

      {/* Popular Experiences */}
      <div className="bg-white rounded-2xl border border-charcoal-100 shadow-card p-6 space-y-4">
        <h2 className="font-semibold text-charcoal text-sm">Popular Experiences</h2>
        <div className="flex gap-2">
          <Input value={newExp} onChange={(e) => setNewExp(e.target.value)} placeholder="e.g. Shikara ride on Dal Lake"
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(experiences, setExperiences, newExp, setNewExp); } }} />
          <Button type="button" variant="outline" onClick={() => addItem(experiences, setExperiences, newExp, setNewExp)}><Plus className="w-4 h-4" /></Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {experiences.map((e, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vayu-50 text-vayu-700 text-sm">
              {e} <button type="button" onClick={() => setExperiences(experiences.filter((_, j) => j !== i))}><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      </div>

      {/* Travel Tips */}
      <div className="bg-white rounded-2xl border border-charcoal-100 shadow-card p-6 space-y-4">
        <h2 className="font-semibold text-charcoal text-sm">Travel Tips</h2>
        <div className="flex gap-2">
          <Input value={newTip} onChange={(e) => setNewTip(e.target.value)} placeholder="e.g. Carry warm clothes in winter"
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(tips, setTips, newTip, setNewTip); } }} />
          <Button type="button" variant="outline" onClick={() => addItem(tips, setTips, newTip, setNewTip)}><Plus className="w-4 h-4" /></Button>
        </div>
        <div className="space-y-1.5">
          {tips.map((t, i) => (
            <div key={i} className="flex items-center justify-between bg-off-white rounded-lg px-3 py-2 text-sm text-charcoal">
              <span>{t}</span>
              <button type="button" onClick={() => setTips(tips.filter((_, j) => j !== i))}><X className="w-3.5 h-3.5 text-charcoal-400" /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-charcoal-100 shadow-card p-6 space-y-5">
        <h2 className="font-semibold text-charcoal text-sm">SEO</h2>
        <div>
          <Label htmlFor="seo_title">SEO Title</Label>
          <Input id="seo_title" {...register("seo_title")} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="seo_description">SEO Description</Label>
          <Textarea id="seo_description" {...register("seo_description")} className="mt-1.5" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-charcoal-100 shadow-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("is_published")} className="rounded" />
              <span className="text-sm font-medium text-charcoal">Published</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("is_featured")} className="rounded" />
              <span className="text-sm font-medium text-charcoal">Featured</span>
            </label>
          </div>
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : (dest ? "Update" : "Create")}
          </Button>
        </div>
      </div>
    </form>
  );
}
