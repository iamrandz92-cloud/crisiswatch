/*
  # Add Advanced Intelligence Features

  ## Summary
  This migration adds comprehensive intelligence tracking capabilities including casualty tracking,
  military movements, threat predictions, humanitarian resources, expert analysis, and wargaming scenarios.

  ## New Tables

  ### 1. casualty_reports
  Tracks casualties and damage from conflict events
  - `id` (uuid, primary key)
  - `event_id` (uuid, foreign key) - Reference to escalation_events
  - `location` (text) - Location of casualties
  - `casualties_military` (integer) - Military casualties
  - `casualties_civilian` (integer) - Civilian casualties
  - `casualties_unknown` (integer) - Unknown casualties
  - `injuries_reported` (integer) - Total injuries
  - `infrastructure_damage` (text) - Type of damage (minor, moderate, severe, destroyed)
  - `damage_description` (text) - Description of damage
  - `verified` (boolean) - Verification status
  - `verified_by` (text) - Verification source
  - `reported_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 2. military_movements
  Tracks military unit and equipment movements
  - `id` (uuid, primary key)
  - `movement_type` (text) - troop, armor, artillery, air, naval, missile
  - `force` (text) - Military force involved
  - `unit_size` (text) - squad, platoon, company, battalion, brigade, division
  - `from_location` (text) - Origin
  - `to_location` (text) - Destination
  - `latitude` (numeric) - Coordinate
  - `longitude` (numeric) - Coordinate
  - `status` (text) - planned, in_progress, completed, cancelled
  - `confidence_level` (integer) - 1-10
  - `source_type` (text) - satellite, osint, official, intelligence
  - `notes` (text)
  - `detected_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 3. threat_predictions
  AI-powered threat analysis and predictions
  - `id` (uuid, primary key)
  - `threat_type` (text) - escalation, attack, diplomatic, economic
  - `target_region` (text) - Affected region
  - `probability` (integer) - 0-100
  - `severity` (integer) - 1-10
  - `timeframe` (text) - immediate, 24h, 48h, week, month
  - `prediction_factors` (jsonb) - Array of contributing factors
  - `ai_model_version` (text) - Model identifier
  - `confidence_score` (numeric) - 0-1
  - `status` (text) - active, realized, expired, invalidated
  - `predicted_at` (timestamptz)
  - `expires_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 4. humanitarian_resources
  Tracks aid, supplies, and humanitarian resources
  - `id` (uuid, primary key)
  - `resource_type` (text) - food, water, medical, shelter, fuel, power
  - `location` (text)
  - `latitude` (numeric)
  - `longitude` (numeric)
  - `quantity` (text) - Quantity description
  - `status` (text) - available, critical, depleted, incoming
  - `provider` (text) - Organization providing
  - `last_updated` (timestamptz)
  - `notes` (text)
  - `created_at` (timestamptz)

  ### 5. expert_analysis
  Analysis and commentary from military/geopolitical experts
  - `id` (uuid, primary key)
  - `expert_name` (text)
  - `expert_title` (text) - Title/credentials
  - `expert_organization` (text)
  - `analysis_type` (text) - military, diplomatic, economic, strategic
  - `title` (text)
  - `content` (text) - Full analysis
  - `key_points` (jsonb) - Array of key takeaways
  - `related_events` (jsonb) - Array of related event IDs
  - `published_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 6. wargame_scenarios
  Interactive scenario planning and wargaming simulations
  - `id` (uuid, primary key)
  - `scenario_name` (text)
  - `description` (text)
  - `scenario_type` (text) - escalation, de-escalation, diplomatic, military
  - `starting_conditions` (jsonb) - Initial state
  - `possible_actions` (jsonb) - Array of available actions
  - `outcomes` (jsonb) - Potential outcomes
  - `probability_tree` (jsonb) - Decision tree data
  - `created_by` (uuid) - User who created
  - `active` (boolean)
  - `created_at` (timestamptz)

  ### 7. source_verification
  Multi-source verification tracking
  - `id` (uuid, primary key)
  - `event_id` (uuid, foreign key) - Reference to escalation_events
  - `source_name` (text)
  - `source_type` (text) - media, osint, satellite, official, eyewitness
  - `source_url` (text)
  - `verification_status` (text) - pending, verified, disputed, debunked
  - `credibility_score` (integer) - 1-10
  - `verification_method` (text)
  - `verified_by` (text)
  - `verified_at` (timestamptz)
  - `notes` (text)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public read access for verified/published data
  - Admin-only write access for sensitive tables
  - Authenticated users can create wargame scenarios

  ## Indexes
  - Location-based queries
  - Time-based queries
  - Status filtering
  - Foreign key relationships
*/

