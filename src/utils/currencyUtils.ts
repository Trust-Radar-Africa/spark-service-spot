// Map of country names/codes to currency codes
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  // North America
  'united states': 'USD',
  'usa': 'USD',
  'us': 'USD',
  'canada': 'CAD',
  
  // Europe
  'united kingdom': 'GBP',
  'uk': 'GBP',
  'england': 'GBP',
  'scotland': 'GBP',
  'wales': 'GBP',
  'germany': 'EUR',
  'france': 'EUR',
  'italy': 'EUR',
  'spain': 'EUR',
  'netherlands': 'EUR',
  'belgium': 'EUR',
  'austria': 'EUR',
  'ireland': 'EUR',
  'portugal': 'EUR',
  'greece': 'EUR',
  'finland': 'EUR',
  'switzerland': 'CHF',
  'sweden': 'SEK',
  'norway': 'NOK',
  'denmark': 'DKK',
  'poland': 'PLN',
  
  // Asia Pacific
  'australia': 'AUD',
  'new zealand': 'NZD',
  'japan': 'JPY',
  'china': 'CNY',
  'hong kong': 'HKD',
  'singapore': 'SGD',
  'india': 'INR',
  'philippines': 'PHP',
  'malaysia': 'MYR',
  'thailand': 'THB',
  'indonesia': 'IDR',
  'south korea': 'KRW',
  'taiwan': 'TWD',
  'vietnam': 'VND',
  
  // Middle East & Africa
  'uae': 'AED',
  'united arab emirates': 'AED',
  'dubai': 'AED',
  'saudi arabia': 'SAR',
  'qatar': 'QAR',
  'south africa': 'ZAR',
  'nigeria': 'NGN',
  'kenya': 'KES',
  'egypt': 'EGP',
  'israel': 'ILS',
  
  // South America
  'brazil': 'BRL',
  'mexico': 'MXN',
  'argentina': 'ARS',
  'chile': 'CLP',
  'colombia': 'COP',
  'peru': 'PEN',
};

// Currency symbols and formatting
const CURRENCY_CONFIG: Record<string, { symbol: string; position: 'before' | 'after'; locale: string }> = {
  USD: { symbol: '$', position: 'before', locale: 'en-US' },
  EUR: { symbol: '€', position: 'before', locale: 'de-DE' },
  GBP: { symbol: '£', position: 'before', locale: 'en-GB' },
  CAD: { symbol: 'C$', position: 'before', locale: 'en-CA' },
  AUD: { symbol: 'A$', position: 'before', locale: 'en-AU' },
  NZD: { symbol: 'NZ$', position: 'before', locale: 'en-NZ' },
  JPY: { symbol: '¥', position: 'before', locale: 'ja-JP' },
  CNY: { symbol: '¥', position: 'before', locale: 'zh-CN' },
  CHF: { symbol: 'CHF', position: 'before', locale: 'de-CH' },
  SGD: { symbol: 'S$', position: 'before', locale: 'en-SG' },
  HKD: { symbol: 'HK$', position: 'before', locale: 'zh-HK' },
  INR: { symbol: '₹', position: 'before', locale: 'en-IN' },
  AED: { symbol: 'AED', position: 'before', locale: 'ar-AE' },
  SAR: { symbol: 'SAR', position: 'before', locale: 'ar-SA' },
  PHP: { symbol: '₱', position: 'before', locale: 'en-PH' },
  MYR: { symbol: 'RM', position: 'before', locale: 'ms-MY' },
  THB: { symbol: '฿', position: 'before', locale: 'th-TH' },
  BRL: { symbol: 'R$', position: 'before', locale: 'pt-BR' },
  MXN: { symbol: 'MX$', position: 'before', locale: 'es-MX' },
  ZAR: { symbol: 'R', position: 'before', locale: 'en-ZA' },
  SEK: { symbol: 'kr', position: 'after', locale: 'sv-SE' },
  NOK: { symbol: 'kr', position: 'after', locale: 'nb-NO' },
  DKK: { symbol: 'kr', position: 'after', locale: 'da-DK' },
  PLN: { symbol: 'zł', position: 'after', locale: 'pl-PL' },
  KRW: { symbol: '₩', position: 'before', locale: 'ko-KR' },
};

/**
 * Get currency code from a location string
 */
export function getCurrencyFromLocation(location: string): string {
  const normalized = location.toLowerCase().trim();
  
  // Check for exact matches first
  if (COUNTRY_TO_CURRENCY[normalized]) {
    return COUNTRY_TO_CURRENCY[normalized];
  }
  
  // Check if location contains any known country
  for (const [country, currency] of Object.entries(COUNTRY_TO_CURRENCY)) {
    if (normalized.includes(country)) {
      return currency;
    }
  }
  
  // Default to USD
  return 'USD';
}

/**
 * Format currency amount based on location
 */
export function formatCurrency(amount: number, location: string): string {
  const currencyCode = getCurrencyFromLocation(location);
  const config = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.USD;
  
  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Fallback formatting
    const formatted = amount.toLocaleString();
    return config.position === 'before' 
      ? `${config.symbol}${formatted}`
      : `${formatted} ${config.symbol}`;
  }
}

/**
 * Format a salary range string based on location
 */
export function formatSalaryRange(salaryRange: string, location: string): string {
  if (!salaryRange) return '';
  
  const currencyCode = getCurrencyFromLocation(location);
  const config = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.USD;
  
  // Try to parse the salary range
  // Common formats: "$50,000 - $70,000", "50000-70000", "$50K - $70K"
  const numbers = salaryRange.match(/[\d,]+/g);
  
  if (!numbers || numbers.length === 0) {
    return salaryRange;
  }
  
  const parsedNumbers = numbers.map(n => parseInt(n.replace(/,/g, '')));
  
  if (parsedNumbers.length === 1) {
    return formatCurrency(parsedNumbers[0], location);
  }
  
  if (parsedNumbers.length >= 2) {
    return `${formatCurrency(parsedNumbers[0], location)} - ${formatCurrency(parsedNumbers[1], location)}`;
  }
  
  return salaryRange;
}

/**
 * Get currency symbol for a location
 */
export function getCurrencySymbol(location: string): string {
  const currencyCode = getCurrencyFromLocation(location);
  const config = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.USD;
  return config.symbol;
}
