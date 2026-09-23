"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/types";

interface Props { settings: SiteSettings[] }

export function SettingsForm({ settings }: Props) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(settings.map((s) => [s.key, s.value ?? ""]))
  );
  const [saving, setSaving] = useState(false);
  const router = useRouter(); const supabase = createClient();

  async function save() {
    setSaving(true);
    const updates = Object.entries(values).map(([key, value]) =>
      supabase.from("site_settings").update({ value }).eq("key", key)
    );
    const results = await Promise.all(updates);
    setSaving(false);
    const hasError = results.some((r) => r.error);
    if (hasError) { toast.error("Some settings failed to save."); }
    else { toast.success("Settings saved."); router.refresh(); }
  }

  return (
    <div className="space-y-4">
      {settings.map((setting) => (
        <div key={setting.key} className="bg-white rounded-2xl border border-charcoal-100 shadow-card p-5">
          <Label htmlFor={setting.key}>{setting.label}</Label>
          {setting.type === "textarea" ? (
            <Textarea
              id={setting.key}
              value={values[setting.key] ?? ""}
              onChange={(e) => setValues({ ...values, [setting.key]: e.target.value })}
              className="mt-1.5"
            />
          ) : setting.type === "boolean" ? (
            <div className="mt-2 flex items-center gap-2">
              <input
                id={setting.key}
                type="checkbox"
                checked={values[setting.key] === "true"}
                onChange={(e) => setValues({ ...values, [setting.key]: e.target.checked ? "true" : "false" })}
                className="rounded"
              />
              <label htmlFor={setting.key} className="text-sm text-charcoal">Enable</label>
            </div>
          ) : (
            <Input
              id={setting.key}
              value={values[setting.key] ?? ""}
              onChange={(e) => setValues({ ...values, [setting.key]: e.target.value })}
              className="mt-1.5"
            />
          )}
        </div>
      ))}
      <Button onClick={save} size="lg" disabled={saving} className="w-full">
        {saving ? "Saving…" : "Save All Settings"}
      </Button>
    </div>
  );
}
