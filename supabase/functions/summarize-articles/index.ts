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
      events_created: 0,
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

          // Extract and create escalation event if article contains military activity
          const event = extractEscalationEvent(article);
          if (event) {
            const { error: eventError } = await supabase
              .from('escalation_events')
              .insert({
                event_type: event.type,
                severity: event.severity,
                location: event.location,
                description: event.description,
                verified: verificationStatus === 'confirmed',
                article_id: article.id,
                latitude: event.latitude,
                longitude: event.longitude,
              });

            if (!eventError) {
              results.events_created++;
            }
          }
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

interface EscalationEvent {
  type: string;
  severity: number;
  location: string;
  description: string;
  latitude: string;
  longitude: string;
}

function extractEscalationEvent(article: any): EscalationEvent | null {
  const text = `${article.title} ${article.original_content || ''}`.toLowerCase();

  // Location mapping for Middle East conflicts
  const locations = [
    { keywords: ['gaza', 'gaza strip', 'gaza city'], name: 'Gaza Strip', lat: '31.5017', lng: '34.4668' },
    { keywords: ['khan yunis', 'khan younis'], name: 'Khan Yunis, Gaza', lat: '31.3460', lng: '34.3027' },
    { keywords: ['rafah'], name: 'Rafah, Gaza', lat: '31.2886', lng: '34.2453' },
    { keywords: ['tel aviv'], name: 'Tel Aviv, Israel', lat: '32.0853', lng: '34.7818' },
    { keywords: ['jerusalem'], name: 'Jerusalem', lat: '31.7683', lng: '35.2137' },
    { keywords: ['beirut', 'lebanon'], name: 'Beirut, Lebanon', lat: '33.8886', lng: '35.4955' },
    { keywords: ['damascus', 'syria'], name: 'Damascus, Syria', lat: '33.5138', lng: '36.2765' },
    { keywords: ['tehran', 'iran'], name: 'Tehran, Iran', lat: '35.6892', lng: '51.3890' },
    { keywords: ['baghdad', 'iraq'], name: 'Baghdad, Iraq', lat: '33.3152', lng: '44.3661' },
    { keywords: ['red sea', 'yemen', 'houthi'], name: 'Red Sea Region', lat: '15.5527', lng: '48.5164' },
    { keywords: ['golan heights'], name: 'Golan Heights', lat: '33.0000', lng: '35.7667' },
    { keywords: ['west bank'], name: 'West Bank', lat: '31.9522', lng: '35.2332' },
  ];

  // Event type detection
  const eventTypes = [
    { keywords: ['airstrike', 'air strike', 'aerial attack', 'bombing'], type: 'airstrike', baseSeverity: 8 },
    { keywords: ['missile', 'rocket', 'ballistic'], type: 'missile_launch', baseSeverity: 8 },
    { keywords: ['drone strike', 'drone attack', 'uav'], type: 'drone_strike', baseSeverity: 7 },
    { keywords: ['ground operation', 'troops', 'ground forces', 'invasion'], type: 'ground_operation', baseSeverity: 7 },
    { keywords: ['naval', 'warship', 'carrier'], type: 'naval_activity', baseSeverity: 6 },
    { keywords: ['ceasefire', 'peace talk', 'negotiation', 'diplomatic'], type: 'diplomatic', baseSeverity: 3 },
  ];

  // Find location
  let location = null;
  for (const loc of locations) {
    if (loc.keywords.some(k => text.includes(k))) {
      location = loc;
      break;
    }
  }

  // Find event type
  let eventType = null;
  for (const et of eventTypes) {
    if (et.keywords.some(k => text.includes(k))) {
      eventType = et;
      break;
    }
  }

  if (!location || !eventType) {
    return null;
  }

  // Calculate severity based on keywords
  let severity = eventType.baseSeverity;
  if (text.includes('casualties') || text.includes('killed') || text.includes('dead')) {
    severity = Math.min(10, severity + 1);
  }
  if (text.includes('major') || text.includes('massive') || text.includes('heavy')) {
    severity = Math.min(10, severity + 1);
  }

  // Create description from article summary
  const description = article.ai_summary || article.title.substring(0, 200);

  return {
    type: eventType.type,
    severity,
    location: location.name,
    description,
    latitude: location.lat,
    longitude: location.lng,
  };
}
