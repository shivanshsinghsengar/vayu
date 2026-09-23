// ─── Core database types ─────────────────────────────────────────────────────

export type UserRole = "super_admin" | "admin" | "content_manager" | "travel_executive";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Destinations ─────────────────────────────────────────────────────────────

export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  region: string | null;
  description: string | null;
  short_description: string | null;
  hero_image_url: string | null;
  best_time_to_visit: string | null;
  popular_experiences: string[] | null;
  travel_tips: string[] | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DestinationImage {
  id: string;
  destination_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
}

// ─── Packages ─────────────────────────────────────────────────────────────────

export type PackageCategory =
  | "honeymoon"
  | "family"
  | "group"
  | "adventure"
  | "luxury"
  | "customized"
  | "mice"
  | "domestic"
  | "international";

export interface Package {
  id: string;
  title: string;
  slug: string;
  destination_id: string | null;
  destination?: Destination;
  category: PackageCategory;
  duration_nights: number;
  duration_days: number;
  price_starting_from: number | null;
  currency: string;
  short_description: string | null;
  description: string | null;
  hero_image_url: string | null;
  highlights: string[] | null;
  inclusions?: PackageInclusion[];
  exclusions?: PackageExclusion[];
  itinerary?: PackageItinerary[];
  images?: PackageImage[];
  hotel_info: string | null;
  transport_info: string | null;
  terms_and_conditions: string | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PackageItinerary {
  id: string;
  package_id: string;
  day_number: number;
  title: string;
  description: string;
  activities: string[] | null;
}

export interface PackageInclusion {
  id: string;
  package_id: string;
  text: string;
  sort_order: number;
}

export interface PackageExclusion {
  id: string;
  package_id: string;
  text: string;
  sort_order: number;
}

export interface PackageImage {
  id: string;
  package_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
}

// ─── Services ─────────────────────────────────────────────────────────────────

export type ServiceCategory = "holiday" | "booking" | "assistance";

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: ServiceCategory;
  description: string | null;
  short_description: string | null;
  icon_name: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

// ─── Enquiries ────────────────────────────────────────────────────────────────

export type EnquiryStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "quote_sent"
  | "follow_up"
  | "booked"
  | "lost"
  | "closed";

export type TravelType =
  | "honeymoon"
  | "family"
  | "couple"
  | "group"
  | "adventure"
  | "luxury"
  | "mice";

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  destination: string | null;
  package_id: string | null;
  package?: Package;
  travel_dates: string | null;
  travellers: number | null;
  budget: string | null;
  travel_type: TravelType | null;
  message: string | null;
  source: string;
  status: EnquiryStatus;
  assigned_to: string | null;
  assigned_profile?: Profile;
  created_at: string;
  updated_at: string;
  notes?: EnquiryNote[];
  follow_ups?: EnquiryFollowUp[];
}

export interface EnquiryNote {
  id: string;
  enquiry_id: string;
  author_id: string;
  author?: Profile;
  content: string;
  created_at: string;
}

export interface EnquiryFollowUp {
  id: string;
  enquiry_id: string;
  scheduled_at: string;
  completed: boolean;
  note: string | null;
  created_at: string;
}

// ─── Blog ────────────────────────────────────────────────────────────────────

export type BlogCategory =
  | "destination_guides"
  | "travel_tips"
  | "honeymoon"
  | "family_travel"
  | "visa_guides"
  | "travel_inspiration"
  | "seasonal_travel";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image_url: string | null;
  category: BlogCategory;
  tags: string[] | null;
  author_id: string | null;
  author?: Profile;
  reading_time_minutes: number | null;
  is_published: boolean;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  customer_name: string;
  trip_package: string | null;
  review: string;
  rating: number;
  photo_url: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

// ─── Media ────────────────────────────────────────────────────────────────────

export interface MediaFile {
  id: string;
  file_name: string;
  storage_path: string;
  public_url: string;
  mime_type: string;
  file_size_bytes: number;
  alt_text: string | null;
  uploaded_by: string | null;
  created_at: string;
}

// ─── Banners ──────────────────────────────────────────────────────────────────

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  cta_text: string | null;
  cta_url: string | null;
  is_active: boolean;
  sort_order: number;
  valid_from: string | null;
  valid_until: string | null;
}

// ─── Offers ───────────────────────────────────────────────────────────────────

export interface Offer {
  id: string;
  title: string;
  description: string | null;
  discount_text: string | null;
  image_url: string | null;
  is_active: boolean;
  valid_until: string | null;
  sort_order: number;
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export interface SiteSettings {
  id: string;
  key: string;
  value: string | null;
  label: string;
  type: "text" | "textarea" | "boolean" | "json";
}

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  entity_type: "package" | "destination" | "general" | "service";
  entity_id: string | null;
  sort_order: number;
  is_published: boolean;
}

// ─── Form types ───────────────────────────────────────────────────────────────

export interface EnquiryFormData {
  name: string;
  phone: string;
  email?: string;
  destination?: string;
  package_id?: string;
  travel_dates?: string;
  travellers?: number;
  travel_type?: TravelType;
  budget?: string;
  message?: string;
  source: string;
}

export interface TripPlannerData {
  destination: string;
  travel_dates: string;
  travellers: number;
  travel_type: TravelType;
  budget: string;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── API response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
