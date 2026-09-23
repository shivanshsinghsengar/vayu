import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { formatDate, BLOG_CATEGORY_LABELS } from "@/lib/utils";
import type { BlogPost } from "@/types";

interface Props { params: Promise<{ slug: string }> }

async function getPost(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blogs")
    .select("*, author:profiles(full_name, avatar_url)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return (data as BlogPost) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.seo_title ?? post.title,
    description: post.seo_description ?? post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.seo_title ?? post.title,
      description: post.seo_description ?? post.excerpt ?? undefined,
      type: "article",
      publishedTime: post.published_at ?? undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      {post.featured_image_url && (
        <div className="relative h-[50vh] min-h-[320px] max-h-[550px] overflow-hidden">
          <Image src={post.featured_image_url} alt={post.title} fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-hero-gradient" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-4xl mx-auto">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Travel Stories
            </Link>
            {post.category && (
              <Badge variant="sand" className="mb-3">{BLOG_CATEGORY_LABELS[post.category] ?? post.category}</Badge>
            )}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-white/70 text-sm">
              {post.published_at && (
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(post.published_at)}</span>
              )}
              {post.reading_time_minutes && (
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.reading_time_minutes} min read</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {post.excerpt && (
          <p className="text-lg text-charcoal-600 leading-relaxed mb-8 font-medium border-l-4 border-vayu-300 pl-5">
            {post.excerpt}
          </p>
        )}
        {post.content && (
          <div className="prose prose-sm sm:prose max-w-none text-charcoal-700 leading-relaxed">
            {post.content.split("\n").map((para, i) =>
              para.trim() ? <p key={i} className="mb-4">{para}</p> : <br key={i} />
            )}
          </div>
        )}

        {/* Author */}
        {post.author && (
          <div className="mt-12 pt-8 border-t border-charcoal-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-vayu-100 flex items-center justify-center text-vayu-700 font-semibold text-lg shrink-0">
              {post.author.full_name?.charAt(0) ?? "V"}
            </div>
            <div>
              <p className="font-semibold text-charcoal text-sm">{post.author.full_name ?? "Vayu Holidays Team"}</p>
              <p className="text-xs text-charcoal-400">Travel Writer, Vayu Holidays</p>
            </div>
          </div>
        )}

        <div className="mt-10">
          <Link href="/blog" className="inline-flex items-center gap-2 text-vayu-700 font-medium text-sm hover:text-vayu-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Travel Stories
          </Link>
        </div>
      </div>
    </div>
  );
}
