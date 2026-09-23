import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-vayu-100 flex items-center justify-center mx-auto mb-6">
          <Plane className="w-10 h-10 text-vayu-600 rotate-45" />
        </div>
        <h1 className="text-6xl font-bold text-vayu-700 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-charcoal mb-3">Page Not Found</h2>
        <p className="text-charcoal-500 text-sm mb-8">
          Looks like this page took a detour. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/">Back to Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/packages">Browse Packages</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
