import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Star, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestimonialTogglePublish } from "@/components/admin/TestimonialTogglePublish";
import type { Testimonial } from "@/types";

async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("testimonials").select("*").order("sort_order");
  return (data ?? []) as Testimonial[];
}

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-charcoal">Testimonials</h1>
        <Button asChild>
          <Link href="/admin/testimonials/new"><Plus className="w-4 h-4 mr-1.5" /> Add Testimonial</Link>
        </Button>
      </div>
      <div className="bg-white rounded-2xl border border-charcoal-100 shadow-card overflow-hidden">
        {testimonials.length === 0 ? (
          <div className="py-16 text-center text-charcoal-400 text-sm">No testimonials yet.</div>
        ) : (
          <div className="divide-y divide-charcoal-100">
            {testimonials.map((t) => (
              <div key={t.id} className="flex items-start gap-4 px-6 py-4 hover:bg-off-white transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-charcoal text-sm">{t.customer_name}</p>
                    <div className="flex">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  {t.trip_package && <p className="text-xs text-charcoal-400">{t.trip_package}</p>}
                  <p className="text-sm text-charcoal-600 mt-1 line-clamp-2">{t.review}</p>
                </div>
                <TestimonialTogglePublish id={t.id} isPublished={t.is_published} />
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/testimonials/${t.id}/edit`}><Edit className="w-3.5 h-3.5" /></Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
