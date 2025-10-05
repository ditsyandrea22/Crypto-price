
import { useState } from 'react';
import { RefreshCw, Clock, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated?: string;
}

function useDarkMode() {
  const [isDark, setIsDark] = useState(() =>
    typeof window !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );
  const toggle = () => {
    setIsDark((prev: boolean) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };
  return { isDark, toggle };
}



export function Header({ onRefresh, isRefreshing, lastUpdated }: HeaderProps) {
  const { isDark, toggle } = useDarkMode();
  const formatTime = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleTimeString();
  };

  return (
    <header className="bg-white dark:bg-zinc-900 shadow-sm border-b border-gray-100 dark:border-zinc-800 transition-colors">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
              <RefreshCw className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Crypto Tracker</h1>
              <p className="text-gray-500 dark:text-gray-300 text-sm">Live cryptocurrency prices & market data</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggle}
              className="p-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {lastUpdated && (
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-300">
                <Clock size={16} />
                <span>Updated: {formatTime(lastUpdated)}</span>
              </div>
            )}
            
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 text-sm font-medium transition-colors ${
                isRefreshing
                  ? 'bg-gray-100 dark:bg-zinc-800 text-gray-400 cursor-not-allowed'
                  : 'bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:border-gray-400 dark:hover:border-zinc-500'
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