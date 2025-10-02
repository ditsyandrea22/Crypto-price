/*
  # Create Crypto Price Tracker Schema

  1. New Tables
    - `cryptocurrencies`
      - `id` (text, primary key) - Coin ID from API
      - `symbol` (text) - Coin symbol (BTC, ETH, etc)
      - `name` (text) - Full name of cryptocurrency
      - `image` (text) - Coin logo URL
      - `current_price` (numeric) - Current price in USD
      - `market_cap` (numeric) - Market capitalization
      - `market_cap_rank` (integer) - Rank by market cap
      - `total_volume` (numeric) - 24h trading volume
      - `price_change_24h` (numeric) - Price change in last 24h
      - `price_change_percentage_24h` (numeric) - Price change percentage
      - `circulating_supply` (numeric) - Circulating supply
      - `total_supply` (numeric) - Total supply
      - `max_supply` (numeric) - Maximum supply
      - `ath` (numeric) - All time high price
      - `ath_date` (timestamptz) - All time high date
      - `atl` (numeric) - All time low price
      - `atl_date` (timestamptz) - All time low date
      - `last_updated` (timestamptz) - Last update timestamp
      - `created_at` (timestamptz) - Record creation time
  
  2. Security
    - Enable RLS on `cryptocurrencies` table
    - Add policy for public read access (crypto prices are public data)
*/

CREATE TABLE IF NOT EXISTS cryptocurrencies (
  id text PRIMARY KEY,
  symbol text NOT NULL,
  name text NOT NULL,
  image text,
  current_price numeric,
  market_cap numeric,
  market_cap_rank integer,
  total_volume numeric,
  price_change_24h numeric,
  price_change_percentage_24h numeric,
  circulating_supply numeric,
  total_supply numeric,
  max_supply numeric,
  ath numeric,
  ath_date timestamptz,
  atl numeric,
  atl_date timestamptz,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cryptocurrencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cryptocurrency data"
  ON cryptocurrencies
  FOR SELECT
  TO public
  USING (true);