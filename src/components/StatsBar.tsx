import { TrendingUp, DollarSign, BarChart3 } from 'lucide-react';

interface StatsBarProps {
  totalMarketCap: number;
  total24hVolume: number;
  btcDominance: number;
}

export default function StatsBar({ totalMarketCap, total24hVolume, btcDominance }: StatsBarProps) {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Market Cap</p>
              <p className="text-lg font-bold text-gray-900">{formatNumber(totalMarketCap)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <BarChart3 className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500">24h Volume</p>
              <p className="text-lg font-bold text-gray-900">{formatNumber(total24hVolume)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500">BTC Dominance</p>
              <p className="text-lg font-bold text-gray-900">{btcDominance.toFixed(2)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
