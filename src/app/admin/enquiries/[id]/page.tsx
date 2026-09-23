import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, MessageCircle, Calendar, User, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnquiryStatusForm } from "@/components/admin/EnquiryStatusForm";
import { EnquiryNotesSection } from "@/components/admin/EnquiryNotesSection";
import { formatDate, STATUS_LABELS, whatsappUrl } from "@/lib/utils";
import type { Enquiry, Profile } from "@/types";

interface Props { params: Promise<{ id: string }> }

async function getEnquiry(id: string) {
  const supabase = await createClient();
  const [enqRes, staffRes] = await Promise.all([
    supabase
      .from("enquiries")
      .select(`
        *,
        package:packages(id, title, slug),
        assigned_profile:profiles!enquiries_assigned_to_fkey(id, full_name, email),
        notes:enquiry_notes(*, author:profiles(full_name))
      `)
      .eq("id", id)
      .single(),
    supabase.from("profiles").select("id, full_name, email, role").eq("is_active", true),
  ]);

  return {
    enquiry: enqRes.data as Enquiry | null,
    staff:   (staffRes.data ?? []) as Profile[],
  };
}

export default async function EnquiryDetailPage({ params }: Props) {
  const { id } = await params;
  const { enquiry, staff } = await getEnquiry(id);
  if (!enquiry) notFound();

  const STATUS_COLORS: Record<string, string> = {
    new: "bg-blue-100 text-blue-700", contacted: "bg-yellow-100 text-yellow-700",
    qualified: "bg-purple-100 text-purple-700", quote_sent: "bg-indigo-100 text-indigo-700",
    follow_up: "bg-orange-100 text-orange-700", booked: "bg-green-100 text-green-700",
    lost: "bg-red-100 text-red-700", closed: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/enquiries"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-charcoal">{enquiry.name}</h1>
          <p className="text-sm text-charcoal-400 mt-0.5">
            Enquiry from {formatDate(enquiry.created_at)} • Source: {enquiry.source.replace(/_/g, " ")}
          </p>
        </div>
        <span className={`ml-auto text-sm font-medium px-3 py-1 rounded-full ${STATUS_COLORS[enquiry.status]}`}>
          {STATUS_LABELS[enquiry.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Contact */}
          <div className="bg-white rounded-2xl border border-charcoal-100 shadow-card p-6">
            <h2 className="font-semibold text-charcoal text-sm mb-4">Contact Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={User} label="Name"  value={enquiry.name} />
              <InfoRow icon={Phone} label="Phone" value={enquiry.phone} />
              {enquiry.email   && <InfoRow icon={MessageCircle} label="Email" value={enquiry.email} />}
              {enquiry.destination && <InfoRow icon={MapPin} label="Destination" value={enquiry.destination} />}
              {enquiry.travel_dates && <InfoRow icon={Calendar} label="Travel Dates" value={enquiry.travel_dates} />}
              {enquiry.travellers  && <InfoRow icon={User} label="Travellers" value={String(enquiry.travellers)} />}
              {enquiry.travel_type && <InfoRow icon={Tag} label="Trip Type" value={enquiry.travel_type} />}
              {enquiry.budget      && <InfoRow icon={Tag} label="Budget" value={enquiry.budget} />}
            </div>
            {enquiry.message && (
              <div className="mt-4 pt-4 border-t border-charcoal-100">
                <p className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-2">Message</p>
                <p className="text-sm text-charcoal-600 leading-relaxed whitespace-pre-line">{enquiry.message}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-5 pt-4 border-t border-charcoal-100 flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <a href={`tel:${enquiry.phone}`}><Phone className="w-3.5 h-3.5 mr-1" /> Call</a>
              </Button>
              <Button asChild variant="whatsapp" size="sm">
                <a href={whatsappUrl(`Hi ${enquiry.name}, thank you for enquiring with Vayu Holidays.`, enquiry.phone)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-3.5 h-3.5 mr-1" /> WhatsApp
                </a>
              </Button>
              {enquiry.package && (
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/packages/${enquiry.package.slug}`} target="_blank">View Package</Link>
                </Button>
              )}
            </div>
          </div>

          {/* Notes */}
          <EnquiryNotesSection enquiryId={enquiry.id} notes={enquiry.notes ?? []} />
        </div>

        {/* Sidebar: status + assign */}
        <div>
          <EnquiryStatusForm enquiry={enquiry} staff={staff} />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-charcoal-400 flex items-center gap-1 mb-0.5">
        <Icon className="w-3 h-3" /> {label}
      </p>
      <p className="text-sm text-charcoal font-medium">{value}</p>
    </div>
  );
}
