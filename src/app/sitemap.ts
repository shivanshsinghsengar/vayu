import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://vayuholidays.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [pkgRes, destRes, blogRes] = await Promise.all([
    supabase.from("packages").select("slug, updated_at").eq("is_published", true).is("deleted_at", null),
    supabase.from("destinations").select("slug, updated_at").eq("is_published", true).is("deleted_at", null),
    supabase.from("blogs").select("slug, updated_at").eq("is_published", true).is("deleted_at", null),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`,            lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/packages`,    lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/destinations`,lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/blog`,        lastModified: new Date(), changeFrequency: "daily",   priority: 0.7 },
    { url: `${BASE_URL}/about`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/services`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const packagePages: MetadataRoute.Sitemap = (pkgRes.data ?? []).map((p) => ({
    url: `${BASE_URL}/packages/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const destinationPages: MetadataRoute.Sitemap = (destRes.data ?? []).map((d) => ({
    url: `${BASE_URL}/destinations/${d.slug}`,
    lastModified: new Date(d.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = (blogRes.data ?? []).map((b) => ({
    url: `${BASE_URL}/blog/${b.slug}`,
    lastModified: new Date(b.updated_at),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [...staticPages, ...packagePages, ...destinationPages, ...blogPages];
}
