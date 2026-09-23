import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/admin/SettingsForm";
import type { SiteSettings } from "@/types";

async function getSettings(): Promise<SiteSettings[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").order("key");
  return (data ?? []) as SiteSettings[];
}

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-charcoal mb-2">Site Settings</h1>
      <p className="text-sm text-charcoal-400 mb-8">Manage global site configuration.</p>
      <SettingsForm settings={settings} />
    </div>
  );
}
