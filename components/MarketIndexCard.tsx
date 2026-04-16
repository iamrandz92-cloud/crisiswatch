'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketIndexCardProps {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export function MarketIndexCard({ symbol, name, value, change, changePercent }: MarketIndexCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-xl p-6 hover:border-neutral-600 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm text-neutral-400 font-medium">{name}</h3>
          <p className="text-xs text-neutral-500 mt-1">{symbol}</p>
        </div>
        {isPositive ? (
          <TrendingUp className="w-5 h-5 text-green-500" />
        ) : (
          <TrendingDown className="w-5 h-5 text-red-500" />
        )}
      </div>

      <div className="space-y-2">
        <p className="text-3xl font-bold text-white">
          {value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <div className={`flex items-center gap-2 text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          <span>{isPositive ? '+' : ''}{change.toFixed(2)}</span>
          <span>({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)</span>
        </div>
      </div>
    </div>
  );
}
