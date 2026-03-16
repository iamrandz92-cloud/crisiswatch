import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Article {
  id: string;
  severity?: string;
  created_at: string;
  categories?: { name: string } | null;
}

function calculateThreatScore(articles: Article[]): number {
  if (!articles || articles.length === 0) return 15;

  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recent24h = articles.filter(a => new Date(a.created_at) > last24Hours);
  const recent7d = articles.filter(a => new Date(a.created_at) > last7Days);

  const severityWeights: Record<string, number> = {
    critical: 10,
    high: 5,
    medium: 2,
    low: 0.5,
  };

  const categoryWeights: Record<string, number> = {
    "Military Action": 8,
    "Diplomacy": -3,
    "Intelligence": 5,
    "Economic": 2,
    "Humanitarian": 1,
  };

  // Base score starts at 20 for normal conditions
  let score = 20;

  // Heavily weight last 24 hours
  recent24h.forEach(article => {
    const severityScore = severityWeights[article.severity?.toLowerCase() || 'low'] || 0.5;
    const categoryName = article.categories && typeof article.categories === 'object' ? article.categories.name : '';
    const categoryScore = categoryWeights[categoryName || ''] || 0;
    score += severityScore + categoryScore * 0.3;
  });

  // Lightly weight last 7 days for trend analysis
  recent7d.forEach(article => {
    const severityScore = severityWeights[article.severity?.toLowerCase() || 'low'] || 0.5;
    score += severityScore * 0.15;
  });

  // Volume factor - more articles = higher concern
  const volumeMultiplier = 1 + (recent24h.length / 50) * 0.1;
  score *= volumeMultiplier;

  score = Math.max(0, Math.min(100, score));

  return Math.round(score);
}

function getEscalationLevel(score: number): string {
  if (score >= 75) return 'regional_war';
  if (score >= 50) return 'major_strikes';
  if (score >= 30) return 'military_activity';
  return 'low';
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: articles, error: articlesError } = await supabase
      .from("articles")
      .select(`
        id,
        severity,
        created_at,
        categories (name)
      `)
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(200);

    if (articlesError) {
      throw articlesError;
    }

    const threatScore = calculateThreatScore(articles || []);
    const level = getEscalationLevel(threatScore);

    const { error: updateError } = await supabase
      .from("escalation_levels")
      .upsert({
        region: "Global",
        level: level,
        level_score: threatScore,
        last_updated: new Date().toISOString(),
      }, {
        onConflict: 'region'
      });

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        threatScore,
        level,
        articlesAnalyzed: articles?.length || 0,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error calculating threat level:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
