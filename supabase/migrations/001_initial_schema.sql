-- ============================================================
-- Vayu Holidays — PostgreSQL Schema
-- Run this in your Supabase SQL editor or via supabase CLI
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ─── ENUMS ───────────────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM (
  'super_admin', 'admin', 'content_manager', 'travel_executive'
);

CREATE TYPE package_category AS ENUM (
  'honeymoon', 'family', 'group', 'adventure',
  'luxury', 'customized', 'mice', 'domestic', 'international'
);

CREATE TYPE service_category AS ENUM (
  'holiday', 'booking', 'assistance'
);

CREATE TYPE enquiry_status AS ENUM (
  'new', 'contacted', 'qualified', 'quote_sent',
  'follow_up', 'booked', 'lost', 'closed'
);

CREATE TYPE travel_type AS ENUM (
  'honeymoon', 'family', 'couple', 'group',
  'adventure', 'luxury', 'mice'
);

CREATE TYPE blog_category AS ENUM (
  'destination_guides', 'travel_tips', 'honeymoon',
  'family_travel', 'visa_guides', 'travel_inspiration', 'seasonal_travel'
);

CREATE TYPE entity_type AS ENUM (
  'package', 'destination', 'general', 'service'
);

CREATE TYPE settings_type AS ENUM (
  'text', 'textarea', 'boolean', 'json'
);

-- ─── PROFILES ────────────────────────────────────────────────────────────────

CREATE TABLE public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT NOT NULL UNIQUE,
  full_name    TEXT,
  avatar_url   TEXT,
  phone        TEXT,
  role         user_role NOT NULL DEFAULT 'travel_executive',
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── DESTINATIONS ─────────────────────────────────────────────────────────────

