import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Phone, MessageCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRelativeTime, STATUS_LABELS, whatsappUrl, phoneUrl } from "@/lib/utils";
import type { Enquiry } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  new:        "bg-blue-100 text-blue-700",
  contacted:  "bg-yellow-100 text-yellow-700",
  qualified:  "bg-purple-100 text-purple-700",
  quote_sent: "bg-indigo-100 text-indigo-700",
  follow_up:  "bg-orange-100 text-orange-700",
  booked:     "bg-green-100 text-green-700",
  lost:       "bg-red-100 text-red-700",
  closed:     "bg-gray-100 text-gray-600",
};

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "quote_sent", label: "Quote Sent" },
  { value: "follow_up", label: "Follow-up" },
  { value: "booked", label: "Booked" },
  { value: "lost", label: "Lost" },
  { value: "closed", label: "Closed" },
];

interface PageProps {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}

async function getEnquiries(status?: string, search?: string, page = 1) {
  const supabase   = await createClient();
  const pageSize   = 25;
  const from       = (page - 1) * pageSize;
  const to         = from + pageSize - 1;

  let query = supabase
    .from("enquiries")
    .select("*, assigned_profile:profiles(full_name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status) query = query.eq("status", status);
  if (search) {
    query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%,destination.ilike.%${search}%`);
  }

  const { data, count, error } = await query;
  return { enquiries: (data ?? []) as Enquiry[], total: count ?? 0 };
}

export default async function EnquiriesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = params.status ?? "";
  const search = params.q ?? "";
  const page   = parseInt(params.page ?? "1", 10);

  const { enquiries, total } = await getEnquiries(status || undefined, search || undefined, page);
  const pageSize   = 25;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Enquiries</h1>
          <p className="text-sm text-charcoal-400 mt-1">{total} total enquiries</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
          <form>
            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Search by name, phone, destination…"
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-charcoal-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-vayu-600"
            />
          </form>
        </div>

        {/* Status tabs */}
        <div className="flex gap-1 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <Link
              key={f.value}
              href={f.value ? `/admin/enquiries?status=${f.value}` : "/admin/enquiries"}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                status === f.value
                  ? "bg-vayu-700 text-white border-vayu-700"
                  : "bg-white text-charcoal-500 border-charcoal-100 hover:border-vayu-300 hover:text-vayu-700"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-charcoal-100 shadow-card overflow-hidden">
        {enquiries.length === 0 ? (
          <div className="py-16 text-center text-charcoal-400">
            <p className="text-sm">No enquiries found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal-100 bg-off-white">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Name</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-charcoal-400 uppercase tracking-wider hidden md:table-cell">Destination</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-charcoal-400 uppercase tracking-wider hidden lg:table-cell">Source</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-charcoal-400 uppercase tracking-wider hidden sm:table-cell">Received</th>
                  <th className="py-3 px-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-off-white transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-charcoal">{enq.name}</p>
                        <p className="text-xs text-charcoal-400">{enq.phone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-charcoal-600">
                      {enq.destination ?? "—"}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[enq.status] ?? ""}`}>
                        {STATUS_LABELS[enq.status] ?? enq.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-charcoal-400 text-xs capitalize">
                      {enq.source.replace(/_/g, " ")}
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell text-charcoal-400 text-xs">
                      {formatRelativeTime(enq.created_at)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 justify-end">
                        <a
                          href={`tel:${enq.phone}`}
                          className="w-8 h-8 rounded-lg bg-vayu-50 text-vayu-700 flex items-center justify-center hover:bg-vayu-100 transition-colors"
                          aria-label={`Call ${enq.name}`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={whatsappUrl(`Hi ${enq.name}, this is Vayu Holidays regarding your travel enquiry.`, enq.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg bg-green-50 text-green-700 flex items-center justify-center hover:bg-green-100 transition-colors"
                          aria-label={`WhatsApp ${enq.name}`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/enquiries/${enq.id}`}>View</Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-charcoal-100 flex items-center justify-between">
            <p className="text-xs text-charcoal-400">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              {page > 1 && (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/enquiries?page=${page - 1}${status ? `&status=${status}` : ""}`}>Previous</Link>
                </Button>
              )}
              {page < totalPages && (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/enquiries?page=${page + 1}${status ? `&status=${status}` : ""}`}>Next</Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
