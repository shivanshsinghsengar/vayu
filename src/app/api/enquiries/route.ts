import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";

// ─── Validation ───────────────────────────────────────────────────────────────

const enquirySchema = z.object({
  name:         z.string().min(2).max(100),
  phone:        z.string().min(7).max(20),
  email:        z.string().email().max(255).or(z.literal("")).optional(),
  destination:  z.string().max(200).optional(),
  package_slug: z.string().max(200).optional(),
  travel_dates: z.string().max(200).optional(),
  travellers:   z.string().max(20).optional(),
  travel_type:  z.enum(["honeymoon","family","couple","group","adventure","luxury","mice"]).optional(),
  budget:       z.string().max(50).optional(),
  message:      z.string().max(2000).optional(),
  preferences:  z.string().max(1000).optional(),
  special_req:  z.string().max(1000).optional(),
  source:       z.string().max(100).default("website"),
});

// ─── Simple rate limiting via in-memory map ───────────────────────────────────
// In production, replace with Upstash Redis or similar
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now     = Date.now();
  const window  = 60_000; // 1 minute
  const maxReqs = 5;

  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + window });
    return true;
  }
  if (entry.count >= maxReqs) return false;
  entry.count++;
  return true;
}

// ─── POST /api/enquiries ──────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed.", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // Resolve package ID from slug if provided
  let packageId: string | null = null;
  if (data.package_slug) {
    const supabase = await createServiceClient();
    const { data: pkg } = await supabase
      .from("packages")
      .select("id")
      .eq("slug", data.package_slug)
      .single();
    packageId = pkg?.id ?? null;
  }

  // Compose message from preferences/special_req if no explicit message
  const fullMessage = [
    data.message,
    data.preferences ? `Preferences: ${data.preferences}` : null,
    data.special_req ? `Special requirements: ${data.special_req}` : null,
  ]
    .filter(Boolean)
    .join("\n\n") || null;

  const supabase = await createServiceClient();
  const { error } = await supabase.from("enquiries").insert({
    name:         data.name.trim(),
    phone:        data.phone.trim(),
    email:        data.email?.trim() || null,
    destination:  data.destination?.trim() || null,
    package_id:   packageId,
    travel_dates: data.travel_dates?.trim() || null,
    travellers:   data.travellers ? parseInt(data.travellers, 10) || null : null,
    travel_type:  data.travel_type ?? null,
    budget:       data.budget ?? null,
    message:      fullMessage,
    source:       data.source,
    status:       "new",
  });

  if (error) {
    console.error("Enquiry insert error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save enquiry. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, message: "Enquiry received." }, { status: 201 });
}
