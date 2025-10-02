import { useState, useMemo } from 'react';
import { Coins, Activity, TrendingUp, DollarSign, Search } from 'lucide-react';
import { useCryptoData } from './hooks/useCryptoData';
import { CryptoTable } from './components/CryptoTable';
import { StatCard } from './components/StatCard';
import { Header } from './components/Header';

function App() {
  const { cryptos, loading, error, refetch } = useCryptoData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const filteredCryptos = useMemo(() => {
    if (!searchTerm) return cryptos;
    const term = searchTerm.toLowerCase();
    return cryptos.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(term) ||
        crypto.symbol.toLowerCase().includes(term)
    );
  }, [cryptos, searchTerm]);

  const stats = useMemo(() => {
    const totalMarketCap = cryptos.reduce((sum, crypto) => {
      return sum + (crypto.latest_price?.market_cap || 0);
    }, 0);

    const total24hVolume = cryptos.reduce((sum, crypto) => {
      return sum + (crypto.latest_price?.volume_24h || 0);
    }, 0);

    const btc = cryptos.find((c) => c.symbol === 'BTC');
    const eth = cryptos.find((c) => c.symbol === 'ETH');

    return {
      totalMarketCap,
      total24hVolume,
      btcDominance: btc?.latest_price?.market_cap
        ? (btc.latest_price.market_cap / totalMarketCap) * 100
        : 0,
      ethPrice: eth?.latest_price?.price_usd || 0,
    };
  }, [cryptos]);

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  const lastUpdated = cryptos[0]?.latest_price?.recorded_at;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg max-w-md">
          <div className="text-red-500 text-center mb-4">
            <Activity size={48} className="mx-auto mb-2" />
            <h2 className="text-xl font-bold">Error Loading Data</h2>
          </div>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header onRefresh={handleRefresh} isRefreshing={isRefreshing} lastUpdated={lastUpdated} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && cryptos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading cryptocurrency data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Market Cap"
                value={formatNumber(stats.totalMarketCap)}
                icon={DollarSign}
              />
              <StatCard
                title="24h Volume"
                value={formatNumber(stats.total24hVolume)}
                icon={Activity}
              />
              <StatCard
                title="BTC Dominance"
                value={`${stats.btcDominance.toFixed(2)}%`}
                icon={TrendingUp}
              />
              <StatCard
                title="Cryptocurrencies"
                value={cryptos.length.toString()}
                icon={Coins}
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Cryptocurrency Prices by Market Cap
                  </h2>
                  <div className="relative">
                    <Search
                      size={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search cryptocurrencies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full sm:w-64"
                    />
                  </div>
                </div>
              </div>

              {filteredCryptos.length === 0 ? (
                <div className="p-12 text-center">
                  <Coins size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">No cryptocurrencies found</p>
                  <p className="text-gray-400 text-sm mt-2">
                    {searchTerm
                      ? 'Try adjusting your search term'
                      : 'Data will appear here once prices are fetched'}
                  </p>
                </div>
              ) : (
                <CryptoTable cryptos={filteredCryptos} />
              )}
            </div>

            {cryptos.length === 0 && (
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Getting Started
                </h3>
                <p className="text-blue-700 mb-4">
                  No cryptocurrency data found. To fetch live prices from CoinMarketCap:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-blue-700 mb-4">
                  <li>Get a free API key from <a href="https://coinmarketcap.com/api/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">CoinMarketCap</a></li>
                  <li>Use the fetch-crypto-prices edge function with your API key</li>
                  <li>Prices will update automatically in real-time</li>
                </ol>
                <code className="block bg-blue-100 p-3 rounded text-sm text-blue-900 overflow-x-auto">
                  GET {import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-crypto-prices?apiKey=YOUR_API_KEY&limit=100
                </code>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
