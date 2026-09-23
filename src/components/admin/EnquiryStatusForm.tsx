"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import type { Enquiry, Profile } from "@/types";

const STATUSES = [
  "new","contacted","qualified","quote_sent","follow_up","booked","lost","closed"
] as const;

const STATUS_LABELS: Record<string, string> = {
  new: "New", contacted: "Contacted", qualified: "Qualified",
  quote_sent: "Quote Sent", follow_up: "Follow-up", booked: "Booked",
  lost: "Lost", closed: "Closed",
};

interface Props {
  enquiry: Enquiry;
  staff: Profile[];
}

export function EnquiryStatusForm({ enquiry, staff }: Props) {
  const [status, setStatus]   = useState(enquiry.status);
  const [assignTo, setAssignTo] = useState(enquiry.assigned_to ?? "");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const supabase = createClient();

  async function save() {
    startTransition(async () => {
      const { error } = await supabase
        .from("enquiries")
        .update({
          status,
          assigned_to: assignTo || null,
        })
        .eq("id", enquiry.id);

      if (error) {
        toast.error("Failed to update. Please try again.");
      } else {
        toast.success("Enquiry updated.");
        router.refresh();
      }
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-charcoal-100 shadow-card p-6 space-y-5">
      <h2 className="font-semibold text-charcoal text-sm">Manage Enquiry</h2>

      <div>
        <label className="block text-xs font-medium text-charcoal-400 mb-1.5">Status</label>
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-xs font-medium text-charcoal-400 mb-1.5">Assign To</label>
        <Select value={assignTo} onValueChange={setAssignTo}>
          <SelectTrigger>
            <SelectValue placeholder="Unassigned" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Unassigned</SelectItem>
            {staff.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.full_name ?? s.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={save} size="default" className="w-full" disabled={pending}>
        {pending ? "Saving…" : "Save Changes"}
      </Button>
    </div>
  );
}
