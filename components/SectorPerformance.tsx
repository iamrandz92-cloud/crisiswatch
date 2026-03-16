'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface SectorData {
  name: string;
  avgChange: number;
  stockCount: number;
}

interface SectorPerformanceProps {
  sectors: SectorData[];
}

export function SectorPerformance({ sectors }: SectorPerformanceProps) {
  const sortedSectors = [...sectors].sort((a, b) => b.avgChange - a.avgChange);

  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Sector Performance</h3>
      <div className="space-y-3">
        {sortedSectors.map((sector) => {
          const isPositive = sector.avgChange >= 0;
          return (
            <div key={sector.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 flex-shrink-0" />
                )}
                <span className="text-sm text-neutral-300">{sector.name}</span>
                <span className="text-xs text-neutral-500">({sector.stockCount})</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-neutral-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isPositive ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.min(Math.abs(sector.avgChange) * 20, 100)}%`,
                    }}
                  />
                </div>
                <span
                  className={`text-sm font-semibold w-16 text-right ${
                    isPositive ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {sector.avgChange.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
