/*
  # Add Market Data Schema

  1. New Tables
    - `market_indices`
      - `id` (uuid, primary key)
      - `symbol` (text, e.g., 'SPX', 'DJI', 'IXIC')
      - `name` (text, e.g., 'S&P 500')
      - `value` (numeric, current value)
      - `change` (numeric, point change)
      - `change_percent` (numeric, percentage change)
      - `updated_at` (timestamp)
    
    - `stocks`
      - `id` (uuid, primary key)
      - `symbol` (text, e.g., 'AAPL', 'GOOGL')
      - `name` (text, company name)
      - `price` (numeric, current price)
      - `change` (numeric, price change)
      - `change_percent` (numeric, percentage change)
      - `volume` (bigint, trading volume)
      - `market_cap` (bigint, market capitalization)
      - `sector` (text, e.g., 'Technology', 'Healthcare')
      - `updated_at` (timestamp)
    
    - `market_news`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `summary` (text)
      - `source` (text)
      - `url` (text, unique)
      - `published_at` (timestamp)
      - `category` (text, e.g., 'Markets', 'Crypto', 'Commodities')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - All data publicly readable
    - Only authenticated users can insert/update (for admin functions)
*/

-- Create market_indices table
CREATE TABLE IF NOT EXISTS market_indices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text UNIQUE NOT NULL,
  name text NOT NULL,
  value numeric NOT NULL,
  change numeric NOT NULL,
  change_percent numeric NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Create stocks table
CREATE TABLE IF NOT EXISTS stocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text UNIQUE NOT NULL,
  name text NOT NULL,
  price numeric NOT NULL,
  change numeric NOT NULL,
  change_percent numeric NOT NULL,
  volume bigint DEFAULT 0,
  market_cap bigint,
  sector text,
  updated_at timestamptz DEFAULT now()
);

-- Create market_news table
CREATE TABLE IF NOT EXISTS market_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  summary text,
  source text NOT NULL,
  url text UNIQUE NOT NULL,
  published_at timestamptz NOT NULL,
  category text DEFAULT 'Markets',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_market_indices_symbol ON market_indices(symbol);
CREATE INDEX IF NOT EXISTS idx_stocks_symbol ON stocks(symbol);
CREATE INDEX IF NOT EXISTS idx_stocks_sector ON stocks(sector);
CREATE INDEX IF NOT EXISTS idx_market_news_published ON market_news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_market_news_category ON market_news(category);

-- Enable RLS
ALTER TABLE market_indices ENABLE ROW LEVEL SECURITY;
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_news ENABLE ROW LEVEL SECURITY;

-- Market indices policies
CREATE POLICY "Market indices are publicly readable"
  ON market_indices FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert market indices"
  ON market_indices FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update market indices"
  ON market_indices FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Stocks policies
CREATE POLICY "Stocks are publicly readable"
  ON stocks FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert stocks"
  ON stocks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update stocks"
  ON stocks FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Market news policies
CREATE POLICY "Market news is publicly readable"
  ON market_news FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert market news"
  ON market_news FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update market news"
  ON market_news FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);