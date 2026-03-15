/*
  # Add Intelligence Features Schema

  ## Overview
  Extends the database to support advanced intelligence features including escalation tracking,
  alerts, daily briefings, risk assessments, and civilian safety information.

  ## New Tables

  ### 1. escalation_events
  Tracks major events that affect escalation levels
  - `id` (uuid, primary key)
  - `event_type` (text) - Type of event (missile_launch, airstrike, diplomatic, etc.)
  - `severity` (int) - Severity score 1-10
  - `location` (text) - Location of event
  - `description` (text) - Event description
  - `verified` (boolean) - Whether event is verified
  - `article_id` (uuid, nullable) - Related article if any
  - `created_at` (timestamptz)

  ### 2. escalation_levels
  Current escalation status by region
  - `id` (uuid, primary key)
  - `region` (text) - Region name (e.g., "Global", "Israel", "Iran")
  - `level` (text) - low, military_activity, major_strikes, regional_war
  - `level_score` (int) - Numeric score 0-100
  - `last_updated` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. alerts
  Breaking news alerts for push notifications
  - `id` (uuid, primary key)
  - `title` (text) - Alert title
  - `message` (text) - Alert message
  - `alert_type` (text) - missile, airstrike, diplomatic, ceasefire
  - `priority` (text) - low, medium, high, critical
  - `sent` (boolean) - Whether notification was sent
  - `article_id` (uuid, nullable)
  - `created_at` (timestamptz)

  ### 4. daily_briefings
  Auto-generated daily summaries
  - `id` (uuid, primary key)
  - `briefing_date` (date, unique) - Date of briefing
  - `summary` (text) - Overall summary
  - `key_events` (jsonb) - Array of key events
  - `military_movements` (text, nullable)
  - `diplomatic_updates` (text, nullable)
  - `potential_developments` (text, nullable)
  - `confirmed_count` (int) - Number of confirmed events
  - `developing_count` (int) - Number of developing events
  - `created_at` (timestamptz)

  ### 5. risk_assessments
  Risk levels by country/region
  - `id` (uuid, primary key)
  - `country` (text, unique) - Country name
  - `risk_level` (text) - low, medium, high, critical
  - `risk_score` (int) - Numeric score 0-100
  - `factors` (jsonb) - Risk factors
  - `last_updated` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. civilian_safety
  Safety information and alerts
  - `id` (uuid, primary key)
  - `region` (text) - Affected region
  - `alert_type` (text) - shelter, evacuation, emergency, safe_zone
  - `title` (text) - Alert title
  - `description` (text) - Detailed information
  - `coordinates` (jsonb, nullable) - Location coordinates
  - `contact_numbers` (jsonb, nullable) - Emergency contacts
  - `active` (boolean) - Whether alert is active
  - `priority` (text) - low, medium, high, urgent
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 7. osint_posts
  Verified social media intelligence
  - `id` (uuid, primary key)
  - `source_type` (text) - twitter, telegram, official
  - `author` (text) - Author name
  - `author_verified` (boolean) - Whether author is verified
  - `content` (text) - Post content
  - `media_url` (text, nullable) - Attached media
  - `post_url` (text) - Original post URL
  - `reliability_score` (int) - 0-100
  - `published_at` (timestamptz)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public read access for active/published data
  - Admin-only write access

  ## Indexes
  - Events by date for timeline
  - Alerts by priority and sent status
  - Briefings by date
  - Risk assessments by country
*/

-- Create escalation_events table
CREATE TABLE IF NOT EXISTS escalation_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL CHECK (event_type IN ('missile_launch', 'airstrike', 'drone_strike', 'ground_operation', 'naval_activity', 'diplomatic', 'ceasefire', 'other')),
  severity int NOT NULL CHECK (severity >= 1 AND severity <= 10),
  location text NOT NULL,
  description text NOT NULL,
  verified boolean DEFAULT false,
  article_id uuid REFERENCES articles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create escalation_levels table
CREATE TABLE IF NOT EXISTS escalation_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region text UNIQUE NOT NULL,
  level text NOT NULL CHECK (level IN ('low', 'military_activity', 'major_strikes', 'regional_war')),
  level_score int NOT NULL CHECK (level_score >= 0 AND level_score <= 100),
  last_updated timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  alert_type text NOT NULL CHECK (alert_type IN ('missile', 'airstrike', 'diplomatic', 'ceasefire', 'other')),
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  sent boolean DEFAULT false,
  article_id uuid REFERENCES articles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create daily_briefings table
CREATE TABLE IF NOT EXISTS daily_briefings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  briefing_date date UNIQUE NOT NULL,
  summary text NOT NULL,
  key_events jsonb DEFAULT '[]'::jsonb,
  military_movements text,
  diplomatic_updates text,
  potential_developments text,
  confirmed_count int DEFAULT 0,
  developing_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create risk_assessments table
