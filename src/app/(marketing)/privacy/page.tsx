import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-charcoal mb-8">Privacy Policy</h1>
        <div className="prose prose-sm text-charcoal-600 leading-relaxed space-y-6">
          <p>This Privacy Policy explains how Vayu Holidays collects, uses and protects your personal information when you use our website or services.</p>
          <h2 className="text-lg font-semibold text-charcoal mt-6">Information We Collect</h2>
          <p>We collect information you provide when submitting enquiry forms, including your name, phone number, email address, and travel preferences. We use this information solely to respond to your travel enquiries and plan your trips.</p>
          <h2 className="text-lg font-semibold text-charcoal mt-6">How We Use Your Information</h2>
          <p>Your information is used to respond to enquiries, send travel quotations, and communicate about your booking. We do not sell or share your personal information with third parties for marketing purposes.</p>
          <h2 className="text-lg font-semibold text-charcoal mt-6">Contact Us</h2>
          <p>For privacy-related questions, contact us at <a href="mailto:info@vayuholidays.com" className="text-vayu-700">info@vayuholidays.com</a>.</p>
          <p className="text-xs text-charcoal-400 mt-10">This policy will be updated as our services evolve. Last updated: 2026.</p>
        </div>
      </div>
    </div>
  );
}
