'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { MarketIndexCard } from '@/components/MarketIndexCard';
import { StockCard } from '@/components/StockCard';
import { MarketTrendChart } from '@/components/MarketTrendChart';
import { SectorPerformance } from '@/components/SectorPerformance';
import { MarketSummaryStats } from '@/components/MarketSummaryStats';
import { CommodityCard } from '@/components/CommodityCard';
import { CommoditySearch } from '@/components/CommoditySearch';
import { supabase } from '@/lib/supabase';
import { TrendingUp, TrendingDown, RefreshCw, DollarSign, ChartBar as BarChart3, Layers, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  change_percent: number;
  updated_at: string;
}

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  sector?: string;
  updated_at: string;
}

interface Commodity {
  symbol: string;
  name: string;
  category: string;
  price: number;
  change: number;
  change_percent: number;
  currency: string;
  unit?: string;
  volume: number;
  market_cap?: number;
  updated_at: string;
}

export default function MarketsPage() {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [filteredCommodities, setFilteredCommodities] = useState<Commodity[]>([]);
  const [commoditySearchQuery, setCommoditySearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const [indicesResponse, stocksResponse, commoditiesResponse] = await Promise.all([
        supabase.from('market_indices').select('*').order('symbol'),
        supabase.from('stocks').select('*').order('symbol'),
        supabase.from('commodities').select('*').order('name'),
      ]);

      if (indicesResponse.data) setIndices(indicesResponse.data);
      if (stocksResponse.data) setStocks(stocksResponse.data);
      if (commoditiesResponse.data) {
        setCommodities(commoditiesResponse.data);
        setFilteredCommodities(commoditiesResponse.data);
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshMarketData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/fetch-market-data`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
          }
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/fetch-commodities`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
          }
        ),
      ]);

      await fetchMarketData();
    } catch (error) {
      console.error('Error refreshing market data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCommoditySearch = (query: string) => {
    setCommoditySearchQuery(query);
    filterCommodities(query, selectedCategory);
  };

  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
    filterCommodities(commoditySearchQuery, category);
  };

  const filterCommodities = (query: string, category: string | null) => {
    let filtered = commodities;

    if (category) {
      filtered = filtered.filter((c) => c.category === category);
    }

    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(lowerQuery) ||
          c.symbol.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredCommodities(filtered);
  };

  const gainers = stocks.filter(s => s.change > 0).sort((a, b) => b.change_percent - a.change_percent).slice(0, 8);
  const losers = stocks.filter(s => s.change < 0).sort((a, b) => a.change_percent - b.change_percent).slice(0, 8);
  const mostActive = [...stocks].sort((a, b) => b.volume - a.volume).slice(0, 8);

  const marketSummary = {
    gainers: stocks.filter(s => s.change > 0).length,
    losers: stocks.filter(s => s.change < 0).length,
    unchanged: stocks.filter(s => s.change === 0).length,
  };

  const sectorPerformance = stocks.reduce((acc, stock) => {
    if (!stock.sector) return acc;
    if (!acc[stock.sector]) {
      acc[stock.sector] = { total: 0, count: 0 };
    }
    acc[stock.sector].total += stock.change_percent;
    acc[stock.sector].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const sectors = Object.entries(sectorPerformance).map(([name, data]) => ({
    name,
    avgChange: data.total / data.count,
    stockCount: data.count,
  }));

  const totalVolume = stocks.reduce((sum, stock) => sum + stock.volume, 0);
  const avgChange = stocks.length > 0
    ? stocks.reduce((sum, stock) => sum + stock.change_percent, 0) / stocks.length
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-neutral-400">Loading market data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <Header />

      <main className="max-w-[1400px] mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Financial Markets</h1>
            <p className="text-neutral-400">Live market data and stock performance</p>
          </div>
          <Button
            onClick={refreshMarketData}
            disabled={refreshing}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <MarketSummaryStats
          totalVolume={totalVolume}
          gainers={marketSummary.gainers}
          losers={marketSummary.losers}
          avgChange={avgChange}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Major Indices
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {indices.map((index) => (
                <MarketIndexCard
                  key={index.symbol}
                  symbol={index.symbol}
                  name={index.name}
                  value={index.value}
                  change={index.change}
                  changePercent={index.change_percent}
                />
              ))}
            </div>
          </div>

          <div>
            <MarketTrendChart summary={marketSummary} />
          </div>
        </div>

        {sectors.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-500" />
              Sector Analysis
            </h2>
            <SectorPerformance sectors={sectors} />
          </div>
        )}

        <Tabs defaultValue="commodities" className="w-full">
          <TabsList className="bg-neutral-900 border border-neutral-800">
            <TabsTrigger value="commodities" className="data-[state=active]:bg-orange-600/20 data-[state=active]:text-orange-500">
              <Coins className="w-4 h-4 mr-2" />
              Commodities
            </TabsTrigger>
            <TabsTrigger value="gainers" className="data-[state=active]:bg-green-600/20 data-[state=active]:text-green-500">
              <TrendingUp className="w-4 h-4 mr-2" />
              Top Gainers
            </TabsTrigger>
            <TabsTrigger value="losers" className="data-[state=active]:bg-red-600/20 data-[state=active]:text-red-500">
              <TrendingDown className="w-4 h-4 mr-2" />
              Top Losers
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-500">
              <DollarSign className="w-4 h-4 mr-2" />
              Most Active
            </TabsTrigger>
          </TabsList>

          <TabsContent value="commodities" className="mt-6">
            <CommoditySearch
              onSearch={handleCommoditySearch}
              onCategoryFilter={handleCategoryFilter}
              selectedCategory={selectedCategory}
            />
            <div className="mt-6">
              {filteredCommodities.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-400">No commodities found matching your search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredCommodities.map((commodity) => (
                    <CommodityCard
                      key={commodity.symbol}
                      symbol={commodity.symbol}
                      name={commodity.name}
                      category={commodity.category}
                      price={commodity.price}
                      change={commodity.change}
                      changePercent={commodity.change_percent}
                      unit={commodity.unit}
                      volume={commodity.volume}
                      marketCap={commodity.market_cap}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="gainers" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {gainers.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  symbol={stock.symbol}
                  name={stock.name}
                  price={stock.price}
                  change={stock.change}
                  changePercent={stock.change_percent}
                  volume={stock.volume}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="losers" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {losers.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  symbol={stock.symbol}
                  name={stock.name}
                  price={stock.price}
                  change={stock.change}
                  changePercent={stock.change_percent}
                  volume={stock.volume}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mostActive.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  symbol={stock.symbol}
                  name={stock.name}
                  price={stock.price}
                  change={stock.change}
                  changePercent={stock.change_percent}
                  volume={stock.volume}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 bg-neutral-900/50 border border-neutral-800 rounded-lg p-4">
          <p className="text-xs text-neutral-500 text-center">
            Market data is delayed by 15-20 minutes. Updates every minute. Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </main>
    </div>
  );
}
