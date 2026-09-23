import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { formatDate, BLOG_CATEGORY_LABELS } from "@/lib/utils";
import type { BlogPost } from "@/types";

export const metadata: Metadata = {
  title: "Travel Stories",
  description: "Destination guides, travel tips and travel inspiration from Vayu Holidays.",
  alternates: { canonical: "/blog" },
};

async function getPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blogs")
    .select("*")
    .eq("is_published", true)
    .is("deleted_at", null)
    .order("published_at", { ascending: false });
  return (data ?? []) as BlogPost[];
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-vayu-950 pt-28 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Travel Stories</h1>
          <p className="mt-2 text-vayu-300 text-base max-w-xl">
            Destination guides, travel tips and inspiration for your next journey.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {posts.length === 0 ? (
          <div className="py-24 text-center text-charcoal-400">
            <p className="text-lg font-medium text-charcoal mb-2">Stories coming soon</p>
            <p className="text-sm">Check back soon for travel guides and inspiration.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article key={post.id} className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-lg transition-all duration-300 hover:-translate-y-1">
                {post.featured_image_url && (
                  <Link href={`/blog/${post.slug}`} tabIndex={-1}>
                    <div className="relative h-52 overflow-hidden">
                      <Image src={post.featured_image_url} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="33vw" />
                    </div>
                  </Link>
                )}
                <div className="p-5">
                  {post.category && (
                    <Badge variant="sand" className="mb-3 text-xs">{BLOG_CATEGORY_LABELS[post.category] ?? post.category}</Badge>
                  )}
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="font-semibold text-charcoal text-base leading-snug group-hover:text-vayu-700 transition-colors line-clamp-2">{post.title}</h2>
                  </Link>
                  {post.excerpt && <p className="mt-2 text-charcoal-500 text-sm line-clamp-2">{post.excerpt}</p>}
                  <div className="mt-4 flex items-center gap-4 text-xs text-charcoal-400">
                    {post.published_at && (
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(post.published_at)}</span>
                    )}
                    {post.reading_time_minutes && (
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.reading_time_minutes} min</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
