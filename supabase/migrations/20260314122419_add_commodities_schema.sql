/*
  # Add Commodities Schema

  1. New Tables
    - `commodities`
      - `id` (uuid, primary key)
      - `symbol` (text, unique) - Commodity symbol/ticker
      - `name` (text) - Full name of the commodity
      - `category` (text) - Type: crypto, metal, energy, agriculture
      - `price` (numeric) - Current price
      - `change` (numeric) - Price change
      - `change_percent` (numeric) - Percentage change
      - `currency` (text) - Price currency (USD, etc.)
      - `unit` (text) - Trading unit (oz, barrel, bushel, etc.)
      - `volume` (bigint) - Trading volume
      - `market_cap` (numeric) - Market capitalization (for crypto)
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `commodities` table
    - Add policy for public read access
    - Add policy for authenticated insert/update

  3. Indexes
    - Index on symbol for fast lookups
    - Index on category for filtering
    - Index on updated_at for sorting by freshness
*/

CREATE TABLE IF NOT EXISTS commodities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  change numeric NOT NULL DEFAULT 0,
  change_percent numeric NOT NULL DEFAULT 0,
  currency text DEFAULT 'USD',
  unit text,
  volume bigint DEFAULT 0,
  market_cap numeric,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE commodities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read commodities"
  ON commodities FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert commodities"
  ON commodities FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update commodities"
  ON commodities FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_commodities_symbol ON commodities(symbol);
CREATE INDEX IF NOT EXISTS idx_commodities_category ON commodities(category);
CREATE INDEX IF NOT EXISTS idx_commodities_updated_at ON commodities(updated_at DESC);
