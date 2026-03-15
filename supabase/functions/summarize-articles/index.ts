import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('*')
      .is('ai_summary', null)
      .not('original_content', 'is', null)
      .limit(10);

    if (articlesError) throw articlesError;

    const results = {
      processed: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const article of articles || []) {
      try {
        const summary = await generateSummary(article.title, article.original_content);
        const verificationStatus = determineVerificationStatus(article.title, article.original_content);

        const { error: updateError } = await supabase
          .from('articles')
          .update({
            ai_summary: summary,
            verification_status: verificationStatus,
          })
          .eq('id', article.id);

        if (updateError) {
          results.errors.push(`Failed to update article ${article.id}: ${updateError.message}`);
          results.failed++;
        } else {
          results.processed++;
        }
      } catch (error) {
        results.errors.push(`Error processing article ${article.id}: ${error.message}`);
        results.failed++;
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Article summarization completed',
        results,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

async function generateSummary(title: string, content: string): Promise<string> {
  const text = `${title}. ${content}`;

  const sentences = text
    .replace(/([.!?])\s+/g, '$1|')
    .split('|')
    .filter(s => s.trim().length > 20);

  const relevantSentences = sentences
    .filter(s => {
      const lower = s.toLowerCase();
      return (
        lower.includes('iran') ||
        lower.includes('israel') ||
        lower.includes('us ') ||
        lower.includes('united states') ||
        lower.includes('middle east') ||
        lower.includes('strike') ||
        lower.includes('attack') ||
        lower.includes('military') ||
        lower.includes('diplomat')
      );
    });

  const summaryText = relevantSentences.length > 0
    ? relevantSentences.slice(0, 2).join(' ')
    : sentences.slice(0, 2).join(' ');

  const summary = summaryText.length > 300
    ? summaryText.substring(0, 297) + '...'
    : summaryText;

  return summary || title;
}

function determineVerificationStatus(title: string, content: string): string {
  const text = `${title} ${content}`.toLowerCase();

  const confirmedKeywords = [
    'confirmed',
    'verified',
    'official',
    'announced',
    'statement',
    'multiple sources',
  ];

  const developingKeywords = [
    'developing',
    'breaking',
    'reports',
    'reportedly',
    'ongoing',
    'unfolding',
  ];

  const confirmedCount = confirmedKeywords.filter(k => text.includes(k)).length;
  const developingCount = developingKeywords.filter(k => text.includes(k)).length;

  if (confirmedCount >= 2) {
    return 'confirmed';
  } else if (developingCount >= 1) {
    return 'developing';
  } else {
    return 'unverified';
  }
}
