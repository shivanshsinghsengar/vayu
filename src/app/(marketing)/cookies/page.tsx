import type { Metadata } from "next";
export const metadata: Metadata = { title: "Cookie Policy", alternates: { canonical: "/cookies" } };
export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-cream pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-charcoal mb-8">Cookie Policy</h1>
        <div className="prose prose-sm text-charcoal-600 leading-relaxed space-y-6">
          <p>This website uses cookies to improve your browsing experience and analyse site traffic.</p>
          <h2 className="text-lg font-semibold text-charcoal mt-6">What Are Cookies</h2>
          <p>Cookies are small text files stored on your device. They help us understand how visitors use our site so we can improve it.</p>
          <h2 className="text-lg font-semibold text-charcoal mt-6">How We Use Cookies</h2>
          <p>We use cookies for analytics (Google Analytics) and to remember session preferences. We do not use cookies to collect sensitive personal information.</p>
          <p className="text-xs text-charcoal-400 mt-10">Last updated: 2026.</p>
        </div>
      </div>
    </div>
  );
}
