import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const COMMODITIES = [
  { symbol: 'BTC-USD', name: 'Bitcoin', category: 'crypto', unit: 'USD' },
  { symbol: 'ETH-USD', name: 'Ethereum', category: 'crypto', unit: 'USD' },
  { symbol: 'BNB-USD', name: 'Binance Coin', category: 'crypto', unit: 'USD' },
  { symbol: 'SOL-USD', name: 'Solana', category: 'crypto', unit: 'USD' },
  { symbol: 'XRP-USD', name: 'Ripple', category: 'crypto', unit: 'USD' },
  { symbol: 'ADA-USD', name: 'Cardano', category: 'crypto', unit: 'USD' },
  { symbol: 'DOGE-USD', name: 'Dogecoin', category: 'crypto', unit: 'USD' },
  { symbol: 'GC=F', name: 'Gold', category: 'metal', unit: 'oz' },
  { symbol: 'SI=F', name: 'Silver', category: 'metal', unit: 'oz' },
  { symbol: 'PL=F', name: 'Platinum', category: 'metal', unit: 'oz' },
  { symbol: 'HG=F', name: 'Copper', category: 'metal', unit: 'lb' },
  { symbol: 'PA=F', name: 'Palladium', category: 'metal', unit: 'oz' },
  { symbol: 'CL=F', name: 'Crude Oil WTI', category: 'energy', unit: 'barrel' },
  { symbol: 'BZ=F', name: 'Brent Crude Oil', category: 'energy', unit: 'barrel' },
  { symbol: 'NG=F', name: 'Natural Gas', category: 'energy', unit: 'MMBtu' },
  { symbol: 'RB=F', name: 'Gasoline', category: 'energy', unit: 'gallon' },
  { symbol: 'HO=F', name: 'Heating Oil', category: 'energy', unit: 'gallon' },
  { symbol: 'ZC=F', name: 'Corn', category: 'agriculture', unit: 'bushel' },
  { symbol: 'ZW=F', name: 'Wheat', category: 'agriculture', unit: 'bushel' },
  { symbol: 'ZS=F', name: 'Soybeans', category: 'agriculture', unit: 'bushel' },
  { symbol: 'KC=F', name: 'Coffee', category: 'agriculture', unit: 'lb' },
  { symbol: 'SB=F', name: 'Sugar', category: 'agriculture', unit: 'lb' },
  { symbol: 'CC=F', name: 'Cocoa', category: 'agriculture', unit: 'ton' },
  { symbol: 'CT=F', name: 'Cotton', category: 'agriculture', unit: 'lb' },
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
      marketCap: meta.marketCap || null,
    };
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return null;
  }
}

async function fetchCommodityData() {
  const commodities = [];

  for (const commodity of COMMODITIES) {
    const data = await fetchYahooFinanceData(commodity.symbol);
    if (data && data.price > 0) {
      commodities.push({
        symbol: commodity.symbol,
        name: commodity.name,
        category: commodity.category,
        price: data.price,
        change: data.change,
        change_percent: data.changePercent,
        currency: 'USD',
        unit: commodity.unit,
        volume: data.volume,
        market_cap: data.marketCap,
      });
    }
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return commodities;
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

    console.log('Fetching commodity data...');
    const commodities = await fetchCommodityData();

    console.log(`Fetched ${commodities.length} commodities`);

    for (const commodity of commodities) {
      const { error } = await supabase
        .from('commodities')
        .upsert({
          symbol: commodity.symbol,
          name: commodity.name,
          category: commodity.category,
          price: commodity.price,
          change: commodity.change,
          change_percent: commodity.change_percent,
          currency: commodity.currency,
          unit: commodity.unit,
          volume: commodity.volume,
          market_cap: commodity.market_cap,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'symbol'
        });

      if (error) {
        console.error('Error upserting commodity:', error);
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Commodity data updated successfully',
        commodities: commodities.length,
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