CREATE TABLE public.destinations (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                 TEXT NOT NULL,
  slug                 TEXT NOT NULL UNIQUE,
  country              TEXT NOT NULL DEFAULT 'India',
  region               TEXT,
  short_description    TEXT,
  description          TEXT,
  hero_image_url       TEXT,
  best_time_to_visit   TEXT,
  popular_experiences  TEXT[],
  travel_tips          TEXT[],
  is_featured          BOOLEAN NOT NULL DEFAULT FALSE,
  is_published         BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order           INTEGER NOT NULL DEFAULT 0,
  seo_title            TEXT,
  seo_description      TEXT,
  og_image_url         TEXT,
  deleted_at           TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_destinations_slug        ON public.destinations(slug);
CREATE INDEX idx_destinations_is_published ON public.destinations(is_published);
CREATE INDEX idx_destinations_is_featured  ON public.destinations(is_featured);
CREATE INDEX idx_destinations_country      ON public.destinations(country);

CREATE TABLE public.destination_images (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  url            TEXT NOT NULL,
  alt_text       TEXT,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── PACKAGES ─────────────────────────────────────────────────────────────────

CREATE TABLE public.packages (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title                 TEXT NOT NULL,
  slug                  TEXT NOT NULL UNIQUE,
  destination_id        UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
  category              package_category NOT NULL DEFAULT 'domestic',
  duration_nights       INTEGER NOT NULL DEFAULT 0,
  duration_days         INTEGER NOT NULL DEFAULT 1,
  price_starting_from   NUMERIC(12, 2),
  currency              TEXT NOT NULL DEFAULT 'INR',
  short_description     TEXT,
  description           TEXT,
  hero_image_url        TEXT,
  highlights            TEXT[],
  hotel_info            TEXT,
  transport_info        TEXT,
  terms_and_conditions  TEXT,
  is_featured           BOOLEAN NOT NULL DEFAULT FALSE,
  is_published          BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order            INTEGER NOT NULL DEFAULT 0,
  seo_title             TEXT,
  seo_description       TEXT,
  og_image_url          TEXT,
  deleted_at            TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_packages_slug          ON public.packages(slug);
CREATE INDEX idx_packages_destination   ON public.packages(destination_id);
CREATE INDEX idx_packages_category      ON public.packages(category);
CREATE INDEX idx_packages_is_published  ON public.packages(is_published);
CREATE INDEX idx_packages_is_featured   ON public.packages(is_featured);

CREATE TABLE public.package_itineraries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id  UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  day_number  INTEGER NOT NULL,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  activities  TEXT[],
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(package_id, day_number)
);

CREATE TABLE public.package_inclusions (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  text       TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.package_exclusions (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  text       TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.package_images (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  alt_text   TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── SERVICES ─────────────────────────────────────────────────────────────────

CREATE TABLE public.services (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  category          service_category NOT NULL DEFAULT 'holiday',
  short_description TEXT,
  description       TEXT,
  icon_name         TEXT,
  is_published      BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order        INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ENQUIRIES ────────────────────────────────────────────────────────────────

CREATE TABLE public.enquiries (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  phone        TEXT NOT NULL,
  email        TEXT,
  destination  TEXT,
  package_id   UUID REFERENCES public.packages(id) ON DELETE SET NULL,
  travel_dates TEXT,
  travellers   INTEGER,
  budget       TEXT,
  travel_type  travel_type,
  message      TEXT,
  source       TEXT NOT NULL DEFAULT 'website',
  status       enquiry_status NOT NULL DEFAULT 'new',
  assigned_to  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_enquiries_status      ON public.enquiries(status);
CREATE INDEX idx_enquiries_created_at  ON public.enquiries(created_at DESC);
CREATE INDEX idx_enquiries_assigned_to ON public.enquiries(assigned_to);
CREATE INDEX idx_enquiries_package_id  ON public.enquiries(package_id);
-- Full-text search on name, phone, email
CREATE INDEX idx_enquiries_name_trgm  ON public.enquiries USING gin(name gin_trgm_ops);
CREATE INDEX idx_enquiries_phone_trgm ON public.enquiries USING gin(phone gin_trgm_ops);

CREATE TABLE public.enquiry_notes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_id  UUID NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
  author_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.enquiry_followups (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_id   UUID NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  completed    BOOLEAN NOT NULL DEFAULT FALSE,
  note         TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── BLOGS ────────────────────────────────────────────────────────────────────

CREATE TABLE public.blogs (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title                TEXT NOT NULL,
  slug                 TEXT NOT NULL UNIQUE,
  excerpt              TEXT,
  content              TEXT,
  featured_image_url   TEXT,
  category             blog_category NOT NULL DEFAULT 'travel_inspiration',
  tags                 TEXT[],
  author_id            UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reading_time_minutes INTEGER,
  is_published         BOOLEAN NOT NULL DEFAULT FALSE,
  published_at         TIMESTAMPTZ,
  seo_title            TEXT,
  seo_description      TEXT,
  og_image_url         TEXT,
  deleted_at           TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blogs_slug         ON public.blogs(slug);
CREATE INDEX idx_blogs_is_published ON public.blogs(is_published);
CREATE INDEX idx_blogs_category     ON public.blogs(category);
CREATE INDEX idx_blogs_published_at ON public.blogs(published_at DESC);

-- ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

CREATE TABLE public.testimonials (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name  TEXT NOT NULL,
  trip_package   TEXT,
  review         TEXT NOT NULL,
  rating         SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  photo_url      TEXT,
  is_published   BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── REVIEWS ──────────────────────────────────────────────────────────────────

CREATE TABLE public.reviews (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform   TEXT NOT NULL,
  reviewer   TEXT NOT NULL,
  rating     SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review     TEXT NOT NULL,
  review_url TEXT,
  reviewed_at TIMESTAMPTZ,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── OFFERS ───────────────────────────────────────────────────────────────────

CREATE TABLE public.offers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  description   TEXT,
  discount_text TEXT,
  image_url     TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  valid_until   TIMESTAMPTZ,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── BANNERS ──────────────────────────────────────────────────────────────────

CREATE TABLE public.banners (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  subtitle    TEXT,
  image_url   TEXT NOT NULL,
  cta_text    TEXT,
  cta_url     TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  valid_from  TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── MEDIA ────────────────────────────────────────────────────────────────────

CREATE TABLE public.media (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name        TEXT NOT NULL,
  storage_path     TEXT NOT NULL UNIQUE,
  public_url       TEXT NOT NULL,
  mime_type        TEXT NOT NULL,
  file_size_bytes  BIGINT NOT NULL,
  alt_text         TEXT,
  uploaded_by      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_media_mime_type ON public.media(mime_type);
CREATE INDEX idx_media_uploaded_by ON public.media(uploaded_by);

-- ─── FAQs ─────────────────────────────────────────────────────────────────────

CREATE TABLE public.faqs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question     TEXT NOT NULL,
  answer       TEXT NOT NULL,
  category     TEXT,
  entity_type  entity_type NOT NULL DEFAULT 'general',
  entity_id    UUID,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── PAGES ────────────────────────────────────────────────────────────────────

CREATE TABLE public.pages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  content     TEXT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  seo_title   TEXT,
  seo_description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── SEO METADATA ─────────────────────────────────────────────────────────────

CREATE TABLE public.seo_metadata (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type     TEXT NOT NULL,
  entity_id       UUID NOT NULL,
  seo_title       TEXT,
  seo_description TEXT,
  canonical_url   TEXT,
  og_title        TEXT,
  og_description  TEXT,
  og_image_url    TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(entity_type, entity_id)
);

-- ─── SITE SETTINGS ────────────────────────────────────────────────────────────

CREATE TABLE public.site_settings (
  id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key   TEXT NOT NULL UNIQUE,
  value TEXT,
  label TEXT NOT NULL,
  type  settings_type NOT NULL DEFAULT 'text'
);

-- Seed default settings
INSERT INTO public.site_settings (key, value, label, type) VALUES
  ('company_name',      'Vayu Holidays',               'Company Name',              'text'),
  ('phone',             NULL,                          'Phone Number',              'text'),
  ('email',             NULL,                          'Email Address',             'text'),
  ('whatsapp',          NULL,                          'WhatsApp Number',           'text'),
  ('address',           'Raksha Vihar, Vayu Residency, Airport Road, Bhopal, Madhya Pradesh, India',
                                                       'Office Address',            'textarea'),
  ('facebook_url',      NULL,                          'Facebook URL',              'text'),
  ('instagram_url',     NULL,                          'Instagram URL',             'text'),
  ('twitter_url',       NULL,                          'Twitter/X URL',             'text'),
  ('youtube_url',       NULL,                          'YouTube URL',               'text'),
  ('show_testimonials', 'true',                        'Show Testimonials Section', 'boolean'),
  ('show_offers',       'true',                        'Show Offers Banner',        'boolean'),
  ('footer_description',
   'Thoughtfully planned holidays, unforgettable destinations and personalized travel experiences.',
                                                       'Footer Description',        'textarea');

-- ─── SERVICES SEED DATA ───────────────────────────────────────────────────────

INSERT INTO public.services (name, slug, category, short_description, icon_name, sort_order, is_published) VALUES
  ('Holiday Packages',   'holiday-packages',   'holiday',    'Curated domestic and international holiday packages for every kind of traveller.',           'Package',     1,  TRUE),
  ('Domestic Tours',     'domestic-tours',     'holiday',    'Explore India''s most iconic destinations with our thoughtfully planned domestic tours.',    'MapPin',      2,  TRUE),
  ('International Tours','international-tours','holiday',    'Discover the world with our premium international tour packages.',                           'Globe',       3,  TRUE),
  ('Group Tours',        'group-tours',        'holiday',    'Travel together with our specially crafted group tour packages.',                            'Users',       4,  TRUE),
  ('Honeymoon Packages', 'honeymoon-packages', 'holiday',    'Romantic escapes designed for two — crafted with care and attention.',                      'Heart',       5,  TRUE),
  ('Customized Tours',   'customized-tours',   'holiday',    'Build your perfect trip. We plan it around your interests, dates and budget.',               'Settings',    6,  TRUE),
  ('MICE',               'mice',               'holiday',    'Professional event management and corporate travel solutions.',                              'Briefcase',   7,  TRUE),
  ('Flight Booking',     'flight-booking',     'booking',    'Get assistance with domestic and international flight bookings.',                            'Plane',       8,  TRUE),
  ('Hotel Booking',      'hotel-booking',      'booking',    'Handpicked hotel recommendations and booking assistance.',                                   'Building2',   9,  TRUE),
  ('Bus Tickets',        'bus-tickets',        'booking',    'Bus ticket booking assistance for your travel needs.',                                      'Bus',         10, TRUE),
  ('Train Tickets',      'train-tickets',      'booking',    'Train ticket booking and reservation assistance.',                                          'Train',       11, TRUE),
  ('Visa Assistance',    'visa-assistance',    'assistance', 'End-to-end visa guidance and application support for international travel.',                 'FileText',    12, TRUE),
  ('Passport Assistance','passport-assistance','assistance', 'Passport application and renewal guidance.',                                                'BookOpen',    13, TRUE),
  ('Forex / Currency',   'forex-currency',     'assistance', 'Currency exchange assistance for your international travels.',                              'DollarSign',  14, TRUE),
  ('Travel Insurance',   'travel-insurance',   'assistance', 'Get the right travel insurance coverage for your journey.',                                 'Shield',      15, TRUE),
  ('Airport Transfer',   'airport-transfer',   'assistance', 'Reliable airport transfer and cab services for seamless travel.',                           'Car',         16, TRUE);

-- ─── FUNCTIONS & TRIGGERS ─────────────────────────────────────────────────────

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'profiles', 'destinations', 'packages', 'enquiries',
    'blogs', 'pages', 'seo_metadata'
  ]
  LOOP
    EXECUTE format(
      'CREATE TRIGGER set_updated_at
       BEFORE UPDATE ON public.%I
       FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at()',
      tbl
    );
  END LOOP;
END;
$$;

-- Auto-create profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
