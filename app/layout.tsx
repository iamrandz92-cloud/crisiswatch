import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Conflict Watch - Iran-US-Israel Live Updates',
  description: 'Real-time news aggregation and intelligence dashboard for the Iran-US-Israel conflict. Live updates, verified sources, and comprehensive analysis.',
  verification: {
    google: 'ca-pub-5040534732303778',
  },
  openGraph: {
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
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
        {children}
      </body>
    </html>
  );
}
