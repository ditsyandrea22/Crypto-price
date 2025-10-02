import { Search, RefreshCw, TrendingUp } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header = ({ searchQuery, onSearchChange, onRefresh, isRefreshing }: HeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <TrendingUp size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">CryptoTracker</h1>
              <p className="text-blue-100 text-sm">Real-time cryptocurrency prices</p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
            <span className="font-semibold">Refresh</span>
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md"
          />
        </div>
      </div>
    </header>
  );
};