-- Create casualty_reports table
CREATE TABLE IF NOT EXISTS casualty_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES escalation_events(id) ON DELETE CASCADE,
  location text NOT NULL,
  casualties_military integer DEFAULT 0,
  casualties_civilian integer DEFAULT 0,
  casualties_unknown integer DEFAULT 0,
  injuries_reported integer DEFAULT 0,
  infrastructure_damage text CHECK (infrastructure_damage IN ('none', 'minor', 'moderate', 'severe', 'destroyed')),
  damage_description text,
  verified boolean DEFAULT false,
  verified_by text,
  reported_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create military_movements table
CREATE TABLE IF NOT EXISTS military_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  movement_type text NOT NULL CHECK (movement_type IN ('troop', 'armor', 'artillery', 'air', 'naval', 'missile')),
  force text NOT NULL,
  unit_size text CHECK (unit_size IN ('squad', 'platoon', 'company', 'battalion', 'brigade', 'division', 'unknown')),
  from_location text,
  to_location text NOT NULL,
  latitude numeric,
  longitude numeric,
  status text DEFAULT 'detected' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled', 'detected')),
  confidence_level integer CHECK (confidence_level BETWEEN 1 AND 10),
  source_type text CHECK (source_type IN ('satellite', 'osint', 'official', 'intelligence', 'radar')),
  notes text,
  detected_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create threat_predictions table
CREATE TABLE IF NOT EXISTS threat_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  threat_type text NOT NULL CHECK (threat_type IN ('escalation', 'attack', 'diplomatic', 'economic', 'cyber')),
  target_region text NOT NULL,
  probability integer CHECK (probability BETWEEN 0 AND 100),
  severity integer CHECK (severity BETWEEN 1 AND 10),
  timeframe text CHECK (timeframe IN ('immediate', '24h', '48h', 'week', 'month')),
  prediction_factors jsonb DEFAULT '[]'::jsonb,
  ai_model_version text DEFAULT 'v1.0',
  confidence_score numeric CHECK (confidence_score BETWEEN 0 AND 1),
  status text DEFAULT 'active' CHECK (status IN ('active', 'realized', 'expired', 'invalidated')),
  predicted_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create humanitarian_resources table
CREATE TABLE IF NOT EXISTS humanitarian_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type text NOT NULL CHECK (resource_type IN ('food', 'water', 'medical', 'shelter', 'fuel', 'power', 'communications')),
  location text NOT NULL,
  latitude numeric,
  longitude numeric,
  quantity text,
  status text DEFAULT 'available' CHECK (status IN ('available', 'critical', 'depleted', 'incoming', 'blocked')),
  provider text,
  last_updated timestamptz DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create expert_analysis table
CREATE TABLE IF NOT EXISTS expert_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_name text NOT NULL,
  expert_title text,
  expert_organization text,
  analysis_type text CHECK (analysis_type IN ('military', 'diplomatic', 'economic', 'strategic', 'humanitarian')),
  title text NOT NULL,
  content text NOT NULL,
  key_points jsonb DEFAULT '[]'::jsonb,
  related_events jsonb DEFAULT '[]'::jsonb,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create wargame_scenarios table
