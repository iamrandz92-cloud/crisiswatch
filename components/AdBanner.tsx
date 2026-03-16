'use client';

import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface AdBannerProps {
  position: 'top' | 'sidebar' | 'inline' | 'footer';
  className?: string;
  slot?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function AdBanner({ position, className, slot }: AdBannerProps) {
  const sizeConfig = {
    top: { width: 728, height: 90, style: 'w-full h-24' },
    sidebar: { width: 300, height: 250, style: 'w-full h-64' },
    inline: { width: 728, height: 90, style: 'w-full h-32' },
    footer: { width: 468, height: 60, style: 'w-full h-20' },
  };

  const config = sizeConfig[position];

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  if (!slot) {
    return (
      <div
        className={cn(
          'bg-neutral-900/50 border border-neutral-800 rounded-lg flex items-center justify-center',
          config.style,
          className
        )}
      >
        <div className="text-center text-neutral-600">
          <p className="text-sm font-medium">Advertisement</p>
          <p className="text-xs mt-1">AdSense slot ID required</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center', config.style, className)}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5040534732303778"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
