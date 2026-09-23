"use client";
import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
interface Props { id: string; isPublished: boolean }
export function TestimonialTogglePublish({ id, isPublished }: Props) {
  const [published, setPublished] = useState(isPublished);
  const [pending, startTransition] = useTransition();
  const router = useRouter(); const supabase = createClient();
  function toggle() {
    startTransition(async () => {
      const next = !published;
      const { error } = await supabase.from("testimonials").update({ is_published: next }).eq("id", id);
      if (error) { toast.error("Failed."); } else { setPublished(next); toast.success(next ? "Published." : "Hidden."); router.refresh(); }
    });
  }
  return (
    <button onClick={toggle} disabled={pending}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${published ? "bg-vayu-600" : "bg-charcoal-200"} disabled:opacity-60`}
      role="switch" aria-checked={published}>
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${published ? "translate-x-4.5" : "translate-x-0.5"}`} />
    </button>
  );
}
