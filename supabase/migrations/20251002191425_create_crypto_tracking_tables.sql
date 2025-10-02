/*
  # Crypto Price Tracking Database Schema

  ## Overview
  Complete database schema for cryptocurrency price tracking application similar to CoinMarketCap.

  ## New Tables
  
  ### 1. `cryptocurrencies`
  Stores cryptocurrency information:
  - `id` (uuid, primary key) - Unique identifier
  - `cmc_id` (integer, unique) - CoinMarketCap ID
  - `name` (text) - Cryptocurrency name (e.g., "Bitcoin")
  - `symbol` (text) - Symbol (e.g., "BTC")
  - `slug` (text) - URL-friendly slug
  - `logo_url` (text) - Logo image URL
  - `max_supply` (numeric) - Maximum supply
  - `circulating_supply` (numeric) - Circulating supply
  - `total_supply` (numeric) - Total supply
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `crypto_prices`
  Stores current and historical price data:
  - `id` (uuid, primary key) - Unique identifier
  - `crypto_id` (uuid, foreign key) - Reference to cryptocurrency
  - `price_usd` (numeric) - Current price in USD
  - `market_cap` (numeric) - Market capitalization
  - `volume_24h` (numeric) - 24-hour trading volume
  - `percent_change_1h` (numeric) - 1-hour price change percentage
  - `percent_change_24h` (numeric) - 24-hour price change percentage
  - `percent_change_7d` (numeric) - 7-day price change percentage
  - `percent_change_30d` (numeric) - 30-day price change percentage
  - `rank` (integer) - Market cap rank
  - `recorded_at` (timestamptz) - Price snapshot timestamp
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. `user_watchlists`
  User favorite/watchlist cryptocurrencies:
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - Reference to auth.users
  - `crypto_id` (uuid, foreign key) - Reference to cryptocurrency
  - `created_at` (timestamptz) - When added to watchlist

  ## Security
  - Enable RLS on all tables
  - Public read access for cryptocurrency data
  - Authenticated users can manage their own watchlists
  - Only authenticated users can view watchlist data

  ## Indexes
  - Index on cmc_id for fast lookups
  - Index on crypto_id in prices table for efficient queries
  - Index on recorded_at for time-series queries
  - Composite index on user_id and crypto_id for watchlist queries
*/

-- Create cryptocurrencies table
CREATE TABLE IF NOT EXISTS cryptocurrencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cmc_id integer UNIQUE NOT NULL,
  name text NOT NULL,
  symbol text NOT NULL,
  slug text NOT NULL,
  logo_url text DEFAULT '',
  max_supply numeric,
  circulating_supply numeric,
  total_supply numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create crypto_prices table
CREATE TABLE IF NOT EXISTS crypto_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crypto_id uuid NOT NULL REFERENCES cryptocurrencies(id) ON DELETE CASCADE,
  price_usd numeric NOT NULL DEFAULT 0,
  market_cap numeric DEFAULT 0,
  volume_24h numeric DEFAULT 0,
  percent_change_1h numeric DEFAULT 0,
  percent_change_24h numeric DEFAULT 0,
  percent_change_7d numeric DEFAULT 0,
  percent_change_30d numeric DEFAULT 0,
  rank integer DEFAULT 0,
  recorded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create user_watchlists table
CREATE TABLE IF NOT EXISTS user_watchlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crypto_id uuid NOT NULL REFERENCES cryptocurrencies(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, crypto_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cryptocurrencies_cmc_id ON cryptocurrencies(cmc_id);
CREATE INDEX IF NOT EXISTS idx_cryptocurrencies_symbol ON cryptocurrencies(symbol);
CREATE INDEX IF NOT EXISTS idx_crypto_prices_crypto_id ON crypto_prices(crypto_id);
CREATE INDEX IF NOT EXISTS idx_crypto_prices_recorded_at ON crypto_prices(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_watchlists_user_id ON user_watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_user_watchlists_composite ON user_watchlists(user_id, crypto_id);

-- Enable Row Level Security
ALTER TABLE cryptocurrencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_watchlists ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cryptocurrencies (public read)
CREATE POLICY "Anyone can view cryptocurrencies"
  ON cryptocurrencies FOR SELECT
  TO public
  USING (true);

-- RLS Policies for crypto_prices (public read)
CREATE POLICY "Anyone can view crypto prices"
  ON crypto_prices FOR SELECT
  TO public
  USING (true);

-- RLS Policies for user_watchlists
CREATE POLICY "Users can view own watchlist"
  ON user_watchlists FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own watchlist"
  ON user_watchlists FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from own watchlist"
  ON user_watchlists FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for cryptocurrencies updated_at
DROP TRIGGER IF EXISTS update_cryptocurrencies_updated_at ON cryptocurrencies;
CREATE TRIGGER update_cryptocurrencies_updated_at
  BEFORE UPDATE ON cryptocurrencies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();