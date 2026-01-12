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
export const CURRENCY_CONFIG: Record<string, { symbol: string; position: 'before' | 'after'; locale: string; name: string }> = {
  USD: { symbol: '$', position: 'before', locale: 'en-US', name: 'US Dollar' },
  EUR: { symbol: '€', position: 'before', locale: 'de-DE', name: 'Euro' },
  GBP: { symbol: '£', position: 'before', locale: 'en-GB', name: 'British Pound' },
  CAD: { symbol: 'C$', position: 'before', locale: 'en-CA', name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', position: 'before', locale: 'en-AU', name: 'Australian Dollar' },
  NZD: { symbol: 'NZ$', position: 'before', locale: 'en-NZ', name: 'New Zealand Dollar' },
  JPY: { symbol: '¥', position: 'before', locale: 'ja-JP', name: 'Japanese Yen' },
  CNY: { symbol: '¥', position: 'before', locale: 'zh-CN', name: 'Chinese Yuan' },
  CHF: { symbol: 'CHF', position: 'before', locale: 'de-CH', name: 'Swiss Franc' },
  SGD: { symbol: 'S$', position: 'before', locale: 'en-SG', name: 'Singapore Dollar' },
  HKD: { symbol: 'HK$', position: 'before', locale: 'zh-HK', name: 'Hong Kong Dollar' },
  INR: { symbol: '₹', position: 'before', locale: 'en-IN', name: 'Indian Rupee' },
  AED: { symbol: 'AED', position: 'before', locale: 'ar-AE', name: 'UAE Dirham' },
  SAR: { symbol: 'SAR', position: 'before', locale: 'ar-SA', name: 'Saudi Riyal' },
  PHP: { symbol: '₱', position: 'before', locale: 'en-PH', name: 'Philippine Peso' },
  MYR: { symbol: 'RM', position: 'before', locale: 'ms-MY', name: 'Malaysian Ringgit' },
  THB: { symbol: '฿', position: 'before', locale: 'th-TH', name: 'Thai Baht' },
  BRL: { symbol: 'R$', position: 'before', locale: 'pt-BR', name: 'Brazilian Real' },
  MXN: { symbol: 'MX$', position: 'before', locale: 'es-MX', name: 'Mexican Peso' },
  ZAR: { symbol: 'R', position: 'before', locale: 'en-ZA', name: 'South African Rand' },
  SEK: { symbol: 'kr', position: 'after', locale: 'sv-SE', name: 'Swedish Krona' },
  NOK: { symbol: 'kr', position: 'after', locale: 'nb-NO', name: 'Norwegian Krone' },
  DKK: { symbol: 'kr', position: 'after', locale: 'da-DK', name: 'Danish Krone' },
  PLN: { symbol: 'zł', position: 'after', locale: 'pl-PL', name: 'Polish Zloty' },
  KRW: { symbol: '₩', position: 'before', locale: 'ko-KR', name: 'South Korean Won' },
  QAR: { symbol: 'QAR', position: 'before', locale: 'ar-QA', name: 'Qatari Riyal' },
  NGN: { symbol: '₦', position: 'before', locale: 'en-NG', name: 'Nigerian Naira' },
  KES: { symbol: 'KSh', position: 'before', locale: 'en-KE', name: 'Kenyan Shilling' },
  EGP: { symbol: 'E£', position: 'before', locale: 'ar-EG', name: 'Egyptian Pound' },
  ILS: { symbol: '₪', position: 'before', locale: 'he-IL', name: 'Israeli Shekel' },
};

// Get list of available currencies for dropdown
export const AVAILABLE_CURRENCIES = Object.entries(CURRENCY_CONFIG).map(([code, config]) => ({
  value: code,
  label: `${code} (${config.symbol}) - ${config.name}`,
}));

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
 * Format currency amount based on location or currency override
 */
export function formatCurrency(amount: number, location: string, currencyOverride?: string): string {
  const currencyCode = currencyOverride || getCurrencyFromLocation(location);
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
 * Format a salary range string based on location or currency override
 */
export function formatSalaryRange(salaryRange: string, location: string, currencyOverride?: string): string {
  if (!salaryRange) return '';
  
  const currencyCode = currencyOverride || getCurrencyFromLocation(location);
  const config = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.USD;
  
  // Try to parse the salary range
  // Common formats: "$50,000 - $70,000", "50000-70000", "$50K - $70K"
  const numbers = salaryRange.match(/[\d,]+/g);
  
  if (!numbers || numbers.length === 0) {
    return salaryRange;
  }
  
  const parsedNumbers = numbers.map(n => parseInt(n.replace(/,/g, '')));
  
  if (parsedNumbers.length === 1) {
    return formatCurrency(parsedNumbers[0], location, currencyOverride);
  }
  
  if (parsedNumbers.length >= 2) {
    return `${formatCurrency(parsedNumbers[0], location, currencyOverride)} - ${formatCurrency(parsedNumbers[1], location, currencyOverride)}`;
  }
  
  return salaryRange;
}

/**
 * Get currency symbol for a location
 */
export function getCurrencySymbol(location: string, currencyOverride?: string): string {
  const currencyCode = currencyOverride || getCurrencyFromLocation(location);
  const config = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.USD;
  return config.symbol;
}
