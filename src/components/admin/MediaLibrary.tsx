"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Trash2, Copy, Search, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import type { MediaFile } from "@/types";

interface Props { initialMedia: MediaFile[] }

export function MediaLibrary({ initialMedia }: Props) {
  const [media, setMedia]     = useState<MediaFile[]>(initialMedia);
  const [search, setSearch]   = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter(); const supabase = createClient();

  const filtered = search
    ? media.filter((m) => m.file_name.toLowerCase().includes(search.toLowerCase()))
    : media;

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);

    for (const file of files) {
      const ext  = file.name.split(".").pop();
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage.from("media").upload(path, file, { cacheControl: "3600" });
      if (error) { toast.error(`Failed to upload ${file.name}`); continue; }

      const { data: publicData } = supabase.storage.from("media").getPublicUrl(path);
      const { error: dbError } = await supabase.from("media").insert({
        file_name: file.name, storage_path: path, public_url: publicData.publicUrl,
        mime_type: file.type, file_size_bytes: file.size,
      });
      if (dbError) { toast.error("Failed to save file record."); }
    }

    setUploading(false);
    toast.success("Upload complete.");
    router.refresh();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function deleteFile(file: MediaFile) {
    const { error: storageError } = await supabase.storage.from("media").remove([file.storage_path]);
    if (storageError) { toast.error("Failed to delete file."); return; }
    const { error: dbError } = await supabase.from("media").delete().eq("id", file.id);
    if (dbError) { toast.error("Failed to remove record."); return; }
    setMedia(media.filter((m) => m.id !== file.id));
    toast.success("File deleted.");
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    toast.success("URL copied.");
  }

  return (
    <div className="space-y-5">
      {/* Actions bar */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files…" className="pl-9" />
        </div>
        <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading…</> : <><Upload className="w-4 h-4 mr-2" />Upload</>}
        </Button>
        <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-charcoal-400">
          <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">{search ? "No files match your search." : "No files uploaded yet."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((file) => (
            <div key={file.id} className="group relative bg-white rounded-xl border border-charcoal-100 overflow-hidden aspect-square shadow-card hover:shadow-card-md transition-shadow">
              {file.mime_type.startsWith("image/") ? (
                <Image src={file.public_url} alt={file.alt_text ?? file.file_name} fill className="object-cover" sizes="160px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-off-white">
                  <ImageIcon className="w-8 h-8 text-charcoal-300" />
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                <button onClick={() => copyUrl(file.public_url)} className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white" title="Copy URL">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => deleteFile(file)} className="w-8 h-8 rounded-lg bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white" title="Delete">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {/* Filename */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-white text-[10px] truncate">{file.file_name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
