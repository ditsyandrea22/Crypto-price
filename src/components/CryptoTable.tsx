import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { CryptoWithPrice } from '../types/crypto';

interface CryptoTableProps {
  cryptos: CryptoWithPrice[];
  onToggleFavorite?: (cryptoId: string) => void;
  favorites?: Set<string>;
  searchTerm?: string;
  highlight?: (text: string, term: string) => React.ReactNode;
}

export function CryptoTable({ cryptos, onToggleFavorite, favorites = new Set(), searchTerm = '', highlight }: CryptoTableProps) {
  const formatNumber = (num: number | null | undefined, decimals = 2): string => {
    if (num === null || num === undefined) return 'N/A';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(decimals)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`;
    return `$${num.toFixed(decimals)}`;
  };

  const formatPrice = (price: number | null | undefined): string => {
    if (price === null || price === undefined) return 'N/A';
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercent = (percent: number | null | undefined): string => {
    if (percent === null || percent === undefined) return 'N/A';
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const getPercentColor = (percent: number | null | undefined): string => {
    if (percent === null || percent === undefined) return 'text-gray-500';
    return percent >= 0 ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">1h %</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">24h %</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">7d %</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Market Cap</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Volume (24h)</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Circulating Supply</th>
          </tr>
        </thead>
        <tbody>
          {cryptos.map((crypto) => {
            const price = crypto.latest_price;
            const isFavorite = favorites.has(crypto.id);

            return (
              <tr key={crypto.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 text-sm text-gray-900">
                  <div className="flex items-center gap-2">
                    {onToggleFavorite && (
                      <button
                        onClick={() => onToggleFavorite(crypto.id)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star
                          size={16}
                          className={isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      </button>
                    )}
                    {price?.rank || '-'}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <img src={crypto.logo_url} alt={crypto.name} className="w-8 h-8" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {highlight ? highlight(crypto.name, searchTerm) : crypto.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {highlight ? highlight(crypto.symbol, searchTerm) : crypto.symbol}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-right font-semibold text-gray-900">
                  {formatPrice(price?.price_usd)}
                </td>
                <td className={`px-4 py-4 text-right font-medium ${getPercentColor(price?.percent_change_1h)}`}>
                  <div className="flex items-center justify-end gap-1">
                    {price?.percent_change_1h !== null && price?.percent_change_1h !== undefined && (
                      price.percent_change_1h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />
                    )}
                    {formatPercent(price?.percent_change_1h)}
                  </div>
                </td>
                <td className={`px-4 py-4 text-right font-medium ${getPercentColor(price?.percent_change_24h)}`}>
                  <div className="flex items-center justify-end gap-1">
                    {price?.percent_change_24h !== null && price?.percent_change_24h !== undefined && (
                      price.percent_change_24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />
                    )}
                    {formatPercent(price?.percent_change_24h)}
                  </div>
                </td>
                <td className={`px-4 py-4 text-right font-medium ${getPercentColor(price?.percent_change_7d)}`}>
                  <div className="flex items-center justify-end gap-1">
                    {price?.percent_change_7d !== null && price?.percent_change_7d !== undefined && (
                      price.percent_change_7d >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />
                    )}
                    {formatPercent(price?.percent_change_7d)}
                  </div>
                </td>
                <td className="px-4 py-4 text-right text-gray-900">
                  {formatNumber(price?.market_cap)}
                </td>
                <td className="px-4 py-4 text-right text-gray-900">
                  {formatNumber(price?.volume_24h)}
                </td>
                <td className="px-4 py-4 text-right text-gray-900">
                  <div>
                    {crypto.circulating_supply ? `${formatNumber(crypto.circulating_supply, 0).replace('$', '')} ${crypto.symbol}` : 'N/A'}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
