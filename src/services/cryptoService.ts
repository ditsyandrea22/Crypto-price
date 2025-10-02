import { supabase, Cryptocurrency } from '../lib/supabase';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export const fetchAndUpdateCryptoPrices = async (limit: number = 100): Promise<void> => {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch crypto prices');
    }

    const data = await response.json();

    const cryptoData = data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
      total_volume: coin.total_volume,
      price_change_24h: coin.price_change_24h,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      circulating_supply: coin.circulating_supply,
      total_supply: coin.total_supply,
      max_supply: coin.max_supply,
      ath: coin.ath,
      ath_date: coin.ath_date,
      atl: coin.atl,
      atl_date: coin.atl_date,
      last_updated: new Date().toISOString(),
    }));

    for (const crypto of cryptoData) {
      const { error } = await supabase
        .from('cryptocurrencies')
        .upsert(crypto, { onConflict: 'id' });

      if (error) {
        console.error(`Error updating ${crypto.name}:`, error);
      }
    }
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    throw error;
  }
};

export const getCryptocurrencies = async (): Promise<Cryptocurrency[]> => {
  const { data, error } = await supabase
    .from('cryptocurrencies')
    .select('*')
    .order('market_cap_rank', { ascending: true });

  if (error) {
    console.error('Error fetching cryptocurrencies:', error);
    throw error;
  }

  return data || [];
};

export const searchCryptocurrencies = async (query: string): Promise<Cryptocurrency[]> => {
  const { data, error } = await supabase
    .from('cryptocurrencies')
    .select('*')
    .or(`name.ilike.%${query}%,symbol.ilike.%${query}%`)
    .order('market_cap_rank', { ascending: true })
    .limit(20);

  if (error) {
    console.error('Error searching cryptocurrencies:', error);
    throw error;
  }

  return data || [];
};
