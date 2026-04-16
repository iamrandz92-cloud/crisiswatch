import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const MAJOR_INDICES = [
  { symbol: '^GSPC', name: 'S&P 500', displaySymbol: 'SPX' },
  { symbol: '^DJI', name: 'Dow Jones', displaySymbol: 'DJI' },
  { symbol: '^IXIC', name: 'NASDAQ', displaySymbol: 'IXIC' },
  { symbol: '^FTSE', name: 'FTSE 100', displaySymbol: 'FTSE' },
  { symbol: '^N225', name: 'Nikkei 225', displaySymbol: 'N225' },
];

const TRENDING_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical' },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology' },
  { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', sector: 'Financial' },
  { symbol: 'JPM', name: 'JPMorgan Chase', sector: 'Financial' },
  { symbol: 'V', name: 'Visa Inc.', sector: 'Financial' },
  { symbol: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Defensive' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
  { symbol: 'PG', name: 'Procter & Gamble', sector: 'Consumer Defensive' },
  { symbol: 'XOM', name: 'Exxon Mobil', sector: 'Energy' },
  { symbol: 'BAC', name: 'Bank of America', sector: 'Financial' },
  { symbol: 'DIS', name: 'Walt Disney Co.', sector: 'Communication' },
];

async function fetchYahooFinanceData(symbol: string) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      console.error(`Yahoo Finance API error for ${symbol}: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    const quote = data.chart.result[0];
    const meta = quote.meta;

    const currentPrice = meta.regularMarketPrice || meta.chartPreviousClose || 0;
    const previousClose = meta.previousClose || meta.chartPreviousClose || currentPrice;

    const change = currentPrice - previousClose;
    const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;

    return {
      symbol: meta.symbol,
      price: currentPrice,
      previousClose: previousClose,
      change: change,
      changePercent: changePercent,
      volume: meta.regularMarketVolume || 0,
    };
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return null;
  }
}

async function generateMarketData() {
  const indices = [];
  const stocks = [];

  for (const index of MAJOR_INDICES) {
    const data = await fetchYahooFinanceData(index.symbol);
    if (data && data.price > 0) {
      indices.push({
        symbol: index.displaySymbol,
        name: index.name,
        value: data.price,
        change: data.change,
        change_percent: data.changePercent,
      });
    }
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  for (const stockInfo of TRENDING_STOCKS) {
    const data = await fetchYahooFinanceData(stockInfo.symbol);
    if (data && data.price > 0) {
      stocks.push({
        symbol: stockInfo.symbol,
        name: stockInfo.name,
        price: data.price,
        change: data.change,
        change_percent: data.changePercent,
        volume: data.volume,
        sector: stockInfo.sector,
      });
    }
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return { indices, stocks };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const { createClient } = await import('npm:@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching market data...');
    const { indices, stocks } = await generateMarketData();

    console.log(`Fetched ${indices.length} indices and ${stocks.length} stocks`);

    for (const index of indices) {
      const { error } = await supabase
        .from('market_indices')
        .upsert({
          symbol: index.symbol,
          name: index.name,
          value: index.value,
          change: index.change,
          change_percent: index.change_percent,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'symbol'
        });

      if (error) {
        console.error('Error upserting index:', error);
      }
    }

    for (const stock of stocks) {
      const { error } = await supabase
        .from('stocks')
        .upsert({
          symbol: stock.symbol,
          name: stock.name,
          price: stock.price,
          change: stock.change,
          change_percent: stock.change_percent,
          volume: stock.volume,
          sector: stock.sector,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'symbol'
        });

      if (error) {
        console.error('Error upserting stock:', error);
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Market data updated successfully',
        indices: indices.length,
        stocks: stocks.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
