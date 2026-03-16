/*
  # Add Deployment Documentation Table

  1. New Tables
    - `deployment_docs`
      - `id` (uuid, primary key)
      - `platform` (text) - Deployment platform name (e.g., 'Netlify', 'Vercel', 'AWS')
      - `title` (text) - Documentation title
      - `content` (text) - Full documentation content in markdown
      - `category` (text) - Category such as 'setup', 'deployment', 'configuration', 'troubleshooting'
      - `tags` (jsonb) - Array of tags for search/filtering
      - `order` (integer) - Display order
      - `active` (boolean) - Whether this documentation is active
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `deployment_docs` table
    - Add policy for public read access (documentation should be publicly accessible)
    - Add policy for admin write access only
*/

CREATE TABLE IF NOT EXISTS deployment_docs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'setup'
    CHECK (category IN ('setup', 'deployment', 'configuration', 'troubleshooting', 'maintenance')),
  tags jsonb DEFAULT '[]'::jsonb,
  "order" integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE deployment_docs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read deployment docs"
  ON deployment_docs
  FOR SELECT
  TO authenticated, anon
  USING (active = true);

CREATE POLICY "Admins can insert deployment docs"
  ON deployment_docs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update deployment docs"
  ON deployment_docs
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete deployment docs"
  ON deployment_docs
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_deployment_docs_platform ON deployment_docs(platform);
CREATE INDEX IF NOT EXISTS idx_deployment_docs_category ON deployment_docs(category);
CREATE INDEX IF NOT EXISTS idx_deployment_docs_active ON deployment_docs(active);
