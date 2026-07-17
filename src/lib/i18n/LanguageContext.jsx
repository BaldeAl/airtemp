import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from './en.json';
import fr from './fr.json';

const dictionaries = { en, fr };

const FRANCOPHONE_COUNTRIES = [
  'FR', 'BE', 'CH', 'CA', 'LU', 'MC', 'SN', 'CI', 'ML', 'BF',
  'NE', 'TD', 'CM', 'CG', 'CD', 'GA', 'GN', 'MG', 'TG', 'BJ',
  'RW', 'BI', 'DJ', 'KM', 'HT', 'MU', 'SC',
];

const LanguageContext = createContext();

/**
 * Resolve a dotted key like "navbar.login" from a dictionary object.
 */
function getNestedValue(obj, key) {
  return key.split('.').reduce((acc, part) => acc?.[part], obj);
}

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState('en');
  const [isReady, setIsReady] = useState(false);

  // Detect language on mount
  useEffect(() => {
    // 1. Check persisted user preference
    const stored = localStorage.getItem('locale');
    if (stored && dictionaries[stored]) {
      setLocaleState(stored);
      setIsReady(true);
      return;
    }

    // 2. Try IP-based geolocation
    const detectFromIP = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
        if (res.ok) {
          const data = await res.json();
          const country = data.country_code || data.country;
          if (country && FRANCOPHONE_COUNTRIES.includes(country.toUpperCase())) {
            setLocaleState('fr');
            setIsReady(true);
            return;
          }
        }
      } catch {
        // Geolocation failed, fall through
      }

      // 3. Fallback to browser language
      const browserLang = navigator.language || navigator.userLanguage || 'en';
      if (browserLang.toLowerCase().startsWith('fr')) {
        setLocaleState('fr');
      } else {
        setLocaleState('en');
      }
      setIsReady(true);
    };

    detectFromIP();
  }, []);

  const setLocale = useCallback((lang) => {
    if (dictionaries[lang]) {
      setLocaleState(lang);
      localStorage.setItem('locale', lang);
    }
  }, []);

  const t = useCallback((key, params) => {
    const dict = dictionaries[locale] || dictionaries.en;
    let value = getNestedValue(dict, key);

    // Fallback to English if key not found in current locale
    if (value === undefined) {
      value = getNestedValue(dictionaries.en, key);
    }

    // Still not found — return the key itself as fallback
    if (value === undefined) {
      return key;
    }

    // Interpolate params like {name}, {count}, etc.
    if (params && typeof value === 'string') {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        value = value.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), paramValue);
      });
    }

    return value;
  }, [locale]);

  // Date locale helper
  const dateLocale = locale === 'fr' ? 'fr-FR' : 'en-US';

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dateLocale, isReady }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
