/*
  # News Aggregation Platform Schema

  ## Overview
  This migration creates the complete database schema for the Iran-US-Israel conflict news aggregation platform.

  ## New Tables

  ### 1. sources
  Stores trusted news sources with RSS feed URLs
  - `id` (uuid, primary key)
  - `name` (text) - Source name (e.g., "Reuters", "BBC")
  - `url` (text) - Source homepage URL
  - `rss_feed_url` (text) - RSS feed URL for automated collection
  - `logo_url` (text, nullable) - Source logo
  - `active` (boolean) - Whether to collect from this source
  - `last_fetched_at` (timestamptz, nullable) - Last successful fetch time
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. categories
  Article categorization (Breaking News, Military Activity, etc.)
  - `id` (uuid, primary key)
  - `name` (text) - Category name
  - `slug` (text, unique) - URL-friendly slug
  - `description` (text, nullable)
  - `icon` (text, nullable) - Icon name for display
  - `created_at` (timestamptz)

  ### 3. articles
  Main news articles with AI summaries and verification status
  - `id` (uuid, primary key)
  - `source_id` (uuid, foreign key to sources)
  - `category_id` (uuid, foreign key to categories)
  - `title` (text) - Article headline
  - `original_content` (text, nullable) - Original article content
  - `ai_summary` (text, nullable) - AI-generated 2-3 sentence summary
  - `verification_status` (text) - "confirmed", "developing", "unverified"
  - `source_url` (text) - Original article URL
  - `published_at` (timestamptz) - Article publication time
  - `approved` (boolean) - Admin approval status
  - `is_breaking` (boolean) - Breaking news flag
  - `image_url` (text, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. map_events
  Geographic events for interactive map display
  - `id` (uuid, primary key)
  - `article_id` (uuid, foreign key to articles)
  - `latitude` (decimal)
  - `longitude` (decimal)
  - `event_type` (text) - "strike", "military_movement", "conflict_location"
  - `location_name` (text) - Human-readable location
  - `created_at` (timestamptz)

  ### 5. admin_users
  Admin authentication for dashboard access
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, unique)
  - `full_name` (text)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public read access for approved articles, sources, categories
  - Admin-only write access
  - Authenticated admin access for admin dashboard

  ## Indexes
  - Articles by published_at for timeline sorting
  - Articles by category for filtering
  - Articles by verification status
  - Map events by article for efficient lookups
*/

-- Create sources table
CREATE TABLE IF NOT EXISTS sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  rss_feed_url text,
  logo_url text,
  active boolean DEFAULT true,
  last_fetched_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid REFERENCES sources(id) ON DELETE SET NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  original_content text,
  ai_summary text,
  verification_status text DEFAULT 'unverified' CHECK (verification_status IN ('confirmed', 'developing', 'unverified')),
  source_url text NOT NULL,
  published_at timestamptz NOT NULL,
  approved boolean DEFAULT false,
  is_breaking boolean DEFAULT false,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create map_events table
CREATE TABLE IF NOT EXISTS map_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  latitude decimal(10, 7) NOT NULL,
  longitude decimal(10, 7) NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('strike', 'military_movement', 'conflict_location', 'diplomatic')),
  location_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_verification ON articles(verification_status);
CREATE INDEX IF NOT EXISTS idx_articles_approved ON articles(approved);
CREATE INDEX IF NOT EXISTS idx_articles_breaking ON articles(is_breaking);
CREATE INDEX IF NOT EXISTS idx_map_events_article ON map_events(article_id);

-- Enable Row Level Security
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sources
CREATE POLICY "Public can view active sources"
  ON sources FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Admins can manage sources"
  ON sources FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- RLS Policies for categories
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- RLS Policies for articles
CREATE POLICY "Public can view approved articles"
  ON articles FOR SELECT
  TO public
  USING (approved = true);

CREATE POLICY "Admins can view all articles"
  ON articles FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

CREATE POLICY "Admins can manage articles"
  ON articles FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- RLS Policies for map_events
CREATE POLICY "Public can view map events for approved articles"
  ON map_events FOR SELECT
  TO public
  USING (EXISTS (SELECT 1 FROM articles WHERE articles.id = map_events.article_id AND articles.approved = true));

CREATE POLICY "Admins can manage map events"
  ON map_events FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- RLS Policies for admin_users
CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- Insert default categories
INSERT INTO categories (name, slug, description, icon) VALUES
  ('Breaking News', 'breaking-news', 'Latest breaking developments', 'AlertCircle'),
  ('Military Activity', 'military-activity', 'Military operations and movements', 'Shield'),
  ('Diplomatic Updates', 'diplomatic-updates', 'Diplomatic efforts and negotiations', 'Users'),
  ('Civilian Safety', 'civilian-safety', 'Civilian impact and safety information', 'Heart')
ON CONFLICT (slug) DO NOTHING;

-- Insert default trusted sources
INSERT INTO sources (name, url, rss_feed_url, logo_url, active) VALUES
  ('Reuters', 'https://www.reuters.com', 'https://www.reuters.com/rssfeed/worldNews', 'https://www.reuters.com/pf/resources/images/reuters/logo.png', true),
  ('BBC News', 'https://www.bbc.com/news', 'http://feeds.bbci.co.uk/news/world/middle_east/rss.xml', 'https://www.bbc.co.uk/news/special/2015/newsspec_10857/bbc_news_logo.png', true),
  ('Associated Press', 'https://apnews.com', 'https://rsshub.app/ap/topics/apf-topnews', null, true),
  ('Al Jazeera', 'https://www.aljazeera.com', 'https://www.aljazeera.com/xml/rss/all.xml', null, true)
ON CONFLICT DO NOTHING;