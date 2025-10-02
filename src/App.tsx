import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { CryptoCard } from './components/CryptoCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { Cryptocurrency } from './lib/supabase';
import { fetchAndUpdateCryptoPrices, getCryptocurrencies, searchCryptocurrencies } from './services/cryptoService';

function App() {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [filteredCryptos, setFilteredCryptos] = useState<Cryptocurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadCryptocurrencies = async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchAndUpdateCryptoPrices(100);
      const data = await getCryptocurrencies();
      setCryptocurrencies(data);
      setFilteredCryptos(data);
    } catch (err) {
      setError('Failed to load cryptocurrency data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      await fetchAndUpdateCryptoPrices(100);
      const data = await getCryptocurrencies();
      setCryptocurrencies(data);
      if (searchQuery) {
        const filtered = await searchCryptocurrencies(searchQuery);
        setFilteredCryptos(filtered);
      } else {
        setFilteredCryptos(data);
      }
    } catch (err) {
      setError('Failed to refresh data. Please try again.');
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredCryptos(cryptocurrencies);
    } else {
      try {
        const results = await searchCryptocurrencies(query);
        setFilteredCryptos(results);
      } catch (err) {
        console.error('Search error:', err);
      }
    }
  };

  useEffect(() => {
    loadCryptocurrencies();

    const interval = setInterval(() => {
      handleRefresh();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadCryptocurrencies} />
        ) : filteredCryptos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No cryptocurrencies found.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredCryptos.length}</span> cryptocurrencies
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCryptos.map((crypto) => (
                <CryptoCard key={crypto.id} crypto={crypto} />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-600 text-sm">
            Data provided by CoinGecko API • Updates every 60 seconds
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
