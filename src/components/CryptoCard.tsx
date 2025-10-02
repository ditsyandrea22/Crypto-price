import { TrendingUp, TrendingDown } from 'lucide-react';
import { Cryptocurrency } from '../lib/supabase';

interface CryptoCardProps {
  crypto: Cryptocurrency;
}

export const CryptoCard = ({ crypto }: CryptoCardProps) => {
  const isPositive = crypto.price_change_percentage_24h >= 0;

  const formatNumber = (num: number | null) => {
    if (num === null) return 'N/A';
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return 'N/A';
    if (price >= 1) return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (price >= 0.01) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(8)}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={crypto.image}
              alt={crypto.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="absolute -bottom-1 -right-1 bg-gray-100 rounded-full px-1.5 py-0.5 text-xs font-semibold text-gray-600">
              #{crypto.market_cap_rank}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{crypto.name}</h3>
            <p className="text-sm text-gray-500 uppercase">{crypto.symbol}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
          isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="font-semibold text-sm">
            {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500 mb-1">Current Price</p>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(crypto.current_price)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">Market Cap</p>
            <p className="font-semibold text-gray-900">{formatNumber(crypto.market_cap)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Volume 24h</p>
            <p className="font-semibold text-gray-900">{formatNumber(crypto.total_volume)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">24h Change</p>
            <p className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {formatPrice(crypto.price_change_24h)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Circulating Supply</p>
            <p className="font-semibold text-gray-900">
              {crypto.circulating_supply ? crypto.circulating_supply.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
