'use client';

import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface MarketSummary {
  gainers: number;
  losers: number;
  unchanged: number;
}

interface MarketTrendChartProps {
  summary: MarketSummary;
}

export function MarketTrendChart({ summary }: MarketTrendChartProps) {
  const total = summary.gainers + summary.losers + summary.unchanged;
  const gainersPercent = (summary.gainers / total) * 100;
  const losersPercent = (summary.losers / total) * 100;

  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-bold text-white">Market Sentiment</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-neutral-400">Gainers</span>
          </div>
          <span className="text-lg font-bold text-green-500">{summary.gainers}</span>
        </div>
        <div className="w-full bg-neutral-800 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${gainersPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span className="text-sm text-neutral-400">Losers</span>
          </div>
          <span className="text-lg font-bold text-red-500">{summary.losers}</span>
        </div>
        <div className="w-full bg-neutral-800 rounded-full h-2">
          <div
            className="bg-red-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${losersPercent}%` }}
          />
        </div>

        <div className="pt-4 border-t border-neutral-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-400">Market Mood</span>
            <span className={`text-sm font-bold ${gainersPercent > losersPercent ? 'text-green-500' : 'text-red-500'}`}>
              {gainersPercent > losersPercent ? 'Bullish' : 'Bearish'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
