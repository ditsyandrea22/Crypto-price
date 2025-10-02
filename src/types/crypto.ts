export interface Cryptocurrency {
  id: string;
  cmc_id: number;
  name: string;
  symbol: string;
  slug: string;
  logo_url: string;
  max_supply: number | null;
  circulating_supply: number | null;
  total_supply: number | null;
  created_at: string;
  updated_at: string;
}

export interface CryptoPrice {
  id: string;
  crypto_id: string;
  price_usd: number;
  market_cap: number;
  volume_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  rank: number;
  recorded_at: string;
  created_at: string;
}

export interface CryptoWithPrice extends Cryptocurrency {
  latest_price: CryptoPrice | null;
}
