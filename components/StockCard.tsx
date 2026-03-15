'use client';

import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StockCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
}

export function StockCard({ symbol, name, price, change, changePercent, volume }: StockCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 hover:border-neutral-700 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">{symbol}</h3>
          <p className="text-xs text-neutral-500">{name}</p>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded ${isPositive ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
          {isPositive ? (
            <ArrowUpRight className="w-3 h-3 text-green-500" />
          ) : (
            <ArrowDownRight className="w-3 h-3 text-red-500" />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-2xl font-bold text-white">
          ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <div className={`text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
        </div>
        {volume && (
          <p className="text-xs text-neutral-500">
            Vol: {(volume / 1000000).toFixed(2)}M
          </p>
        )}
      </div>
    </div>
  );
}
