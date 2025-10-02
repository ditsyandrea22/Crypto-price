import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CryptoWithPrice } from '../types/crypto';

export function useCryptoData() {
  const [cryptos, setCryptos] = useState<CryptoWithPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCryptos();

    const channel = supabase
      .channel('crypto-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'crypto_prices' }, () => {
        fetchCryptos();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchCryptos() {
    try {
      setLoading(true);
      setError(null);

      const { data: cryptoData, error: cryptoError } = await supabase
        .from('cryptocurrencies')
        .select('*')
        .order('cmc_id', { ascending: true });

      if (cryptoError) throw cryptoError;

      const cryptosWithPrices: CryptoWithPrice[] = await Promise.all(
        (cryptoData || []).map(async (crypto) => {
          const { data: priceData } = await supabase
            .from('crypto_prices')
            .select('*')
            .eq('crypto_id', crypto.id)
            .order('recorded_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          return {
            ...crypto,
            latest_price: priceData,
          };
        })
      );

      const sortedCryptos = cryptosWithPrices.sort((a, b) => {
        const rankA = a.latest_price?.rank || 999999;
        const rankB = b.latest_price?.rank || 999999;
        return rankA - rankB;
      });

      setCryptos(sortedCryptos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching cryptos:', err);
    } finally {
      setLoading(false);
    }
  }

  return { cryptos, loading, error, refetch: fetchCryptos };
}