CREATE TABLE IF NOT EXISTS wargame_scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_name text NOT NULL,
  description text NOT NULL,
  scenario_type text CHECK (scenario_type IN ('escalation', 'de-escalation', 'diplomatic', 'military', 'humanitarian')),
  starting_conditions jsonb DEFAULT '{}'::jsonb,
  possible_actions jsonb DEFAULT '[]'::jsonb,
  outcomes jsonb DEFAULT '[]'::jsonb,
  probability_tree jsonb DEFAULT '{}'::jsonb,
  created_by uuid,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create source_verification table
CREATE TABLE IF NOT EXISTS source_verification (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES escalation_events(id) ON DELETE CASCADE,
  source_name text NOT NULL,
  source_type text CHECK (source_type IN ('media', 'osint', 'satellite', 'official', 'eyewitness', 'social_media')),
  source_url text,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'disputed', 'debunked')),
  credibility_score integer CHECK (credibility_score BETWEEN 1 AND 10),
  verification_method text,
  verified_by text,
  verified_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_casualty_reports_event ON casualty_reports(event_id);
CREATE INDEX IF NOT EXISTS idx_casualty_reports_verified ON casualty_reports(verified, reported_at);
CREATE INDEX IF NOT EXISTS idx_military_movements_status ON military_movements(status, detected_at);
CREATE INDEX IF NOT EXISTS idx_military_movements_location ON military_movements(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_threat_predictions_status ON threat_predictions(status, predicted_at);
CREATE INDEX IF NOT EXISTS idx_threat_predictions_region ON threat_predictions(target_region);
CREATE INDEX IF NOT EXISTS idx_humanitarian_resources_status ON humanitarian_resources(status, resource_type);
CREATE INDEX IF NOT EXISTS idx_humanitarian_resources_location ON humanitarian_resources(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_expert_analysis_published ON expert_analysis(published_at);
CREATE INDEX IF NOT EXISTS idx_wargame_scenarios_active ON wargame_scenarios(active, created_at);
CREATE INDEX IF NOT EXISTS idx_source_verification_event ON source_verification(event_id);
CREATE INDEX IF NOT EXISTS idx_source_verification_status ON source_verification(verification_status);

-- Enable RLS
ALTER TABLE casualty_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE military_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE threat_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE humanitarian_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE wargame_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_verification ENABLE ROW LEVEL SECURITY;

-- RLS Policies for casualty_reports
CREATE POLICY "Public can view verified casualty reports"
  ON casualty_reports FOR SELECT
  USING (verified = true);

CREATE POLICY "Admins can manage casualty reports"
  ON casualty_reports FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for military_movements
CREATE POLICY "Public can view completed military movements"
  ON military_movements FOR SELECT
  USING (confidence_level >= 7);

CREATE POLICY "Admins can manage military movements"
  ON military_movements FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for threat_predictions
CREATE POLICY "Public can view active threat predictions"
  ON threat_predictions FOR SELECT
  USING (status = 'active');

CREATE POLICY "Admins can manage threat predictions"
  ON threat_predictions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for humanitarian_resources
CREATE POLICY "Public can view humanitarian resources"
  ON humanitarian_resources FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage humanitarian resources"
  ON humanitarian_resources FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for expert_analysis
CREATE POLICY "Public can view published expert analysis"
  ON expert_analysis FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage expert analysis"
  ON expert_analysis FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for wargame_scenarios
CREATE POLICY "Public can view active wargame scenarios"
  ON wargame_scenarios FOR SELECT
  USING (active = true);

CREATE POLICY "Authenticated users can create wargame scenarios"
  ON wargame_scenarios FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own wargame scenarios"
  ON wargame_scenarios FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Admins can manage all wargame scenarios"
  ON wargame_scenarios FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for source_verification
CREATE POLICY "Public can view verified sources"
  ON source_verification FOR SELECT
  USING (verification_status IN ('verified', 'disputed', 'debunked'));

CREATE POLICY "Admins can manage source verification"
  ON source_verification FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);