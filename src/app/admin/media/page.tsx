import { createClient } from "@/lib/supabase/server";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import type { MediaFile } from "@/types";

async function getMedia(): Promise<MediaFile[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("media").select("*").order("created_at", { ascending: false });
  return (data ?? []) as MediaFile[];
}

export default async function AdminMediaPage() {
  const media = await getMedia();
  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Media Library</h1>
          <p className="text-sm text-charcoal-400 mt-1">{media.length} files</p>
        </div>
      </div>
      <MediaLibrary initialMedia={media} />
    </div>
  );
}
