'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface CommodityCardProps {
  symbol: string;
  name: string;
  category: string;
  price: number;
  change: number;
  changePercent: number;
  unit?: string;
  volume?: number;
  marketCap?: number;
}

export function CommodityCard({
  symbol,
  name,
  category,
  price,
  change,
  changePercent,
  unit,
  volume,
  marketCap,
}: CommodityCardProps) {
  const isPositive = change >= 0;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'crypto':
        return 'bg-gradient-to-br from-orange-900/30 to-orange-800/20 border-orange-700/50';
      case 'metal':
        return 'bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border-yellow-700/50';
      case 'energy':
        return 'bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/50';
      case 'agriculture':
        return 'bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700/50';
      default:
        return 'bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-700';
    }
  };

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case 'crypto':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'metal':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'energy':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'agriculture':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
    }
  };

  const formatPrice = (val: number) => {
    if (val >= 1000) {
      return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return val.toFixed(2);
  };

  const formatVolume = (vol: number) => {
    if (vol >= 1000000000) {
      return `${(vol / 1000000000).toFixed(2)}B`;
    } else if (vol >= 1000000) {
      return `${(vol / 1000000).toFixed(2)}M`;
    } else if (vol >= 1000) {
      return `${(vol / 1000).toFixed(2)}K`;
    }
    return vol.toString();
  };

  return (
    <div className={`${getCategoryColor(category)} border rounded-lg p-4 hover:shadow-lg transition-all duration-200`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-white">{name}</h3>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getCategoryBadgeColor(category)}`}>
              {category}
            </span>
          </div>
          <p className="text-xs text-neutral-400">{symbol}</p>
        </div>
        {isPositive ? (
          <TrendingUp className="w-5 h-5 text-green-500" />
        ) : (
          <TrendingDown className="w-5 h-5 text-red-500" />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">
            ${formatPrice(price)}
          </span>
          {unit && (
            <span className="text-xs text-neutral-500">/{unit}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{change.toFixed(2)}
          </span>
          <span className={`text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
          </span>
        </div>

        {((volume && volume > 0) || marketCap) && (
          <div className="pt-2 border-t border-neutral-700/50 space-y-1">
            {volume && volume > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Volume</span>
                <span className="text-neutral-300 font-medium">{formatVolume(volume)}</span>
              </div>
            )}
            {marketCap && (
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Market Cap</span>
                <span className="text-neutral-300 font-medium">${formatVolume(marketCap)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
