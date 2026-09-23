import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format currency in Indian Rupees */
export function formatPrice(
  amount: number,
  currency: string = "INR"
): string {
  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format duration string */
export function formatDuration(nights: number, days: number): string {
  return `${nights} Night${nights !== 1 ? "s" : ""} / ${days} Day${days !== 1 ? "s" : ""}`;
}

/** Truncate text */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "…";
}

/** Slugify a string */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** WhatsApp URL */
export function whatsappUrl(
  message?: string,
  phone?: string
): string {
  const number = phone ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const text = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${number}${text ? `?text=${text}` : ""}`;
}

/** Phone URL */
export function phoneUrl(phone?: string): string {
  const number = phone ?? process.env.NEXT_PUBLIC_PHONE ?? "";
  return `tel:${number.replace(/\s/g, "")}`;
}

/** Enquiry source labels */
export const ENQUIRY_SOURCE_LABELS: Record<string, string> = {
  homepage: "Homepage",
  package_page: "Package Page",
  destination_page: "Destination Page",
  service_page: "Service Page",
  custom_trip: "Custom Trip Form",
  contact_page: "Contact Page",
  whatsapp: "WhatsApp",
  trip_planner: "Trip Planner",
};

/** Status labels */
export const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  quote_sent: "Quote Sent",
  follow_up: "Follow-Up",
  booked: "Booked",
  lost: "Lost",
  closed: "Closed",
};

/** Status colors */
export const STATUS_COLORS: Record<string, string> = {
  new: "badge-new",
  contacted: "badge-contacted",
  qualified: "badge-qualified",
  quote_sent: "badge-qualified",
  follow_up: "badge-contacted",
  booked: "badge-booked",
  lost: "badge-lost",
  closed: "badge-closed",
};

/** Category labels */
export const PACKAGE_CATEGORY_LABELS: Record<string, string> = {
  honeymoon: "Honeymoon",
  family: "Family",
  group: "Group",
  adventure: "Adventure",
  luxury: "Luxury",
  customized: "Customized",
  mice: "MICE",
  domestic: "Domestic",
  international: "International",
};

/** Blog category labels */
export const BLOG_CATEGORY_LABELS: Record<string, string> = {
  destination_guides: "Destination Guides",
  travel_tips: "Travel Tips",
  honeymoon: "Honeymoon",
  family_travel: "Family Travel",
  visa_guides: "Visa Guides",
  travel_inspiration: "Travel Inspiration",
  seasonal_travel: "Seasonal Travel",
};

/** Format date */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Format relative time */
export function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}
