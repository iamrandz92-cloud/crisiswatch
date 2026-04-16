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
  imageUrl?: string;
  videoUrl?: string;
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

          const finalImageUrl = item.imageUrl || getFallbackImage(item.title, item.description || '');

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
                image_url: finalImageUrl,
                video_url: item.videoUrl,
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

    // Extract media (multiple formats used by different feeds)
    let imageUrl = extractTag(itemXml, 'media:content');
    if (imageUrl) {
      const urlMatch = imageUrl.match(/url=["']([^"']+)["']/);
      imageUrl = urlMatch ? urlMatch[1] : '';
    }
    if (!imageUrl) {
      imageUrl = extractTag(itemXml, 'media:thumbnail');
      if (imageUrl) {
        const urlMatch = imageUrl.match(/url=["']([^"']+)["']/);
        imageUrl = urlMatch ? urlMatch[1] : '';
      }
    }
    if (!imageUrl) {
      const enclosure = extractTag(itemXml, 'enclosure');
      if (enclosure && enclosure.includes('image')) {
        const urlMatch = enclosure.match(/url=["']([^"']+)["']/);
        imageUrl = urlMatch ? urlMatch[1] : '';
      }
    }
    // Extract from content/description as fallback
    if (!imageUrl && (content || description)) {
      const imgMatch = (content || description || '').match(/<img[^>]+src=["']([^"']+)["']/);
      imageUrl = imgMatch ? imgMatch[1] : '';
    }

    const videoUrl = extractTag(itemXml, 'media:player') || extractTag(itemXml, 'media:group');

    if (title && link && pubDate) {
      items.push({
        title: cleanText(title),
        link: cleanText(link),
        pubDate: pubDate,
        description: description ? cleanText(description) : undefined,
        content: content ? cleanText(content) : undefined,
        imageUrl: imageUrl || undefined,
        videoUrl: videoUrl || undefined,
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

function getFallbackImage(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();

  const militaryImages = [
    'https://images.pexels.com/photos/3586966/pexels-photo-3586966.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1047223/pexels-photo-1047223.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1274260/pexels-photo-1274260.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ];

  const diplomaticImages = [
    'https://images.pexels.com/photos/8761562/pexels-photo-8761562.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/7821677/pexels-photo-7821677.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ];

  const civilianImages = [
    'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/7551975/pexels-photo-7551975.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ];

  const generalImages = [
    'https://images.pexels.com/photos/2159/flight-sky-earth-space.jpg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/2346594/pexels-photo-2346594.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ];

  if (
    text.includes('strike') ||
    text.includes('attack') ||
    text.includes('military') ||
    text.includes('missile') ||
    text.includes('bomb') ||
    text.includes('tank') ||
    text.includes('soldier') ||
    text.includes('army')
  ) {
    return militaryImages[Math.floor(Math.random() * militaryImages.length)];
  }

  if (
    text.includes('diplomat') ||
    text.includes('negotiat') ||
    text.includes('talk') ||
    text.includes('meeting') ||
    text.includes('agreement') ||
    text.includes('peace')
  ) {
    return diplomaticImages[Math.floor(Math.random() * diplomaticImages.length)];
  }

  if (
    text.includes('civilian') ||
    text.includes('humanitarian') ||
    text.includes('casualt') ||
    text.includes('evacuat') ||
    text.includes('refuge')
  ) {
    return civilianImages[Math.floor(Math.random() * civilianImages.length)];
  }

  return generalImages[Math.floor(Math.random() * generalImages.length)];
}
