"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import toast from "react-hot-toast";
import type { BlogPost } from "@/types";

const schema = z.object({
  title:               z.string().min(2, "Title required"),
  slug:                z.string().min(2, "Slug required"),
  excerpt:             z.string().optional(),
  content:             z.string().optional(),
  featured_image_url:  z.string().url().or(z.literal("")).optional(),
  category:            z.string().min(1, "Category required"),
  reading_time_minutes:z.coerce.number().min(1).optional(),
  is_published:        z.boolean().default(false),
  seo_title:           z.string().optional(),
  seo_description:     z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const CATEGORIES = [
  ["destination_guides","Destination Guides"],
  ["travel_tips","Travel Tips"],
  ["honeymoon","Honeymoon"],
  ["family_travel","Family Travel"],
  ["visa_guides","Visa Guides"],
  ["travel_inspiration","Travel Inspiration"],
  ["seasonal_travel","Seasonal Travel"],
];

interface Props { post?: BlogPost }

export function BlogForm({ post }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title:               post?.title ?? "",
      slug:                post?.slug ?? "",
      excerpt:             post?.excerpt ?? "",
      content:             post?.content ?? "",
      featured_image_url:  post?.featured_image_url ?? "",
      category:            post?.category ?? "",
      reading_time_minutes:post?.reading_time_minutes ?? undefined,
      is_published:        post?.is_published ?? false,
      seo_title:           post?.seo_title ?? "",
      seo_description:     post?.seo_description ?? "",
    },
  });

  const titleValue = watch("title");

  async function onSubmit(data: FormData) {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    const payload = {
      ...data,
      author_id:          user?.id ?? null,
      featured_image_url: data.featured_image_url || null,
      published_at:       data.is_published ? new Date().toISOString() : null,
    };

    let error;
    if (post) {
      ({ error } = await supabase.from("blogs").update(payload).eq("id", post.id));
    } else {
      ({ error } = await supabase.from("blogs").insert(payload));
    }

    setSaving(false);
    if (error) {
      toast.error(error.message.includes("slug") ? "Slug already exists." : "Failed to save post.");
    } else {
      toast.success(post ? "Post updated." : "Post created.");
      router.push("/admin/blog");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="bg-white rounded-2xl border border-charcoal-100 shadow-card p-6 space-y-5">
        <h2 className="font-semibold text-charcoal text-sm">Post Details</h2>

        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...register("title")}
            onBlur={() => { if (!post) setValue("slug", slugify(titleValue)); }}
            className="mt-1.5"
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" {...register("slug")} className="mt-1.5" />
          </div>
          <div>
            <Label>Category *</Label>
            <Select defaultValue={post?.category} onValueChange={(v) => setValue("category", v)}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="featured_image_url">Featured Image URL</Label>
          <Input id="featured_image_url" {...register("featured_image_url")} className="mt-1.5" placeholder="https://..." />
        </div>

        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea id="excerpt" {...register("excerpt")} className="mt-1.5 min-h-[80px]" placeholder="Short summary shown on listing…" />
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea id="content" {...register("content")} className="mt-1.5 min-h-[300px]" placeholder="Full article content…" />
        </div>

        <div>
          <Label htmlFor="reading_time_minutes">Reading Time (minutes)</Label>
          <Input id="reading_time_minutes" type="number" min={1} {...register("reading_time_minutes")} className="mt-1.5 max-w-[120px]" />
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
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("is_published")} className="rounded" />
            <span className="text-sm font-medium text-charcoal">Published</span>
          </label>
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : (post ? "Update Post" : "Create Post")}
          </Button>
        </div>
      </div>
    </form>
  );
}
