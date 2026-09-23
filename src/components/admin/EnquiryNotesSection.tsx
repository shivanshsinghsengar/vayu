"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import type { EnquiryNote } from "@/types";

interface Props {
  enquiryId: string;
  notes: EnquiryNote[];
}

export function EnquiryNotesSection({ enquiryId, notes }: Props) {
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const supabase = createClient();

  async function addNote() {
    if (!note.trim()) return;
    startTransition(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Not authenticated"); return; }

      const { error } = await supabase.from("enquiry_notes").insert({
        enquiry_id: enquiryId,
        author_id:  user.id,
        content:    note.trim(),
      });

      if (error) {
        toast.error("Failed to add note.");
      } else {
        toast.success("Note added.");
        setNote("");
        router.refresh();
      }
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-charcoal-100 shadow-card p-6">
      <h2 className="font-semibold text-charcoal text-sm mb-4">Notes</h2>

      {/* Existing notes */}
      {notes.length > 0 && (
        <div className="space-y-3 mb-5">
          {notes.map((n) => (
            <div key={n.id} className="bg-off-white rounded-xl p-3.5">
              <p className="text-sm text-charcoal leading-relaxed whitespace-pre-line">{n.content}</p>
              <p className="text-xs text-charcoal-400 mt-2">
                {n.author?.full_name ?? "Staff"} · {formatDate(n.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add note */}
      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note about this enquiry…"
        className="min-h-[80px]"
      />
      <Button
        onClick={addNote}
        size="sm"
        className="mt-2"
        disabled={pending || !note.trim()}
      >
        {pending ? "Adding…" : "Add Note"}
      </Button>
    </div>
  );
}
