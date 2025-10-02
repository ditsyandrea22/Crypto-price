import { RefreshCw, Clock } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated?: string;
}

export function Header({ onRefresh, isRefreshing, lastUpdated }: HeaderProps) {
  const formatTime = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleTimeString();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
              <RefreshCw className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Crypto Tracker</h1>
              <p className="text-gray-500 text-sm">Live cryptocurrency prices & market data</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {lastUpdated && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock size={16} />
                <span>Updated: {formatTime(lastUpdated)}</span>
              </div>
            )}
            
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium transition-colors ${
                isRefreshing
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              <RefreshCw
                size={16}
                className={isRefreshing ? 'animate-spin' : ''}
              />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}