import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CrisisWatch - Global Conflict Intelligence & Live Updates',
  description: 'Real-time news aggregation and intelligence dashboard for global conflicts. Live updates, verified sources, and comprehensive analysis.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://crisiswatch.net'),
  verification: {
    google: '9BuAowy9kIJom1iUTCSOTlMEl2wZAzX8TBcBUln2JEw',
  },
  openGraph: {
    title: 'CrisisWatch - Global Conflict Intelligence & Live Updates',
    description: 'Real-time news aggregation and intelligence dashboard for global conflicts. Live updates, verified sources, and comprehensive analysis.',
    url: '/',
    siteName: 'CrisisWatch',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CrisisWatch - Global Conflict Intelligence & Live Updates',
    description: 'Real-time news aggregation and intelligence dashboard for global conflicts.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5040534732303778" crossOrigin="anonymous"></script>
      </head>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
