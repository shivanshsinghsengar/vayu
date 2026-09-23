-- ============================================================
-- Vayu Holidays — Row Level Security Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destination_images  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_inclusions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_exclusions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_images      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_notes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_followups   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_metadata        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings       ENABLE ROW LEVEL SECURITY;

-- Helper: is current user an admin or above?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin')
      AND is_active = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: is current user staff (any role)?
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND is_active = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: is current user content manager or above?
CREATE OR REPLACE FUNCTION public.can_manage_content()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin', 'content_manager')
      AND is_active = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ─── PROFILES ────────────────────────────────────────────────────────────────
-- Users can read their own profile; admins can read all
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid() AND
    -- Only super_admin can change role
    (role = (SELECT role FROM public.profiles WHERE id = auth.uid()) OR public.is_admin())
  );

CREATE POLICY "profiles_admin_all" ON public.profiles
  FOR ALL USING (public.is_admin());

-- ─── DESTINATIONS ─────────────────────────────────────────────────────────────
-- Public can read published destinations; staff can manage
CREATE POLICY "destinations_public_select" ON public.destinations
  FOR SELECT USING (is_published = TRUE AND deleted_at IS NULL);

CREATE POLICY "destinations_staff_select" ON public.destinations
  FOR SELECT USING (public.is_staff());

CREATE POLICY "destinations_content_write" ON public.destinations
  FOR ALL USING (public.can_manage_content());

CREATE POLICY "destination_images_public_select" ON public.destination_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.destinations d
      WHERE d.id = destination_id AND d.is_published = TRUE AND d.deleted_at IS NULL
    )
  );

CREATE POLICY "destination_images_staff_all" ON public.destination_images
  FOR ALL USING (public.can_manage_content());

-- ─── PACKAGES ─────────────────────────────────────────────────────────────────
CREATE POLICY "packages_public_select" ON public.packages
  FOR SELECT USING (is_published = TRUE AND deleted_at IS NULL);

CREATE POLICY "packages_staff_select" ON public.packages
  FOR SELECT USING (public.is_staff());

CREATE POLICY "packages_content_write" ON public.packages
  FOR ALL USING (public.can_manage_content());

-- Package sub-tables: public can read if parent is published
CREATE POLICY "pkg_itinerary_public" ON public.package_itineraries
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.packages p WHERE p.id = package_id AND p.is_published = TRUE AND p.deleted_at IS NULL));
CREATE POLICY "pkg_itinerary_staff"  ON public.package_itineraries
  FOR ALL USING (public.can_manage_content());

CREATE POLICY "pkg_inclusion_public" ON public.package_inclusions
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.packages p WHERE p.id = package_id AND p.is_published = TRUE AND p.deleted_at IS NULL));
CREATE POLICY "pkg_inclusion_staff"  ON public.package_inclusions
  FOR ALL USING (public.can_manage_content());

CREATE POLICY "pkg_exclusion_public" ON public.package_exclusions
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.packages p WHERE p.id = package_id AND p.is_published = TRUE AND p.deleted_at IS NULL));
CREATE POLICY "pkg_exclusion_staff"  ON public.package_exclusions
  FOR ALL USING (public.can_manage_content());

CREATE POLICY "pkg_images_public" ON public.package_images
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.packages p WHERE p.id = package_id AND p.is_published = TRUE AND p.deleted_at IS NULL));
CREATE POLICY "pkg_images_staff"  ON public.package_images
  FOR ALL USING (public.can_manage_content());

-- ─── SERVICES ─────────────────────────────────────────────────────────────────
CREATE POLICY "services_public_select" ON public.services
  FOR SELECT USING (is_published = TRUE);
CREATE POLICY "services_staff_all"     ON public.services
  FOR ALL USING (public.can_manage_content());

-- ─── ENQUIRIES ────────────────────────────────────────────────────────────────
-- Anyone (including anonymous) can INSERT; only staff can read/update
CREATE POLICY "enquiries_public_insert" ON public.enquiries
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "enquiries_staff_select" ON public.enquiries
  FOR SELECT USING (public.is_staff());

CREATE POLICY "enquiries_staff_update" ON public.enquiries
  FOR UPDATE USING (public.is_staff());

CREATE POLICY "enquiries_admin_delete" ON public.enquiries
  FOR DELETE USING (public.is_admin());

CREATE POLICY "enquiry_notes_staff_all" ON public.enquiry_notes
  FOR ALL USING (public.is_staff());

CREATE POLICY "enquiry_followups_staff_all" ON public.enquiry_followups
  FOR ALL USING (public.is_staff());

-- ─── BLOGS ────────────────────────────────────────────────────────────────────
CREATE POLICY "blogs_public_select" ON public.blogs
  FOR SELECT USING (is_published = TRUE AND deleted_at IS NULL);
CREATE POLICY "blogs_staff_select"  ON public.blogs
  FOR SELECT USING (public.is_staff());
CREATE POLICY "blogs_content_write" ON public.blogs
  FOR ALL USING (public.can_manage_content());

-- ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
CREATE POLICY "testimonials_public_select" ON public.testimonials
  FOR SELECT USING (is_published = TRUE);
CREATE POLICY "testimonials_staff_all"     ON public.testimonials
  FOR ALL USING (public.can_manage_content());

-- ─── REVIEWS ──────────────────────────────────────────────────────────────────
CREATE POLICY "reviews_public_select" ON public.reviews
  FOR SELECT USING (is_published = TRUE);
CREATE POLICY "reviews_staff_all"     ON public.reviews
  FOR ALL USING (public.can_manage_content());

-- ─── OFFERS ───────────────────────────────────────────────────────────────────
CREATE POLICY "offers_public_select" ON public.offers
  FOR SELECT USING (is_active = TRUE);
CREATE POLICY "offers_staff_all"     ON public.offers
  FOR ALL USING (public.can_manage_content());

-- ─── BANNERS ──────────────────────────────────────────────────────────────────
CREATE POLICY "banners_public_select" ON public.banners
  FOR SELECT USING (is_active = TRUE);
CREATE POLICY "banners_staff_all"     ON public.banners
  FOR ALL USING (public.can_manage_content());

-- ─── MEDIA ────────────────────────────────────────────────────────────────────
CREATE POLICY "media_public_select" ON public.media
  FOR SELECT USING (TRUE);
CREATE POLICY "media_staff_write"   ON public.media
  FOR ALL USING (public.can_manage_content());

-- ─── FAQs ─────────────────────────────────────────────────────────────────────
CREATE POLICY "faqs_public_select" ON public.faqs
  FOR SELECT USING (is_published = TRUE);
CREATE POLICY "faqs_staff_all"     ON public.faqs
  FOR ALL USING (public.can_manage_content());

-- ─── PAGES ────────────────────────────────────────────────────────────────────
CREATE POLICY "pages_public_select" ON public.pages
  FOR SELECT USING (is_published = TRUE);
CREATE POLICY "pages_staff_all"     ON public.pages
  FOR ALL USING (public.can_manage_content());

-- ─── SEO METADATA ─────────────────────────────────────────────────────────────
CREATE POLICY "seo_public_select" ON public.seo_metadata
  FOR SELECT USING (TRUE);
CREATE POLICY "seo_staff_all"     ON public.seo_metadata
  FOR ALL USING (public.can_manage_content());

-- ─── SITE SETTINGS ────────────────────────────────────────────────────────────
CREATE POLICY "settings_public_select" ON public.site_settings
  FOR SELECT USING (TRUE);
CREATE POLICY "settings_admin_write"   ON public.site_settings
  FOR ALL USING (public.is_admin());
