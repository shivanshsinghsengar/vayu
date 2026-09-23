"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, BLOG_CATEGORY_LABELS } from "@/lib/utils";
import type { BlogPost } from "@/types";

// Placeholder — replaced by CMS data in production
const placeholderPosts: Partial<BlogPost>[] = [
  {
    id: "1",
    title: "Kashmir in Winter: A Complete Guide to the Snow Season",
    slug: "kashmir-winter-guide",
    excerpt:
      "Winter transforms Kashmir into a snow-covered paradise. Here's everything you need to know before you go.",
    featured_image_url:
      "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&q=80",
    category: "destination_guides",
    reading_time_minutes: 8,
    published_at: "2025-12-01T10:00:00Z",
  },
  {
    id: "2",
    title: "How to Plan Your First International Trip from India",
    slug: "first-international-trip-india",
    excerpt:
      "Passports, visas, forex and more — a practical guide for first-time international travellers from India.",
    featured_image_url:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
    category: "travel_tips",
    reading_time_minutes: 10,
    published_at: "2025-11-15T10:00:00Z",
  },
  {
    id: "3",
    title: "The Perfect Honeymoon in Bali: Itinerary & Tips",
    slug: "bali-honeymoon-itinerary",
    excerpt:
      "From the rice terraces of Ubud to the sunsets of Seminyak — craft your perfect Bali honeymoon.",
    featured_image_url:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    category: "honeymoon",
    reading_time_minutes: 6,
    published_at: "2025-10-20T10:00:00Z",
  },
];

interface BlogPreviewProps {
  posts?: Partial<BlogPost>[];
}

export function BlogPreview({ posts = placeholderPosts }: BlogPreviewProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section
      className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8"
      aria-labelledby="blog-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-label">
              <span className="divider-accent" />
              Travel Stories
            </span>
            <h2
              id="blog-heading"
              className="mt-3 text-3xl sm:text-4xl font-bold text-charcoal tracking-tight"
            >
              Inspiration for Your Next Trip
            </h2>
            <p className="mt-3 text-charcoal-400 text-base max-w-lg">
              Destination guides, travel tips and stories from the road.
            </p>
          </motion.div>
          <Button asChild variant="outline" size="default" className="shrink-0">
            <Link href="/blog">
              All Stories <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.09 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-lg transition-all duration-300 hover:-translate-y-1"
              aria-label={`Blog post: ${post.title}`}
            >
              {/* Image */}
              {post.featured_image_url && (
                <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true">
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={post.featured_image_url}
                      alt={post.title ?? "Blog post image"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                </Link>
              )}

              <div className="p-6">
                {/* Category */}
                {post.category && (
                  <Badge variant="sand" className="mb-3 text-xs">
                    {BLOG_CATEGORY_LABELS[post.category] ?? post.category}
                  </Badge>
                )}

                {/* Title */}
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="font-semibold text-charcoal text-lg leading-snug group-hover:text-vayu-700 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </Link>

                {/* Excerpt */}
                <p className="mt-2.5 text-charcoal-500 text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="mt-4 pt-4 border-t border-charcoal-100 flex items-center justify-between text-xs text-charcoal-400">
                  <div className="flex items-center gap-3">
                    {post.published_at && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.published_at)}
                      </span>
                    )}
                    {post.reading_time_minutes && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.reading_time_minutes} min read
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-vayu-700 font-medium hover:text-vayu-900 flex items-center gap-1 transition-colors"
                  >
                    Read <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
