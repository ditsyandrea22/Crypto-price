import { useState, useEffect } from 'react';
import { CryptoData } from './types/crypto';
import { fetchTopCryptos } from './services/coingecko';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import SearchBar from './components/SearchBar';
import CryptoCard from './components/CryptoCard';
import { Loader2, AlertCircle } from 'lucide-react';

function App() {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [filteredCryptos, setFilteredCryptos] = useState<CryptoData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadCryptos = async () => {
    try {
      setError(null);
      const data = await fetchTopCryptos('usd', 100);
      setCryptos(data);
      setFilteredCryptos(data);
    } catch (err) {
      setError('Failed to fetch cryptocurrency data. Please check your API key and try again.');
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadCryptos();
    const interval = setInterval(loadCryptos, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCryptos(cryptos);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = cryptos.filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(lowercaseQuery) ||
          crypto.symbol.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredCryptos(filtered);
    }
  }, [searchQuery, cryptos]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadCryptos();
  };

  const totalMarketCap = cryptos.reduce((acc, crypto) => acc + crypto.market_cap, 0);
  const total24hVolume = cryptos.reduce((acc, crypto) => acc + crypto.total_volume, 0);
  const btcMarketCap = cryptos.find((c) => c.symbol === 'btc')?.market_cap || 0;
  const btcDominance = totalMarketCap > 0 ? (btcMarketCap / totalMarketCap) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600 text-lg">Loading cryptocurrency data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="text-red-900 font-semibold mb-2">Error Loading Data</h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onRefresh={handleRefresh} isRefreshing={isRefreshing} />
      <StatsBar
        totalMarketCap={totalMarketCap}
        total24hVolume={total24hVolume}
        btcDominance={btcDominance}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {filteredCryptos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No cryptocurrencies found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCryptos.map((crypto) => (
              <CryptoCard key={crypto.id} crypto={crypto} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Showing {filteredCryptos.length} of {cryptos.length} cryptocurrencies</p>
          <p className="mt-1">Data updates every 60 seconds</p>
        </div>
      </div>
    </div>
  );
}

export default App;
