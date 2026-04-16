'use client';

import { Activity, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface MarketSummaryStatsProps {
  totalVolume: number;
  gainers: number;
  losers: number;
  avgChange: number;
}

export function MarketSummaryStats({ totalVolume, gainers, losers, avgChange }: MarketSummaryStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="w-4 h-4 text-blue-500" />
          <span className="text-xs text-neutral-400">Total Volume</span>
        </div>
        <p className="text-2xl font-bold text-white">
          {(totalVolume / 1000000000).toFixed(2)}B
        </p>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-xs text-neutral-400">Gainers</span>
        </div>
        <p className="text-2xl font-bold text-green-500">{gainers}</p>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingDown className="w-4 h-4 text-red-500" />
          <span className="text-xs text-neutral-400">Losers</span>
        </div>
        <p className="text-2xl font-bold text-red-500">{losers}</p>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-purple-500" />
          <span className="text-xs text-neutral-400">Avg Change</span>
        </div>
        <p className={`text-2xl font-bold ${avgChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
        </p>
      </div>
    </div>
  );
}
