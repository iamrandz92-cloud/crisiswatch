'use client';

import { useState, useEffect } from 'react';
import { UI_TRANSLATIONS, TranslationKey, LanguageCode } from '@/lib/ui-translations';

export function useTranslation() {
  const [language, setLanguage] = useState<LanguageCode>('en');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('preferredLanguage') as LanguageCode;
    if (storedLanguage && UI_TRANSLATIONS[storedLanguage]) {
      setLanguage(storedLanguage);
    }

    const handleLanguageChange = (event: CustomEvent) => {
      const newLanguage = event.detail as LanguageCode;
      if (UI_TRANSLATIONS[newLanguage]) {
        setLanguage(newLanguage);
      }
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);

    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const t = (key: TranslationKey): string => {
    return UI_TRANSLATIONS[language]?.[key] || UI_TRANSLATIONS.en[key] || key;
  };

  return { t, language };
}
