import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TranslationRequest {
  articleId: string;
  targetLanguage: string;
}

const SUPPORTED_LANGUAGES = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ar': 'Arabic',
  'zh': 'Chinese',
  'ja': 'Japanese',
  'ko': 'Korean',
  'hi': 'Hindi',
  'bn': 'Bengali',
  'ur': 'Urdu',
  'tr': 'Turkish',
  'fa': 'Persian',
  'he': 'Hebrew',
  'nl': 'Dutch',
  'pl': 'Polish',
  'sv': 'Swedish',
  'uk': 'Ukrainian',
  'vi': 'Vietnamese',
  'th': 'Thai',
  'id': 'Indonesian',
  'ms': 'Malay',
};

async function translateWithAI(text: string, targetLanguage: string): Promise<string> {
  const languageName = SUPPORTED_LANGUAGES[targetLanguage as keyof typeof SUPPORTED_LANGUAGES] || targetLanguage;

  const prompt = `Translate the following text to ${languageName}. Preserve all formatting, links, and structure. Only provide the translation, no explanations:\n\n${text}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
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

    const { articleId, targetLanguage }: TranslationRequest = await req.json();

    if (!articleId || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: 'Missing articleId or targetLanguage' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!SUPPORTED_LANGUAGES[targetLanguage as keyof typeof SUPPORTED_LANGUAGES]) {
      return new Response(
        JSON.stringify({ error: 'Unsupported language' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: existingTranslation } = await supabase
      .from('translations')
      .select('*')
      .eq('article_id', articleId)
      .eq('language_code', targetLanguage)
      .maybeSingle();

    if (existingTranslation) {
      return new Response(
        JSON.stringify({
          message: 'Translation already exists',
          translation: existingTranslation
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: article, error: articleError } = await supabase
      .from('articles')
      .select('title, content, summary')
      .eq('id', articleId)
      .maybeSingle();

    if (articleError || !article) {
      return new Response(
        JSON.stringify({ error: 'Article not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const [translatedTitle, translatedContent, translatedSummary] = await Promise.all([
      translateWithAI(article.title, targetLanguage),
      translateWithAI(article.content, targetLanguage),
      article.summary ? translateWithAI(article.summary, targetLanguage) : Promise.resolve(null)
    ]);

    const { data: translation, error: insertError } = await supabase
      .from('translations')
      .insert({
        article_id: articleId,
        language_code: targetLanguage,
        title: translatedTitle,
        content: translatedContent,
        summary: translatedSummary,
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return new Response(
      JSON.stringify({
        message: 'Translation created successfully',
        translation
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
