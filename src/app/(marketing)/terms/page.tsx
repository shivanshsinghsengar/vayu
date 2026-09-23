import type { Metadata } from "next";
export const metadata: Metadata = { title: "Terms & Conditions", alternates: { canonical: "/terms" } };
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-charcoal mb-8">Terms &amp; Conditions</h1>
        <div className="prose prose-sm text-charcoal-600 leading-relaxed space-y-6">
          <p>By using the Vayu Holidays website and services, you agree to these terms and conditions.</p>
          <h2 className="text-lg font-semibold text-charcoal mt-6">Enquiries and Quotations</h2>
          <p>Submitting an enquiry does not constitute a confirmed booking. Bookings are confirmed only upon receipt of written confirmation and payment as agreed with our team.</p>
          <h2 className="text-lg font-semibold text-charcoal mt-6">Pricing</h2>
          <p>All prices are indicative and subject to availability at the time of booking. Final pricing is confirmed in the written quotation provided by our travel experts.</p>
          <h2 className="text-lg font-semibold text-charcoal mt-6">Contact</h2>
          <p>For any queries regarding these terms, contact us at <a href="mailto:info@vayuholidays.com" className="text-vayu-700">info@vayuholidays.com</a>.</p>
          <p className="text-xs text-charcoal-400 mt-10">Last updated: 2026.</p>
        </div>
      </div>
    </div>
  );
}
