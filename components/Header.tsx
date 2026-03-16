'use client';

import Link from 'next/link';
import { Radio } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '@/hooks/use-translation';

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: '#0f1217', borderColor: '#1e293b' }}>
      <div className="max-w-[1400px] mx-auto px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative">
            <Radio className="w-8 h-8 text-red-500" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              CRISISWATCH
            </h1>
            <p className="text-xs" style={{ color: '#6b7a8f' }}>
              {t('subtitle')}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4">
            <a href="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
              {t('home')}
            </a>
            <a href="/markets" className="text-sm text-neutral-400 hover:text-white transition-colors">
              {t('markets')}
            </a>
            <a href="/map" className="text-sm text-neutral-400 hover:text-white transition-colors">
              {t('map')}
            </a>
            <a href="/timeline" className="text-sm text-neutral-400 hover:text-white transition-colors">
              {t('timeline')}
            </a>
          </nav>
          <LanguageSelector />
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border" style={{ background: '#1e293b', borderColor: '#ff4d4d' }}>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-sm text-white">{t('liveUpdates')}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