CREATE TABLE IF NOT EXISTS risk_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country text UNIQUE NOT NULL,
  risk_level text NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  risk_score int NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  factors jsonb DEFAULT '[]'::jsonb,
  last_updated timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create civilian_safety table
CREATE TABLE IF NOT EXISTS civilian_safety (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region text NOT NULL,
  alert_type text NOT NULL CHECK (alert_type IN ('shelter', 'evacuation', 'emergency', 'safe_zone')),
  title text NOT NULL,
  description text NOT NULL,
  coordinates jsonb,
  contact_numbers jsonb,
  active boolean DEFAULT true,
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create osint_posts table
CREATE TABLE IF NOT EXISTS osint_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type text NOT NULL CHECK (source_type IN ('twitter', 'telegram', 'official', 'analyst')),
  author text NOT NULL,
  author_verified boolean DEFAULT false,
  content text NOT NULL,
  media_url text,
  post_url text NOT NULL,
  reliability_score int CHECK (reliability_score >= 0 AND reliability_score <= 100),
  published_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_escalation_events_created ON escalation_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_escalation_events_type ON escalation_events(event_type);
CREATE INDEX IF NOT EXISTS idx_alerts_priority ON alerts(priority, sent);
CREATE INDEX IF NOT EXISTS idx_daily_briefings_date ON daily_briefings(briefing_date DESC);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_level ON risk_assessments(risk_level);
CREATE INDEX IF NOT EXISTS idx_civilian_safety_active ON civilian_safety(active, priority);
CREATE INDEX IF NOT EXISTS idx_osint_posts_published ON osint_posts(published_at DESC);

-- Enable Row Level Security
ALTER TABLE escalation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalation_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE civilian_safety ENABLE ROW LEVEL SECURITY;
ALTER TABLE osint_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for escalation_events
CREATE POLICY "Public can view verified escalation events"
  ON escalation_events FOR SELECT
  TO public
  USING (verified = true);

CREATE POLICY "Admins can manage escalation events"
  ON escalation_events FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- RLS Policies for escalation_levels
CREATE POLICY "Public can view escalation levels"
  ON escalation_levels FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage escalation levels"
  ON escalation_levels FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- RLS Policies for alerts
CREATE POLICY "Public can view sent alerts"
  ON alerts FOR SELECT
  TO public
  USING (sent = true);

CREATE POLICY "Admins can manage alerts"
  ON alerts FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- RLS Policies for daily_briefings
CREATE POLICY "Public can view daily briefings"
  ON daily_briefings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage daily briefings"
  ON daily_briefings FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- RLS Policies for risk_assessments
CREATE POLICY "Public can view risk assessments"
  ON risk_assessments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage risk assessments"
  ON risk_assessments FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- RLS Policies for civilian_safety
CREATE POLICY "Public can view active civilian safety alerts"
  ON civilian_safety FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Admins can manage civilian safety"
  ON civilian_safety FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- RLS Policies for osint_posts
CREATE POLICY "Public can view osint posts"
  ON osint_posts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage osint posts"
  ON osint_posts FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- Insert default escalation level
INSERT INTO escalation_levels (region, level, level_score) VALUES
  ('Global', 'military_activity', 45)
ON CONFLICT (region) DO NOTHING;

-- Insert default risk assessments
INSERT INTO risk_assessments (country, risk_level, risk_score, factors) VALUES
  ('Israel', 'high', 85, '["Active conflict zone", "Regular missile threats", "Military operations ongoing"]'::jsonb),
  ('Iran', 'high', 80, '["Regional tensions", "Nuclear program concerns", "Proxy conflicts"]'::jsonb),
  ('Lebanon', 'medium', 60, '["Border tensions", "Hezbollah presence", "Economic instability"]'::jsonb),
  ('Syria', 'high', 75, '["Ongoing civil conflict", "Foreign military presence", "Instability"]'::jsonb),
  ('Iraq', 'medium', 55, '["Political instability", "Militia activity", "Regional influence"]'::jsonb),
  ('Saudi Arabia', 'medium', 50, '["Regional involvement", "Economic targets", "Defensive posture"]'::jsonb),
  ('UAE', 'medium', 45, '["Regional stability efforts", "Diplomatic initiatives", "Economic hub"]'::jsonb),
  ('Jordan', 'low', 30, '["Stable government", "Western alliances", "Refugee pressures"]'::jsonb),
  ('Egypt', 'low', 35, '["Regional mediator", "Peace treaty with Israel", "Internal stability"]'::jsonb),
  ('United States', 'low', 40, '["Military presence in region", "Support for allies", "Diplomatic engagement"]'::jsonb)
ON CONFLICT (country) DO NOTHING;
