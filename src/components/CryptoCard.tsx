import { CryptoData } from '../types/crypto';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CryptoCardProps {
  crypto: CryptoData;
}

export default function CryptoCard({ crypto }: CryptoCardProps) {
  const isPositive = crypto.price_change_percentage_24h >= 0;
  const priceChangeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const bgChangeColor = isPositive ? 'bg-green-50' : 'bg-red-50';

  const formatNumber = (num: number | null) => {
    if (num === null) return 'N/A';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return `$${price.toFixed(8)}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={crypto.image} alt={crypto.name} className="w-12 h-12 rounded-full" />
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{crypto.name}</h3>
            <p className="text-gray-500 text-sm uppercase">{crypto.symbol}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${bgChangeColor} ${priceChangeColor}`}>
          #{crypto.market_cap_rank}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(crypto.current_price)}</p>
          <div className={`flex items-center gap-1 mt-1 ${priceChangeColor}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="text-sm font-semibold">
              {isPositive ? '+' : ''}{crypto.price_change_percentage_24h.toFixed(2)}%
            </span>
            <span className="text-xs text-gray-500 ml-1">24h</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">Market Cap</p>
            <p className="text-sm font-semibold text-gray-900">{formatNumber(crypto.market_cap)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Volume 24h</p>
            <p className="text-sm font-semibold text-gray-900">{formatNumber(crypto.total_volume)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">High 24h</p>
            <p className="text-sm font-semibold text-gray-900">{formatPrice(crypto.high_24h)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Low 24h</p>
            <p className="text-sm font-semibold text-gray-900">{formatPrice(crypto.low_24h)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
