import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, BLOG_CATEGORY_LABELS } from "@/lib/utils";
import { BlogTogglePublish } from "@/components/admin/BlogTogglePublish";
import type { BlogPost } from "@/types";

async function getPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blogs")
    .select("*, author:profiles(full_name)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  return (data ?? []) as BlogPost[];
}

export default async function AdminBlogPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Blog Posts</h1>
          <p className="text-sm text-charcoal-400 mt-1">{posts.length} articles</p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new"><Plus className="w-4 h-4 mr-1.5" /> New Post</Link>
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-charcoal-100 shadow-card overflow-hidden">
        {posts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-charcoal-400 text-sm mb-4">No blog posts yet.</p>
            <Button asChild size="sm"><Link href="/admin/blog/new">Create First Post</Link></Button>
          </div>
        ) : (
          <div className="divide-y divide-charcoal-100">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center gap-4 px-6 py-4 hover:bg-off-white transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-charcoal truncate">{post.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {post.category && (
                      <Badge variant="sand" className="text-xs">{BLOG_CATEGORY_LABELS[post.category] ?? post.category}</Badge>
                    )}
                    {post.published_at && (
                      <span className="text-xs text-charcoal-400">{formatDate(post.published_at)}</span>
                    )}
                    {post.author && (
                      <span className="text-xs text-charcoal-400">{post.author.full_name}</span>
                    )}
                  </div>
                </div>
                <BlogTogglePublish id={post.id} isPublished={post.is_published} />
                <div className="flex gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/blog/${post.id}/edit`}><Edit className="w-3.5 h-3.5" /></Link>
                  </Button>
                  {post.is_published && (
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/blog/${post.slug}`} target="_blank"><Eye className="w-3.5 h-3.5" /></Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
