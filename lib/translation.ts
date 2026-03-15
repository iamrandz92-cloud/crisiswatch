import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Translation {
  id: string;
  article_id: string;
  language_code: string;
  title: string;
  content: string;
  summary: string | null;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  source: string;
  url: string;
  published_at: string;
  category: string;
  verification_status: string;
  image_url: string | null;
}

export async function getArticleTranslation(
  articleId: string,
  languageCode: string
): Promise<Translation | null> {
  const { data, error } = await supabase
    .from('translations')
    .select('*')
    .eq('article_id', articleId)
    .eq('language_code', languageCode)
    .maybeSingle();

  if (error) {
    console.error('Error fetching translation:', error);
    return null;
  }

  return data;
}

export async function requestTranslation(
  articleId: string,
  targetLanguage: string
): Promise<Translation | null> {
  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/translate-article`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          articleId,
          targetLanguage,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Translation request failed');
    }

    const result = await response.json();
    return result.translation;
  } catch (error) {
    console.error('Error requesting translation:', error);
    return null;
  }
}

export async function getOrCreateTranslation(
  articleId: string,
  languageCode: string
): Promise<Translation | null> {
  if (languageCode === 'en') {
    return null;
  }

  let translation = await getArticleTranslation(articleId, languageCode);

  if (!translation) {
    translation = await requestTranslation(articleId, languageCode);
  }

  return translation;
}

export function getTranslatedArticle(
  article: Article,
  translation: Translation | null
): Article {
  if (!translation) {
    return article;
  }

  return {
    ...article,
    title: translation.title,
    content: translation.content,
    summary: translation.summary || article.summary,
  };
}
