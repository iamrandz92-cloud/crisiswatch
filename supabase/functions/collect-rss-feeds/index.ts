import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  description?: string;
  content?: string;
}

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

    const { data: sources, error: sourcesError } = await supabase
      .from('sources')
      .select('*')
      .eq('active', true)
      .not('rss_feed_url', 'is', null);

    if (sourcesError) throw sourcesError;

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const source of sources || []) {
      try {
        if (!source.rss_feed_url) continue;

        const response = await fetch(source.rss_feed_url, {
          headers: {
            'User-Agent': 'ConflictWatch News Aggregator/1.0',
          },
          signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
          results.errors.push(`Failed to fetch ${source.name}: ${response.status}`);
          results.failed++;
          continue;
        }

        const xmlText = await response.text();
        const items = parseRSS(xmlText);

        const categoryMap = await getCategories(supabase);

        for (const item of items.slice(0, 10)) {
          const categoryId = await categorizeArticle(item.title, item.description || '', categoryMap);

          const { error: insertError } = await supabase
            .from('articles')
            .upsert(
              {
                source_id: source.id,
                category_id: categoryId,
                title: item.title,
                original_content: item.description || item.content,
                source_url: item.link,
                published_at: new Date(item.pubDate).toISOString(),
                approved: true,
                is_breaking: false,
                verification_status: 'unverified',
              },
              {
                onConflict: 'source_url',
                ignoreDuplicates: true,
              }
            );

          if (!insertError) {
            results.success++;
          }
        }

        await supabase
          .from('sources')
          .update({ last_fetched_at: new Date().toISOString() })
          .eq('id', source.id);

      } catch (error) {
        results.errors.push(`Error processing ${source.name}: ${error.message}`);
        results.failed++;
      }
    }

    return new Response(
      JSON.stringify({
        message: 'RSS feed collection completed',
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

function parseRSS(xmlText: string): RSSItem[] {
  const items: RSSItem[] = [];

  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const matches = xmlText.matchAll(itemRegex);

  for (const match of matches) {
    const itemXml = match[1];

    const title = extractTag(itemXml, 'title');
    const link = extractTag(itemXml, 'link');
    const pubDate = extractTag(itemXml, 'pubDate');
    const description = extractTag(itemXml, 'description');
    const content = extractTag(itemXml, 'content:encoded');

    if (title && link && pubDate) {
      items.push({
        title: cleanText(title),
        link: cleanText(link),
        pubDate: pubDate,
        description: description ? cleanText(description) : undefined,
        content: content ? cleanText(content) : undefined,
      });
    }
  }

  return items;
}

function extractTag(xml: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1] : '';
}

function cleanText(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

async function getCategories(supabase: any): Promise<Map<string, string>> {
  const { data } = await supabase.from('categories').select('*');
  const categoryMap = new Map<string, string>();

  if (data) {
    for (const cat of data) {
      categoryMap.set(cat.slug, cat.id);
    }
  }

  return categoryMap;
}

async function categorizeArticle(
  title: string,
  description: string,
  categoryMap: Map<string, string>
): Promise<string> {
  const text = `${title} ${description}`.toLowerCase();

  if (
    text.includes('strike') ||
    text.includes('attack') ||
    text.includes('military') ||
    text.includes('missile') ||
    text.includes('bomb')
  ) {
    return categoryMap.get('military-activity') || categoryMap.values().next().value;
  }

  if (
    text.includes('diplomat') ||
    text.includes('negotiat') ||
    text.includes('talk') ||
    text.includes('meeting') ||
    text.includes('agreement')
  ) {
    return categoryMap.get('diplomatic-updates') || categoryMap.values().next().value;
  }

  if (
    text.includes('civilian') ||
    text.includes('humanitarian') ||
    text.includes('casualt') ||
    text.includes('evacuat') ||
    text.includes('refuge')
  ) {
    return categoryMap.get('civilian-safety') || categoryMap.values().next().value;
  }

  return categoryMap.get('breaking-news') || categoryMap.values().next().value;
}
