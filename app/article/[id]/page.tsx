import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { ArticleDetailView } from '@/components/ArticleDetailView';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function getArticle(id: string) {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: article, error } = await supabase
    .from('articles')
    .select(`
      *,
      source:sources(*),
      category:categories(*)
    `)
    .eq('id', id)
    .eq('approved', true)
    .maybeSingle();

  if (error || !article) {
    return null;
  }

  return article;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const article = await getArticle(params.id);

  if (!article) {
    return {
      title: 'Article Not Found - CrisisWatch',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://crisiswatch.net';
  const articleUrl = `${baseUrl}/article/${article.id}`;

  return {
    title: `${article.title} - CrisisWatch`,
    description: article.ai_summary || article.title,
    openGraph: {
      title: article.title,
      description: article.ai_summary || article.title,
      url: articleUrl,
      siteName: 'CrisisWatch',
      images: article.image_url ? [
        {
          url: article.image_url,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ] : [],
      locale: 'en_US',
      type: 'article',
      publishedTime: article.published_at,
      authors: article.source?.name ? [article.source.name] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.ai_summary || article.title,
      images: article.image_url ? [article.image_url] : [],
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id);

  if (!article) {
    notFound();
  }

  return <ArticleDetailView article={article} />;
}
