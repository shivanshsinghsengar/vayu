import { BlogForm } from "@/components/admin/BlogForm";

export default function NewBlogPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-charcoal mb-6">New Blog Post</h1>
      <BlogForm />
    </div>
  );
}
